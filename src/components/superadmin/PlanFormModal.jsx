import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, DollarSign, Users, Database, Layers } from 'lucide-react';
import FeatureToggle from './FeatureToggle';

const ALL_FEATURES = [
  'Leads Management', 'Contacts', 'Deals & Pipeline', 'Tasks & Activities',
  'Email Integration', 'Reports & Analytics', 'Automation', 'API Access',
  'Custom Fields', 'Document Management', 'Invoicing', 'Campaigns',
  'AI Assistant', 'Priority Support', 'White Labeling', 'Multi-Branch',
];

const SUPPORT_TYPES = ['Email', 'Chat', 'Priority', 'Dedicated'];
const COLORS = ['#64748b','#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#ec4899','#6366f1'];

const EMPTY = {
  name: '', color: '#6366f1', description: '', priceMonthly: 0, priceYearly: 0,
  maxUsers: 5, maxLeads: 100, storage: '1GB', support: 'Email',
  features: [], popular: false, active: true,
};

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

function Inp({ icon: Icon, error, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: f ? '#6366f1' : 'var(--text-muted)', pointerEvents: 'none' }} />}
      <input {...props}
        onFocus={e => { setF(true); props.onFocus?.(e); }}
        onBlur={e => { setF(false); props.onBlur?.(e); }}
        style={{ width: '100%', padding: Icon ? '9px 12px 9px 32px' : '9px 12px', borderRadius: '10px', border: `1px solid ${error ? '#ef4444' : f ? '#6366f1' : 'var(--card-border)'}`, background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', boxShadow: f ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none' }} />
    </div>
  );
}

export default function PlanFormModal({ plan, onSave, onClose }) {
  const isEdit = !!plan?.id;
  const [form, setForm] = useState(plan ? { ...plan } : { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [section, setSection] = useState('basic'); // basic | limits | features

  useEffect(() => { setForm(plan ? { ...plan } : { ...EMPTY }); setErrors({}); setSection('basic'); }, [plan]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Plan name is required';
    if (form.priceMonthly < 0) e.priceMonthly = 'Must be ≥ 0';
    if (form.maxUsers < 1) e.maxUsers = 'Must be ≥ 1';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setSection('basic'); return; }
    onSave(form);
  };

  const SECTIONS = [
    { id: 'basic',    label: 'Basic Info' },
    { id: 'limits',   label: 'Limits' },
    { id: 'features', label: 'Features' },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.65)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '560px', borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.25)', overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ padding: '22px 26px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '11px', background: `linear-gradient(135deg,${form.color},${form.color}99)`, display: 'grid', placeItems: 'center' }}>
                  <Zap size={17} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>{isEdit ? 'Edit Plan' : 'Create Plan'}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure pricing, limits & features</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Section tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-darker)', borderRadius: '10px', padding: '3px', gap: '2px', marginBottom: '20px' }}>
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setSection(s.id)}
                  style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s', background: section === s.id ? 'var(--card-bg)' : 'transparent', color: section === s.id ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: section === s.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '0 26px', overflowY: 'auto', flex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>

                {section === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <Field label="PLAN NAME *" error={errors.name}>
                        <Inp value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Pro" error={errors.name} />
                      </Field>
                      <Field label="THEME COLOR">
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '2px' }}>
                          {COLORS.map(c => (
                            <div key={c} onClick={() => set('color', c)}
                              style={{ width: 26, height: 26, borderRadius: '7px', background: c, cursor: 'pointer', border: form.color === c ? '3px solid var(--text-primary)' : '2px solid transparent', transition: 'all 0.15s', flexShrink: 0 }} />
                          ))}
                        </div>
                      </Field>
                    </div>

                    <Field label="DESCRIPTION">
                      <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short plan description..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical', minHeight: '64px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <Field label="MONTHLY PRICE ($)" error={errors.priceMonthly}>
                        <Inp icon={DollarSign} type="number" min={0} value={form.priceMonthly} onChange={e => set('priceMonthly', +e.target.value)} placeholder="0 = Free" />
                      </Field>
                      <Field label="YEARLY PRICE ($)">
                        <Inp icon={DollarSign} type="number" min={0} value={form.priceYearly} onChange={e => set('priceYearly', +e.target.value)} placeholder="0 = Free" />
                      </Field>
                    </div>

                    <Field label="SUPPORT TYPE">
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {SUPPORT_TYPES.map(s => (
                          <button key={s} type="button" onClick={() => set('support', s)}
                            style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${form.support === s ? form.color : 'var(--card-border)'}`, background: form.support === s ? form.color + '10' : 'var(--bg-darker)', color: form.support === s ? form.color : 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div onClick={() => set('popular', !form.popular)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${form.popular ? '#f59e0b40' : 'var(--card-border)'}`, background: form.popular ? '#f59e0b08' : 'var(--bg-darker)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: form.popular ? '#f59e0b' : 'var(--text-secondary)' }}>⭐ Mark as Popular</span>
                        <div style={{ width: 32, height: 18, borderRadius: '99px', background: form.popular ? '#f59e0b' : 'var(--card-border)', position: 'relative', transition: 'background 0.2s' }}>
                          <motion.div animate={{ x: form.popular ? 15 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            style={{ position: 'absolute', top: 1, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>
                      <div onClick={() => set('active', !form.active)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${form.active ? '#10b98140' : '#ef444440'}`, background: form.active ? '#10b98108' : '#ef444408', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: form.active ? '#10b981' : '#ef4444' }}>{form.active ? '✓ Active' : '✗ Disabled'}</span>
                        <div style={{ width: 32, height: 18, borderRadius: '99px', background: form.active ? '#10b981' : '#ef4444', position: 'relative', transition: 'background 0.2s' }}>
                          <motion.div animate={{ x: form.active ? 15 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            style={{ position: 'absolute', top: 1, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'limits' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <Field label="MAX USERS" error={errors.maxUsers}>
                        <Inp icon={Users} type="number" min={1} value={form.maxUsers} onChange={e => set('maxUsers', +e.target.value)} placeholder="999 = unlimited" />
                      </Field>
                      <Field label="MAX LEADS">
                        <Inp icon={Layers} type="number" min={1} value={form.maxLeads} onChange={e => set('maxLeads', +e.target.value)} placeholder="999999 = unlimited" />
                      </Field>
                    </div>
                    <Field label="STORAGE LIMIT">
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {['1GB','5GB','10GB','25GB','50GB','100GB','Unlimited'].map(s => (
                          <button key={s} type="button" onClick={() => set('storage', s)}
                            style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${form.storage === s ? form.color : 'var(--card-border)'}`, background: form.storage === s ? form.color + '10' : 'var(--bg-darker)', color: form.storage === s ? form.color : 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-darker)', border: '1px solid var(--card-border)' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>PLAN SUMMARY</p>
                      {[['Users', form.maxUsers === 999 ? 'Unlimited' : form.maxUsers], ['Leads', form.maxLeads >= 999999 ? 'Unlimited' : form.maxLeads?.toLocaleString()], ['Storage', form.storage], ['Support', form.support]].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--card-border)' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k}</span>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'features' && (
                  <div style={{ paddingBottom: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{form.features.length} of {ALL_FEATURES.length} features enabled</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" onClick={() => set('features', ALL_FEATURES)} style={{ fontSize: '11px', fontWeight: '700', color: form.color, background: form.color + '10', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>All</button>
                        <button type="button" onClick={() => set('features', [])} style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', background: '#ef444410', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>None</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {ALL_FEATURES.map(f => (
                        <FeatureToggle key={f} label={f} color={form.color}
                          checked={form.features.includes(f)}
                          onChange={on => set('features', on ? [...form.features, f] : form.features.filter(x => x !== f))} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 26px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '11px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave}
              style={{ flex: 2, padding: '10px', borderRadius: '11px', border: 'none', background: `linear-gradient(135deg,${form.color},${form.color}bb)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: `0 4px 14px ${form.color}40` }}>
              <Check size={14} /> {isEdit ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
