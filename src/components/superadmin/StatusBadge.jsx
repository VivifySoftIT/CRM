import React from 'react';

const CONFIG = {
  Active:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', dot: '#10b981' },
  Suspended: { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', dot: '#ef4444' },
  Trial:     { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', dot: '#f59e0b' },
  Free:      { bg: 'rgba(148,163,184,0.12)',color: '#64748b', dot: '#94a3b8' },
  Pro:       { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6', dot: '#8b5cf6' },
  Enterprise:{ bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', dot: '#3b82f6' },
  Starter:   { bg: 'rgba(20,184,166,0.1)',  color: '#14b8a6', dot: '#14b8a6' },
};

export default function StatusBadge({ label, size = 'md' }) {
  const cfg = CONFIG[label] || CONFIG.Free;
  const pad = size === 'sm' ? '3px 8px' : '4px 11px';
  const fs  = size === 'sm' ? '10px' : '11px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: pad, borderRadius: '99px',
      background: cfg.bg, color: cfg.color,
      fontSize: fs, fontWeight: '700', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}
