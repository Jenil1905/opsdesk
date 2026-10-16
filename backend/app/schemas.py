from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field, ConfigDict

class TicketBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=5)
    service: str = Field(default="core-platform", max_length=100)
    priority: str = Field(default="P2 - Medium")
    status: str = Field(default="OPEN")
    assignee: str = Field(default="Unassigned")
    reporter: str = Field(default="SRE On-Call")

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=5)
    service: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assignee: Optional[str] = None
    reporter: Optional[str] = None

class TicketResponse(TicketBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TicketStats(BaseModel):
    total_tickets: int
    open_tickets: int
    investigating_tickets: int
    resolved_tickets: int
    closed_tickets: int
    critical_p0: int
    high_p1: int
    resolution_rate: float
    by_service: Dict[str, int]
