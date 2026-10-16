import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.database import engine, Base, SessionLocal, get_db
from app.models import IncidentTicket
from app.routes import router as tickets_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("opsdesk")

def seed_initial_data(db: Session):
    try:
        if db.query(IncidentTicket).count() == 0:
            logger.info("Seeding initial DevOps incident data...")
            demo_tickets = [
                IncidentTicket(
                    title="Kubernetes Ingress 502 Bad Gateway on API Routes",
                    description="Ingress controller reporting upstream connection timeouts to backend pods in us-east-1 production cluster.",
                    service="k8s-ingress",
                    priority="P0 - Critical",
                    status="INVESTIGATING",
                    assignee="Alex Carter (SRE)",
                    reporter="Prometheus Alertmanager"
                ),
                IncidentTicket(
                    title="PostgreSQL Read Replica Replication Lag > 450s",
                    description="High disk I/O on primary node causing WAL backlog to build up on eu-west-1 reporting replica.",
                    service="db-cluster",
                    priority="P1 - High",
                    status="OPEN",
                    assignee="Sarah Lin (DBA)",
                    reporter="DataDog Monitor"
                ),
                IncidentTicket(
                    title="Auth Service Token Renewal Latency Spike",
                    description="Redis cache eviction policy triggered frequent DB roundtrips for JWT refresh endpoint.",
                    service="auth-service",
                    priority="P2 - Medium",
                    status="RESOLVED",
                    assignee="Devon Vance",
                    reporter="Grafana P99 Alert"
                ),
                IncidentTicket(
                    title="Payment Gateway Stripe Webhook Idempotency Flake",
                    description="Intermittent duplicate webhook deliveries causing duplicate event handling attempts.",
                    service="payment-gateway",
                    priority="P2 - Medium",
                    status="CLOSED",
                    assignee="Elena Rostova",
                    reporter="Stripe Dashboard"
                ),
                IncidentTicket(
                    title="CI/CD GitHub Actions Node Group Auto-scaling Depleted",
                    description="Terraform EKS managed node group reached max_size during release tag build surge.",
                    service="core-platform",
                    priority="P1 - High",
                    status="OPEN",
                    assignee="DevOps On-Call",
                    reporter="GitHub Webhook"
                ),
            ]
            db.add_all(demo_tickets)
            db.commit()
            logger.info("Demo incidents seeded successfully.")
    except Exception as e:
        logger.warning(f"Seed skipped or table not ready: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe startup DB check
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_initial_data(db)
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Startup DB init deferred or running in test mode: {e}")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Enterprise Incident & SRE Ticket Management System with DevOps Observability",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus Metrics Instrumentation
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/", tags=["General"])
def root():
    return {
        "service": settings.APP_NAME,
        "status": "operational",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "ready": "/ready",
            "metrics": "/metrics",
            "tickets": "/api/tickets",
            "stats": "/api/tickets/stats"
        }
    }

@app.get("/health", tags=["Monitoring"])
def health():
    """Liveness probe: returns 200 if container process is active."""
    return {"status": "healthy", "service": "opsdesk-backend"}

@app.get("/ready", tags=["Monitoring"])
def ready(db: Session = Depends(get_db)):
    """Readiness probe: validates connectivity to database."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return Response(
            content='{"status": "not_ready", "error": "database unreachable"}',
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            media_type="application/json"
        )

# Register API routes
app.include_router(tickets_router)
