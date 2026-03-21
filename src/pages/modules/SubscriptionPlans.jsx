import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Check, X, ChevronDown, ChevronUp,
  CreditCard, Building2, TrendingUp, AlertCircle, Clock,
  Shield, Zap, Star, Lock, Unlock, RefreshCw, Gift,
  MoreVertical, Search, Filter, Download, CheckCircle2,
  XCircle, AlertTriangle, ArrowUpRight, Users, ToggleLeft, ToggleRight
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_FEATURES = [
  'Room Management', 'Booking System', 'Billing & Invoicing',
  'Basic Reports', 'Advanced Reports', 'Multi-Branch',
  'Staff Management', 'Guest CRM', 'Marketing Tools',
  'API Access', 'White Labeling', 'Priority Support',
  'Custom Domain', 'Analytics Dashboard', 'Automation'
];

const INIT_PLANS = [
  {
    id: 1, name: 'Free', price: 0, duration: 30, color: 'var(--text-secondary)', badge: '',
    maxRooms: 10, maxStaff: 2, maxBranches: 1,
    features: ['Room Management'],
    description: 'Get started with basic hotel management.',
    hotels: 4, active: true,
  },
  {
    id: 2, name: 'Standard', price: 999, duration: 30, color: '#6366f1', badge: 'Popular',
    maxRooms: 100, maxStaff: 15, maxBranches: 1,
    features: ['Room Management', 'Booking System', 'Billing & Invoicing', 'Basic Reports', 'Guest CRM'],
    description: 'Everything a growing hotel needs.',
    hotels: 8, active: true,
  },
  {
    id: 3, name: 'Premium', price: 2999, duration: 30, color: '#f59e0b', badge: 'Best Value',
    maxRooms: 999, maxStaff: 100, maxBranches: 10,
    features: ['Room Management', 'Booking System', 'Billing & Invoicing', 'Basic Reports', 'Advanced Reports', 'Multi-Branch', 'Staff Management', 'Guest CRM', 'Marketing Tools', 'Analytics Dashboard', 'Automation'],
    description: 'Full power for enterprise hotel chains.',
    hotels: 5, active: true,
  },
  {
    id: 4, name: 'Enterprise', price: 7999, duration: 365, color: '#8b5cf6', badge: 'Custom',
    maxRooms: 9999, maxStaff: 9999, maxBranches: 9999,
    features: ALL_FEATURES,
    description: 'Unlimited everything + dedicated support.',
    hotels: 2, active: true,
  },
];

const INIT_HOTELS = [
  { id: 1, name: 'Grand Omni Hotel',     city: 'Mumbai',    plan: 'Premium',    status: 'Active',   expiry: '2025-12-31', payment: 'Paid',    revenue: 2999 },
  { id: 2, name: 'Riviera Resort & Spa', city: 'Goa',       plan: 'Standard',   status: 'Active',   expiry: '2025-11-15', payment: 'Paid',    revenue: 999  },
  { id: 3, name: 'Urban Boutique Stay',  city: 'Bangalore', plan: 'Free',       status: 'Active',   expiry: '—',          payment: '—',       revenue: 0    },
  { id: 4, name: 'Sky Palace Resort',    city: 'Delhi',     plan: 'Enterprise', status: 'Active',   expiry: '2026-03-01', payment: 'Paid',    revenue: 7999 },
  { id: 5, name: 'The Meridian',         city: 'Chennai',   plan: 'Standard',   status: 'Expired',  expiry: '2025-09-01', payment: 'Failed',  revenue: 0    },
  { id: 6, name: 'Coastal Breeze Inn',   city: 'Kochi',     plan: 'Free',       status: 'Active',   expiry: '—',          payment: '—',       revenue: 0    },
  { id: 7, name: 'Mountain View Lodge',  city: 'Shimla',    plan: 'Standard',   status: 'Pending',  expiry: '—',          payment: 'Pending', revenue: 0    },
];

const PAYMENT_HISTORY = [
  { id: 'TXN001', hotel: 'Grand Omni Hotel',     plan: 'Premium',    amount: 2999, date: '2025-11-01', status: 'Paid'    },
  { id: 'TXN002', hotel: 'Sky Palace Resort',    plan: 'Enterprise', amount: 7999, date: '2025-10-15', status: 'Paid'    },
  { id: 'TXN003', hotel: 'Riviera Resort & Spa', plan: 'Standard',   amount: 999,  date: '2025-11-01', status: 'Paid'    },
  { id: 'TXN004', hotel: 'The Meridian',         plan: 'Standard',   amount: 999,  date: '2025-09-01', status: 'Failed'  },
  { id: 'TXN005', hotel: 'Mountain View Lodge',  plan: 'Standard',   amount: 999,  date: '2025-11-10', status: 'Pending' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const planColor = (name) => ({ Free: '#64748b', Standard: '#6366f1', Premium: '#f59e0b', Enterprise: '#8b5cf6' }[name] || '#6366f1');

const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 24, ...style }}>
    {children}
  </div>
);

const Badge = ({ color, children, style = {} }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${color}18`, color, ...style }}>{children}</span>
);

const PayBadge = ({ status }) => {
  const map = { Paid: ['#10b981', <CheckCircle2 size={11} />], Failed: ['#ef4444', <XCircle size={11} />], Pending: ['#f59e0b', <Clock size={11} />], '—': ['#94a3b8', null] };
  const [c, icon] = map[status] || ['#94a3b8', null];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${c}18`, color: c }}>{icon}{status}</span>;
};

const Input = ({ style = {}, ...p }) => (
  <input {...p} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)', boxSizing: 'border-box', ...style }}
    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--input-border)'} />
);

const Select = ({ children, style = {}, ...p }) => (
  <select {...p} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)', cursor: 'pointer', ...style }}>{children}</select>
);

const Toast = ({ show, msg, type = 'success' }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, background: '#0f172a', color: 'white', padding: '14px 22px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontSize: 14, fontWeight: 600 }}>
        {type === 'success' ? <CheckCircle2 size={16} color="#4ade80" /> : <AlertTriangle size={16} color="#f59e0b" />}
        {msg}
      </motion.div>
    )}
  </AnimatePresence>
);

const ConfirmModal = ({ show, title, desc, onConfirm, onCancel, danger }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 9000, display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          style={{ background: 'var(--card-bg)', borderRadius: 20, padding: 36, maxWidth: 420, width: '90%', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: danger ? '#fee2e2' : '#fff7ed', display: 'grid', placeItems: 'center', marginBottom: 20 }}>
            <AlertTriangle size={24} color={danger ? '#ef4444' : '#f59e0b'} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onCancel} style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: danger ? '#ef4444' : '#6366f1', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Plan Form Modal ──────────────────────────────────────────────────────────

const PlanModal = ({ plan, onSave, onClose }) => {
  const isEdit = !!plan?.id;
  const [form, setForm] = useState(plan || { name: '', price: '', duration: 30, maxRooms: '', maxStaff: '', maxBranches: 1, description: '', features: [], color: '#6366f1', badge: '', active: true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleFeature = (f) => set('features', form.features.includes(f) ? form.features.filter(x => x !== f) : [...form.features, f]);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', zIndex: 9000, display: 'grid', placeItems: 'center', padding: 20 }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          style={{ background: 'var(--card-bg)', borderRadius: 24, padding: 36, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 50px 100px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{isEdit ? 'Edit Plan' : 'Create New Plan'}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Configure pricing, limits, and features.</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name + Badge */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Name *</label>
                <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Premium" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badge Label</label>
                <Input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="e.g. Popular" />
              </div>
            </div>

            {/* Price + Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price (₹/period) *</label>
                <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 for free" min={0} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration (days)</label>
                <Select value={form.duration} onChange={e => set('duration', +e.target.value)}>
                  <option value={30}>30 days (Monthly)</option>
                  <option value={90}>90 days (Quarterly)</option>
                  <option value={180}>180 days (Half-yearly)</option>
                  <option value={365}>365 days (Annual)</option>
                </Select>
              </div>
            </div>

            {/* Limits */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              {[['Max Rooms', 'maxRooms'], ['Max Staff', 'maxStaff'], ['Max Branches', 'maxBranches']].map(([lbl, key]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lbl}</label>
                  <Input type="number" value={form[key]} onChange={e => set(key, e.target.value)} placeholder="999 = unlimited" min={1} />
                </div>
              ))}
            </div>

            {/* Color */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theme Color</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['#64748b','#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#0ea5e9'].map(c => (
                  <div key={c} onClick={() => set('color', c)} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer', border: form.color === c ? '3px solid #0f172a' : '3px solid transparent', transition: 'all 0.15s' }} />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short plan description..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)', resize: 'vertical', minHeight: 70, boxSizing: 'border-box' }} />
            </div>

            {/* Features */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features ({form.features.length} selected)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {ALL_FEATURES.map(f => {
                  const on = form.features.includes(f);
                  return (
                    <div key={f} onClick={() => toggleFeature(f)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${on ? form.color : 'var(--input-border)'}`, background: on ? `${form.color}08` : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: on ? form.color : '#f1f5f9', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {on && <Check size={11} color="white" />}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: on ? form.color : '#64748b' }}>{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={() => onSave(form)} style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${form.color}, ${form.color}cc)`, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, boxShadow: `0 4px 14px ${form.color}40` }}>
                {isEdit ? 'Save Changes' : 'Create Plan'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Hotel Action Modal ───────────────────────────────────────────────────────

const HotelActionModal = ({ hotel, plans, onClose, onAction }) => {
  const [action, setAction] = useState('upgrade');
  const [selectedPlan, setSelectedPlan] = useState(hotel?.plan || '');
  const [extendDays, setExtendDays] = useState(30);
  const [trialDays, setTrialDays] = useState(14);

  if (!hotel) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', zIndex: 9000, display: 'grid', placeItems: 'center', padding: 20 }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          style={{ background: 'var(--card-bg)', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480, boxShadow: '0 50px 100px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>Manage Hotel</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{hotel.name}</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
          </div>

          {/* Action Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'var(--bg-darker)', borderRadius: 12, padding: 4 }}>
            {[['upgrade', 'Change Plan'], ['extend', 'Extend'], ['trial', 'Free Trial'], ['block', 'Block']].map(([k, l]) => (
              <button key={k} onClick={() => setAction(k)} style={{ flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: action === k ? (k === 'block' ? '#ef4444' : '#6366f1') : 'transparent', color: action === k ? 'white' : '#64748b', transition: 'all 0.15s' }}>{l}</button>
            ))}
          </div>

          {action === 'upgrade' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Select new plan for <strong>{hotel.name}</strong>:</p>
              {plans.map(p => (
                <div key={p.id} onClick={() => setSelectedPlan(p.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 12, border: `2px solid ${selectedPlan === p.name ? p.color : 'var(--input-border)'}`, background: selectedPlan === p.name ? `${p.color}08` : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                    {hotel.plan === p.name && <Badge color="#94a3b8">Current</Badge>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: p.color }}>₹{p.price.toLocaleString()}/mo</span>
                </div>
              ))}
            </div>
          )}

          {action === 'extend' && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Extend current subscription for <strong>{hotel.name}</strong>:</p>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Extend by (days)</label>
              <Select value={extendDays} onChange={e => setExtendDays(+e.target.value)}>
                {[7, 14, 30, 60, 90, 180, 365].map(d => <option key={d} value={d}>{d} days</option>)}
              </Select>
            </div>
          )}

          {action === 'trial' && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Grant a free trial to <strong>{hotel.name}</strong>:</p>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Trial Duration (days)</label>
              <Select value={trialDays} onChange={e => setTrialDays(+e.target.value)}>
                {[7, 14, 30].map(d => <option key={d} value={d}>{d} days</option>)}
              </Select>
              <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Hotel will get Premium features free for {trialDays} days.</p>
              </div>
            </div>
          )}

          {action === 'block' && (
            <div style={{ padding: '16px', borderRadius: 12, background: '#fff1f2', border: '1px solid #fecdd3' }}>
              <p style={{ fontSize: 14, color: '#be123c', fontWeight: 600, marginBottom: 8 }}>⚠️ Block Hotel Access</p>
              <p style={{ fontSize: 13, color: '#9f1239', lineHeight: 1.6 }}>This will immediately revoke all access for <strong>{hotel.name}</strong> and their staff. This action can be reversed.</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
            <button onClick={() => onAction(action, { hotel, selectedPlan, extendDays, trialDays })}
              style={{ flex: 2, padding: 12, borderRadius: 12, border: 'none', background: action === 'block' ? '#ef4444' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              {action === 'upgrade' ? 'Apply Plan' : action === 'extend' ? 'Extend Subscription' : action === 'trial' ? 'Grant Trial' : 'Block Hotel'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = ['Plans', 'Hotels', 'Payments', 'Feature Matrix'];

const SubscriptionPlans = () => {
  const [tab, setTab] = useState('Plans');
  const [plans, setPlans] = useState(INIT_PLANS);
  const [hotels, setHotels] = useState(INIT_HOTELS);
  const [payments] = useState(PAYMENT_HISTORY);
  const [planModal, setPlanModal] = useState(null);   // null | {} | plan obj
  const [hotelModal, setHotelModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const savePlan = (form) => {
    if (form.id) {
      setPlans(ps => ps.map(p => p.id === form.id ? { ...p, ...form } : p));
      showToast('Plan updated successfully');
    } else {
      setPlans(ps => [...ps, { ...form, id: Date.now(), hotels: 0, price: +form.price }]);
      showToast('New plan created');
    }
    setPlanModal(null);
  };

  const deletePlan = (id) => {
    setConfirm({
      title: 'Delete Plan?',
      desc: 'This will remove the plan. Hotels on this plan will be moved to Free.',
      danger: true,
      onConfirm: () => { setPlans(ps => ps.filter(p => p.id !== id)); setConfirm(null); showToast('Plan deleted'); }
    });
  };

  const handleHotelAction = (action, { hotel, selectedPlan, extendDays, trialDays }) => {
    if (action === 'upgrade') {
      setHotels(hs => hs.map(h => h.id === hotel.id ? { ...h, plan: selectedPlan, status: 'Active' } : h));
      showToast(`${hotel.name} moved to ${selectedPlan}`);
    } else if (action === 'extend') {
      showToast(`Subscription extended by ${extendDays} days`);
    } else if (action === 'trial') {
      showToast(`${trialDays}-day free trial granted to ${hotel.name}`);
    } else if (action === 'block') {
      setHotels(hs => hs.map(h => h.id === hotel.id ? { ...h, status: 'Blocked' } : h));
      showToast(`${hotel.name} has been blocked`, 'warn');
    }
    setHotelModal(null);
  };

  // KPI summary
  const totalRevenue = hotels.reduce((s, h) => s + (plans.find(p => p.name === h.plan)?.price || 0), 0);
  const activeSubs = hotels.filter(h => h.status === 'Active').length;
  const expiredSubs = hotels.filter(h => h.status === 'Expired').length;
  const mostUsed = plans.reduce((a, b) => (b.hotels > a.hotels ? b : a), plans[0]);

  const filteredHotels = hotels.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || h.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 4 }}>Subscription Plans</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage plans, hotel subscriptions, and payments.</p>
        </div>
        <button onClick={() => setPlanModal({})} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
          <Plus size={16} /> Create Plan
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: <CreditCard size={20} />, label: 'Monthly Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'From active plans', color: '#6366f1' },
          { icon: <CheckCircle2 size={20} />, label: 'Active Subscriptions', value: activeSubs, sub: `${hotels.length} total hotels`, color: '#10b981' },
          { icon: <AlertCircle size={20} />, label: 'Expired / Pending', value: expiredSubs + hotels.filter(h => h.status === 'Pending').length, sub: 'Need attention', color: '#f59e0b' },
          { icon: <Star size={20} />, label: 'Most Popular Plan', value: mostUsed?.name || '—', sub: `${mostUsed?.hotels} hotels`, color: mostUsed?.color || '#6366f1' },
        ].map((k, i) => (
          <Card key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${k.color}15`, display: 'grid', placeItems: 'center', color: k.color }}>{k.icon}</div>
              <ArrowUpRight size={16} color="#94a3b8" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{k.label}</p>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 2 }}>{k.value}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.sub}</p>
            <div style={{ position: 'absolute', bottom: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: `${k.color}08` }} />
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', padding: 5, marginBottom: 24, display: 'flex', gap: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: tab === t ? '#6366f1' : 'transparent', color: tab === t ? 'white' : '#64748b', transition: 'all 0.15s' }}>{t}</button>
        ))}
      </div>

      {/* ── PLANS TAB ── */}
      {tab === 'Plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {plans.map(plan => (
            <motion.div key={plan.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'var(--card-bg)', borderRadius: 20, border: `2px solid ${plan.color}30`, boxShadow: `0 4px 20px ${plan.color}12`, overflow: 'hidden', position: 'relative' }}>
              {/* Top accent */}
              <div style={{ height: 5, background: `linear-gradient(90deg, ${plan.color}, ${plan.color}88)` }} />
              <div style={{ padding: 24 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{plan.name}</h3>
                      {plan.badge && <Badge color={plan.color}>{plan.badge}</Badge>}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{plan.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPlanModal(plan)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: 'var(--card-bg)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Edit2 size={13} color="#64748b" /></button>
                    <button onClick={() => deletePlan(plan.id)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #fee2e2', background: '#fff1f2', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Trash2 size={13} color="#ef4444" /></button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 20 }}>
                  {plan.price === 0
                    ? <span style={{ fontSize: 32, fontWeight: 800, color: plan.color }}>Free</span>
                    : <><span style={{ fontSize: 32, fontWeight: 800, color: plan.color }}>₹{plan.price.toLocaleString()}</span><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/{plan.duration === 365 ? 'yr' : 'mo'}</span></>
                  }
                </div>

                {/* Limits */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {[['Rooms', plan.maxRooms], ['Staff', plan.maxStaff], ['Branches', plan.maxBranches]].map(([l, v]) => (
                    <div key={l} style={{ padding: '5px 10px', borderRadius: 8, background: 'var(--bg-darker)', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {v >= 999 ? '∞' : v} {l}
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {plan.features.slice(0, 5).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                      <CheckCircle2 size={14} color={plan.color} />{f}
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <p style={{ fontSize: 12, color: plan.color, fontWeight: 700 }}>+{plan.features.length - 5} more features</p>
                  )}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 size={13} color="#94a3b8" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{plan.hotels} hotels</span>
                  </div>
                  <div onClick={() => setPlans(ps => ps.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))} style={{ cursor: 'pointer' }}>
                    {plan.active ? <ToggleRight size={28} color={plan.color} /> : <ToggleLeft size={28} color="#cbd5e1" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Plan Card */}
          <div onClick={() => setPlanModal({})} style={{ borderRadius: 20, border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40, cursor: 'pointer', transition: 'all 0.2s', minHeight: 200 }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f5f3ff'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'grid', placeItems: 'center' }}><Plus size={22} color="#94a3b8" /></div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}>Add New Plan</p>
          </div>
        </div>
      )}

      {/* ── HOTELS TAB ── */}
      {tab === 'Hotels' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
            </div>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
              {['All', 'Active', 'Expired', 'Pending', 'Blocked'].map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-darker)' }}>
                  {['Hotel', 'City', 'Current Plan', 'Status', 'Expiry', 'Payment', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map(h => {
                  const pc = planColor(h.plan);
                  const sc = { Active: '#10b981', Expired: '#ef4444', Pending: '#f59e0b', Blocked: '#64748b' }[h.status] || '#94a3b8';
                  return (
                    <tr key={h.id} style={{ borderTop: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${pc}15`, display: 'grid', placeItems: 'center', color: pc, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{h.name.charAt(0)}</div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{h.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{h.city}</td>
                      <td style={{ padding: '14px 16px' }}><Badge color={pc}>{h.plan}</Badge></td>
                      <td style={{ padding: '14px 16px' }}><Badge color={sc}>{h.status}</Badge></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{h.expiry}</td>
                      <td style={{ padding: '14px 16px' }}><PayBadge status={h.payment} /></td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => setHotelModal(h)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#6366f1' }}>
                          <MoreVertical size={13} /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── PAYMENTS TAB ── */}
      {tab === 'Payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { label: 'Total Collected', value: `₹${payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}`, color: '#10b981', icon: <CreditCard size={18} /> },
              { label: 'Pending Payments', value: payments.filter(p => p.status === 'Pending').length, color: '#f59e0b', icon: <Clock size={18} /> },
              { label: 'Failed Transactions', value: payments.filter(p => p.status === 'Failed').length, color: '#ef4444', icon: <XCircle size={18} /> },
            ].map((k, i) => (
              <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}15`, display: 'grid', placeItems: 'center', color: k.color, flexShrink: 0 }}>{k.icon}</div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{k.label}</p>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</h3>
                </div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Transaction History</h4>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <Download size={13} /> Export
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-darker)' }}>
                  {['Txn ID', 'Hotel', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--card-border)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#6366f1', fontWeight: 700 }}>{p.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.hotel}</td>
                    <td style={{ padding: '14px 16px' }}><Badge color={planColor(p.plan)}>{p.plan}</Badge></td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.date}</td>
                    <td style={{ padding: '14px 16px' }}><PayBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── FEATURE MATRIX TAB ── */}
      {tab === 'Feature Matrix' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-darker)' }}>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', minWidth: 180 }}>FEATURE</th>
                  {plans.map(p => (
                    <th key={p.id} style={{ textAlign: 'center', padding: '16px 20px', minWidth: 120 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.price === 0 ? 'Free' : `₹${p.price}/mo`}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((f, i) => (
                  <tr key={f} style={{ borderTop: '1px solid var(--card-border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--bg-darker)' }}>
                    <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f}</td>
                    {plans.map(p => {
                      const has = p.features.includes(f);
                      return (
                        <td key={p.id} style={{ padding: '14px 20px', textAlign: 'center' }}>
                          {has
                            ? <CheckCircle2 size={18} color={p.color} style={{ margin: '0 auto' }} />
                            : <XCircle size={18} color="#e2e8f0" style={{ margin: '0 auto' }} />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      {planModal !== null && <PlanModal plan={planModal?.id ? planModal : null} onSave={savePlan} onClose={() => setPlanModal(null)} />}
      {hotelModal && <HotelActionModal hotel={hotelModal} plans={plans} onClose={() => setHotelModal(null)} onAction={handleHotelAction} />}
      <ConfirmModal show={!!confirm} title={confirm?.title} desc={confirm?.desc} danger={confirm?.danger} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} />
      <Toast show={toast.show} msg={toast.msg} type={toast.type} />
    </motion.div>
  );
};

export default SubscriptionPlans;


