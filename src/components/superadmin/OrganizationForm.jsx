import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Lock, Package, Users, RefreshCw, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const PLANS = ['Free', 'Starter', 'Pro', 'Enterprise'];
const PLAN_INFO = {
  Free:       { price: '$0/mo',      users: 5,   desc: 'Basic CRM features, 1 user' },
  Starter:    { price: '$99/mo',     users: 10,  desc: 'Core modules, up to 10 users' },
  Pro:        { price: '$299/mo',    users: 50,  desc: 'Full suite, up to 50 users' },
  Enterprise: { price: 'Custom',     users: 999, desc: 'Unlimited users, dedicated support' },
};

const EMPTY = { name: '', adminName: '', email: '', password: '', plan: 'Pro', maxUsers: 50, status: 'Active' };

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

function Input({ icon: Icon, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused ? '#6366f1' : 'var(--text-muted)', pointerEvents: 'none', transition: 'color 0.2s' }} />}
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: '100%', padding: Icon ? '10px 12px 10px 36px' : '10px 12px',
          borderRadius: '10px', border: `1px solid ${error ? '#ef4444' : focused ? '#6366f1' : 'var(--card-border)'}`,
          background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '14px',
          outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        }}
      />
    </div>
  );
}

const STEPS = ['Company Info', 'Admin Account', 'Plan & Limits'];

export default function OrganizationForm({ org, onSave, onClose }) {
  const isEdit = !!org;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(isEdit ? { ...org } : { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { setForm(isEdit ? { ...org } : { ...EMPTY }); setStep(0); setErrors({}); }, [org]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = 'Company name is required';
    }
    if (s === 1) {
      if (!form.adminName.trim()) e.adminName = 'Admin name is required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
      if (!isEdit && (!form.password || form.password.length < 6)) e.password = 'Min 6 characters';
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const genPassword = () => set('password', Math.random().toString(36).slice(-12) + 'A1!');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '540px', borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.25)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center' }}>
                <Building2 size={18} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {isEdit ? 'Edit Organization' : 'Add Organization'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {isEdit ? 'Update organization details' : STEPS[step]}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}>
              <X size={15} />
            </button>
          </div>

          {/* Step indicator (only for create) */}
          {!isEdit && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ height: '3px', borderRadius: '99px', background: i <= step ? '#6366f1' : 'var(--card-border)', transition: 'background 0.3s' }} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: i <= step ? '#6366f1' : 'var(--text-muted)', transition: 'color 0.3s' }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '0 28px', overflowY: 'auto', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>

              {/* Step 0 / Edit: Company Info */}
              {(step === 0 || isEdit) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: isEdit ? '0' : '4px' }}>
                  <Field label="COMPANY NAME" error={errors.name}>
                    <Input icon={Building2} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Acme Corporation" error={errors.name} />
                  </Field>
                  {isEdit && (
                    <>
                      <Field label="ADMIN NAME" error={errors.adminName}>
                        <Input icon={User} value={form.adminName} onChange={e => set('adminName', e.target.value)} placeholder="John Smith" error={errors.adminName} />
                      </Field>
                      <Field label="ADMIN EMAIL" error={errors.email}>
                        <Input icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@company.com" error={errors.email} />
                      </Field>
                    </>
                  )}
                </div>
              )}

              {/* Step 1: Admin Account */}
              {step === 1 && !isEdit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="ADMIN NAME" error={errors.adminName}>
                    <Input icon={User} value={form.adminName} onChange={e => set('adminName', e.target.value)} placeholder="John Smith" error={errors.adminName} />
                  </Field>
                  <Field label="ADMIN EMAIL" error={errors.email}>
                    <Input icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@company.com" error={errors.email} />
                  </Field>
                  <Field label="PASSWORD" error={errors.password}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <Input icon={Lock} type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" error={errors.password} />
                      </div>
                      <button type="button" onClick={genPassword}
                        style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '700', color: '#6366f1', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <RefreshCw size={12} /> Generate
                      </button>
                    </div>
                  </Field>
                </div>
              )}

              {/* Step 2 / Edit Plan: Plan & Limits */}
              {(step === 2 || isEdit) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: isEdit ? '16px' : '0' }}>
                  {isEdit && <div style={{ height: '1px', background: 'var(--card-border)', margin: '0 -28px' }} />}
                  {isEdit && <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>PLAN & LIMITS</p>}
                  <Field label="SUBSCRIPTION PLAN">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {PLANS.map(p => (
                        <button key={p} type="button" onClick={() => { set('plan', p); set('maxUsers', PLAN_INFO[p].users); }}
                          style={{
                            padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                            border: `2px solid ${form.plan === p ? '#6366f1' : 'var(--card-border)'}`,
                            background: form.plan === p ? 'rgba(99,102,241,0.06)' : 'var(--bg-darker)',
                            transition: 'all 0.15s',
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: form.plan === p ? '#6366f1' : 'var(--text-primary)' }}>{p}</span>
                            {form.plan === p && <Check size={13} color="#6366f1" />}
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{PLAN_INFO[p].price}</p>
                        </button>
                      ))}
                    </div>
                    {form.plan && (
                      <div style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(99,102,241,0.06)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {PLAN_INFO[form.plan].desc}
                      </div>
                    )}
                  </Field>
                  <Field label="MAX USERS">
                    <Input icon={Users} type="number" value={form.maxUsers} onChange={e => set('maxUsers', parseInt(e.target.value) || 1)} min={1} />
                  </Field>
                  <Field label="STATUS">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Active', 'Suspended'].map(s => (
                        <button key={s} type="button" onClick={() => set('status', s)}
                          style={{ flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', transition: 'all 0.15s',
                            border: `2px solid ${form.status === s ? (s === 'Active' ? '#10b981' : '#ef4444') : 'var(--card-border)'}`,
                            background: form.status === s ? (s === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)') : 'var(--bg-darker)',
                            color: form.status === s ? (s === 'Active' ? '#10b981' : '#ef4444') : 'var(--text-secondary)',
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          {!isEdit && step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ padding: '11px 18px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={15} /> Back
            </button>
          )}
          <button onClick={onClose}
            style={{ flex: isEdit || step === 0 ? 1 : 0, padding: '11px 18px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            Cancel
          </button>
          {!isEdit && step < STEPS.length - 1 ? (
            <button onClick={next}
              style={{ flex: 2, padding: '11px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit}
              style={{ flex: 2, padding: '11px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              <Check size={15} /> {isEdit ? 'Save Changes' : 'Create Organization'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
