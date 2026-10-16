from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class IncidentTicket(Base):
    __tablename__ = "incident_tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    service = Column(String(100), nullable=False, default="core-platform")
    priority = Column(String(20), nullable=False, default="P2 - Medium") # P0 - Critical, P1 - High, P2 - Medium, P3 - Low
    status = Column(String(20), nullable=False, default="OPEN") # OPEN, INVESTIGATING, RESOLVED, CLOSED
    assignee = Column(String(100), nullable=False, default="Unassigned")
    reporter = Column(String(100), nullable=False, default="SRE On-Call")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
