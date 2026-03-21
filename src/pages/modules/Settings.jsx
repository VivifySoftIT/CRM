import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Globe, Shield, CreditCard, Mail, Bell,
  FileText, Building2, BarChart2, Upload, Check,
  AlertTriangle, X, ChevronDown, ToggleLeft, ToggleRight,
  Plus, Trash2, Eye, EyeOff, Save, RefreshCw
} from 'lucide-react';

// ─── Reusable primitives ────────────────────────────────────────────────────

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)', padding: '28px', ...style
  }}>{children}</div>
);

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
    {children}
  </label>
);

const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid var(--input-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', boxSizing: 'border-box',
    transition: 'border 0.2s', ...style
  }}
    onFocus={e => e.target.style.borderColor = '#6366f1'}
    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
  />
);

const Select = ({ children, style = {}, ...props }) => (
  <select {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid var(--input-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', cursor: 'pointer', ...style
  }}>{children}</select>
);

const Textarea = ({ style = {}, ...props }) => (
  <textarea {...props} style={{
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid var(--input-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--input-bg)', resize: 'vertical',
    minHeight: '90px', boxSizing: 'border-box', ...style
  }}
    onFocus={e => e.target.style.borderColor = '#6366f1'}
    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
  />
);

const Toggle = ({ value, onChange, label, desc }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--card-border)' }}>
    <div>
      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</p>
      {desc && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</p>}
    </div>
    <div onClick={() => onChange(!value)} style={{ cursor: 'pointer', flexShrink: 0 }}>
      {value
        ? <ToggleRight size={36} color="#6366f1" />
        : <ToggleLeft size={36} color="#cbd5e1" />}
    </div>
  </div>
);

const SectionHeader = ({ title, desc }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h3>
    {desc && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</p>}
  </div>
);

const SaveBar = ({ onSave, onCancel, saving }) => (
  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
    <button onClick={onCancel} style={{
      padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--input-border)',
      background: 'var(--card-bg)', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', cursor: 'pointer'
    }}>Cancel</button>
    <button onClick={onSave} style={{
      padding: '10px 24px', borderRadius: '10px', border: 'none',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
    }}>
      {saving ? <><RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : <><Save size={15} /> Save Changes</>}
    </button>
  </div>
);

const FileUpload = ({ label, hint }) => (
  <div>
    <Label>{label}</Label>
    <label style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '28px', cursor: 'pointer',
      background: 'var(--input-bg)', transition: 'all 0.2s', gap: '8px'
    }}
      onMouseOver={e => e.currentTarget.style.borderColor = '#6366f1'}
      onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
    >
      <Upload size={22} color="#94a3b8" />
      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Click to upload</span>
      {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hint}</span>}
      <input type="file" style={{ display: 'none' }} />
    </label>
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{
    fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
    background: `${color}15`, color: color
  }}>{children}</span>
);

// ─── Toast ───────────────────────────────────────────────────────────────────

const Toast = ({ show, message }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          background: '#0f172a', color: 'white', padding: '14px 22px',
          borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontSize: '14px', fontWeight: '600'
        }}
      >
        <Check size={18} color="#4ade80" /> {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ show, title, desc, onConfirm, onCancel }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 9000, display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '36px', maxWidth: '420px', width: '90%', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Tab Sections ─────────────────────────────────────────────────────────────

// ─── Preset palettes ─────────────────────────────────────────────────────────
const PRESETS = [
  { name: 'Indigo',   colors: ['#6366f1','#8b5cf6','#ec4899','#f1f5f9'] },
  { name: 'Ocean',    colors: ['#0ea5e9','#06b6d4','#10b981','#f0f9ff'] },
  { name: 'Sunset',   colors: ['#f97316','#ef4444','#eab308','#fff7ed'] },
  { name: 'Forest',   colors: ['#16a34a','#15803d','#84cc16','#f0fdf4'] },
  { name: 'Rose',     colors: ['#e11d48','#f43f5e','#fb7185','#fff1f2'] },
  { name: 'Slate',    colors: ['#334155','#475569','#64748b','#f8fafc'] },
];

const COLOR_ROLES = ['Primary', 'Secondary', 'Accent', 'Background'];

const ThemeColorPicker = () => {
  const [palette, setPalette] = useState(['#6366f1','#ec4899','#8b5cf6','#f8fafc']);
  const [activePreset, setActivePreset] = useState('Indigo');
  const [customColors, setCustomColors] = useState([]);
  const [newColor, setNewColor] = useState('#10b981');

  const applyPreset = (preset) => {
    setActivePreset(preset.name);
    setPalette([...preset.colors]);
  };

  const updateColor = (idx, val) => {
    const next = [...palette];
    next[idx] = val;
    setPalette(next);
    setActivePreset(null);
  };

  const addCustomColor = () => {
    if (!customColors.includes(newColor)) setCustomColors([...customColors, newColor]);
  };

  const removeCustom = (c) => setCustomColors(customColors.filter(x => x !== c));

  return (
    <Card>
      <SectionHeader title="Theme Colors" desc="Build your brand palette — applied globally across all tenant dashboards." />

      {/* Preset Palettes */}
      <div style={{ marginBottom: '24px' }}>
        <Label>Preset Palettes</Label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
          {PRESETS.map(p => (
            <div key={p.name} onClick={() => applyPreset(p)}
              style={{
                cursor: 'pointer', borderRadius: '12px', padding: '10px 14px',
                border: `2px solid ${activePreset === p.name ? '#6366f1' : '#e2e8f0'}`,
                background: activePreset === p.name ? '#f5f3ff' : 'white',
                transition: 'all 0.15s'
              }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                {p.colors.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ width: '16px', height: '16px', borderRadius: '4px', background: c, border: '1px solid rgba(0,0,0,0.06)' }} />
                ))}
              </div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: activePreset === p.name ? '#6366f1' : '#64748b' }}>{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role-based color slots */}
      <div style={{ marginBottom: '24px' }}>
        <Label>Color Roles</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '4px' }}>
          {COLOR_ROLES.map((role, idx) => (
            <div key={role} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)'
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input type="color" value={palette[idx] || '#ffffff'}
                  onChange={e => updateColor(idx, e.target.value)}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', cursor: 'pointer', padding: 0, background: 'none' }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '10px',
                  background: palette[idx], pointerEvents: 'none',
                  border: '2px solid rgba(0,0,0,0.08)'
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{role}</p>
                <input value={palette[idx] || ''} onChange={e => updateColor(idx, e.target.value)}
                  style={{ width: '100%', fontSize: '13px', fontFamily: 'monospace', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom extra colors */}
      <div style={{ marginBottom: '20px' }}>
        <Label>Extra Brand Colors</Label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
              style={{ width: '44px', height: '44px', borderRadius: '10px', border: 'none', cursor: 'pointer', padding: 0 }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: newColor, pointerEvents: 'none', border: '2px solid rgba(0,0,0,0.08)' }} />
          </div>
          <Input value={newColor} onChange={e => setNewColor(e.target.value)} style={{ fontFamily: 'monospace', maxWidth: '140px' }} />
          <button onClick={addCustomColor} style={{
            padding: '11px 18px', borderRadius: '10px', border: 'none',
            background: '#0f172a', color: 'white', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', whiteSpace: 'nowrap'
          }}>
            <Plus size={14} /> Add Color
          </button>
        </div>
        {customColors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {customColors.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px 6px 8px', borderRadius: '10px',
                border: '1px solid var(--input-border)', background: 'var(--input-bg)'
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: c, border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: '600', color: '#334155' }}>{c}</span>
                <X size={13} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => removeCustom(c)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live preview bar */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--input-border)' }}>
        <div style={{ padding: '10px 16px', background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>LIVE PREVIEW</p>
        </div>
        <div style={{ padding: '20px', background: palette[3] || '#f8fafc', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: palette[0], color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Primary Button</button>
          <button style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: palette[1], color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Secondary</button>
          <button style={{ padding: '10px 20px', borderRadius: '10px', border: `2px solid ${palette[0]}`, background: 'transparent', color: palette[0], fontWeight: '700', fontSize: '13px', cursor: 'default' }}>Outline</button>
          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
            {[...palette, ...customColors].map((c, i) => (
              <div key={i} title={c} style={{ width: '28px', height: '28px', borderRadius: '8px', background: c, border: '2px solid rgba(0,0,0,0.08)' }} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const BrandingTab = ({ onSave }) => {
  const [domain, setDomain] = useState('grandomni.yourcrm.com');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Platform Identity" desc="Logos and visual assets shown across the platform." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <FileUpload label="Platform Logo" hint="PNG or SVG, max 2MB" />
          <FileUpload label="Favicon" hint="ICO or PNG 32×32" />
        </div>
        <div style={{ marginTop: '20px' }}>
          <FileUpload label="Login Page Background" hint="JPG or PNG, min 1920×1080" />
        </div>
      </Card>

      <ThemeColorPicker />

      <Card>
        <SectionHeader title="Custom Domain" desc="White-label the platform under your own domain." />
        <Label>Custom Domain</Label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="hotelname.yourcrm.com" />
          <button style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', background: '#0f172a', color: 'white', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '13px' }}>
            Verify Domain
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Add a CNAME record pointing to <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>platform.omnicrm.io</code></p>
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const DomainTab = ({ onSave }) => {
  const [multiTenant, setMultiTenant] = useState(true);
  const [autoSubdomain, setAutoSubdomain] = useState(true);
  const domains = [
    { hotel: 'Grand Omni Hotel', domain: 'grandomni.omnicrm.io', status: 'Active', ssl: 'Active' },
    { hotel: 'Riviera Resort', domain: 'riviera.omnicrm.io', status: 'Active', ssl: 'Active' },
    { hotel: 'Urban Boutique', domain: 'urban.omnicrm.io', status: 'Pending', ssl: 'Pending' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Tenant Configuration" />
        <Toggle value={multiTenant} onChange={setMultiTenant} label="Enable Multi-Tenant Mode" desc="Allow multiple hotel organizations on this platform." />
        <Toggle value={autoSubdomain} onChange={setAutoSubdomain} label="Auto-Create Subdomain" desc="Automatically generate subdomain when a new hotel is onboarded." />
      </Card>

      <Card>
        <SectionHeader title="Domain Mapping" desc="All registered tenant domains and their SSL status." />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-darker)' }}>
                {['Hotel Name', 'Domain', 'Status', 'SSL', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600' }}>{d.hotel}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6366f1', fontFamily: 'monospace' }}>{d.domain}</td>
                  <td style={{ padding: '14px 16px' }}><Badge color={d.status === 'Active' ? '#10b981' : '#f59e0b'}>{d.status}</Badge></td>
                  <td style={{ padding: '14px 16px' }}><Badge color={d.ssl === 'Active' ? '#10b981' : '#f59e0b'}>{d.ssl}</Badge></td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--card-bg)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#6366f1' }}>
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const SecurityTab = ({ onSave }) => {
  const [twoFA, setTwoFA] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
  const [minLen, setMinLen] = useState(8);
  const [timeout, setTimeout_] = useState('30');
  const [loginLimit, setLoginLimit] = useState(5);
  const [ipInput, setIpInput] = useState('');
  const [whitelist, setWhitelist] = useState(['192.168.1.1', '10.0.0.0/24']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Password Policy" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
          <div>
            <Label>Minimum Password Length</Label>
            <Input type="number" value={minLen} onChange={e => setMinLen(e.target.value)} min={6} max={32} />
          </div>
          <div>
            <Label>Login Attempt Limit</Label>
            <Input type="number" value={loginLimit} onChange={e => setLoginLimit(e.target.value)} min={1} max={20} />
          </div>
        </div>
        <Toggle value={specialChars} onChange={setSpecialChars} label="Require Special Characters" desc="Passwords must include at least one special character." />
      </Card>

      <Card>
        <SectionHeader title="Session & Authentication" />
        <div style={{ marginBottom: '16px' }}>
          <Label>Session Timeout</Label>
          <Select value={timeout} onChange={e => setTimeout_(e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </Select>
        </div>
        <Toggle value={twoFA} onChange={setTwoFA} label="Enable Two-Factor Authentication (2FA)" desc="Require OTP via Email for all admin logins." />
      </Card>

      <Card>
        <SectionHeader title="IP Whitelist" desc="Only allow logins from these IP addresses." />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <Input value={ipInput} onChange={e => setIpInput(e.target.value)} placeholder="e.g. 203.0.113.0/24" />
          <button onClick={() => { if (ipInput) { setWhitelist([...whitelist, ipInput]); setIpInput(''); } }}
            style={{ padding: '11px 18px', borderRadius: '10px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {whitelist.map((ip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: 'monospace' }}>
              {ip}
              <X size={13} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setWhitelist(whitelist.filter((_, idx) => idx !== i))} />
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const PaymentTab = ({ onSave }) => {
  const [showRazorSecret, setShowRazorSecret] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Razorpay" desc="Indian payment gateway integration." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>API Key</Label><Input defaultValue="rzp_live_xxxxxxxxxxxx" /></div>
          <div>
            <Label>API Secret</Label>
            <div style={{ position: 'relative' }}>
              <Input type={showRazorSecret ? 'text' : 'password'} defaultValue="secret_xxxxxxxxxxxx" style={{ paddingRight: '44px' }} />
              <div onClick={() => setShowRazorSecret(!showRazorSecret)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showRazorSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Stripe" desc="Global payment gateway integration." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>Publishable Key</Label><Input defaultValue="pk_live_xxxxxxxxxxxx" /></div>
          <div>
            <Label>Secret Key</Label>
            <div style={{ position: 'relative' }}>
              <Input type={showStripeSecret ? 'text' : 'password'} defaultValue="sk_live_xxxxxxxxxxxx" style={{ paddingRight: '44px' }} />
              <div onClick={() => setShowStripeSecret(!showStripeSecret)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showStripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Tax & Currency" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Label>Default Currency</Label>
            <Select defaultValue="USD">
              <option value="USD">USD — US Dollar</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="AED">AED — UAE Dirham</option>
            </Select>
          </div>
          <div><Label>GST / Tax Percentage (%)</Label><Input type="number" defaultValue="18" min={0} max={100} /></div>
        </div>
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const EmailTab = ({ onSave }) => {
  const [whatsapp, setWhatsapp] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('booking');
  const templates = {
    booking: `Subject: Booking Confirmation — {{hotel_name}}\n\nDear {{guest_name}},\n\nYour booking at {{hotel_name}} is confirmed.\nCheck-in: {{checkin_date}} | Check-out: {{checkout_date}}\nRoom: {{room_type}}\n\nThank you for choosing us!\n\nWarm regards,\n{{hotel_name}} Team`,
    invoice: `Subject: Invoice #{{invoice_no}} — {{hotel_name}}\n\nDear {{guest_name}},\n\nPlease find attached your invoice for your recent stay.\nAmount Due: {{amount}}\nDue Date: {{due_date}}\n\nThank you,\n{{hotel_name}} Billing`,
    reset: `Subject: Password Reset Request\n\nHi {{user_name}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nThis link expires in 30 minutes.\n\nIf you didn't request this, ignore this email.`
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="SMTP Configuration" desc="Outgoing email server settings." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><Label>SMTP Host</Label><Input defaultValue="smtp.sendgrid.net" /></div>
          <div><Label>SMTP Port</Label><Input type="number" defaultValue="587" /></div>
          <div><Label>From Email</Label><Input type="email" defaultValue="noreply@omnihotel.io" /></div>
          <div><Label>SMTP Password</Label><Input type="password" defaultValue="SG.xxxxxxxxxxxx" /></div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Email Templates" desc="Customize transactional email content." />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[['booking', 'Booking'], ['invoice', 'Invoice'], ['reset', 'Reset Password']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTemplate(key)} style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              background: activeTemplate === key ? '#6366f1' : '#f1f5f9',
              color: activeTemplate === key ? 'white' : '#64748b'
            }}>{label}</button>
          ))}
        </div>
        <Textarea value={templates[activeTemplate]} readOnly style={{ minHeight: '180px', fontFamily: 'monospace', fontSize: '13px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Use <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>{'{{variable}}'}</code> for dynamic values.</p>
      </Card>

      <Card>
        <SectionHeader title="SMS & WhatsApp" />
        <div style={{ marginBottom: '16px' }}><Label>SMS API Key</Label><Input defaultValue="sms_api_xxxxxxxxxxxx" /></div>
        <Toggle value={whatsapp} onChange={setWhatsapp} label="Enable WhatsApp Notifications" desc="Send booking and payment alerts via WhatsApp Business API." />
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const NotificationsTab = ({ onSave }) => {
  const [rules, setRules] = useState({
    bookingConfirm: true, paymentFail: true, taskReminder: false, systemAlert: true
  });
  const toggle = key => setRules(r => ({ ...r, [key]: !r[key] }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Notification Rules" desc="Control which events trigger alerts to admins and staff." />
        <Toggle value={rules.bookingConfirm} onChange={() => toggle('bookingConfirm')} label="Booking Confirmation" desc="Notify guest and staff when a booking is confirmed." />
        <Toggle value={rules.paymentFail} onChange={() => toggle('paymentFail')} label="Payment Failure Alert" desc="Alert admin immediately on failed payment transactions." />
        <Toggle value={rules.taskReminder} onChange={() => toggle('taskReminder')} label="Task Reminders" desc="Send reminders for overdue or upcoming tasks." />
        <Toggle value={rules.systemAlert} onChange={() => toggle('systemAlert')} label="System Alerts" desc="Critical infrastructure and uptime notifications." />
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const InvoiceTab = ({ onSave }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Card>
      <SectionHeader title="Invoice Configuration" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div><Label>Invoice Prefix</Label><Input defaultValue="INV-" /></div>
        <div><Label>GST Number</Label><Input defaultValue="27AABCU9603R1ZX" /></div>
      </div>
      <div style={{ marginBottom: '16px' }}><Label>Company Address</Label><Textarea defaultValue={"The Grand Omni Hotel\n123 Riviera Boulevard\nMumbai, Maharashtra 400001\nIndia"} /></div>
      <div>
        <Label>Invoice Template</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '4px' }}>
          {['Classic', 'Modern', 'Minimal'].map((t, i) => (
            <div key={t} style={{
              border: `2px solid ${i === 1 ? '#6366f1' : '#e2e8f0'}`, borderRadius: '12px',
              padding: '20px', textAlign: 'center', cursor: 'pointer',
              background: i === 1 ? '#f5f3ff' : 'white'
            }}>
              <div style={{ height: '60px', background: i === 1 ? '#ede9fe' : '#f8fafc', borderRadius: '8px', marginBottom: '10px' }} />
              <p style={{ fontSize: '13px', fontWeight: '700', color: i === 1 ? '#6366f1' : '#64748b' }}>{t}</p>
              {i === 1 && <p style={{ fontSize: '11px', color: '#6366f1', marginTop: '4px' }}>Selected</p>}
            </div>
          ))}
        </div>
      </div>
    </Card>
    <SaveBar onSave={onSave} onCancel={() => {}} />
  </div>
);

const HotelDefaultsTab = ({ onSave }) => {
  const [autoAssign, setAutoAssign] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Check-in / Check-out" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><Label>Default Check-in Time</Label><Input type="time" defaultValue="14:00" /></div>
          <div><Label>Default Check-out Time</Label><Input type="time" defaultValue="11:00" /></div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Policies & Pricing" />
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
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

const AnalyticsTab = ({ onSave }) => {
  const [tracking, setTracking] = useState(true);
  const [exportFormats, setExportFormats] = useState({ excel: true, pdf: true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <SectionHeader title="Analytics Configuration" />
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
      </Card>
      <Card>
        <SectionHeader title="Export Options" desc="Choose available export formats for reports." />
        <div style={{ display: 'flex', gap: '12px' }}>
          {[['excel', 'Excel (.xlsx)'], ['pdf', 'PDF']].map(([key, label]) => (
            <div key={key} onClick={() => setExportFormats(f => ({ ...f, [key]: !f[key] }))}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px',
                borderRadius: '12px', border: `2px solid ${exportFormats[key] ? '#6366f1' : '#e2e8f0'}`,
                background: exportFormats[key] ? '#f5f3ff' : 'white', cursor: 'pointer'
              }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: exportFormats[key] ? '#6366f1' : '#e2e8f0', display: 'grid', placeItems: 'center' }}>
                {exportFormats[key] && <Check size={12} color="white" />}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: exportFormats[key] ? '#6366f1' : '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={onSave} onCancel={() => {}} />
    </div>
  );
};

// ─── Main Settings Component ──────────────────────────────────────────────────

const TABS = [
  { id: 'branding',      label: 'Branding',         icon: <Palette size={16} /> },
  { id: 'domain',        label: 'Domain & Tenants',  icon: <Globe size={16} /> },
  { id: 'security',      label: 'Security',          icon: <Shield size={16} /> },
  { id: 'payment',       label: 'Payment Gateway',   icon: <CreditCard size={16} /> },
  { id: 'email',         label: 'Email & SMS',       icon: <Mail size={16} /> },
  { id: 'notifications', label: 'Notifications',     icon: <Bell size={16} /> },
  { id: 'invoice',       label: 'Invoice & Billing', icon: <FileText size={16} /> },
  { id: 'hotel',         label: 'Hotel Defaults',    icon: <Building2 size={16} /> },
  { id: 'analytics',     label: 'Analytics',         icon: <BarChart2 size={16} /> },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false });

  const showToast = (message = 'Settings saved successfully') => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSave = () => {
    // Domain tab triggers confirmation modal
    if (activeTab === 'domain') {
      setConfirmModal({
        show: true,
        title: 'Apply Domain Changes?',
        desc: 'Changing domain settings may temporarily disrupt tenant access. This action will propagate across all active tenants.',
        onConfirm: () => { setConfirmModal({ show: false }); setSaving(true); setTimeout(() => { setSaving(false); showToast('Domain settings updated'); }, 1400); }
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

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
          Global Platform Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Manage branding, security, integrations, and platform-wide defaults.
        </p>
      </div>

      {/* Horizontal Tab Nav */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '6px', marginBottom: '24px',
        display: 'flex', gap: '2px', overflowX: 'auto', flexWrap: 'nowrap',
        scrollbarWidth: 'none'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? '#f5f3ff' : 'transparent',
              color: activeTab === tab.id ? '#6366f1' : '#64748b',
              fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '500',
              whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0
            }}
            onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ opacity: activeTab === tab.id ? 1 : 0.5, display: 'flex' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTab()}
      </motion.div>

      <Toast show={toast.show} message={toast.message} />
      <ConfirmModal
        show={confirmModal.show}
        title={confirmModal.title}
        desc={confirmModal.desc}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false })}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Settings;


