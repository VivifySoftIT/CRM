import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Edit2, Lock, Check, X, Star,
  Building2, Globe, Calendar, Bell, Shield, CreditCard, ChevronRight,
  Camera, Key, Eye, EyeOff, Smartphone, Wifi, Save, AlertCircle,
  CheckCircle2, BadgeCheck, LogOut, Download
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const INIT = {
  name: 'Alex Morgan',
  email: 'alex.morgan@nexatech.io',
  phone: '+1 650-555-0192',
  address: '320 Commerce Blvd, Suite 12',
  city: 'Austin',
  country: 'United States',
  timezone: 'America/Chicago (CDT)',
  company: 'NexaTech Solutions',
  jobTitle: 'Head of Operations',
  website: 'https://nexatech.io',
  memberSince: 'Jan 2024',
  tier: 'Pro',
  planName: 'CRM Pro – 5 Users',
  nextBill: 'May 5, 2026',
  billingAmount: '$1,149/mo',
};

const NOTIF_PREFS = [
  { id: 'ticket_update', label: 'Ticket status updates', sub: 'When your support tickets change status', enabled: true },
  { id: 'invoice_due', label: 'Invoice reminders', sub: 'Before invoice due dates', enabled: true },
  { id: 'payment_confirm', label: 'Payment confirmations', sub: 'After successful payments', enabled: true },
  { id: 'new_document', label: 'New documents shared', sub: 'When our team shares files with you', enabled: true },
  { id: 'system_maintenance', label: 'System maintenance alerts', sub: 'Scheduled downtime notifications', enabled: false },
  { id: 'marketing', label: 'Product news & tips', sub: 'Feature announcements and best practices', enabled: false },
];

/* ── Toggle Switch ─────────────────────────────────────────────────────────── */
function ToggleSwitch({ enabled, onChange }) {
  return (
    <div onClick={onChange} style={{ width: 40, height: 22, borderRadius: 20, background: enabled ? 'var(--primary)' : 'var(--card-border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <motion.div animate={{ left: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

/* ── Section Card ──────────────────────────────────────────────────────────── */
function SectionCard({ title, icon: Icon, iconColor, children, action }) {
  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 18, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && (
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${iconColor}15`, display: 'grid', placeItems: 'center' }}>
              <Icon size={16} color={iconColor} />
            </div>
          )}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        </div>
        {action}
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  );
}

/* ── Field ────────────────────────────────────────────────────────────────── */
function Field({ label, value, editable, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>{label}</label>
      {editable ? (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
      ) : (
        <div style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{value}</div>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function ClientProfile() {
  const { isDark } = useTheme();
  const [profile, setProfile]   = useState(INIT);
  const [form, setForm]         = useState(INIT);
  const [editing, setEditing]   = useState(false);
  const [saved, setSaved]       = useState(false);
  const [pwModal, setPwModal]   = useState(false);
  const [twoFA, setTwoFA]       = useState(false);
  const [notifs, setNotifs]     = useState(NOTIF_PREFS);
  const [activeTab, setActiveTab] = useState('profile'); // profile | security | notifications
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pw, setPw]             = useState({ old: '', new1: '', new2: '' });

  const save = () => {
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cancel = () => { setForm(profile); setEditing(false); };

  const toggleNotif = (id) => {
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  const TABS = [
    { id: 'profile',       label: 'Profile',       icon: User    },
    { id: 'security',      label: 'Security',      icon: Shield  },
    { id: 'notifications', label: 'Notifications', icon: Bell    },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 860 }}>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>My Profile</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Manage your account details, security settings, and notification preferences</p>
      </div>

      {/* Profile Hero Card */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%)', borderRadius: 18, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Decorations */}
        <div style={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -20, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 30, fontWeight: 900, backdropFilter: 'blur(8px)' }}>
              {initials}
            </div>
            <button style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: '#fff', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <Camera size={12} color='#4f46e5' />
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{profile.name}</h2>
              <BadgeCheck size={20} color='#60a5fa' />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={12} /> {profile.jobTitle} at {profile.company}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                ✓ Verified Client
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: 'rgba(245,158,11,0.25)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={10} style={{ fill: '#fbbf24' }} /> {profile.tier} Plan
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', padding: '4px 0' }}>Member since {profile.memberSince}</span>
            </div>
          </div>

          {/* Subscription */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', minWidth: 200 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Current Plan</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{profile.planName}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Next bill: {profile.nextBill} · {profile.billingAmount}</div>
            <button style={{ padding: '6px 14px', borderRadius: 7, background: '#fff', color: '#4f46e5', border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer', width: '100%' }}>
              Manage Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '8px 18px', borderRadius: 9, border: 'none', background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s' }}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <>
          <SectionCard title="Personal Information" icon={User} iconColor="var(--primary)"
            action={
              editing ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={cancel} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <X size={12} /> Cancel
                  </button>
                  <button onClick={save} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Save size={12} /> Save Changes
                  </button>
                </div>
              ) : (
                <button onClick={() => { setEditing(true); setForm(profile); }}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Edit2 size={12} /> Edit
                </button>
              )
            }>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Field label="Full Name" value={editing ? form.name : profile.name} editable={editing} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Field label="Email Address" value={editing ? form.email : profile.email} editable={editing} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
              <Field label="Phone Number" value={editing ? form.phone : profile.phone} editable={editing} onChange={v => setForm(f => ({ ...f, phone: v }))} />
              <Field label="Job Title" value={editing ? form.jobTitle : profile.jobTitle} editable={editing} onChange={v => setForm(f => ({ ...f, jobTitle: v }))} />
              <Field label="Company" value={editing ? form.company : profile.company} editable={editing} onChange={v => setForm(f => ({ ...f, company: v }))} />
              <Field label="Website" value={editing ? form.website : profile.website} editable={editing} onChange={v => setForm(f => ({ ...f, website: v }))} />
              <Field label="Street Address" value={editing ? form.address : profile.address} editable={editing} onChange={v => setForm(f => ({ ...f, address: v }))} />
              <Field label="City & Country" value={editing ? `${form.city}, ${form.country}` : `${profile.city}, ${profile.country}`} editable={false} onChange={() => {}} />
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Timezone" value={editing ? form.timezone : profile.timezone} editable={editing} onChange={v => setForm(f => ({ ...f, timezone: v }))} />
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === 'security' && (
        <>
          <SectionCard title="Password" icon={Lock} iconColor="#6366f1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Change your password</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last changed 30 days ago. We recommend changing it every 90 days.</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPwModal(true)}
                  style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Key size={14} /> Change Password
                </button>
              </div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={15} color='#10b981' />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Your password meets security requirements</span>
            </div>
          </SectionCard>

          <SectionCard title="Two-Factor Authentication" icon={Smartphone} iconColor={twoFA ? '#10b981' : '#94a3b8'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Authenticator App (TOTP)</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Use Google Authenticator, Authy, or 1Password for an extra layer of security.</div>
                {twoFA && (
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 11, fontWeight: 700 }}>✓ Enabled</span>
                )}
              </div>
              <ToggleSwitch enabled={twoFA} onChange={() => setTwoFA(v => !v)} />
            </div>
          </SectionCard>

          <SectionCard title="Active Sessions" icon={Wifi} iconColor="#f59e0b">
            {[
              { device: 'Chrome on Windows', location: 'Austin, TX, US', time: 'Active now', current: true },
              { device: 'Safari on iPhone 15 Pro', location: 'Austin, TX, US', time: 'Yesterday at 9:30 PM', current: false },
              { device: 'Chrome on MacBook Pro', location: 'Chicago, IL, US', time: 'Mar 30, 2026', current: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--input-bg)', marginBottom: i < 2 ? 10 : 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.current ? 'rgba(16,185,129,0.1)' : 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Smartphone size={16} color={s.current ? '#10b981' : 'var(--text-secondary)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{s.device}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.location} · {s.time}</div>
                </div>
                {s.current ? (
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 11, fontWeight: 700 }}>Current</span>
                ) : (
                  <button style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid var(--danger)', background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Revoke</button>
                )}
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Danger Zone" icon={AlertCircle} iconColor="var(--danger)">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Download My Data</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Export all your account data and documents as a ZIP archive.</div>
              </div>
              <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={13} /> Export
              </button>
            </div>
          </SectionCard>
        </>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <SectionCard title="Notification Preferences" icon={Bell} iconColor="#6366f1">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, marginTop: 0 }}>
            Choose which notifications you'd like to receive by email and in the portal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifs.map((n, i) => (
              <motion.div key={n.id} whileHover={{ x: 4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--input-bg)', marginBottom: i < notifs.length - 1 ? 8 : 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{n.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.sub}</div>
                </div>
                <ToggleSwitch enabled={n.enabled} onChange={() => toggleNotif(n.id)} />
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <button onClick={() => setNotifs(ns => ns.map(n => ({ ...n, enabled: true })))}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Enable All
            </button>
            <button onClick={() => setNotifs(ns => ns.map(n => ({ ...n, enabled: false })))}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Disable All
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── Save Toast ── */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: 28, right: 28, background: '#10b981', color: '#fff', padding: '13px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(16,185,129,0.3)', zIndex: 9999 }}>
            <Check size={16} /> Profile updated successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Change Password Modal ── */}
      <AnimatePresence>
        {pwModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setPwModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 18, width: '100%', maxWidth: 420, boxShadow: '0 32px 64px rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 2px' }}>Change Password</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Minimum 8 characters with at least 1 number</p>
                </div>
                <button onClick={() => setPwModal(false)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                  <X size={13} />
                </button>
              </div>
              <div style={{ padding: 22 }}>
                {[
                  { label: 'Current Password', key: 'old', show: showOldPw, toggle: () => setShowOldPw(v => !v) },
                  { label: 'New Password', key: 'new1', show: showNewPw, toggle: () => setShowNewPw(v => !v) },
                  { label: 'Confirm New Password', key: 'new2', show: showNewPw, toggle: () => setShowNewPw(v => !v) },
                ].map(item => (
                  <div key={item.key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>{item.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input type={item.show ? 'text' : 'password'} value={pw[item.key]} onChange={e => setPw(p => ({ ...p, [item.key]: e.target.value }))}
                        placeholder='••••••••'
                        style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: 9, border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                      <button onClick={item.toggle} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}>
                        {item.show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
                {pw.new1 && pw.new2 && pw.new1 !== pw.new2 && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, color: 'var(--danger)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={12} /> Passwords do not match
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setPwModal(false)} className="b24-btn b24-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={() => { setPwModal(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                    disabled={!pw.old || !pw.new1 || pw.new1 !== pw.new2}
                    style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: pw.old && pw.new1 && pw.new1 === pw.new2 ? 'var(--primary)' : 'var(--card-border)', color: pw.old && pw.new1 && pw.new1 === pw.new2 ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: 13, cursor: pw.old && pw.new1 && pw.new1 === pw.new2 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Key size={14} /> Update Password
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
