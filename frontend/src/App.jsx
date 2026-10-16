import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import TicketTable from './components/TicketTable';
import TicketModal from './components/TicketModal';
import { RefreshCw, Activity, Terminal, ShieldCheck } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total_tickets: 0,
    open_tickets: 0,
    investigating_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0,
    critical_p0: 0,
    high_p1: 0,
    resolution_rate: 0,
    by_service: {}
  });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const checkHealth = async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) setHealthStatus('healthy');
      else setHealthStatus('unhealthy');
    } catch {
      setHealthStatus('unhealthy');
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = '/api/tickets';
      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== 'ALL') params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading incident tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/tickets/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchStats();
    fetchTickets();
  }, [filterStatus, searchQuery]);

  const handleCreateTicket = async (ticketData) => {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Could not create ticket');
    }
    showToast('Incident created successfully!');
    fetchTickets();
    fetchStats();
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      showToast(`Incident #${ticketId} updated to ${newStatus}`);
      fetchTickets();
      fetchStats();
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm(`Are you sure you want to delete ticket #${ticketId}?`)) return;
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete ticket');
      showToast(`Incident #${ticketId} deleted`);
      fetchTickets();
      fetchStats();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'rgba(99, 102, 241, 0.9)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        healthStatus={healthStatus}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* KPI Summary Cards */}
        <StatsCards stats={stats} />

        {/* Ticket Management Table */}
        <TicketTable
          tickets={tickets}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTicket={handleDeleteTicket}
          loading={loading}
        />
      </main>

      {/* Incident Creation Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* Footer with DevOps architecture badges */}
      <footer className="glass-panel" style={{
        margin: '16px 24px 24px 24px',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={15} color="var(--accent-indigo)" />
          <span>OpsDesk v1.0 • Enterprise Cloud Incident Management</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>FastAPI</span>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>PostgreSQL</span>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>Docker</span>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>Kubernetes EKS</span>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>Terraform</span>
          <span className="badge-glass" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>Prometheus & Grafana</span>
        </div>
      </footer>
    </div>
  );
}
