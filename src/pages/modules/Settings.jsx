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
      <div style={{ marginTop: '16px' }}>
        <FileUpload label="Login Page Background" hint="JPG or PNG, min 1920×1080" accent="#8b5cf6" />
      </div>
    </GCard>
    <ThemeColorPicker />
    <GCard>
      <SectionHeader title="Custom Domain" desc="White-label the platform under your own domain." icon={<Globe />} accent="#06b6d4" />
      <Label>Custom Domain</Label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Input defaultValue="grandomni.yourcrm.com" placeholder="hotelname.yourcrm.com" />
        <button style={{ padding: '11px 20px', borderRadius: '11px', border: 'none',
          background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: 'white',
          fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '13px' }}>
          Verify
        </button>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
        Add a CNAME record pointing to <code style={{ background: 'var(--bg-darker)', padding: '2px 7px', borderRadius: '5px', fontFamily: 'monospace', fontSize: '12px' }}>platform.omnicrm.io</code>
      </p>
    </GCard>
    <SaveBar onSave={onSave} saving={saving} />
  </div>
);

const DomainTab = ({ onSave, saving }) => {
  const [multiTenant, setMultiTenant] = useState(true);
  const [autoSubdomain, setAutoSubdomain] = useState(true);
  const domains = [
    { hotel: 'Grand Omni Hotel', domain: 'grandomni.omnicrm.io', status: 'Active', ssl: 'Active' },
    { hotel: 'Riviera Resort',   domain: 'riviera.omnicrm.io',   status: 'Active', ssl: 'Active' },
    { hotel: 'Urban Boutique',   domain: 'urban.omnicrm.io',     status: 'Pending', ssl: 'Pending' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard>
        <SectionHeader title="Tenant Configuration" icon={<Globe />} accent="#0ea5e9" />
        <Toggle value={multiTenant} onChange={setMultiTenant} label="Enable Multi-Tenant Mode" desc="Allow multiple hotel organizations on this platform." />
        <Toggle value={autoSubdomain} onChange={setAutoSubdomain} label="Auto-Create Subdomain" desc="Automatically generate subdomain when a new hotel is onboarded." />
      </GCard>
      <GCard>
        <SectionHeader title="Domain Mapping" desc="All registered tenant domains and their SSL status." icon={<Lock />} accent="#10b981" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Hotel Name','Domain','Status','SSL','Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '10px', fontWeight: '900',
                    color: 'var(--text-muted)', letterSpacing: '0.07em', background: 'var(--bg-darker)',
                    ...(h==='Hotel Name'?{borderRadius:'10px 0 0 10px'}:h==='Action'?{borderRadius:'0 10px 10px 0'}:{}) }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map((d,i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '14px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{d.hotel}</td>
                  <td style={{ padding: '14px', fontSize: '13px', color: '#6366f1', fontFamily: 'monospace' }}>{d.domain}</td>
                  <td style={{ padding: '14px' }}><Badge color={d.status==='Active'?'#10b981':'#f59e0b'}>{d.status}</Badge></td>
                  <td style={{ padding: '14px' }}><Badge color={d.ssl==='Active'?'#10b981':'#f59e0b'}>{d.ssl}</Badge></td>
                  <td style={{ padding: '14px' }}>
                    <button style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #6366f130',
                      background: 'rgba(99,102,241,0.06)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#6366f1' }}>Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const SecurityTab = ({ onSave, saving }) => {
  const [twoFA, setTwoFA] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
  const [minLen, setMinLen] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginLimit, setLoginLimit] = useState(5);
  const [ipInput, setIpInput] = useState('');
  const [whitelist, setWhitelist] = useState(['192.168.1.1','10.0.0.0/24']);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#ef4444">
        <SectionHeader title="Password Policy" icon={<Lock />} accent="#ef4444" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><Label>Minimum Length</Label><Input type="number" value={minLen} onChange={e => setMinLen(e.target.value)} min={6} max={32} /></div>
          <div><Label>Login Attempt Limit</Label><Input type="number" value={loginLimit} onChange={e => setLoginLimit(e.target.value)} min={1} max={20} /></div>
        </div>
        <Toggle value={specialChars} onChange={setSpecialChars} label="Require Special Characters" desc="Passwords must include at least one special character." />
      </GCard>
      <GCard glow="#8b5cf6">
        <SectionHeader title="Session & 2FA" icon={<Shield />} accent="#8b5cf6" />
        <div style={{ marginBottom: '16px' }}>
          <Label>Session Timeout</Label>
          <Select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </Select>
        </div>
        <Toggle value={twoFA} onChange={setTwoFA} label="Enable Two-Factor Authentication (2FA)" desc="Require OTP via Email for all admin logins." />
      </GCard>
      <GCard>
        <SectionHeader title="IP Whitelist" desc="Only allow logins from these IP addresses." icon={<Shield />} accent="#0ea5e9" />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <Input value={ipInput} onChange={e => setIpInput(e.target.value)} placeholder="e.g. 203.0.113.0/24" />
          <button onClick={() => { if (ipInput) { setWhitelist([...whitelist, ipInput]); setIpInput(''); } }}
            style={{ padding: '11px 18px', borderRadius: '11px', border: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white',
              fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {whitelist.map((ip,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-darker)',
              borderRadius: '9px', padding: '6px 12px', fontSize: '13px', fontFamily: 'monospace',
              border: '1px solid var(--card-border)' }}>
              {ip}
              <X size={12} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setWhitelist(whitelist.filter((_,idx) => idx !== i))} />
            </div>
          ))}
        </div>
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const PaymentTab = ({ onSave, saving }) => {
  const [showRazor, setShowRazor] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[
        { title:'Razorpay', desc:'Indian payment gateway integration.', accent:'#2563eb', show:showRazor, setShow:setShowRazor, key:'rzp_live_xxxxxxxxxxxx', secret:'secret_xxxxxxxxxxxx', keyLabel:'API Key', secretLabel:'API Secret' },
        { title:'Stripe',   desc:'Global payment gateway integration.',  accent:'#6366f1', show:showStripe, setShow:setShowStripe, key:'pk_live_xxxxxxxxxxxx', secret:'sk_live_xxxxxxxxxxxx', keyLabel:'Publishable Key', secretLabel:'Secret Key' },
      ].map(gw => (
        <GCard key={gw.title} glow={gw.accent}>
          <SectionHeader title={gw.title} desc={gw.desc} icon={<CreditCard />} accent={gw.accent} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><Label>{gw.keyLabel}</Label><Input defaultValue={gw.key} /></div>
            <div>
              <Label>{gw.secretLabel}</Label>
              <div style={{ position: 'relative' }}>
                <Input type={gw.show ? 'text' : 'password'} defaultValue={gw.secret} style={{ paddingRight: '44px' }} />
                <div onClick={() => gw.setShow(!gw.show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {gw.show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </div>
              </div>
            </div>
          </div>
        </GCard>
      ))}
      <GCard>
        <SectionHeader title="Tax & Currency" icon={<FileText />} accent="#10b981" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Label>Default Currency</Label>
            <Select defaultValue="INR">
              <option value="USD">USD — US Dollar</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </Select>
          </div>
          <div><Label>GST / Tax (%)</Label><Input type="number" defaultValue="18" min={0} max={100} /></div>
        </div>
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const EmailTab = ({ onSave, saving }) => {
  const [whatsapp, setWhatsapp] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('booking');
  const templates = {
    booking: `Subject: Booking Confirmation — {{hotel_name}}\n\nDear {{guest_name}},\n\nYour booking at {{hotel_name}} is confirmed.\nCheck-in: {{checkin_date}} | Check-out: {{checkout_date}}\nRoom: {{room_type}}\n\nThank you!\n{{hotel_name}} Team`,
    invoice: `Subject: Invoice #{{invoice_no}} — {{hotel_name}}\n\nDear {{guest_name}},\n\nPlease find attached your invoice.\nAmount Due: {{amount}}\nDue Date: {{due_date}}\n\n{{hotel_name}} Billing`,
    reset: `Subject: Password Reset Request\n\nHi {{user_name}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nThis link expires in 30 minutes.`
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#0ea5e9">
        <SectionHeader title="SMTP Configuration" desc="Outgoing email server settings." icon={<Mail />} accent="#0ea5e9" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>SMTP Host</Label><Input defaultValue="smtp.sendgrid.net" /></div>
          <div><Label>SMTP Port</Label><Input type="number" defaultValue="587" /></div>
          <div><Label>From Email</Label><Input type="email" defaultValue="noreply@omnihotel.io" /></div>
          <div><Label>SMTP Password</Label><Input type="password" defaultValue="SG.xxxxxxxxxxxx" /></div>
        </div>
      </GCard>
      <GCard>
        <SectionHeader title="Email Templates" desc="Customize transactional email content." icon={<FileText />} accent="#8b5cf6" />
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {[['booking','Booking'],['invoice','Invoice'],['reset','Reset Password']].map(([key,label]) => (
            <button key={key} onClick={() => setActiveTemplate(key)} style={{ padding: '7px 16px', borderRadius: '9px', border: 'none',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: activeTemplate===key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-darker)',
              color: activeTemplate===key ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTemplate===key ? '0 3px 10px rgba(99,102,241,0.3)' : 'none' }}>{label}</button>
          ))}
        </div>
        <Textarea value={templates[activeTemplate]} readOnly style={{ minHeight: '160px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Use <code style={{ background: 'var(--bg-darker)', padding: '2px 6px', borderRadius: '5px' }}>{'{{variable}}'}</code> for dynamic values.
        </p>
      </GCard>
      <GCard>
        <SectionHeader title="SMS & WhatsApp" icon={<Bell />} accent="#10b981" />
        <div style={{ marginBottom: '16px' }}><Label>SMS API Key</Label><Input defaultValue="sms_api_xxxxxxxxxxxx" /></div>
        <Toggle value={whatsapp} onChange={setWhatsapp} label="Enable WhatsApp Notifications" desc="Send booking and payment alerts via WhatsApp Business API." />
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const NotificationsTab = ({ onSave, saving }) => {
  const [rules, setRules] = useState({ bookingConfirm:true, paymentFail:true, taskReminder:false, systemAlert:true });
  const toggle = key => setRules(r => ({ ...r, [key]: !r[key] }));
  const items = [
    { key:'bookingConfirm', label:'Booking Confirmation', desc:'Notify guest and staff when a booking is confirmed.' },
    { key:'paymentFail',    label:'Payment Failure Alert', desc:'Alert admin immediately on failed payment transactions.' },
    { key:'taskReminder',   label:'Task Reminders',        desc:'Send reminders for overdue or upcoming tasks.' },
    { key:'systemAlert',    label:'System Alerts',         desc:'Critical infrastructure and uptime notifications.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#f59e0b">
        <SectionHeader title="Notification Rules" desc="Control which events trigger alerts to admins and staff." icon={<Bell />} accent="#f59e0b" />
        {items.map(item => <Toggle key={item.key} value={rules[item.key]} onChange={() => toggle(item.key)} label={item.label} desc={item.desc} />)}
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const InvoiceTab = ({ onSave, saving }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <GCard glow="#10b981">
      <SectionHeader title="Invoice Configuration" icon={<FileText />} accent="#10b981" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div><Label>Invoice Prefix</Label><Input defaultValue="INV-" /></div>
        <div><Label>GST Number</Label><Input defaultValue="27AABCU9603R1ZX" /></div>
      </div>
      <div style={{ marginBottom: '20px' }}><Label>Company Address</Label>
        <Textarea defaultValue={"The Grand Omni Hotel\n123 Riviera Boulevard\nMumbai, Maharashtra 400001\nIndia"} />
      </div>
      <Label>Invoice Template</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '6px' }}>
        {['Classic','Modern','Minimal'].map((t,i) => (
          <div key={t} style={{ border: `2px solid ${i===1?'#6366f1':'var(--card-border)'}`, borderRadius: '14px',
            padding: '20px', textAlign: 'center', cursor: 'pointer',
            background: i===1 ? 'rgba(99,102,241,0.06)' : 'var(--input-bg)', transition: 'all 0.15s' }}>
            <div style={{ height: '56px', background: i===1?'rgba(99,102,241,0.1)':'var(--bg-darker)', borderRadius: '8px', marginBottom: '10px' }} />
            <p style={{ fontSize: '13px', fontWeight: '700', color: i===1?'#6366f1':'var(--text-secondary)' }}>{t}</p>
            {i===1 && <p style={{ fontSize: '10px', color: '#6366f1', marginTop: '3px', fontWeight: '800' }}>✓ Selected</p>}
          </div>
        ))}
      </div>
    </GCard>
    <SaveBar onSave={onSave} saving={saving} />
  </div>
);

const HotelDefaultsTab = ({ onSave, saving }) => {
  const [autoAssign, setAutoAssign] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#f97316">
        <SectionHeader title="Check-in / Check-out" icon={<Building2 />} accent="#f97316" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>Default Check-in Time</Label><Input type="time" defaultValue="14:00" /></div>
          <div><Label>Default Check-out Time</Label><Input type="time" defaultValue="11:00" /></div>
        </div>
      </GCard>
      <GCard>
        <SectionHeader title="Policies & Pricing" icon={<FileText />} accent="#8b5cf6" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <Label>Cancellation Policy</Label>
            <Select defaultValue="48h">
              <option value="free">Free Cancellation</option>
              <option value="24h">24 Hours Notice</option>
              <option value="48h">48 Hours Notice</option>
              <option value="nonrefund">Non-Refundable</option>
            </Select>
          </div>
          <div>
            <Label>Room Pricing Rule</Label>
            <Select defaultValue="dynamic">
              <option value="fixed">Fixed Rate</option>
              <option value="dynamic">Dynamic Pricing</option>
              <option value="seasonal">Seasonal Pricing</option>
            </Select>
          </div>
        </div>
        <Toggle value={autoAssign} onChange={setAutoAssign} label="Auto-Assign Room on Booking" desc="Automatically assign the best available room upon confirmation." />
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

const AnalyticsTab = ({ onSave, saving }) => {
  const [tracking, setTracking] = useState(true);
  const [formats, setFormats] = useState({ excel:true, pdf:true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GCard glow="#6366f1">
        <SectionHeader title="Analytics Configuration" icon={<BarChart2 />} accent="#6366f1" />
        <Toggle value={tracking} onChange={setTracking} label="Enable Platform Tracking" desc="Collect usage analytics across all tenant dashboards." />
        <div style={{ marginTop: '20px' }}>
          <Label>Data Retention Period</Label>
          <Select defaultValue="90">
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="180">180 Days</option>
          </Select>
        </div>
      </GCard>
      <GCard>
        <SectionHeader title="Export Options" desc="Choose available export formats for reports." icon={<FileText />} accent="#10b981" />
        <div style={{ display: 'flex', gap: '12px' }}>
          {[['excel','Excel (.xlsx)'],['pdf','PDF']].map(([key,label]) => (
            <div key={key} onClick={() => setFormats(f => ({ ...f, [key]: !f[key] }))}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px',
                borderRadius: '14px', border: `2px solid ${formats[key]?'#6366f1':'var(--card-border)'}`,
                background: formats[key]?'rgba(99,102,241,0.06)':'var(--input-bg)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px',
                background: formats[key]?'linear-gradient(135deg,#6366f1,#8b5cf6)':'var(--card-border)',
                display: 'grid', placeItems: 'center' }}>
                {formats[key] && <Check size={12} color="white" />}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: formats[key]?'#6366f1':'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </GCard>
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id:'branding',      label:'Branding',         icon:<Palette size={16}/>,   accent:'#8b5cf6', desc:'Logos, colors & domain' },
  { id:'domain',        label:'Domain & Tenants',  icon:<Globe size={16}/>,     accent:'#0ea5e9', desc:'Multi-tenant config' },
  { id:'security',      label:'Security',          icon:<Shield size={16}/>,    accent:'#ef4444', desc:'2FA, passwords, IP' },
  { id:'payment',       label:'Payment Gateway',   icon:<CreditCard size={16}/>,accent:'#6366f1', desc:'Razorpay & Stripe' },
  { id:'email',         label:'Email & SMS',       icon:<Mail size={16}/>,      accent:'#0ea5e9', desc:'SMTP & templates' },
  { id:'notifications', label:'Notifications',     icon:<Bell size={16}/>,      accent:'#f59e0b', desc:'Alert rules' },
  { id:'invoice',       label:'Invoice & Billing', icon:<FileText size={16}/>,  accent:'#10b981', desc:'Templates & tax' },
  { id:'hotel',         label:'Hotel Defaults',    icon:<Building2 size={16}/>, accent:'#f97316', desc:'Check-in & policies' },
  { id:'analytics',     label:'Analytics',         icon:<BarChart2 size={16}/>, accent:'#6366f1', desc:'Tracking & exports' },
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
      case 'branding':      return <BrandingTab {...props} />;
      case 'domain':        return <DomainTab {...props} />;
      case 'security':      return <SecurityTab {...props} />;
      case 'payment':       return <PaymentTab {...props} />;
      case 'email':         return <EmailTab {...props} />;
      case 'notifications': return <NotificationsTab {...props} />;
      case 'invoice':       return <InvoiceTab {...props} />;
      case 'hotel':         return <HotelDefaultsTab {...props} />;
      case 'analytics':     return <AnalyticsTab {...props} />;
      default:              return null;
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
              Global Platform Settings
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
