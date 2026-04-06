import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit2, Ban, CheckCircle, Trash2, Users, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PLAN_STYLES = {
  Free:       { bg: 'rgba(148,163,184,0.12)', color: '#64748b' },
  Starter:    { bg: 'rgba(20,184,166,0.1)',   color: '#14b8a6' },
  Pro:        { bg: 'rgba(139,92,246,0.1)',   color: '#8b5cf6' },
  Enterprise: { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
};

// Mobile card view for each organization
export default function OrganizationCard({ org, index, onView, onEdit, onToggleStatus, onDelete }) {
  const plan = PLAN_STYLES[org.plan] || PLAN_STYLES.Free;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: '16px', padding: '18px', boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '12px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>{org.name[0]}</span>
          </div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>{org.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{org.email}</p>
          </div>
        </div>
        <StatusBadge label={org.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <div style={{ background: 'var(--bg-darker)', borderRadius: '10px', padding: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Admin</p>
          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.adminName}</p>
        </div>
        <div style={{ background: 'var(--bg-darker)', borderRadius: '10px', padding: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Plan</p>
          <span style={{ fontSize: '12px', fontWeight: '800', padding: '2px 8px', borderRadius: '99px', background: plan.bg, color: plan.color }}>{org.plan}</span>
        </div>
        <div style={{ background: 'var(--bg-darker)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={13} color="var(--text-muted)" />
          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.users} users</p>
        </div>
        <div style={{ background: 'var(--bg-darker)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={13} color="var(--text-muted)" />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{org.createdDate}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { icon: Eye,     label: 'View',    color: '#6366f1', action: onView },
          { icon: Edit2,   label: 'Edit',    color: '#f59e0b', action: onEdit },
          { icon: org.status === 'Active' ? Ban : CheckCircle, label: org.status === 'Active' ? 'Suspend' : 'Activate', color: org.status === 'Active' ? '#ef4444' : '#10b981', action: onToggleStatus },
          { icon: Trash2,  label: 'Delete',  color: '#ef4444', action: onDelete },
        ].map(({ icon: Ic, label, color, action }) => (
          <button key={label} onClick={action} title={label}
            style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color, transition: 'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background = color + '15'; e.currentTarget.style.borderColor = color + '40'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
            <Ic size={13} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
