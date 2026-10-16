"""Initial incident tickets table

Revision ID: 001_initial_tickets
Revises: 
Create Date: 2026-10-16 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_tickets'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'incident_tickets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('service', sa.String(length=100), nullable=False),
        sa.Column('priority', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('assignee', sa.String(length=100), nullable=False),
        sa.Column('reporter', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_incident_tickets_id'), 'incident_tickets', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_incident_tickets_id'), table_name='incident_tickets')
    op.drop_table('incident_tickets')
