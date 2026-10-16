from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import IncidentTicket
from app.schemas import TicketCreate, TicketUpdate, TicketResponse, TicketStats

router = APIRouter(prefix="/api/tickets", tags=["Incident Tickets"])

@router.get("", response_model=List[TicketResponse])
def get_tickets(
    status: Optional[str] = Query(None, description="Filter by ticket status"),
    priority: Optional[str] = Query(None, description="Filter by priority level"),
    service: Optional[str] = Query(None, description="Filter by service name"),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db: Session = Depends(get_db)
):
    query = db.query(IncidentTicket)
    if status and status.upper() != "ALL":
        query = query.filter(IncidentTicket.status == status.upper())
    if priority and priority.upper() != "ALL":
        query = query.filter(IncidentTicket.priority.ilike(f"%{priority}%"))
    if service and service.upper() != "ALL":
        query = query.filter(IncidentTicket.service == service)
    if search:
        query = query.filter(
            (IncidentTicket.title.ilike(f"%{search}%")) |
            (IncidentTicket.description.ilike(f"%{search}%"))
        )
    return query.order_by(IncidentTicket.created_at.desc()).all()

@router.get("/stats", response_model=TicketStats)
def get_ticket_stats(db: Session = Depends(get_db)):
    total = db.query(IncidentTicket).count()
    open_count = db.query(IncidentTicket).filter(IncidentTicket.status == "OPEN").count()
    investigating_count = db.query(IncidentTicket).filter(IncidentTicket.status == "INVESTIGATING").count()
    resolved_count = db.query(IncidentTicket).filter(IncidentTicket.status == "RESOLVED").count()
    closed_count = db.query(IncidentTicket).filter(IncidentTicket.status == "CLOSED").count()
    
    p0_count = db.query(IncidentTicket).filter(IncidentTicket.priority.ilike("%P0%")).count()
    p1_count = db.query(IncidentTicket).filter(IncidentTicket.priority.ilike("%P1%")).count()

    resolution_rate = round(((resolved_count + closed_count) / total * 100), 1) if total > 0 else 0.0

    service_counts = {}
    service_rows = db.query(IncidentTicket.service, func.count(IncidentTicket.id)).group_by(IncidentTicket.service).all()
    for s_name, count in service_rows:
        service_counts[s_name] = count

    return TicketStats(
        total_tickets=total,
        open_tickets=open_count,
        investigating_tickets=investigating_count,
        resolved_tickets=resolved_count,
        closed_tickets=closed_count,
        critical_p0=p0_count,
        high_p1=p1_count,
        resolution_rate=resolution_rate,
        by_service=service_counts
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(IncidentTicket).filter(IncidentTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found"
        )
    return ticket

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket_data: TicketCreate, db: Session = Depends(get_db)):
    db_ticket = IncidentTicket(**ticket_data.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(IncidentTicket).filter(IncidentTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found"
        )
    
    update_data = ticket_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)
    
    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(IncidentTicket).filter(IncidentTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found"
        )
    db.delete(ticket)
    db.commit()
    return None
