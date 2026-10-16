import React, { useState } from 'react';
import { Search, Filter, Trash2, ArrowUpRight, Server, User, Calendar } from 'lucide-react';

export default function TicketTable({
  tickets,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  onUpdateStatus,
  onDeleteTicket,
  loading
}) {
  const statusTabs = ['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];

  const getPriorityBadgeClass = (priority) => {
    if (priority.includes('P0')) return 'badge-p0';
    if (priority.includes('P1')) return 'badge-p1';
    if (priority.includes('P2')) return 'badge-p2';
    return 'badge-p3';
  };

  const getStatusIndicatorClass = (status) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'INVESTIGATING': return 'status-investigating';
      case 'RESOLVED': return 'status-resolved';
      default: return 'status-closed';
    }
  };

  return (
    <div className="glass-panel" style={{
      margin: '0 24px 24px 24px',
      padding: '24px',
      overflow: 'hidden'
    }}>
      {/* Top Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className="btn-glass"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                background: filterStatus === tab ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: filterStatus === tab ? 'var(--accent-indigo)' : 'var(--glass-border)',
                color: filterStatus === tab ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-muted)" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            id="ticket-search-input"
            type="text"
            placeholder="Search incident or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '36px', height: '38px' }}
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--glass-border)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '12px 16px' }}>Incident Details</th>
              <th style={{ padding: '12px 16px' }}>Service</th>
              <th style={{ padding: '12px 16px' }}>Severity</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Assignee</th>
              <th style={{ padding: '12px 16px' }}>Reported</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading incidents from cluster...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '50px 20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.1rem' }}>
                    No Incidents Matching Filter
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    All services are operating within normal SLO parameters.
                  </p>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px', maxWidth: '340px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {ticket.title}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {ticket.description}
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Server size={14} color="var(--accent-cyan)" />
                      <span>{ticket.service}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span className={`badge-glass ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-indicator ${getStatusIndicatorClass(ticket.status)}`} />
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="OPEN" style={{ background: '#0f172a' }}>OPEN</option>
                        <option value="INVESTIGATING" style={{ background: '#0f172a' }}>INVESTIGATING</option>
                        <option value="RESOLVED" style={{ background: '#0f172a' }}>RESOLVED</option>
                        <option value="CLOSED" style={{ background: '#0f172a' }}>CLOSED</option>
                      </select>
                    </div>
                  </td>

                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="var(--accent-indigo)" />
                      <span>{ticket.assignee}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => onDeleteTicket(ticket.id)}
                      className="btn-glass"
                      style={{
                        padding: '6px 10px',
                        color: 'var(--accent-rose)',
                        borderColor: 'rgba(244, 63, 94, 0.2)'
                      }}
                      title="Delete Ticket"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
