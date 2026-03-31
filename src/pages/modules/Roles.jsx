import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Search, Edit2, Trash2, Eye, Users, Check, X,
  Copy, Lock, Unlock, ChevronDown, ChevronRight, AlertTriangle,
  Clock, User, CheckSquare, Square, Info, MoreVertical, ShieldCheck
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const MODULES = [
  { key: 'dashboard',   label: 'Dashboard' },
  { key: 'guests',      label: 'Guest Directory' },
  { key: 'bookings',    label: 'Booking Management' },
  { key: 'events',      label: 'Event Bookings' },
  { key: 'revenue',     label: 'Revenue & Occupancy' },
  { key: 'invoices',    label: 'Invoices & Billing' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'marketing',   label: 'Marketing' },
  { key: 'staff',       label: 'Staff Management' },
  { key: 'reports',     label: 'Reports & Analytics' },
];

const PERMS = ['view', 'create', 'edit', 'delete'];

const buildPerms = (overrides = {}) => {
  const base = {};
  MODULES.forEach(m => {
    base[m.key] = { view: false, create: false, edit: false, delete: false, ...overrides[m.key] };
  });
  return base;
};

const ADMIN_PERMS = buildPerms(Object.fromEntries(MODULES.map(m => [m.key, { view: true, create: true, edit: true, delete: true }])));
const MANAGER_PERMS = buildPerms({ dashboard: { view: true }, guests: { view: true, create: true, edit: true }, bookings: { view: true, create: true, edit: true }, events: { view: true, create: true, edit: true }, revenue: { view: true }, invoices: { view: true, create: true, edit: true }, maintenance: { view: true, create: true, edit: true }, marketing: { view: true }, reports: { view: true } });
const RECEPTION_PERMS = buildPerms({ dashboard: { view: true }, guests: { view: true, create: true, edit: true }, bookings: { view: true, create: true, edit: true }, events: { view: true }, invoices: { view: true, create: true } });
const HOUSEKEEPING_PERMS = buildPerms({ dashboard: { view: true }, maintenance: { view: true, create: true, edit: true } });

const SAMPLE_USERS = [
  { id: 'u1', name: 'Jane Doe', email: 'jane@hotel.com', avatar: 'JD' },
  { id: 'u2', name: 'Mike Johnson', email: 'mike@hotel.com', avatar: 'MJ' },
  { id: 'u3', name: 'Sara Lee', email: 'sara@hotel.com', avatar: 'SL' },
  { id: 'u4', name: 'Tom Brown', email: 'tom@hotel.com', avatar: 'TB' },
  { id: 'u5', name: 'Anna White', email: 'anna@hotel.com', avatar: 'AW' },
  { id: 'u6', name: 'Chris Green', email: 'chris@hotel.com', avatar: 'CG' },
];

const INIT_ROLES = [
  { id: 'r1', name: 'Super Admin', description: 'Full system access — cannot be modified', userCount: 1, createdAt: '2025-01-01', status: 'Active', isSystem: true, permissions: ADMIN_PERMS, assignedUsers: ['u1'] },
  { id: 'r2', name: 'Hotel Manager', description: 'Manages all hotel operations except admin settings', userCount: 2, createdAt: '2025-01-15', status: 'Active', isSystem: false, permissions: MANAGER_PERMS, assignedUsers: ['u2', 'u3'] },
  { id: 'r3', name: 'Receptionist', description: 'Front desk — check-in, check-out, guest management', userCount: 2, createdAt: '2025-02-01', status: 'Active', isSystem: false, permissions: RECEPTION_PERMS, assignedUsers: ['u4', 'u5'] },
  { id: 'r4', name: 'Housekeeping', description: 'Room cleaning and maintenance task access only', userCount: 1, createdAt: '2025-02-10', status: 'Active', isSystem: false, permissions: HOUSEKEEPING_PERMS, assignedUsers: ['u6'] },
  { id: 'r5', name: 'Auditor', description: 'Read-only access to reports and revenue data', userCount: 0, createdAt: '2025-03-01', status: 'Inactive', isSystem: false, permissions: buildPerms({ revenue: { view: true }, reports: { view: true }, invoices: { view: true } }), assignedUsers: [] },
];

const INIT_AUDIT = [
  { id: 1, user: 'Jane Doe', action: 'Created Role', target: 'Auditor', time: '2025-03-01 09:14' },
  { id: 2, user: 'Jane Doe', action: 'Edited Permissions', target: 'Hotel Manager', time: '2025-02-28 11:32' },
  { id: 3, user: 'Mike Johnson', action: 'Assigned Role', target: 'Sara Lee → Hotel Manager', time: '2025-02-20 15:10' },
  { id: 4, user: 'Jane Doe', action: 'Deleted Role', target: 'Guest (old)', time: '2025-02-15 08:05' },
];

const avatarGrads = ['linear-gradient(135deg,#4f46e5,#7c3aed)', 'linear-gradient(135deg,#2563eb,#0ea5e9)', 'linear-gradient(135deg,#10b981,#059669)', 'linear-gradient(135deg,#f59e0b,#d97706)', 'linear-gradient(135deg,#ec4899,#db2777)', 'linear-gradient(135deg,#8b5cf6,#6d28d9)'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const emptyPerms = () => buildPerms();

// ── Permission Matrix Component ───────────────────────────────────────────────
function PermMatrix({ perms, onChange, readonly = false }) {
  const modCount = mod => PERMS.filter(p => perms[mod]?.[p]).length;
  const allCount = () => MODULES.reduce((sum, m) => sum + modCount(m.key), 0);
  const totalPerms = MODULES.length * PERMS.length;

  const toggle = (mod, perm) => {
    if (readonly) return;
    const next = { ...perms, [mod]: { ...perms[mod], [perm]: !perms[mod][perm] } };
    // view is required if any other perm is true
    if (perm !== 'view' && next[mod][perm] && !next[mod].view) next[mod].view = true;
    // if unsetting view, clear everything
    if (perm === 'view' && !next[mod].view) next[mod] = { view: false, create: false, edit: false, delete: false };
    onChange(next);
  };

  const toggleModule = (mod) => {
    if (readonly) return;
    const allOn = modCount(mod) === PERMS.length;
    onChange({ ...perms, [mod]: { view: !allOn, create: !allOn, edit: !allOn, delete: !allOn } });
  };

  const toggleAll = () => {
    if (readonly) return;
    const isAllOn = allCount() === totalPerms;
    const newPerms = buildPerms(isAllOn ? {} : Object.fromEntries(MODULES.map(m => [m.key, { view: true, create: true, edit: true, delete: true }])));
    onChange(newPerms);
  };

  const allOn = allCount() === totalPerms;
  const someOn = allCount() > 0;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520, fontSize: 13 }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <tr style={{ background: 'var(--input-bg)' }}>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 160 }}>
              Module
            </th>
            {PERMS.map(p => (
              <th key={p} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {p}
              </th>
            ))}
            <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {readonly ? 'All' : (
                <button onClick={toggleAll} style={{ background: allOn ? '#2563eb' : 'var(--input-bg)', border: `1px solid ${allOn ? '#2563eb' : 'var(--input-border)'}`, borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: allOn ? '#fff' : 'var(--text-muted)' }}>
                  {allOn ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {MODULES.map((mod, i) => {
            const cnt = modCount(mod.key);
            const allModOn = cnt === PERMS.length;
            return (
              <tr key={mod.key} style={{ borderBottom: '1px solid var(--card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.02)' }}>
                <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cnt > 0 ? '#2563eb' : 'var(--input-border)', flexShrink: 0 }} />
                    {mod.label}
                  </div>
                </td>
                {PERMS.map(p => {
                  const checked = !!perms[mod.key]?.[p];
                  const isViewDisabledDel = p !== 'view' && !perms[mod.key]?.view && !readonly;
                  return (
                    <td key={p} style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggle(mod.key, p)}
                        disabled={readonly}
                        title={isViewDisabledDel ? 'Enable View first' : `${p} ${mod.label}`}
                        style={{ background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: isViewDisabledDel ? 0.3 : 1 }}>
                        {checked
                          ? <div style={{ width: 20, height: 20, borderRadius: 4, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="#fff" /></div>
                          : <div style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid var(--input-border)' }} />
                        }
                      </button>
                    </td>
                  );
                })}
                <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                  {readonly ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: cnt > 0 ? '#2563eb' : 'var(--text-muted)' }}>{cnt}/{PERMS.length}</span>
                  ) : (
                    <button onClick={() => toggleModule(mod.key)} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, border: `1px solid ${allModOn ? '#2563eb' : 'var(--input-border)'}`, background: allModOn ? '#dbeafe' : 'var(--input-bg)', color: allModOn ? '#2563eb' : 'var(--text-muted)', cursor: 'pointer' }}>
                      {allModOn ? 'Deselect' : 'All'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────
function RoleModal({ role, onClose, onSave, roles }) {
  const isEdit = !!role;
  const [name, setName] = useState(role?.name || '');
  const [desc, setDesc] = useState(role?.description || '');
  const [status, setStatus] = useState(role?.status || 'Active');
  const [perms, setPerms] = useState(role?.permissions ? JSON.parse(JSON.stringify(role.permissions)) : emptyPerms());
  const [tab, setTab] = useState('info');
  const [error, setError] = useState('');

  const hasAnyPerm = () => MODULES.some(m => PERMS.some(p => perms[m.key]?.[p]));

  const save = () => {
    if (!name.trim()) { setError('Role name is required.'); return; }
    const conflict = roles.find(r => r.name.toLowerCase() === name.trim().toLowerCase() && r.id !== role?.id);
    if (conflict) { setError('A role with this name already exists.'); return; }
    if (!hasAnyPerm()) { setError('Please enable at least one permission.'); return; }
    onSave({ id: role?.id || 'r' + Date.now(), name: name.trim(), description: desc.trim(), status, permissions: perms, userCount: role?.userCount || 0, createdAt: role?.createdAt || new Date().toISOString().slice(0, 10), isSystem: false, assignedUsers: role?.assignedUsers || [] });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', padding: 0 }}
      onClick={onClose}>
      <motion.div initial={{ x: 60 }} animate={{ x: 0 }} exit={{ x: 60 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', width: '100%', maxWidth: 700, height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)', borderLeft: '1px solid var(--card-border)' }}>

        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'grid', placeItems: 'center' }}>
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{isEdit ? 'Edit Role' : 'Create New Role'}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{isEdit ? role.name : 'Define role and permissions'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', flexShrink: 0, padding: '0 24px' }}>
          {[['info', 'Role Info'], ['perms', 'Permissions Matrix']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: tab === key ? '#2563eb' : 'var(--text-muted)', borderBottom: `2px solid ${tab === key ? '#2563eb' : 'transparent'}`, marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={14} />{error}</div>}
              <div className="b24-field"><label className="b24-label">Role Name <span className="required">*</span></label>
                <input className="b24-input" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="e.g. Hotel Manager" />
              </div>
              <div className="b24-field"><label className="b24-label">Description</label>
                <textarea className="b24-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the responsibilities of this role..." style={{ minHeight: 80 }} />
              </div>
              <div className="b24-field">
                <label className="b24-label">Status</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Active', 'Inactive'].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, border: `2px solid ${status === s ? (s === 'Active' ? '#2563eb' : '#dc2626') : 'var(--input-border)'}`, background: status === s ? (s === 'Active' ? '#dbeafe' : '#fee2e2') : 'var(--input-bg)', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: status === s ? (s === 'Active' ? '#2563eb' : '#dc2626') : 'var(--text-muted)' }}>
                      {s === 'Active' ? <Unlock size={13} /> : <Lock size={13} />}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe', fontSize: 13, color: '#1d4ed8', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Switch to the <strong>Permissions Matrix</strong> tab to configure what this role can access.</span>
              </div>
            </div>
          )}

          {tab === 'perms' && (
            <div>
              {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><AlertTriangle size={14} />{error}</div>}
              <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-secondary)' }}>Check the permissions this role should have. <strong>View</strong> is required before enabling Create/Edit/Delete.</div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
                <PermMatrix perms={perms} onChange={setPerms} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', flexShrink: 0, background: 'var(--input-bg)' }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="b24-btn b24-btn-primary" onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} />{isEdit ? 'Save Changes' : 'Create Role'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function DetailDrawer({ role, allUsers, onClose, onEdit, onAssignUsers }) {
  const [selectedTab, setSelectedTab] = useState('perms');
  const assignedUsers = allUsers.filter(u => role.assignedUsers.includes(u.id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }}
      onClick={onClose}>
      <motion.div initial={{ x: 80 }} animate={{ x: 0 }} exit={{ x: 80 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', width: '100%', maxWidth: 660, height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', borderLeft: '1px solid var(--card-border)' }}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'grid', placeItems: 'center' }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{role.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{role.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!role.isSystem && <button className="b24-btn b24-btn-secondary" onClick={() => onEdit(role)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12 }}><Edit2 size={13} />Edit</button>}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', flexShrink: 0, padding: '0 24px' }}>
          {[['perms', 'Permissions'], ['users', `Users (${assignedUsers.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setSelectedTab(key)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: selectedTab === key ? '#2563eb' : 'var(--text-muted)', borderBottom: `2px solid ${selectedTab === key ? '#2563eb' : 'transparent'}`, marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {selectedTab === 'perms' && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: role.status === 'Active' ? '#d1fae5' : '#f1f5f9', color: role.status === 'Active' ? '#059669' : '#64748b' }}>{role.status}</span>
                  {role.isSystem && <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#fef3c7', color: '#d97706' }}>System Role</span>}
                  <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#dbeafe', color: '#2563eb' }}>{role.userCount} Users</span>
                </div>
              </div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
                <PermMatrix perms={role.permissions} onChange={() => {}} readonly />
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div>
              {assignedUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p>No users assigned to this role.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {assignedUsers.map((u, i) => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarGrads[i % avatarGrads.length], display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{u.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Confirm Delete ─────────────────────────────────────────────────────────────
function ConfirmDelete({ role, onClose, onConfirm }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', borderRadius: 14, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)' }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: '#fee2e2', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={22} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 8px' }}>Delete Role?</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, margin: '0 0 24px' }}>Are you sure you want to delete <strong>"{role.name}"</strong>? This cannot be undone and will remove all assigned permissions.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="b24-btn" onClick={onConfirm} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Delete Role</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Roles() {
  const [roles, setRoles] = useState(INIT_ROLES);
  const [audit] = useState(INIT_AUDIT);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewDetailRole, setViewDetailRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteRole, setDeleteRole] = useState(null);

  const filtered = roles.filter(r => {
    const mSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const mStatus = filterStatus === 'All' || r.status === filterStatus;
    return mSearch && mStatus;
  });

  const handleSave = (savedRole) => {
    setRoles(prev => {
      const exists = prev.find(r => r.id === savedRole.id);
      if (exists) return prev.map(r => r.id === savedRole.id ? { ...r, ...savedRole } : r);
      return [...prev, savedRole];
    });
    setShowForm(false);
    setEditRole(null);
  };

  const handleDelete = () => {
    setRoles(prev => prev.filter(r => r.id !== deleteRole.id));
    setDeleteRole(null);
  };

  const cloneRole = (role) => {
    const cloned = { ...role, id: 'r' + Date.now(), name: role.name + ' (Copy)', isSystem: false, userCount: 0, assignedUsers: [], createdAt: new Date().toISOString().slice(0, 10), permissions: JSON.parse(JSON.stringify(role.permissions)) };
    setRoles(prev => [...prev, cloned]);
  };

  const totalActive = roles.filter(r => r.status === 'Active').length;
  const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%', background: 'var(--bg-page)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #4f46e5)', display: 'grid', placeItems: 'center' }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Roles & Permissions</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Manage user roles and module access control</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setEditRole(null); setShowForm(true); }}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Create Role
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Roles', val: roles.length, color: '#6366f1', icon: Shield, bg: '#e0e7ff' },
          { label: 'Active Roles', val: totalActive, color: '#10b981', icon: Unlock, bg: '#d1fae5' },
          { label: 'Total Users', val: totalUsers, color: '#2563eb', icon: Users, bg: '#dbeafe' },
          { label: 'System Roles', val: roles.filter(r => r.isSystem).length, color: '#f59e0b', icon: Lock, bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 8, padding: '9px 12px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="b24-select" style={{ minWidth: 140, width: 'auto', margin: 0 }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Roles Table */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ background: 'var(--input-bg)', borderBottom: '1px solid var(--card-border)' }}>
                {['Role Name', 'Description', 'Users', 'Created', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(role => (
                <tr key={role.id} className="b24-tr-hover" style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }} onClick={() => setViewDetailRole(role)}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <Shield size={15} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{role.name}</div>
                        {role.isSystem && <span style={{ fontSize: 10, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '1px 7px', borderRadius: 99 }}>System</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.description}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{role.userCount}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{role.createdAt}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: role.status === 'Active' ? '#d1fae5' : '#f1f5f9', color: role.status === 'Active' ? '#059669' : '#64748b' }}>{role.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button title="View Details" className="b24-btn b24-btn-secondary" style={{ padding: '5px 9px' }} onClick={() => setViewDetailRole(role)}><Eye size={14} /></button>
                      {!role.isSystem && <>
                        <button title="Edit" className="b24-btn b24-btn-secondary" style={{ padding: '5px 9px' }} onClick={() => { setEditRole(role); setShowForm(true); }}><Edit2 size={14} /></button>
                        <button title="Clone" className="b24-btn b24-btn-secondary" style={{ padding: '5px 9px' }} onClick={() => cloneRole(role)}><Copy size={14} /></button>
                        <button title="Delete" style={{ padding: '5px 9px', background: 'transparent', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', color: '#dc2626' }} onClick={() => setDeleteRole(role)}><Trash2 size={14} /></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}><Shield size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No roles found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', padding: 24, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Clock size={18} color="#2563eb" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Audit Log</h3>
          <span style={{ fontSize: 11, background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Recent Activity</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {audit.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <User size={14} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{a.user}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> · {a.action}: </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{a.target}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals / Drawers */}
      <AnimatePresence>
        {showForm && <RoleModal role={editRole} roles={roles} onClose={() => { setShowForm(false); setEditRole(null); }} onSave={handleSave} />}
        {viewDetailRole && <DetailDrawer role={viewDetailRole} allUsers={SAMPLE_USERS} onClose={() => setViewDetailRole(null)} onEdit={(r) => { setViewDetailRole(null); setEditRole(r); setShowForm(true); }} onAssignUsers={() => {}} />}
        {deleteRole && <ConfirmDelete role={deleteRole} onClose={() => setDeleteRole(null)} onConfirm={handleDelete} />}
      </AnimatePresence>
    </div>
  );
}
