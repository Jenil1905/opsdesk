import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Active Incidents',
      value: (stats.open_tickets || 0) + (stats.investigating_tickets || 0),
      subtitle: `${stats.open_tickets || 0} Open, ${stats.investigating_tickets || 0} In Progress`,
      icon: Clock,
      color: '#f59e0b',
      borderGlow: 'rgba(245, 158, 11, 0.3)'
    },
    {
      title: 'P0 / P1 Severity',
      value: (stats.critical_p0 || 0) + (stats.high_p1 || 0),
      subtitle: `${stats.critical_p0 || 0} Critical P0, ${stats.high_p1 || 0} High P1`,
      icon: AlertTriangle,
      color: '#f43f5e',
      borderGlow: 'rgba(244, 63, 94, 0.3)'
    },
    {
      title: 'Resolved / Closed',
      value: (stats.resolved_tickets || 0) + (stats.closed_tickets || 0),
      subtitle: 'Successfully mitigated outages',
      icon: CheckCircle2,
      color: '#10b981',
      borderGlow: 'rgba(16, 185, 129, 0.3)'
    },
    {
      title: 'Resolution Rate',
      value: `${stats.resolution_rate || 0}%`,
      subtitle: `Out of ${stats.total_tickets || 0} total tickets`,
      icon: TrendingUp,
      color: '#06b6d4',
      borderGlow: 'rgba(6, 182, 212, 0.3)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '18px',
      margin: '0 24px 24px 24px'
    }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              borderTop: `2px solid ${card.color}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {card.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `rgba(255, 255, 255, 0.05)`,
                border: `1px solid ${card.borderGlow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={18} color={card.color} />
              </div>
            </div>
            
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '4px'
            }}>
              {card.value}
            </div>
            
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
