import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Shield, CreditCard, Users, Layers, Bell,
  BarChart3, Palette, Link2, Save, RefreshCw, Info,
  Check, AlertTriangle, X, Upload, Eye, EyeOff, Copy,
  Key, Globe, Lock, Zap, Database, Mail, Star,
  Building2, Sliders, Webhook, ChevronRight
} from 'lucide-react';

// ─── Animated Toggle ──────────────────────────────────────────────────────────
function Toggle({ value, onChange, color = '#6366f1', size = 'md' }) {
  const W = size === 'sm' ? 36 : 44, H = size === 'sm' ? 20 : 24, D = size === 'sm' ? 16 : 20;
  return (
    <motion.div onClick={() => onChange(!value)} animate={{ background: value ? color : 'var(--card-border)' }}
      transition={{ duration: 0.2 }}
      style={{ width: W, height: H, borderRadius: 99, position: 'relative', cursor: 'pointer', flexShrink: 0, boxShadow: value ? `0 2px 10px ${color}55` : 'none', border: value ? 'none' : '1px solid var(--card-border)' }}>
      <motion.div animate={{ x: value ? W - D - 2 : (value === false && size === 'sm' ? 2 : 2) }} transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        style={{ position: 'absolute', top: 2, width: D, height: D, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
    </motion.div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--card-bg)', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 10, whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxWidth: 260, textAlign: 'center', lineHeight: 1.5, border: '1px solid var(--card-border)' }}>
            {text}
            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: 'var(--text-primary)', clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HelpDot({ tip }) {
  return (
    <Tip text={tip}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-darker)', border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', cursor: 'help', flexShrink: 0 }}>
        <Info size={9} color="var(--text-muted)" />
      </div>
    </Tip>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Inp({ value, onChange, placeholder, type = 'text', disabled = false, mono = false, readOnly = false, rightEl }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        disabled={disabled} readOnly={readOnly}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', padding: `10px ${rightEl ? '44px' : '14px'} 10px 14px`, borderRadius: 10, border: `1.5px solid ${f ? '#6366f1' : 'var(--card-border)'}`, background: disabled || readOnly ? 'var(--bg-darker)' : 'var(--card-bg)', color: 'var(--text-primary)', fontSize: mono ? 12 : 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: f ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none', opacity: disabled ? 0.55 : 1, cursor: disabled ? 'not-allowed' : 'text', fontFamily: mono ? 'monospace' : 'inherit' }} />
      {rightEl && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
function Sel({ value, onChange, options }) {
  const [f, setF] = useState(false);
  return (
    <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${f ? '#6366f1' : 'var(--card-border)'}`, background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer', boxShadow: f ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}

// ─── Range Slider ─────────────────────────────────────────────────────────────
function Range({ value, onChange, min = 0, max = 100, step = 1, unit = '', color = '#6366f1' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{min}{unit}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color, background: color + '15', padding: '4px 14px', borderRadius: 99, border: `1px solid ${color}25`, backdropFilter: 'blur(4px)' }}>{value}{unit}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{max}{unit}</span>
      </div>
      <div style={{ position: 'relative', height: 8, background: 'var(--bg-darker)', borderRadius: 99, border: '1px solid var(--card-border)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 99, transition: 'width 0.1s ease-out' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
          style={{ 
            position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%', margin: 0,
            WebkitAppearance: 'none'
          }} />
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, tip, desc, children, row = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', justifyContent: row ? 'space-between' : undefined, alignItems: row ? 'center' : 'flex-start', gap: row ? 20 : 6 }}>
      <div style={{ flex: row ? 1 : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
          {tip && <HelpDot tip={tip} />}
        </div>
        {desc && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div style={{ width: row ? 'auto' : '100%' }}>{children}</div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--card-shadow)', ...style }}>
      {children}
    </div>
  );
}

// ─── Card Header ─────────────────────────────────────────────────────────────
function CardHead({ icon: Icon, color, title, sub, badge, right }) {
  return (
    <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg,${color}0a,${color}04)` }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${color},${color}bb)`, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: `0 4px 14px ${color}40` }}>
        <Icon size={18} color="white" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</h3>
          {badge && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: color + '18', color, border: `1px solid ${color}25` }}>{badge}</span>}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</p>
      </div>
      {right}
    </div>
  );
}

// ─── Card Body ────────────────────────────────────────────────────────────────
function CardBody({ children, gap = 18 }) {
  return <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Hr() { return <div style={{ height: 1, background: 'var(--card-border)' }} />; }

// ─── Banner ───────────────────────────────────────────────────────────────────
function Banner({ color, icon: Icon, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '11px 14px', borderRadius: 10, background: color + '0d', border: `1px solid ${color}28` }}>
      {Icon && <Icon size={14} color={color} style={{ flexShrink: 0, marginTop: 1 }} />}
      <p style={{ fontSize: 12, color, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toasts({ list }) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      <AnimatePresence>
        {list.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 13, fontWeight: 700, fontSize: 13, color: 'white', pointerEvents: 'all', minWidth: 280, boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              background: t.type === 'success' ? 'linear-gradient(135deg,#10b981,#059669)' : t.type === 'error' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              {t.type === 'success' ? <Check size={12} /> : t.type === 'error' ? <X size={12} /> : <Info size={12} />}
            </div>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [list, setList] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setList(t => [...t, { id, msg, type }]);
    setTimeout(() => setList(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { list, add };
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function Confirm({ title, message, label = 'Confirm', danger = false, onOk, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.65)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'grid', placeItems: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: 'var(--card-bg)', borderRadius: 22, padding: '36px 32px', maxWidth: 440, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
          {danger ? <AlertTriangle size={24} color="#ef4444" /> : <Save size={24} color="#6366f1" />}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 11, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onOk} style={{ flex: 1, padding: 11, borderRadius: 12, border: 'none', background: danger ? '#ef4444' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: danger ? '0 4px 14px rgba(239,68,68,0.3)' : '0 4px 14px rgba(99,102,241,0.3)' }}>
            {label}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id:'general',       icon:Settings,  label:'General',       color:'#6366f1' },
  { id:'security',      icon:Shield,    label:'Security',      color:'#ef4444' },
  { id:'subscription',  icon:CreditCard,label:'Subscription',  color:'#10b981' },
  { id:'users',         icon:Users,     label:'Users & Roles', color:'#3b82f6' },
  { id:'modules',       icon:Layers,    label:'Modules',       color:'#8b5cf6' },
  { id:'notifications', icon:Bell,      label:'Notifications', color:'#f59e0b' },
  { id:'analytics',     icon:BarChart3, label:'Analytics',     color:'#06b6d4' },
  { id:'branding',      icon:Palette,   label:'Branding',      color:'#ec4899' },
  { id:'integrations',  icon:Link2,     label:'Integrations',  color:'#f97316' },
];

const DEFAULTS = {
  platformName:'MyCRM', timezone:'UTC', language:'en', dateFormat:'MM/DD/YYYY', currency:'USD',
  minPasswordLength:8, requireSpecialChars:true, sessionTimeout:30, twoFactorAuth:false, maxLoginAttempts:5, ipWhitelist:'',
  trialDuration:30, enableFreeTrial:true, autoExpiry:true, gracePeriod:7, paymentGateway:'stripe',
  maxUsersBasic:5, maxUsersPro:50, maxUsersEnterprise:999, rbacEnabled:true, defaultRole:'staff', staffPermissions:'limited',
  modules:{ leads:true, deals:true, tasks:true, contacts:true, finance:true, support:true, reports:true, automation:true, campaigns:false, visits:false },
  emailNotifications:true, inAppNotifications:true, alertLeadCreated:true, alertDealWon:true, alertPaymentFailed:true, alertTaskOverdue:true, alertNewUser:false,
  usageTracking:true, logRetentionDays:90, dashboardMetrics:true,
  primaryColor:'#6366f1', theme:'default', whiteLabelEnabled:false, logoUrl:'',
  apiKey:'sk-live-••••••••••••••••••••••••••••••', webhookUrl:'', emailProvider:'sendgrid', smsProvider:'twilio', smsEnabled:false,
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GlobalSettings() {
  const [tab, setTab]             = useState('general');
  const [s, setS]                 = useState(DEFAULTS);
  const [dirty, setDirty]         = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [showKey, setShowKey]     = useState(false);
  const [logo, setLogo]           = useState(null);
  const fileRef                   = useRef(null);
  const { list: toasts, add: toast } = useToast();

  const set  = useCallback((k, v) => { setS(p => ({ ...p, [k]: v })); setDirty(true); }, []);
  const setM = useCallback((k, v) => { setS(p => ({ ...p, modules: { ...p.modules, [k]: v } })); setDirty(true); }, []);

  const save = () => setConfirm({ title:'Apply Global Settings?', message:'These changes will take effect platform-wide across all organizations and users immediately.', label:'Save Changes', onOk:() => { setConfirm(null); setDirty(false); toast('Settings saved successfully','success'); } });
  const reset = () => setConfirm({ title:'Reset to Defaults?', message:'All settings will revert to factory defaults. This cannot be undone.', label:'Reset All', danger:true, onOk:() => { setS(DEFAULTS); setDirty(false); setLogo(null); setConfirm(null); toast('Settings reset to defaults','info'); } });

  const uploadLogo = e => { const f = e.target.files?.[0]; if (!f) return; setLogo(URL.createObjectURL(f)); set('logoUrl', f.name); toast('Logo uploaded','success'); };
  const copyKey = () => { navigator.clipboard?.writeText(s.apiKey); toast('API key copied','success'); };
  const regenKey = () => { set('apiKey','sk-live-'+Math.random().toString(36).slice(2,34)); toast('New API key generated','success'); };

  const activeMeta = TABS.find(t => t.id === tab);

  return (
    <div style={{ minHeight:'100%', background:'var(--bg-page)', fontFamily:"'Plus Jakarta Sans',sans-serif", paddingBottom: 80 }}>
      <Toasts list={toasts} />

      {/* ── Sticky Header ── */}
      <div style={{ 
        position:'sticky', top:0, zIndex:100, 
        background:'var(--card-bg)', 
        borderBottom:'1px solid var(--card-border)', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)'
      }}>
        {/* Title row */}
        <div style={{ padding:'0 28px', height:72, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'grid', placeItems:'center', boxShadow:'0 8px 16px rgba(99,102,241,0.25)' }}>
              <Settings size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', lineHeight:1.2 }}>Global Settings</h1>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginTop: 2 }}>Platform-wide configurations and system controls</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <AnimatePresence>
              {dirty && (
                <motion.span initial={{ opacity:0, scale:0.8, x: 10 }} animate={{ opacity:1, scale:1, x: 0 }} exit={{ opacity:0, scale:0.8 }}
                  style={{ fontSize:11, fontWeight:800, color:'#f59e0b', background:'rgba(245,158,11,0.1)', padding:'6px 14px', borderRadius:99, border:'1px solid rgba(245,158,11,0.2)' }}>
                  ● Unsaved changes
                </motion.span>
              )}
            </AnimatePresence>
            <button onClick={reset}
              style={{ 
                display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:11, 
                border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-secondary)', 
                fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s' 
              }}
              onMouseOver={e => { e.currentTarget.style.background='#ef444415'; e.currentTarget.style.borderColor='#ef444440'; e.currentTarget.style.color='#ef4444'; }}
              onMouseOut={e => { e.currentTarget.style.background='var(--bg-darker)'; e.currentTarget.style.borderColor='var(--card-border)'; e.currentTarget.style.color='var(--text-secondary)'; }}>
              <RefreshCw size={14} /> Reset
            </button>
            <motion.button onClick={save} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              style={{ 
                display:'flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:11, border:'none', 
                background: dirty ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--input-border)', 
                color: dirty ? 'white' : 'var(--text-muted)', 
                fontSize:13, fontWeight:700, cursor: dirty ? 'pointer' : 'default', 
                boxShadow: dirty ? '0 10px 20px rgba(99,102,241,0.3)' : 'none', 
                transition:'all 0.3s' 
              }}>
              <Save size={16} /> Save Changes
            </motion.button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ position: 'relative', borderTop:'1px solid var(--card-border)' }}>
          <div style={{ 
            padding:'0 28px', display:'flex', gap:4, overflowX:'auto', scrollbarWidth:'none', 
            msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'
          }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ 
                    display:'flex', alignItems:'center', gap:8, padding:'16px 20px', border:'none', 
                    background:'transparent', cursor:'pointer', fontSize:13, fontWeight: active ? 800 : 600, 
                    color: active ? t.color : 'var(--text-muted)', 
                    borderBottom:`3px solid ${active ? t.color : 'transparent'}`, 
                    marginBottom:-1, whiteSpace:'nowrap', transition:'all 0.2s', 
                    flexShrink:0, position: 'relative'
                  }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.background='var(--bg-darker)'; }}}
                  onMouseOut={e => { if (!active) { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent'; }}}>
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
          {/* Scroll fade indicators */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, transparent, var(--card-bg))', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ padding:'40px 28px', maxWidth:920, margin:'0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:0.18 }}>

            {/* ══ GENERAL ══ */}
            {tab === 'general' && (
              <Card>
                <CardHead icon={Settings} color="#6366f1" title="General Settings" sub="Core platform identity and regional defaults" />
                <CardBody>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <Field label="Platform Name" tip="Displayed in the sidebar, emails, and browser tab">
                      <Inp value={s.platformName} onChange={v => set('platformName',v)} placeholder="MyCRM" />
                    </Field>
                    <Field label="Default Timezone" tip="Used for scheduling, reports, and timestamps">
                      <Sel value={s.timezone} onChange={v => set('timezone',v)} options={[
                        {value:'UTC',label:'UTC — Coordinated Universal Time'},
                        {value:'America/New_York',label:'Eastern Time (ET)'},
                        {value:'America/Los_Angeles',label:'Pacific Time (PT)'},
                        {value:'Europe/London',label:'London (GMT)'},
                        {value:'Asia/Kolkata',label:'India (IST)'},
                        {value:'Asia/Tokyo',label:'Japan (JST)'},
                        {value:'Asia/Dubai',label:'Dubai (GST)'},
                      ]} />
                    </Field>
                    <Field label="Default Language" tip="Interface language for new organizations">
                      <Sel value={s.language} onChange={v => set('language',v)} options={[
                        {value:'en',label:'🇺🇸 English'},{value:'es',label:'🇪🇸 Spanish'},
                        {value:'fr',label:'🇫🇷 French'},{value:'de',label:'🇩🇪 German'},
                        {value:'ja',label:'🇯🇵 Japanese'},{value:'ar',label:'🇸🇦 Arabic'},
                      ]} />
                    </Field>
                    <Field label="Date Format" tip="How dates appear across the platform">
                      <Sel value={s.dateFormat} onChange={v => set('dateFormat',v)} options={['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD','DD MMM YYYY']} />
                    </Field>
                    <Field label="Currency" tip="Default currency for billing and invoices">
                      <Sel value={s.currency} onChange={v => set('currency',v)} options={[
                        {value:'USD',label:'$ USD — US Dollar'},{value:'EUR',label:'€ EUR — Euro'},
                        {value:'GBP',label:'£ GBP — British Pound'},{value:'INR',label:'₹ INR — Indian Rupee'},
                        {value:'JPY',label:'¥ JPY — Japanese Yen'},{value:'AED',label:'د.إ AED — UAE Dirham'},
                      ]} />
                    </Field>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ══ SECURITY ══ */}
            {tab === 'security' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Card>
                  <CardHead icon={Shield} color="#ef4444" title="Password Policy" sub="Enforce strong passwords across all accounts" />
                  <CardBody>
                    <Field label="Minimum Password Length" tip="Minimum characters required for all user passwords" desc="Recommended: 8–16 characters">
                      <Range value={s.minPasswordLength} onChange={v => set('minPasswordLength',v)} min={6} max={32} unit=" chars" color="#ef4444" />
                    </Field>
                    <Hr />
                    <Field label="Require Special Characters" tip="Force passwords to include symbols like !@#$%" desc="Adds an extra layer of security" row>
                      <Toggle value={s.requireSpecialChars} onChange={v => set('requireSpecialChars',v)} color="#ef4444" />
                    </Field>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Lock} color="#ef4444" title="Session & Access Control" sub="Login behavior and session management" />
                  <CardBody>
                    <Field label="Two-Factor Authentication (2FA)" tip="Require 2FA for all admin accounts" desc="Strongly recommended for production environments" row>
                      <Toggle value={s.twoFactorAuth} onChange={v => set('twoFactorAuth',v)} color="#ef4444" />
                    </Field>
                    <Hr />
                    <Field label="Session Timeout" tip="Auto-logout after inactivity" desc="Minutes of inactivity before automatic sign-out">
                      <Range value={s.sessionTimeout} onChange={v => set('sessionTimeout',v)} min={5} max={480} unit=" min" color="#ef4444" />
                    </Field>
                    <Field label="Max Login Attempts" tip="Lock account after consecutive failed logins" desc="Account locked for 30 minutes after limit is reached">
                      <Range value={s.maxLoginAttempts} onChange={v => set('maxLoginAttempts',v)} min={3} max={20} unit=" attempts" color="#ef4444" />
                    </Field>
                    <Hr />
                    <Field label="IP Whitelist" tip="Only allow access from these IPs (leave blank to allow all)" desc="Comma-separated IPs or CIDR ranges, e.g. 192.168.1.1, 10.0.0.0/24">
                      <Inp value={s.ipWhitelist} onChange={v => set('ipWhitelist',v)} placeholder="192.168.1.1, 10.0.0.0/24" />
                    </Field>
                    {s.twoFactorAuth && <Banner color="#10b981" icon={Check}>2FA is enabled. All admin accounts will be required to verify via authenticator app on next login.</Banner>}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ══ SUBSCRIPTION ══ */}
            {tab === 'subscription' && (
              <Card>
                <CardHead icon={CreditCard} color="#10b981" title="Subscription & Billing" sub="Trial periods, expiry rules, and payment configuration" />
                <CardBody>
                  <Field label="Enable Free Trial" tip="Allow new organizations to start with a free trial period" desc="New orgs automatically get trial access on signup" row>
                    <Toggle value={s.enableFreeTrial} onChange={v => set('enableFreeTrial',v)} color="#10b981" />
                  </Field>
                  {s.enableFreeTrial && (
                    <Field label="Trial Duration" tip="Number of days for the free trial" desc="After this period, orgs must subscribe to continue">
                      <Range value={s.trialDuration} onChange={v => set('trialDuration',v)} min={7} max={90} unit=" days" color="#10b981" />
                    </Field>
                  )}
                  <Hr />
                  <Field label="Auto-Expiry" tip="Automatically expire subscriptions when the billing period ends" desc="Orgs will lose access unless they renew" row>
                    <Toggle value={s.autoExpiry} onChange={v => set('autoExpiry',v)} color="#10b981" />
                  </Field>
                  <Field label="Grace Period" tip="Days after expiry before access is fully revoked" desc="Gives organizations time to renew without service interruption">
                    <Range value={s.gracePeriod} onChange={v => set('gracePeriod',v)} min={0} max={30} unit=" days" color="#10b981" />
                  </Field>
                  <Hr />
                  <Field label="Payment Gateway" tip="Primary payment processor for subscription billing" desc="Ensure API keys are configured in Integrations">
                    <Sel value={s.paymentGateway} onChange={v => set('paymentGateway',v)} options={[
                      {value:'stripe',label:'💳 Stripe'},{value:'razorpay',label:'💳 Razorpay'},
                      {value:'paypal',label:'💳 PayPal'},{value:'manual',label:'📋 Manual / Offline'},
                    ]} />
                  </Field>
                  <Banner color="#10b981" icon={Check}>
                    Trial: {s.enableFreeTrial ? `${s.trialDuration} days` : 'Disabled'} · Grace period: {s.gracePeriod} days · Gateway: {s.paymentGateway}
                  </Banner>
                </CardBody>
              </Card>
            )}

            {/* ══ USERS & ROLES ══ */}
            {tab === 'users' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Card>
                  <CardHead icon={Users} color="#3b82f6" title="Access Control" sub="Role-based permissions and default assignments" />
                  <CardBody>
                    <Field label="Role-Based Access Control (RBAC)" tip="Enable granular permission control per role" desc="When disabled, all users get full access" row>
                      <Toggle value={s.rbacEnabled} onChange={v => set('rbacEnabled',v)} color="#3b82f6" />
                    </Field>
                    <Hr />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <Field label="Default Role" tip="Role automatically assigned to new users" desc="Can be changed per user after creation">
                        <Sel value={s.defaultRole} onChange={v => set('defaultRole',v)} options={[
                          {value:'admin',label:'👑 Admin'},{value:'manager',label:'🎯 Manager'},
                          {value:'staff',label:'👤 Staff'},{value:'viewer',label:'👁 Viewer (Read-only)'},
                        ]} />
                      </Field>
                      <Field label="Staff Permissions" tip="Default permission level for staff members">
                        <Sel value={s.staffPermissions} onChange={v => set('staffPermissions',v)} options={[
                          {value:'full',label:'Full Access'},{value:'limited',label:'Limited (No Delete)'},
                          {value:'readonly',label:'Read Only'},
                        ]} />
                      </Field>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Sliders} color="#3b82f6" title="User Limits Per Plan" sub="Maximum users allowed per subscription tier" />
                  <CardBody>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                      {[['Free / Basic','maxUsersBasic',1,20,'#64748b'],['Pro','maxUsersPro',5,100,'#3b82f6'],['Enterprise','maxUsersEnterprise',10,999,'#6366f1']].map(([label,key,min,max,color]) => (
                        <div key={key} style={{ background:'var(--bg-darker)', borderRadius:14, padding:16, border:'1px solid var(--card-border)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                            <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
                            <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{label}</span>
                          </div>
                          <Range value={s[key]} onChange={v => set(key,v)} min={min} max={max} unit=" users" color={color} />
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ══ MODULES ══ */}
            {tab === 'modules' && (
              <Card>
                <CardHead icon={Layers} color="#8b5cf6" title="Module Management" sub="Enable or disable CRM modules platform-wide"
                  badge={`${Object.values(s.modules).filter(Boolean).length}/${Object.keys(s.modules).length} active`} />
                <CardBody>
                  <Banner color="#8b5cf6" icon={Info}>Disabled modules are hidden from all organizations. Changes apply immediately.</Banner>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      {key:'leads',label:'Leads Management',emoji:'👤',desc:'Lead capture, scoring & pipeline stages'},
                      {key:'deals',label:'Deals & Pipeline',emoji:'💼',desc:'Opportunity tracking and Kanban board'},
                      {key:'tasks',label:'Tasks & Activities',emoji:'✅',desc:'Task management, reminders & scheduling'},
                      {key:'contacts',label:'Contacts & Accounts',emoji:'📇',desc:'Contact records and account management'},
                      {key:'finance',label:'Finance Suite',emoji:'💰',desc:'Invoices, quotes, contracts & revenue'},
                      {key:'support',label:'Support / Cases',emoji:'🎧',desc:'Ticket management and case resolution'},
                      {key:'reports',label:'Reports & Analytics',emoji:'📊',desc:'Custom dashboards and data exports'},
                      {key:'automation',label:'Automation Engine',emoji:'⚡',desc:'Workflow triggers, conditions & actions'},
                      {key:'campaigns',label:'Campaigns',emoji:'📣',desc:'Email marketing and campaign tracking'},
                      {key:'visits',label:'Field Visits',emoji:'📍',desc:'Location-based visit tracking and maps'},
                    ].map(({ key, label, emoji, desc }) => {
                      const on = s.modules[key];
                      return (
                        <motion.div key={key} layout onClick={() => setM(key, !on)}
                          style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderRadius:13, border:`1.5px solid ${on ? '#8b5cf630' : 'var(--card-border)'}`, background: on ? 'rgba(139,92,246,0.04)' : 'var(--bg-darker)', transition:'all 0.2s', cursor:'pointer' }}>
                          <div style={{ width:38, height:38, borderRadius:10, background: on ? 'rgba(139,92,246,0.12)' : 'var(--card-border)', display:'grid', placeItems:'center', fontSize:17, flexShrink:0, transition:'background 0.2s' }}>{emoji}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontSize:13, fontWeight:700, color: on ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</p>
                            <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{desc}</p>
                          </div>
                          <Toggle value={on} onChange={v => setM(key,v)} color="#8b5cf6" size="sm" />
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ══ NOTIFICATIONS ══ */}
            {tab === 'notifications' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Card>
                  <CardHead icon={Bell} color="#f59e0b" title="Delivery Channels" sub="Control how notifications reach users" />
                  <CardBody>
                    <Field label="Email Notifications" tip="Send email alerts for platform events" desc="Uses the email provider configured in Integrations" row>
                      <Toggle value={s.emailNotifications} onChange={v => set('emailNotifications',v)} color="#f59e0b" />
                    </Field>
                    <Hr />
                    <Field label="In-App Notifications" tip="Show notification bell alerts inside the CRM" desc="Real-time alerts visible in the top navigation bar" row>
                      <Toggle value={s.inAppNotifications} onChange={v => set('inAppNotifications',v)} color="#f59e0b" />
                    </Field>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Zap} color="#f59e0b" title="Event-Based Alerts" sub="Choose which platform events trigger notifications" />
                  <CardBody gap={8}>
                    {[
                      {key:'alertLeadCreated',label:'Lead Created',desc:'Notify assigned user when a new lead is added',emoji:'👤'},
                      {key:'alertDealWon',label:'Deal Won',desc:'Celebrate when a deal is marked as converted',emoji:'🏆'},
                      {key:'alertPaymentFailed',label:'Payment Failed',desc:'Alert admins on failed subscription payments',emoji:'💳'},
                      {key:'alertTaskOverdue',label:'Task Overdue',desc:'Remind users when tasks pass their due date',emoji:'⏰'},
                      {key:'alertNewUser',label:'New User Registered',desc:'Notify org admin when a new user joins',emoji:'👋'},
                    ].map(({ key, label, desc, emoji }) => (
                      <div key={key} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 15px', borderRadius:12, background:'var(--bg-darker)', border:'1px solid var(--card-border)', transition:'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background='rgba(245,158,11,0.04)'}
                        onMouseOut={e => e.currentTarget.style.background='var(--bg-darker)'}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{emoji}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{label}</p>
                          <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{desc}</p>
                        </div>
                        <Toggle value={s[key]} onChange={v => set(key,v)} color="#f59e0b" size="sm" />
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ══ ANALYTICS ══ */}
            {tab === 'analytics' && (
              <Card>
                <CardHead icon={BarChart3} color="#06b6d4" title="Analytics & Tracking" sub="Usage data collection, log management, and dashboard configuration" />
                <CardBody>
                  <Field label="Enable Usage Tracking" tip="Collect anonymized usage data to improve the platform" desc="No personally identifiable information is stored" row>
                    <Toggle value={s.usageTracking} onChange={v => set('usageTracking',v)} color="#06b6d4" />
                  </Field>
                  <Hr />
                  <Field label="Dashboard Metrics" tip="Show platform-wide metrics on the Super Admin dashboard" desc="Includes active users, revenue trends, and module adoption" row>
                    <Toggle value={s.dashboardMetrics} onChange={v => set('dashboardMetrics',v)} color="#06b6d4" />
                  </Field>
                  <Hr />
                  <Field label="Log Retention Duration" tip="How long activity logs are stored before automatic deletion" desc="Longer retention uses more storage. Minimum recommended: 30 days">
                    <Range value={s.logRetentionDays} onChange={v => set('logRetentionDays',v)} min={7} max={365} unit=" days" color="#06b6d4" />
                  </Field>
                  <Banner color="#06b6d4" icon={Info}>
                    Logs older than {s.logRetentionDays} days will be automatically purged. Ensure this aligns with your data retention and compliance policy.
                  </Banner>
                </CardBody>
              </Card>
            )}

            {/* ══ BRANDING ══ */}
            {tab === 'branding' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Card>
                  <CardHead icon={Palette} color="#ec4899" title="Visual Identity" sub="Customize the platform's appearance and logo" />
                  <CardBody>
                    <Field label="Platform Logo" tip="Displayed in the sidebar, emails, and login page" desc="PNG, SVG, or JPG · Max 2MB · Recommended: 200×60px">
                      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                        <div style={{ width:88, height:60, borderRadius:12, border:'2px dashed var(--card-border)', display:'grid', placeItems:'center', background:'var(--bg-darker)', overflow:'hidden', flexShrink:0, cursor:'pointer' }}
                          onClick={() => fileRef.current?.click()}>
                          {logo ? <img src={logo} alt="logo" style={{ width:'100%', height:'100%', objectFit:'contain', padding:6 }} /> : <Palette size={22} color="var(--text-muted)" />}
                        </div>
                        <div>
                          <button onClick={() => fileRef.current?.click()}
                            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:'1px solid rgba(99,102,241,0.4)', background:'rgba(99,102,241,0.08)', color:'#6366f1', fontSize:12, fontWeight:700, cursor:'pointer', marginBottom:6 }}>
                            <Upload size={13} /> Upload Logo
                          </button>
                          <p style={{ fontSize:11, color:'var(--text-muted)' }}>{logo ? '✓ Logo uploaded' : 'No logo — using default'}</p>
                          <input ref={fileRef} type="file" accept="image/*" onChange={uploadLogo} style={{ display:'none' }} />
                        </div>
                      </div>
                    </Field>
                    <Hr />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <Field label="Primary Accent Color" tip="Main color used for buttons, links, and highlights">
                        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
                          <input type="color" value={s.primaryColor} onChange={e => set('primaryColor',e.target.value)}
                            style={{ width:42, height:42, borderRadius:10, border:'1px solid var(--card-border)', cursor:'pointer', padding:3, background:'var(--bg-darker)', flexShrink:0 }} />
                          <Inp value={s.primaryColor} onChange={v => set('primaryColor',v)} placeholder="#6366f1" />
                        </div>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#0d9488'].map(c => (
                            <div key={c} onClick={() => set('primaryColor',c)}
                              style={{ width:24, height:24, borderRadius:7, background:c, cursor:'pointer', border: s.primaryColor===c ? '3px solid var(--text-primary)' : '2px solid transparent', transition:'all 0.15s', flexShrink:0 }} />
                          ))}
                        </div>
                      </Field>
                      <Field label="Default Theme" tip="Default theme applied to new organizations">
                        <Sel value={s.theme} onChange={v => set('theme',v)} options={[
                          {value:'default',label:'🖥 System Default'},
                          {value:'light',label:'☀️ Light Mode'},
                          {value:'dark',label:'🌙 Dark Mode'},
                        ]} />
                      </Field>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Star} color="#ec4899" title="White-Label" sub="Remove MyCRM branding for a fully custom experience" />
                  <CardBody>
                    <Field label="Enable White-Label Mode" tip="Hides all MyCRM branding from the platform" desc="Your logo and colors will be used exclusively" row>
                      <Toggle value={s.whiteLabelEnabled} onChange={v => set('whiteLabelEnabled',v)} color="#ec4899" />
                    </Field>
                    {s.whiteLabelEnabled && (
                      <Banner color="#ec4899" icon={AlertTriangle}>
                        White-label is active. Ensure your custom logo is uploaded and primary color is set above. All MyCRM references will be hidden from organizations.
                      </Banner>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ══ INTEGRATIONS ══ */}
            {tab === 'integrations' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Card>
                  <CardHead icon={Key} color="#f97316" title="API Key Management" sub="Authenticate external services and developer integrations" />
                  <CardBody>
                    <Field label="Platform API Key" tip="Use this key to authenticate REST API requests" desc="Keep this secret — never expose it in client-side code">
                      <div style={{ display:'flex', gap:8 }}>
                        <div style={{ flex:1 }}>
                          <Inp value={s.apiKey} readOnly mono
                            rightEl={
                              <button onClick={() => setShowKey(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'grid', placeItems:'center' }}>
                                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            }
                            type={showKey ? 'text' : 'password'} />
                        </div>
                        <button onClick={copyKey} title="Copy"
                          style={{ width:40, height:40, borderRadius:10, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0, transition:'all 0.15s' }}
                          onMouseOver={e => { e.currentTarget.style.background='rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'; }}
                          onMouseOut={e => { e.currentTarget.style.background='var(--bg-darker)'; e.currentTarget.style.borderColor='var(--card-border)'; }}>
                          <Copy size={14} color="var(--text-secondary)" />
                        </button>
                        <button onClick={regenKey}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'0 14px', height:40, borderRadius:10, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.06)', color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                          <RefreshCw size={12} /> Regenerate
                        </button>
                      </div>
                    </Field>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Webhook} color="#f97316" title="Webhooks" sub="Receive real-time event data at your endpoint" />
                  <CardBody>
                    <Field label="Webhook Endpoint URL" tip="POST requests will be sent here on platform events" desc="Must be a publicly accessible HTTPS URL">
                      <Inp value={s.webhookUrl} onChange={v => set('webhookUrl',v)} placeholder="https://your-server.com/api/webhook" />
                    </Field>
                    <div style={{ background:'var(--bg-darker)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--card-border)' }}>
                      <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:10, letterSpacing:'0.05em' }}>EVENTS DISPATCHED</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {['lead.created','deal.won','deal.lost','payment.success','payment.failed','user.registered','org.suspended','org.activated'].map(e => (
                          <span key={e} style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:7, background:'rgba(249,115,22,0.1)', color:'#f97316', fontFamily:'monospace', border:'1px solid rgba(249,115,22,0.2)' }}>{e}</span>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHead icon={Link2} color="#f97316" title="Third-Party Services" sub="Email, SMS, and external provider configuration" />
                  <CardBody>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <Field label="Email Provider" tip="Service used to send transactional and notification emails" desc="Configure API keys in your provider dashboard">
                        <Sel value={s.emailProvider} onChange={v => set('emailProvider',v)} options={[
                          {value:'sendgrid',label:'📧 SendGrid'},{value:'mailgun',label:'📧 Mailgun'},
                          {value:'ses',label:'📧 Amazon SES'},{value:'smtp',label:'📧 Custom SMTP'},
                        ]} />
                      </Field>
                      <Field label="SMS Provider" tip="Service used to send SMS alerts and OTPs">
                        <Sel value={s.smsProvider} onChange={v => set('smsProvider',v)} options={[
                          {value:'twilio',label:'📱 Twilio'},{value:'nexmo',label:'📱 Vonage (Nexmo)'},
                          {value:'msg91',label:'📱 MSG91'},{value:'none',label:'🚫 Disabled'},
                        ]} />
                      </Field>
                    </div>
                    <Hr />
                    <Field label="Enable SMS Notifications" tip="Send SMS alerts for critical events like payment failures" desc="Requires a valid SMS provider configured above" row>
                      <Toggle value={s.smsEnabled} onChange={v => set('smsEnabled',v)} color="#f97316" />
                    </Field>
                  </CardBody>
                </Card>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {confirm && (
          <Confirm title={confirm.title} message={confirm.message} label={confirm.label} danger={confirm.danger}
            onOk={confirm.onOk} onCancel={() => setConfirm(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
