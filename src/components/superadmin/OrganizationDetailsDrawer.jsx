import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Building2, Mail, Phone, User, Calendar, Users, HardDrive,
  CreditCard, Activity, Edit2, Ban, CheckCircle, Trash2, Package
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const TABS = ['Overview', 'Users', 'Billing', 'Activity'];

const MOCK_USERS = [
  { name: 'Sarah Chen',   email: 'sarah@org.com',  role: 'Admin',  status: 'Active',   joined: '2024-01-15' },
  { name: 'Marcus Reid',  email: 'marcus@org.com', role: 'Manager',status: 'Active',   joined: '2024-02-10' },
  { name: 'Priya Nair',   email: 'priya@org.com',  role: 'Staff',  status: 'Active',   joined: '2024-03-22' },
  { name: 'Tom Walker',   email: 'tom@org.com',    role: 'Staff',  status: 'Inactive', joined: '2024-04-05' },
];

const MOCK_ACTIVITY = [
  { action: 'Organization created',       time: '2024-01-15 09:00', type: 'success' },
  { action: 'Plan upgraded to Pro',       time: '2024-02-20 14:30', type: 'success' },
  { action: 'New user invited: Marcus',   time: '2024-02-10 11:15', type: 'info'    },
  { action: 'Payment failed — retrying',  time: '2024-03-01 08:00', type: 'warning' },
  { action: 'Payment succeeded',          time: '2024-03-02 09:00', type: 'success' },
  { action: 'Storage limit warning 80%',  time: '2024-04-10 16:45', type: 'warning' },
];

const ACTIVITY_COLORS = { success: '#10b981', info: '#6366f1', warning: '#f59e0b', danger: '#ef4444' };

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-darker)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: color + '18', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</p>
      </div>
    </div>
  );
}

function StorageBar({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{used}GB used of {limit}GB</span>
        <span style={{ fontWeight: '800', color }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: '8px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: '99px' }} />
      </div>
    </div>
  );
}

export default function OrganizationDetailsDrawer({ org, onClose, onEdit, onToggleStatus, onDelete }) {
  const [tab, setTab] = useState('Overview');
  if (!org) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.5)', backdropFilter: 'blur(6px)', zIndex: 900, display: 'flex', justifyContent: 'flex-end' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '520px', height: '100%', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.2)', overflowY: 'auto' }}
          className="custom-scrollbar">

          {/* Drawer Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>{org.name[0]}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>{org.name}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{org.email}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <StatusBadge label={org.status} />
              <StatusBadge label={org.plan} />
              <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '99px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#f59e0b' }}>
                <Edit2 size={11} /> Edit
              </button>
              <button onClick={onToggleStatus} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '99px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: org.status === 'Active' ? '#ef4444' : '#10b981' }}>
                {org.status === 'Active' ? <><Ban size={11} /> Suspend</> : <><CheckCircle size={11} /> Activate</>}
              </button>
              <button onClick={onDelete} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '99px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#ef4444' }}>
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', padding: '0 24px', flexShrink: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: tab === t ? '#6366f1' : 'var(--text-muted)', borderBottom: `2px solid ${tab === t ? '#6366f1' : 'transparent'}`, transition: 'all 0.2s', marginBottom: '-1px' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px', flex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {tab === 'Overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <StatTile icon={Users}    label="Total Users"    value={org.users}    color="#6366f1" />
                      <StatTile icon={Package}  label="Plan"           value={org.plan}     color="#8b5cf6" />
                      <StatTile icon={Calendar} label="Joined"         value={org.createdDate} color="#10b981" />
                      <StatTile icon={CreditCard} label="Revenue"      value={org.revenue}  color="#f59e0b" />
                    </div>

                    <div style={{ background: 'var(--bg-darker)', borderRadius: '14px', padding: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>CONTACT INFO</p>
                      {[
                        { icon: User,     label: 'Admin',  value: org.adminName },
                        { icon: Mail,     label: 'Email',  value: org.email },
                        { icon: Phone,    label: 'Phone',  value: org.phone || '—' },
                      ].map(({ icon: Ic, label, value }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--card-border)' }}>
                          <Ic size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: 50, flexShrink: 0 }}>{label}</span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: 'var(--bg-darker)', borderRadius: '14px', padding: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>STORAGE</p>
                      <StorageBar used={org.storageUsed || 2.4} limit={org.storageLimit || 10} />
                    </div>
                  </div>
                )}

                {tab === 'Users' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{MOCK_USERS.length} users in this organization</p>
                    {MOCK_USERS.map((u, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-darker)', borderRadius: '12px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: 'white' }}>{u.name[0]}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{u.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <StatusBadge label={u.status} size="sm" />
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{u.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'Billing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '16px', padding: '20px', color: 'white' }}>
                      <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Current Plan</p>
                      <p style={{ fontSize: '24px', fontWeight: '800' }}>{org.plan}</p>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>{org.revenue}/month</p>
                    </div>
                    {[
                      { label: 'Next billing date', value: 'May 1, 2026' },
                      { label: 'Payment method',    value: 'Visa •••• 4242' },
                      { label: 'Billing email',     value: org.email },
                      { label: 'Max users',         value: `${org.maxUsers || 50} seats` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-darker)', borderRadius: '10px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'Activity' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {MOCK_ACTIVITY.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACTIVITY_COLORS[a.type], marginTop: '5px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{a.action}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
