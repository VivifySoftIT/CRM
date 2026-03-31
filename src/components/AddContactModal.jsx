import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Building2, Phone, Mail, MapPin, Briefcase,
  Tag, FileText, Shield, ChevronDown, Check, AlertCircle,
  Loader2, Users
} from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────────────────────
const CONTACT_TYPES = ['Lead', 'Customer', 'VIP'];
const OWNERS       = ['John Sales', 'Sarah Doe', 'Mike Ross', 'Emily Clark'];
const ALL_TAGS     = ['VIP', 'Hot Lead', 'New'];
const COUNTRIES    = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'India', 'Australia', 'Spain', 'Japan'];

const AVATAR_PALETTES = [
  { bg: 'rgba(37,99,235,0.15)', text: '#2563eb' },
  { bg: 'rgba(124,58,237,0.15)', text: '#7c3aed' },
  { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  { bg: 'rgba(236,72,153,0.15)', text: '#ec4899' },
];

const TYPE_COLORS = {
  Lead:     { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b',  border: 'rgba(245,158,11,0.3)'  },
  Customer: { bg: 'rgba(16,185,129,0.1)',  text: '#10b981',  border: 'rgba(16,185,129,0.3)'  },
  VIP:      { bg: 'rgba(124,58,237,0.1)',  text: '#7c3aed',  border: 'rgba(124,58,237,0.3)'  },
};

function getAvatarPalette(name = '') {
  const idx = name.charCodeAt(0) % AVATAR_PALETTES.length || 0;
  return AVATAR_PALETTES[idx] || AVATAR_PALETTES[0];
}

// ─── Email & Phone validators ────────────────────────────────────────────────
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = v => /^[+\d\s\-().]{7,20}$/.test(v.trim());

// ─── Reusable Field Components ───────────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div className="b24-field" style={{ marginBottom: 0 }}>
      <label className="b24-label">
        {label}{required && <span style={{ color: '#e53935', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <span className="b24-error">
          <AlertCircle size={11} /> {error}
        </span>
      )}
      {hint && !error && <span className="b24-hint">{hint}</span>}
    </div>
  );
}

function Input({ icon: Icon, error, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      {Icon && (
        <Icon
          size={14}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
      )}
      <input
        className={`b24-input${error ? ' error' : ''}`}
        style={{ paddingLeft: Icon ? 32 : 10, borderRadius: 8 }}
        {...props}
      />
    </div>
  );
}

function Select({ icon: Icon, error, children, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      {Icon && (
        <Icon
          size={14}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}
        />
      )}
      <select
        className={`b24-select${error ? ' error' : ''}`}
        style={{ paddingLeft: Icon ? 32 : 10, borderRadius: 8 }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, color = '#2563eb' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontWeight: 800, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 14, paddingBottom: 10,
      borderBottom: '1px solid var(--card-border)'
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        background: `${color}18`, display: 'grid', placeItems: 'center'
      }}>
        <Icon size={13} color={color} />
      </span>
      {title}
    </div>
  );
}

// ─── Tag Picker ──────────────────────────────────────────────────────────────
const TAG_STYLES = {
  'VIP':      { bg: 'rgba(124,58,237,0.12)', text: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
  'Hot Lead': { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444',  border: 'rgba(239,68,68,0.25)'  },
  'New':      { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.25)' },
};

function TagPicker({ selected, onChange }) {
  const toggle = tag => onChange(
    selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
  );
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {ALL_TAGS.map(tag => {
        const active = selected.includes(tag);
        const style = TAG_STYLES[tag] || {};
        return (
          <button
            key={tag} type="button"
            onClick={() => toggle(tag)}
            style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
              border: `1.5px solid ${active ? style.border : 'var(--card-border)'}`,
              background: active ? style.bg : 'transparent',
              color: active ? style.text : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 5
            }}
          >
            {active && <Check size={11} />} {tag}
          </button>
        );
      })}
    </div>
  );
}

// ─── Avatar Preview ──────────────────────────────────────────────────────────
function AvatarPreview({ firstName, lastName, type }) {
  const name = `${firstName} ${lastName}`.trim() || '?';
  const palette = getAvatarPalette(name);
  const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?';
  const typeStyle = TYPE_COLORS[type];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', borderRadius: 10,
      background: 'var(--bg-page)', border: '1px dashed var(--card-border)',
      marginBottom: 20
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: palette.bg, color: palette.text,
        fontSize: 22, fontWeight: 900, display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-heading)', flexShrink: 0,
        boxShadow: `0 0 0 3px ${palette.bg}`
      }}>
        {initials}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {name === '?' ? 'Your Contact' : name}
        </div>
        {typeStyle && (
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            marginTop: 4, padding: '2px 10px', borderRadius: 99,
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            background: typeStyle.bg, color: typeStyle.text,
            border: `1px solid ${typeStyle.border}`, letterSpacing: '0.06em'
          }}>
            {type}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          border: '1px solid #d1fae5', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12, minWidth: 280
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 99, background: '#d1fae5',
          display: 'grid', placeItems: 'center', flexShrink: 0
        }}>
          <Check size={16} color="#059669" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#065f46' }}>{message}</div>
          <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 1 }}>The contact list has been updated.</div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', padding: 4, marginLeft: 'auto',
          cursor: 'pointer', color: '#94a3b8', borderRadius: 6
        }}>
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Initial Form State ──────────────────────────────────────────────────────
const INIT_FORM = {
  firstName: '', lastName: '', phone: '', email: '', contactType: 'Lead',
  company: '', designation: '',
  owner: 'John Sales',
  country: '', city: '',
  tags: [], notes: ''
};

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function AddContactModal({ open, onClose, onAdd }) {
  const [form, setForm]     = useState(INIT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (open) { setForm(INIT_FORM); setErrors({}); }
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = useCallback((k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }, []);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required';
    if (!form.phone.trim())         errs.phone  = 'Phone number is required';
    else if (!isValidPhone(form.phone)) errs.phone = 'Enter a valid phone number';
    if (!form.email.trim())         errs.email  = 'Email address is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address';
    return errs;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate async

    const newContact = {
      id:          Date.now(),
      name:        `${form.firstName} ${form.lastName}`.trim(),
      firstName:   form.firstName,
      lastName:    form.lastName,
      phone:       form.phone,
      email:       form.email,
      contactType: form.contactType,
      company:     form.company,
      designation: form.designation,
      owner:       form.owner,
      country:     form.country,
      city:        form.city,
      location:    [form.city, form.country].filter(Boolean).join(', ') || '—',
      tags:        form.tags.length ? form.tags : [form.contactType],
      notes:       form.notes,
      date:        new Date().toISOString().split('T')[0],
    };

    onAdd(newContact);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)'
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1101,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', pointerEvents: 'none'
            }}
          >
            <div style={{
              pointerEvents: 'auto',
              background: 'var(--card-bg)',
              borderRadius: 14, width: '100%', maxWidth: 620,
              maxHeight: '92vh', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.22), 0 0 0 1px var(--card-border)',
            }}>

              {/* ── Header ── */}
              <div style={{
                padding: '16px 22px', borderBottom: '1px solid var(--card-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.04))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'rgba(37,99,235,0.1)',
                    display: 'grid', placeItems: 'center'
                  }}>
                    <Users size={16} color="#2563eb" />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                      Add New Contact
                    </h2>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                      Fill in the details to create a contact record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !loading && onClose()}
                  style={{
                    background: 'var(--bg-page)', border: '1px solid var(--card-border)',
                    borderRadius: 8, width: 32, height: 32, padding: 0,
                    display: 'grid', placeItems: 'center', cursor: 'pointer',
                    color: 'var(--text-muted)', transition: 'all 0.15s'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

                {/* Avatar Preview */}
                <AvatarPreview
                  firstName={form.firstName}
                  lastName={form.lastName}
                  type={form.contactType}
                />

                {/* Section 1: Basic Information */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHeading icon={User} title="Basic Information" color="#2563eb" />
                  <div className="b24-row b24-row-2" style={{ marginBottom: 12 }}>
                    <Field label="First Name" required error={errors.firstName}>
                      <Input icon={User} placeholder="e.g. Alice" value={form.firstName}
                        onChange={e => set('firstName', e.target.value)} error={errors.firstName} />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName}>
                      <Input placeholder="e.g. Johnson" value={form.lastName}
                        onChange={e => set('lastName', e.target.value)} error={errors.lastName} />
                    </Field>
                  </div>
                  <div className="b24-row b24-row-2" style={{ marginBottom: 12 }}>
                    <Field label="Phone Number" required error={errors.phone}>
                      <Input icon={Phone} placeholder="+1-202-555-0101" value={form.phone}
                        onChange={e => set('phone', e.target.value)} error={errors.phone} />
                    </Field>
                    <Field label="Email Address" required error={errors.email}>
                      <Input icon={Mail} type="email" placeholder="alice@company.com" value={form.email}
                        onChange={e => set('email', e.target.value)} error={errors.email} />
                    </Field>
                  </div>
                  <Field label="Contact Type">
                    <Select icon={Shield} value={form.contactType} onChange={e => set('contactType', e.target.value)}>
                      {CONTACT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </Select>
                  </Field>
                </div>

                {/* Section 2: Company Details */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHeading icon={Building2} title="Company Details" color="#7c3aed" />
                  <div className="b24-row b24-row-2">
                    <Field label="Company Name">
                      <Input icon={Building2} placeholder="e.g. Vertex Corp" value={form.company}
                        onChange={e => set('company', e.target.value)} />
                    </Field>
                    <Field label="Designation / Job Title">
                      <Input icon={Briefcase} placeholder="e.g. VP Operations" value={form.designation}
                        onChange={e => set('designation', e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Section 3: Ownership */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHeading icon={Users} title="Ownership" color="#10b981" />
                  <Field label="Record Owner">
                    <Select icon={Users} value={form.owner} onChange={e => set('owner', e.target.value)}>
                      {OWNERS.map(o => <option key={o}>{o}</option>)}
                    </Select>
                  </Field>
                </div>

                {/* Section 4: Location */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHeading icon={MapPin} title="Location" color="#f59e0b" />
                  <div className="b24-row b24-row-2">
                    <Field label="Country">
                      <Select icon={MapPin} value={form.country} onChange={e => set('country', e.target.value)}>
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </Select>
                    </Field>
                    <Field label="City">
                      <Input icon={MapPin} placeholder="e.g. New York" value={form.city}
                        onChange={e => set('city', e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Section 5: Additional Info */}
                <div>
                  <SectionHeading icon={Tag} title="Additional Information" color="#ec4899" />
                  <Field label="Tags" hint="Click to toggle tags">
                    <div style={{ marginTop: 6 }}>
                      <TagPicker selected={form.tags} onChange={v => set('tags', v)} />
                    </div>
                  </Field>
                  <Field label="Notes" hint="Any additional context or remarks">
                    <textarea
                      className="b24-textarea"
                      style={{ borderRadius: 8, marginTop: 2, minHeight: 80 }}
                      placeholder="Write any notes about this contact..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{
                padding: '14px 22px', borderTop: '1px solid var(--card-border)',
                display: 'flex', gap: 10, justifyContent: 'flex-end',
                background: 'var(--bg-page)'
              }}>
                <button
                  className="b24-btn b24-btn-secondary"
                  onClick={() => !loading && onClose()}
                  disabled={loading}
                  style={{ minWidth: 100 }}
                >
                  Cancel
                </button>
                <button
                  className="b24-btn b24-btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ minWidth: 140, gap: 8 }}
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                        <Loader2 size={14} />
                      </motion.div>
                      Saving…
                    </>
                  ) : (
                    <><Check size={14} /> Save Contact</>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
