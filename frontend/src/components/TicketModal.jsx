import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';

export default function TicketModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service: 'k8s-ingress',
    priority: 'P1 - High',
    status: 'OPEN',
    assignee: 'SRE On-Call',
    reporter: 'DevOps Engineer'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'k8s-ingress',
    'db-cluster',
    'auth-service',
    'payment-gateway',
    'api-gateway',
    'core-platform'
  ];

  const priorities = [
    'P0 - Critical',
    'P1 - High',
    'P2 - Medium',
    'P3 - Low'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please provide both an incident title and technical description.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit incident ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '28px',
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '12px'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              Log Production Incident
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Dispatch alert to active SRE team and infrastructure logs
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-glass"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Incident Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ingress Controller Connection Timeout"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="glass-input"
            />
          </div>

          {/* Service & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Affected Service
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="glass-input"
                style={{ background: '#0f172a' }}
              >
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Priority Severity
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="glass-input"
                style={{ background: '#0f172a' }}
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee & Reporter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Assignee
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Carter (SRE)"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="glass-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Reporter
              </label>
              <input
                type="text"
                placeholder="e.g. CloudWatch / PagerDuty"
                value={formData.reporter}
                onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Detailed Description & Logs *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe symptoms, affected pods, error codes, and mitigation steps..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-glass"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-glass btn-primary"
              style={{ padding: '10px 22px' }}
            >
              <Send size={16} />
              <span>{submitting ? 'Dispatching...' : 'Dispatch Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
