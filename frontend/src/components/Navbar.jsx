import React from 'react';
import { ShieldAlert, Plus, Activity, BookOpen, Layers } from 'lucide-react';

export default function Navbar({ onOpenModal, healthStatus }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 40,
      margin: '16px 24px 24px 24px',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
        }}>
          <ShieldAlert size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              OpsDesk
            </h1>
            <span className="badge-glass" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              SRE Hub
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Cloud Incident & Infrastructure Reliability Management
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Health status badge */}
        <div className="glass-panel" style={{
          padding: '6px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className={`status-indicator ${healthStatus === 'healthy' ? 'status-resolved' : 'status-open'}`} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {healthStatus === 'healthy' ? 'API & DB Ready' : 'Connecting...'}
          </span>
        </div>

        {/* Links */}
        <a href="/docs" target="_blank" rel="noreferrer" className="btn-glass" title="Swagger REST Docs">
          <BookOpen size={16} />
          <span>API Docs</span>
        </a>

        <a href="/metrics" target="_blank" rel="noreferrer" className="btn-glass" title="Prometheus Metrics">
          <Activity size={16} />
          <span>Metrics</span>
        </a>

        {/* New Ticket Button */}
        <button id="btn-create-incident" onClick={onOpenModal} className="btn-glass btn-primary">
          <Plus size={18} />
          <span>Report Incident</span>
        </button>
      </div>
    </header>
  );
}
