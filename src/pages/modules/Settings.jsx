import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Globe, Shield, CreditCard, Mail, Bell,
  FileText, Building2, BarChart2, Upload, Check,
  AlertTriangle, X, ToggleLeft, ToggleRight,
  Plus, Eye, EyeOff, Save, RefreshCw, Sparkles,
  ChevronRight, Lock, Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Primitives ───────────────────────────────────────────────────────────────

const GCard = ({ children, style = {}, glow }) => (
  <div style={{
    background: 'var(--card-bg)', borderRadius: '20px',
    border: `1px solid ${glow ? glow + '30' : 'var(--card-border)'}`,
    boxShadow: glow ? `var(--card-shadow), 0 0 0 1px ${glow}18, 0 8px 32px ${glow}12` : 'var(--card-shadow)',
    padding: '28px', ...style
  }}>{children}</div>
);

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
    marginBottom: '7px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
    {children}
  </label>
);

const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '11px',
    border: '1.5px solid var(--card-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s', ...style
  }}
    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
    onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none'; }}
  />
);

const Select = ({ children, style = {}, ...props }) => (
  <select {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '11px',
    border: '1.5px solid var(--card-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', cursor: 'pointer', ...style
  }}>{children}</select>
);

const Textarea = ({ style = {}, ...props }) => (
  <textarea {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '11px',
    border: '1.5px solid var(--card-border)', fontSize: '13px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', resize: 'vertical',
    minHeight: '90px', boxSizing: 'border-box', fontFamily: 'monospace', ...style
  }}
    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
    onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none'; }}
  />
);

const Toggle = ({ value, onChange, label, desc }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid var(--card-border)' }}>
    <div>
      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</p>
      {desc && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</p>}
    </div>
    <div onClick={() => onChange(!value)} style={{ cursor: 'pointer', flexShrink: 0, marginLeft: '16px' }}>
      <div style={{
        width: '48px', height: '26px', borderRadius: '99px', position: 'relative',
        background: value ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--card-border)',
        transition: 'background 0.25s', boxShadow: value ? '0 2px 8px rgba(99,102,241,0.35)' : 'none'
      }}>
        <motion.div animate={{ x: value ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%',
            background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, desc, icon, accent = '#6366f1' }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
    {icon && (
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
        background: `linear-gradient(135deg,${accent}22,${accent}10)`, border: `1px solid ${accent}25`,
        display: 'grid', placeItems: 'center' }}>
        {React.cloneElement(icon, { size: 18, color: accent })}
      </div>
    )}
    <div>
      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>{title}</h3>
      {desc && <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>}
    </div>
  </div>
);

const SaveBar = ({ onSave, saving }) => (
  <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
    <button style={{ padding: '10px 20px', borderRadius: '11px', border: '1.5px solid var(--card-border)',
      background: 'transparent', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', cursor: 'pointer' }}>
      Discard
    </button>
    <button onClick={onSave} style={{ padding: '10px 24px', borderRadius: '11px', border: 'none',
      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '13px',
      fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
      {saving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} />Saving...</>
               : <><Save size={14} />Save Changes</>}
    </button>
  </div>
);

const FileUpload = ({ label, hint, accent = '#6366f1' }) => (
  <div>
    <Label>{label}</Label>
    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      border: `2px dashed var(--card-border)`, borderRadius: '14px', padding: '28px', cursor: 'pointer',
      background: 'var(--input-bg)', transition: 'all 0.2s', gap: '8px' }}
      onMouseOver={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = accent + '08'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--input-bg)'; }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: accent + '15',
        display: 'grid', placeItems: 'center' }}>
        <Upload size={18} color={accent} />
      </div>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Click to upload</span>
      {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hint}</span>}
      <input type="file" style={{ display: 'none' }} />
    </label>
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
    background: `${color}15`, color, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
    {children}
  </span>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ show, message }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: 'white',
          padding: '14px 22px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontSize: '14px', fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#10b981',
          display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Check size={15} color="white" />
        </div>
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ show, title, desc, onConfirm, onCancel }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(8px)', zIndex: 9000, display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
          style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '36px',
            maxWidth: '420px', width: '90%', boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
            border: '1px solid var(--card-border)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#fff7ed',
            display: 'grid', placeItems: 'center', marginBottom: '20px',
            border: '1px solid #fed7aa' }}>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '12px',
              border: '1.5px solid var(--card-border)', background: 'transparent',
              color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '12px',
              border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
              boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Preset palettes ──────────────────────────────────────────────────────────
const PRESETS = [
  { name: 'Indigo',  colors: ['#6366f1','#8b5cf6','#ec4899','#f1f5f9'] },
  { name: 'Ocean',   colors: ['#0ea5e9','#06b6d4','#10b981','#f0f9ff'] },
  { name: 'Sunset',  colors: ['#f97316','#ef4444','#eab308','#fff7ed'] },
  { name: 'Forest',  colors: ['#16a34a','#15803d','#84cc16','#f0fdf4'] },
  { name: 'Rose',    colors: ['#e11d48','#f43f5e','#fb7185','#fff1f2'] },
  { name: 'Slate',   colors: ['#334155','#475569','#64748b','#f8fafc'] },
];
const COLOR_ROLES = ['Primary', 'Secondary', 'Accent', 'Background'];

const ThemeColorPicker = () => {
  const { brandColors, updateBrandColors } = useTheme();
  const [palette, setPalette] = useState([brandColors.primary, brandColors.secondary, brandColors.accent, '#f8fafc']);
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (p) => {
    setActivePreset(p.name);
    setPalette([...p.colors]);
    updateBrandColors({ primary: p.colors[0], secondary: p.colors[1], accent: p.colors[2] });
  };

  const updateColor = (idx, val) => {
    const next = [...palette]; next[idx] = val; setPalette(next); setActivePreset(null);
    const map = ['primary','secondary','accent'];
    if (map[idx]) updateBrandColors({ [map[idx]]: val });
  };

  return (
    <GCard glow="#6366f1">
      <SectionHeader title="Theme Colors" desc="Build your brand palette — applied globally across all tenant dashboards." icon={<Palette />} accent="#6366f1" />

      <Label>Preset Palettes</Label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', marginTop: '6px' }}>
        {PRESETS.map(p => (
          <div key={p.name} onClick={() => applyPreset(p)} style={{ cursor: 'pointer', borderRadius: '14px',
            padding: '10px 14px', border: `2px solid ${activePreset === p.name ? '#6366f1' : 'var(--card-border)'}`,
            background: activePreset === p.name ? 'rgba(99,102,241,0.06)' : 'var(--input-bg)', transition: 'all 0.15s' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
              {p.colors.slice(0,3).map((c,i) => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '4px', background: c }} />
              ))}
            </div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: activePreset === p.name ? '#6366f1' : 'var(--text-muted)' }}>{p.name}</p>
          </div>
        ))}
      </div>

      <Label>Color Roles</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '24px', marginTop: '6px' }}>
        {COLOR_ROLES.map((role, idx) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
            borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--input-bg)' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input type="color" value={palette[idx] || '#ffffff'} onChange={e => updateColor(idx, e.target.value)}
                style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', cursor: 'pointer', padding: 0, opacity: 0, position: 'absolute', inset: 0 }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: palette[idx],
                border: '2px solid rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{role}</p>
              <input value={palette[idx] || ''} onChange={e => updateColor(idx, e.target.value)}
                style={{ width: '100%', fontSize: '13px', fontFamily: 'monospace', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
        <div style={{ padding: '8px 16px', background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={11} color="#6366f1" />
          <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>LIVE PREVIEW</p>
        </div>
        <div style={{ padding: '20px', background: palette[3] || '#f8fafc', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: palette[0], color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Primary</button>
          <button style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: palette[1], color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Secondary</button>
          <button style={{ padding: '9px 18px', borderRadius: '10px', border: `2px solid ${palette[0]}`, background: 'transparent', color: palette[0], fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Outline</button>
          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
            {palette.map((c,i) => <div key={i} title={c} style={{ width: '26px', height: '26px', borderRadius: '8px', background: c, border: '2px solid rgba(0,0,0,0.08)' }} />)}
          </div>
        </div>
      </div>
    </GCard>
  );
};

// ─── Tab content components ───────────────────────────────────────────────────

const BrandingTab = ({ onSave, saving }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <GCard>
      <SectionHeader title="Platform Identity" desc="Logos and visual assets shown across the platform." icon={<Upload />} accent="#8b5cf6" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FileUpload label="Platform Logo" hint="PNG or SVG, max 2MB" accent="#8b5cf6" />
        <FileUpload label="Favicon" hint="ICO or PNG 32×32" accent="#8b5cf6" />
      </div>
    </GCard>
    <ThemeColorPicker />
    <SaveBar onSave={onSave} saving={saving} />
  </div>
);


const SecurityTab = ({ onSave, saving }) => {
  const [twoFA, setTwoFA] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
  const [minLen, setMinLen] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#ef4444">
        <SectionHeader title="Authentication" icon={<Lock />} accent="#ef4444" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><Label>Min Password Length</Label><Input type="number" value={minLen} onChange={e => setMinLen(e.target.value)} min={6} max={32} /></div>
          <div>
            <Label>Session Timeout</Label>
            <Select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </Select>
          </div>
        </div>
        <Toggle value={specialChars} onChange={setSpecialChars} label="Strong Passwords" desc="Require special characters in passwords." />
        <Toggle value={twoFA} onChange={setTwoFA} label="2FA Protection" desc="Enable Two-Factor Authentication for all logins." />
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const BillingTab = ({ onSave, saving }) => {
  const [showRazor, setShowRazor] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#2563eb">
        <SectionHeader title="Payment Provider" desc="Configure your primary payment gateway." icon={<CreditCard />} accent="#2563eb" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>Razorpay Key ID</Label><Input defaultValue="rzp_live_xxxxxxxxxxxx" /></div>
          <div>
            <Label>Secret Key</Label>
            <div style={{ position: 'relative' }}>
              <Input type={showRazor ? 'text' : 'password'} defaultValue="secret_xxxxxxxxxxxx" style={{ paddingRight: '44px' }} />
              <div onClick={() => setShowRazor(!showRazor)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showRazor ? <EyeOff size={16}/> : <Eye size={16}/>}
              </div>
            </div>
          </div>
        </div>
      </GCard>
      <GCard glow="#10b981">
        <SectionHeader title="Tax & Invoice" desc="Settings for generated invoices." icon={<FileText />} accent="#10b981" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><Label>Currency</Label><Select defaultValue="USD"><option value="USD">USD</option><option value="EUR">EUR</option></Select></div>
          <div><Label>Tax Rate (%)</Label><Input type="number" defaultValue="10" /></div>
        </div>
        <Label>Business Address</Label>
        <Textarea defaultValue="123 Growth Lane, Tech City" style={{ minHeight: '60px' }} />
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const CommunicationsTab = ({ onSave, saving }) => {
  const [rules, setRules] = useState({ booking: true, system: true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#0ea5e9">
        <SectionHeader title="Email Server (SMTP)" desc="Settings to send outgoing emails." icon={<Mail />} accent="#0ea5e9" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>SMTP Host</Label><Input defaultValue="smtp.mailtrap.io" /></div>
          <div><Label>SMTP Port</Label><Input type="number" defaultValue="587" /></div>
        </div>
      </GCard>
      <GCard glow="#f59e0b">
        <SectionHeader title="Alert Rules" desc="Manage when to send notifications." icon={<Bell />} accent="#f59e0b" />
        <Toggle value={rules.booking} onChange={() => setRules(r=>({...r, booking:!r.booking}))} label="Customer Confirmations" desc="Send automated emails to clients." />
        <Toggle value={rules.system} onChange={() => setRules(r=>({...r, system:!r.system}))} label="System Alerts" desc="Notify me about critical updates." />
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};


// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id:'branding',      label:'Branding',         icon:<Palette size={16}/>,   accent:'#8b5cf6', desc:'Logos & visual style' },
  { id:'security',      label:'Security',          icon:<Shield size={16}/>,    accent:'#ef4444', desc:'Password & protection' },
  { id:'billing',       label:'Billing & Payments',icon:<CreditCard size={16}/>,accent:'#2563eb', desc:'Tax & payment portal' },
  { id:'comms',         label:'Communications',    icon:<Mail size={16}/>,      accent:'#0ea5e9', desc:'Emails & notifications' },
];

// ─── Main Settings Component ──────────────────────────────────────────────────
const Settings = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [toast, setToast] = useState({ show:false, message:'' });
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show:false });

  const showToast = (msg = 'Settings saved successfully') => {
    setToast({ show:true, message:msg });
    setTimeout(() => setToast({ show:false, message:'' }), 3000);
  };

  const handleSave = () => {
    if (activeTab === 'domain') {
      setConfirmModal({ show:true, title:'Apply Domain Changes?',
        desc:'Changing domain settings may temporarily disrupt tenant access. This will propagate across all active tenants.',
        onConfirm: () => { setConfirmModal({ show:false }); setSaving(true); setTimeout(() => { setSaving(false); showToast('Domain settings updated'); }, 1400); }
      });
      return;
    }
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast(); }, 1200);
  };

  const renderTab = () => {
    const props = { onSave: handleSave, saving };
    switch (activeTab) {
      case 'branding': return <BrandingTab {...props} />;
      case 'security': return <SecurityTab {...props} />;
      case 'billing':  return <BillingTab {...props} />;
      case 'comms':    return <CommunicationsTab {...props} />;
      default:         return null;
    }
  };

  const activeData = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ minHeight: '100%' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
              <Sparkles size={18} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.8px' }}>
              Account Settings
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '46px' }}>
            Manage branding, security, integrations, and platform-wide defaults
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
          borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>All systems operational</span>
        </div>
      </motion.div>

      {/* ── Layout: sidebar + content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Sidebar nav */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px',
          padding: '8px', boxShadow: 'var(--card-shadow)', position: 'sticky', top: '20px' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: isActive ? `linear-gradient(135deg,${tab.accent}18,${tab.accent}08)` : 'transparent',
                marginBottom: '2px', transition: 'all 0.15s', textAlign: 'left',
                borderLeft: isActive ? `3px solid ${tab.accent}` : '3px solid transparent',
              }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-darker)'; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                  background: isActive ? `${tab.accent}20` : 'var(--bg-darker)',
                  display: 'grid', placeItems: 'center', transition: 'all 0.15s' }}>
                  {React.cloneElement(tab.icon, { color: isActive ? tab.accent : 'var(--text-muted)' })}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: isActive ? '800' : '600',
                    color: isActive ? tab.accent : 'var(--text-secondary)', lineHeight: 1.2 }}>{tab.label}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.desc}</p>
                </div>
                {isActive && <ChevronRight size={14} color={tab.accent} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.2 }}>
          {renderTab()}
        </motion.div>
      </div>

      <Toast show={toast.show} message={toast.message} />
      <ConfirmModal show={confirmModal.show} title={confirmModal.title} desc={confirmModal.desc}
        onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ show:false })} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
};

export default Settings;
