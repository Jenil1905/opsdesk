# OpsDesk: Enterprise Cloud Incident & SRE Hub
## DevOps Final Capstone Project Presentation
**Presenter:** DevOps Team  
**Evaluation:** Final Capstone Rubric (Modules M1 – M10)

---

## Slide 1: Executive Overview & Problem Statement
* **Application Domain:** OpsDesk — Cloud Incident & Reliability Management System.
* **The Problem:** Modern cloud architectures suffer from fragmented incident escalation, slow root cause discovery, and unmonitored infrastructure regressions.
* **The Solution:** A high-throughput FastAPI incident hub with PostgreSQL persistence, real-time SLA metrics, and an ambient Glassmorphism React frontend, engineered end-to-end through a battle-tested GitOps & Kubernetes pipeline.

---

## Slide 2: End-to-End DevOps Architecture

```text
[ Developer Laptop ]
         │ (git push origin main)
         ▼
[ GitHub Repository ]
         │ (Webhook Trigger)
         ▼
[ GitHub Actions CI Pipeline ]
  ├── Job 1: Pytest Suite (9 test cases across CRUD, Health, Ready, Metrics)
  ├── Job 2: Frontend Vite Build & Asset Optimization
  ├── Job 3: Docker Build (Non-root images)
  ├── Job 4: DevSecOps — Trivy Container Vulnerability Scan
  └── Job 5: Push to GHCR with Immutable Git SHA Tags
         │
         ▼
[ Terraform Infrastructure as Code (AWS) ]
  ├── VPC (CIDR 10.0.0.0/16) across 2 Availability Zones
  ├── 2 Public Subnets + Internet Gateway + Route Tables
  ├── AWS EKS Cluster (v1.30)
  └── EKS Managed Node Group (Auto-scaling 2 to 4 t3.medium nodes)
         │
         ▼
[ Kubernetes & Helm Orchestration ]
  ├── Namespace: `opsdesk`
  ├── PostgreSQL Database (ClusterIP: 5432 + Persistent Volume)
  ├── OpsDesk Backend (2 Replicas, Port 8000, Liveness/Readiness Probes)
  ├── OpsDesk Frontend (2 Replicas, Port 3000, Non-root Nginx)
  ├── Ingress Routing (/ -> Frontend, /api -> Backend)
  └── Horizontal Pod Autoscaler (CPU 75%, Memory 80%)
         │
         ▼
[ Full-Stack Observability ]
  ├── Prometheus Server (Scraping /metrics every 15s)
  └── Grafana Dashboard (Throughput, P99 Latency, 5xx Error Rates, CPU)
```

---

## Slide 3: Application & Database Engineering (Module M1)
* **Backend Framework:** FastAPI (Python 3.12) with asynchronous ASGI performance.
* **Endpoints Implemented:**
  - `GET /` — Service metadata and API catalog
  - `GET /health` — Liveness probe
  - `GET /ready` — Readiness probe verifying PostgreSQL ping (`SELECT 1`)
  - `GET /metrics` — Prometheus machine-readable telemetry
  - `GET /api/tickets` — Incident listing with status, priority, and search filters
  - `GET /api/tickets/stats` — Incident KPI analytics & service distribution
  - `GET /api/tickets/{id}` — Single ticket lookup
  - `POST /api/tickets` — Incident dispatch
  - `PUT /api/tickets/{id}` — Status & priority mutation
  - `DELETE /api/tickets/{id}` — Ticket resolution / archival
* **Database & ORM:** PostgreSQL 16 + SQLAlchemy 2.0.
* **Database Migrations:** Alembic (`alembic/versions/001_initial_tickets.py`).

---

## Slide 4: Testing & Code Quality Gates (Module M2)
* **Pytest Test Suite:** 9 unit and integration tests in `backend/tests/test_tickets.py`.
* **Database Isolation:** SQLite in-memory engine via `conftest.py` ensuring tests never pollute production databases.
* **Test Execution Speed:** 100% pass rate in ~0.14 seconds.
* **Pipeline Enforcement:** The CI pipeline halts immediately if any test fails, blocking bad images from ever reaching the registry.

---

## Slide 5: Containerization & Docker Security (Module M4)
* **Multi-stage Frontend Dockerfile:**
  - Build stage: `node:20-alpine` compiling React + Vite assets.
  - Production runtime: `nginx:alpine` configured as an unprivileged reverse proxy.
* **Secure Backend Dockerfile:**
  - Base: `python:3.12-slim`.
  - Non-root execution: Runs under dedicated system UID/GID `1001:1001` (`appuser:appgroup`).
* **Docker Compose Stack:** Single-command local orchestration via `docker compose up --build`.

---

## Slide 6: CI/CD Pipeline & DevSecOps (Modules M5 & M6)
* **Pipeline Automation:** Automated GitHub Actions workflow (`.github/workflows/ci.yml`).
* **Container Registry:** GitHub Container Registry (GHCR).
* **Tagging Strategy:** Immutable tags tied to Git Commit SHA (`${{ github.sha }}`) prevents container drift.
* **DevSecOps Integration:** Aqua Security **Trivy** vulnerability scanner runs on both frontend and backend images, scanning for CRITICAL and HIGH CVEs before promotion.

---

## Slide 7: Terraform Infrastructure as Code (Module M7)
* **AWS VPC:** Custom VPC with 2 public subnets in separate Availability Zones (`us-east-1a`, `us-east-1b`).
* **EKS Cluster:** Kubernetes v1.30 control plane with managed IAM roles and policies.
* **Managed Node Group:** Auto-scaling cluster of EC2 `t3.medium` instances (min: 2, max: 4, desired: 2).
* **Security & Cleanliness:** Fully validated via `terraform init` and `terraform validate`. Zero hardcoded credentials committed (`terraform.tfvars.example` used).

---

## Slide 8: Kubernetes & Helm Packaging (Module M8)
* **Helm Chart:** Fully packaged in `helm/opsdesk/` (`Chart.yaml`, `values.yaml`, templates).
* **High Availability:** 2 replicas for backend and frontend with rolling updates.
* **Zero-Downtime Probes:**
  - Liveness probe: `/health` prevents deadlock.
  - Readiness probe: `/ready` delays traffic until DB connectivity is verified.
* **Ingress Controller:** Nginx Ingress routes `/` to frontend and `/api` to backend.
* **Autoscaling:** Horizontal Pod Autoscaler (HPA) scales pods up to 5 replicas during traffic surges.

---

## Slide 9: Observability & SRE Monitoring (Module M9)
* **FastAPI Prometheus Instrumentator:** Exposes standard metrics (`http_requests_total`, `http_request_duration_seconds_bucket`).
* **Prometheus Configuration:** Helm values configured for 15s scrape interval on `opsdesk-backend:8000/metrics`.
* **Grafana Dashboard:** Pre-configured JSON dashboard tracking:
  - Throughput (req/sec) by handler and HTTP status
  - P99 Request Latency
  - HTTP 5xx Error Rates
  - Container CPU and Memory utilization

---

## Slide 10: Live Demonstration Script & Conclusion
1. **Application Walkthrough:** Open `http://localhost:3000` — showcase Glassmorphism KPI cards, incident filtering, search, and incident creation modal.
2. **API Verification:** Inspect Swagger at `/docs` and raw telemetry at `/metrics`.
3. **Pipeline Demonstration:** Make a Git commit, push to GitHub, and watch GitHub Actions execute Pytest, Trivy, and image publishing.
4. **Resilience Test:** Simulate pod failure or database recovery, demonstrating Kubernetes self-healing and zero downtime.
