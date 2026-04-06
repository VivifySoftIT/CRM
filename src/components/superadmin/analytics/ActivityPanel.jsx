import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Building2, CheckCircle, FileText, TrendingUp, DollarSign } from 'lucide-react';

const ACTIVITIES = [
  { id:1, icon: UserPlus,   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'New user signup',       sub: 'sarah@nexus.io joined',        time: '2m ago' },
  { id:2, icon: Building2,  color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  title: 'Organization created',  sub: 'Velocity Labs registered',     time: '8m ago' },
  { id:3, icon: CheckCircle,color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Payment successful',    sub: 'Apex Dynamics — $2,450',       time: '15m ago' },
  { id:4, icon: FileText,   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  title: 'Lead created',          sub: 'Marcus Reid added new lead',   time: '22m ago' },
  { id:5, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Deal won',              sub: 'Orbit Solutions — $15,000',    time: '34m ago' },
  { id:6, icon: DollarSign, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: 'Subscription upgraded', sub: 'Bloom Digital → Pro plan',     time: '1h ago' },
  { id:7, icon: UserPlus,   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'New user signup',       sub: 'priya@orbit.in joined',        time: '1h ago' },
  { id:8, icon: CheckCircle,color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Payment successful',    sub: 'Pinnacle Systems — $2,450',    time: '2h ago' },
];

export default function ActivityPanel() {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)', height: 'fit-content', position: 'sticky', top: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Real-Time Activity</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Live platform events</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
        {ACTIVITIES.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '10px', transition: 'background 0.15s', cursor: 'default' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, borderRadius: '9px', background: a.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <a.icon size={14} color={a.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sub}</p>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', flexShrink: 0, marginTop: '2px' }}>{a.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
