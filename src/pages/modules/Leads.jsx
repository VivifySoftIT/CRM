import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Download, Upload, LayoutList, Kanban,
  Eye, Edit2, Phone, Mail, Trash2, X, Check, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, MoreVertical, SlidersHorizontal,
  TrendingUp, TrendingDown, UserPlus, Users, Target, Zap,
  AlertTriangle, CheckCircle, RefreshCw, Calendar, Star,
  ArrowUpDown, Copy, Tag, Building2
} from 'lucide-react';

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SOURCES = ['Website', 'Google Ads', 'Referral', 'LinkedIn', 'Cold Email', 'Event', 'Social Media'];
const USERS   = ['John Sales', 'Sarah Doe', 'Mike Ross', 'Emily Clark', 'David Lee'];
const STAGES  = ['New', 'Contacted', 'Qualified', 'Proposal', 'Converted'];

const STAGE_META = {
  New:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  light: '#eff6ff' },
  Contacted: { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  light: '#fff7ed' },
  Qualified: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  light: '#f5f3ff' },
  Proposal:  { color: '#0d9488', bg: 'rgba(13,148,136,0.1)',  light: '#f0fdfa' },
  Converted: { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  light: '#f0fdf4' },
};

const SCORE_META = {
  High:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  Low:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
};

function scoreLabel(s) {
  if (s >= 70) return 'High';
  if (s >= 40) return 'Medium';
  return 'Low';
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#0d9488'];
function avatarColor(name) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }

const SEED_LEADS = [
  { id:1,  name:'Alice Johnson',   company:'Vertex Corp',      email:'alice@vertex.com',    phone:'+1 555-0101', source:'Website',     status:'New',       score:82, owner:'John Sales',  date:'2026-03-28', notes:'' },
  { id:2,  name:'Bob Martinez',    company:'BlueSky Inc',      email:'bob@bluesky.io',      phone:'+1 555-0102', source:'Google Ads',  status:'Contacted', score:55, owner:'Sarah Doe',   date:'2026-03-26', notes:'' },
  { id:3,  name:'Carol White',     company:'Nexus Solutions',  email:'carol@nexus.com',     phone:'+1 555-0103', source:'Referral',    status:'Qualified', score:91, owner:'Mike Ross',   date:'2026-03-24', notes:'' },
  { id:4,  name:'David Kim',       company:'Apex Dynamics',    email:'david@apex.com',      phone:'+1 555-0104', source:'LinkedIn',    status:'Proposal',  score:74, owner:'Emily Clark', date:'2026-03-22', notes:'' },
  { id:5,  name:'Eva Chen',        company:'Orbit Labs',       email:'eva@orbit.io',        phone:'+1 555-0105', source:'Cold Email',  status:'Converted', score:95, owner:'David Lee',   date:'2026-03-20', notes:'' },
  { id:6,  name:'Frank Okafor',    company:'Pinnacle Tech',    email:'frank@pinnacle.com',  phone:'+1 555-0106', source:'Event',       status:'New',       score:38, owner:'John Sales',  date:'2026-03-19', notes:'' },
  { id:7,  name:'Grace Liu',       company:'Meridian Group',   email:'grace@meridian.com',  phone:'+1 555-0107', source:'Social Media',status:'Contacted', score:62, owner:'Sarah Doe',   date:'2026-03-18', notes:'' },
  { id:8,  name:'Henry Park',      company:'Crest Analytics',  email:'henry@crest.com',     phone:'+1 555-0108', source:'Website',     status:'Qualified', score:78, owner:'Mike Ross',   date:'2026-03-17', notes:'' },
  { id:9,  name:'Iris Patel',      company:'Dune Ventures',    email:'iris@dune.ae',        phone:'+1 555-0109', source:'Referral',    status:'New',       score:45, owner:'Emily Clark', date:'2026-03-16', notes:'' },
  { id:10, name:'James Wilson',    company:'Solaris Tech',     email:'james@solaris.mx',    phone:'+1 555-0110', source:'Google Ads',  status:'Proposal',  score:88, owner:'David Lee',   date:'2026-03-15', notes:'' },
  { id:11, name:'Karen Brown',     company:'Zephyr Cloud',     email:'karen@zephyr.kr',     phone:'+1 555-0111', source:'LinkedIn',    status:'Converted', score:93, owner:'John Sales',  date:'2026-03-14', notes:'' },
  { id:12, name:'Leo Tanaka',      company:'Ironclad Sec',     email:'leo@ironclad.sa',     phone:'+1 555-0112', source:'Cold Email',  status:'Contacted', score:31, owner:'Sarah Doe',   date:'2026-03-13', notes:'' },
  { id:13, name:'Mia Nguyen',      company:'Bloom Digital',    email:'mia@bloom.de',        phone:'+1 555-0113', source:'Event',       status:'New',       score:57, owner:'Mike Ross',   date:'2026-03-12', notes:'' },
  { id:14, name:'Noah Adams',      company:'Velocity Labs',    email:'noah@velocity.dev',   phone:'+1 555-0114', source:'Website',     status:'Qualified', score:69, owner:'Emily Clark', date:'2026-03-11', notes:'' },
  { id:15, name:'Olivia Scott',    company:'Nexus Corp',       email:'olivia@nexus.io',     phone:'+1 555-0115', source:'Social Media',status:'Proposal',  score:83, owner:'David Lee',   date:'2026-03-10', notes:'' },
];

const KPI_STAGES = [
  { stage:'New',       count:4,  prev:3,  icon: UserPlus, gradient:'linear-gradient(135deg,#3b82f6,#60a5fa)' },
  { stage:'Contacted', count:3,  prev:4,  icon: Phone,    gradient:'linear-gradient(135deg,#f97316,#fb923c)' },
  { stage:'Qualified', count:3,  prev:2,  icon: Target,   gradient:'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
  { stage:'Proposal',  count:3,  prev:2,  icon: Zap,      gradient:'linear-gradient(135deg,#0d9488,#2dd4bf)' },
  { stage:'Converted', count:2,  prev:1,  icon: CheckCircle, gradient:'linear-gradient(135deg,#10b981,#34d399)' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity:0, x:60, scale:0.95 }} animate={{ opacity:1, x:0, scale:1 }} exit={{ opacity:0, x:60 }}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:12, fontWeight:700, fontSize:13, color:'white', pointerEvents:'all', minWidth:260, boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
              background: t.type==='success'?'#10b981':t.type==='error'?'#ef4444':t.type==='warning'?'#f59e0b':'#3b82f6' }}>
            {t.type==='success'?<CheckCircle size={15}/>:t.type==='error'?<X size={15}/>:<AlertTriangle size={15}/>}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type='success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, add };
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(10,15,30,0.6)', backdropFilter:'blur(8px)', zIndex:1100, display:'grid', placeItems:'center', padding:20 }}
      onClick={e => e.target===e.currentTarget && onCancel()}>
      <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
        style={{ background:'var(--card-bg)', borderRadius:20, padding:32, maxWidth:400, width:'100%', boxShadow:'0 40px 80px rgba(0,0,0,0.25)', textAlign:'center' }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(239,68,68,0.1)', display:'grid', placeItems:'center', margin:'0 auto 16px' }}>
          <Trash2 size={22} color="#ef4444" />
        </div>
        <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>{title}</h3>
        <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:24 }}>{message}</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'10px', borderRadius:11, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-secondary)', fontWeight:700, fontSize:13, cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'10px', borderRadius:11, border:'none', background:'#ef4444', color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[40, 180, 130, 140, 90, 90, 70, 110, 90, 80].map((w, i) => (
        <td key={i} style={{ padding:'14px 12px' }}>
          <div style={{ height:14, width:w, borderRadius:7, background:'var(--card-border)', animation:'shimmer 1.4s infinite linear', backgroundSize:'600px 100%', backgroundImage:'linear-gradient(90deg,var(--card-border) 25%,var(--bg-darker) 50%,var(--card-border) 75%)' }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STAGE_META[status] || STAGE_META.New;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:800, background:m.bg, color:m.color, whiteSpace:'nowrap' }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:m.color }} />
      {status}
    </span>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const label = scoreLabel(score);
  const m = SCORE_META[label];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ flex:1, height:5, background:'var(--card-border)', borderRadius:99, overflow:'hidden', minWidth:40 }}>
        <div style={{ height:'100%', width:`${score}%`, background:m.color, borderRadius:99, transition:'width 0.4s' }} />
      </div>
      <span style={{ fontSize:11, fontWeight:800, color:m.color, background:m.bg, padding:'2px 7px', borderRadius:99, flexShrink:0 }}>{label}</span>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size=32 }) {
  const color = avatarColor(name);
  return (
    <div style={{ width:size, height:size, borderRadius:size/3, background:color, display:'grid', placeItems:'center', flexShrink:0, color:'white', fontWeight:800, fontSize:size*0.38 }}>
      {initials(name)}
    </div>
  );
}

// ─── Lead Form Modal ──────────────────────────────────────────────────────────
function LeadFormModal({ lead, onSave, onClose }) {
  const isEdit = !!lead?.id;
  const empty = { name:'', company:'', email:'', phone:'', source:'Website', status:'New', score:50, owner:'John Sales', notes:'' };
  const [form, setForm] = useState(lead ? { ...lead } : empty);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.company.trim()) e.company = 'Required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: form.id || Date.now(), date: form.date || new Date().toISOString().split('T')[0] });
  };

  const inp = (err) => ({
    padding:'9px 12px', borderRadius:10, border:`1px solid ${err?'#ef4444':'var(--card-border)'}`,
    background:'var(--bg-darker)', color:'var(--text-primary)', fontSize:13, outline:'none',
    width:'100%', boxSizing:'border-box', transition:'border-color 0.2s',
    fontFamily:"'Plus Jakarta Sans',sans-serif",
  });

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(10,15,30,0.6)', backdropFilter:'blur(8px)', zIndex:1000, display:'grid', placeItems:'center', padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ scale:0.95, y:20, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
        transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
        style={{ background:'var(--card-bg)', borderRadius:22, width:'100%', maxWidth:560, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 40px 80px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#3b82f6)', display:'grid', placeItems:'center' }}>
              <UserPlus size={16} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', lineHeight:1.2 }}>{isEdit?'Edit Lead':'Add New Lead'}</h2>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{isEdit?'Update lead information':'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 24px', overflowY:'auto', flex:1 }}>
          <form onSubmit={handleSubmit} id="lead-form" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>FULL NAME *</label>
                <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Alice Johnson" style={inp(errors.name)}
                  onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor=errors.name?'#ef4444':'var(--card-border)'} />
                {errors.name && <p style={{ fontSize:11, color:'#ef4444', marginTop:3 }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>COMPANY *</label>
                <input value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Acme Corp" style={inp(errors.company)}
                  onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor=errors.company?'#ef4444':'var(--card-border)'} />
                {errors.company && <p style={{ fontSize:11, color:'#ef4444', marginTop:3 }}>{errors.company}</p>}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>EMAIL *</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="alice@company.com" style={inp(errors.email)}
                  onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor=errors.email?'#ef4444':'var(--card-border)'} />
                {errors.email && <p style={{ fontSize:11, color:'#ef4444', marginTop:3 }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>PHONE</label>
                <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 555-0100" style={inp()} />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>SOURCE</label>
                <select value={form.source} onChange={e=>set('source',e.target.value)} style={{ ...inp(), cursor:'pointer' }}>
                  {SOURCES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>STATUS</label>
                <select value={form.status} onChange={e=>set('status',e.target.value)} style={{ ...inp(), cursor:'pointer' }}>
                  {STAGES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>ASSIGNED TO</label>
                <select value={form.owner} onChange={e=>set('owner',e.target.value)} style={{ ...inp(), cursor:'pointer' }}>
                  {USERS.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>SCORE: {form.score}</label>
                <input type="range" min={0} max={100} value={form.score} onChange={e=>set('score',+e.target.value)}
                  style={{ width:'100%', marginTop:8, accentColor:'#2563eb' }} />
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, letterSpacing:'0.05em' }}>NOTES</label>
              <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Add any notes..." rows={3}
                style={{ ...inp(), resize:'vertical', minHeight:72, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--card-border)', display:'flex', gap:10, flexShrink:0 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:11, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-secondary)', fontWeight:700, fontSize:13, cursor:'pointer' }}>Cancel</button>
          <button form="lead-form" type="submit" style={{ flex:2, padding:'10px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
            {isEdit ? 'Save Changes' : 'Add Lead'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({ filters, onChange, onApply, onReset, onClose }) {
  const [local, setLocal] = useState({ ...filters });
  const set = (k, v) => setLocal(f => ({ ...f, [k]: v }));

  const inp = { padding:'8px 12px', borderRadius:10, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(10,15,30,0.4)', backdropFilter:'blur(4px)', zIndex:900 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
        style={{ position:'absolute', right:0, top:0, bottom:0, width:340, background:'var(--card-bg)', boxShadow:'-20px 0 60px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column' }}>

        <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <SlidersHorizontal size={16} color="#2563eb" />
            <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>Advanced Filters</h3>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
            <X size={13} />
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 22px', display:'flex', flexDirection:'column', gap:18 }}>
          {/* Status */}
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'0.05em' }}>STATUS</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['All', ...STAGES].map(s => (
                <button key={s} onClick={() => set('status', s)}
                  style={{ padding:'5px 12px', borderRadius:99, border:`1.5px solid ${local.status===s?STAGE_META[s]?.color||'#2563eb':'var(--card-border)'}`, background:local.status===s?(STAGE_META[s]?.bg||'rgba(37,99,235,0.1)'):'var(--bg-darker)', color:local.status===s?(STAGE_META[s]?.color||'#2563eb'):'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'0.05em' }}>SOURCE</label>
            <select value={local.source} onChange={e=>set('source',e.target.value)} style={{ ...inp, cursor:'pointer' }}>
              <option value="All">All Sources</option>
              {SOURCES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Assigned User */}
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'0.05em' }}>ASSIGNED TO</label>
            <select value={local.owner} onChange={e=>set('owner',e.target.value)} style={{ ...inp, cursor:'pointer' }}>
              <option value="All">All Users</option>
              {USERS.map(u=><option key={u}>{u}</option>)}
            </select>
          </div>

          {/* Score Range */}
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'0.05em' }}>SCORE RANGE: {local.scoreMin}–{local.scoreMax}</label>
            <div style={{ display:'flex', gap:10 }}>
              <input type="range" min={0} max={100} value={local.scoreMin} onChange={e=>set('scoreMin',+e.target.value)} style={{ flex:1, accentColor:'#2563eb' }} />
              <input type="range" min={0} max={100} value={local.scoreMax} onChange={e=>set('scoreMax',+e.target.value)} style={{ flex:1, accentColor:'#2563eb' }} />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'0.05em' }}>DATE RANGE</label>
            <div style={{ display:'flex', gap:8 }}>
              <input type="date" value={local.dateFrom} onChange={e=>set('dateFrom',e.target.value)} style={{ ...inp, flex:1 }} />
              <input type="date" value={local.dateTo} onChange={e=>set('dateTo',e.target.value)} style={{ ...inp, flex:1 }} />
            </div>
          </div>
        </div>

        <div style={{ padding:'16px 22px', borderTop:'1px solid var(--card-border)', display:'flex', gap:10, flexShrink:0 }}>
          <button onClick={() => { onReset(); onClose(); }} style={{ flex:1, padding:'10px', borderRadius:11, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-secondary)', fontWeight:700, fontSize:13, cursor:'pointer' }}>Reset</button>
          <button onClick={() => { onApply(local); onClose(); }} style={{ flex:2, padding:'10px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>Apply Filters</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Kanban View ──────────────────────────────────────────────────────────────
function KanbanView({ leads, onEdit, onDelete, onStatusChange, toast }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (e, lead) => {
    setDragging(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    if (dragging && dragging.status !== stage) {
      onStatusChange(dragging.id, stage);
      toast(`Moved "${dragging.name}" to ${stage}`, 'success');
    }
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, overflowX:'auto', minWidth:900 }}>
      {STAGES.map(stage => {
        const m = STAGE_META[stage];
        const stageLeads = leads.filter(l => l.status === stage);
        const isOver = dragOver === stage;
        return (
          <div key={stage}
            onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, stage)}
            style={{ background: isOver ? m.bg : 'var(--bg-darker)', borderRadius:16, padding:12, border:`2px dashed ${isOver?m.color:'transparent'}`, transition:'all 0.2s', minHeight:400 }}>

            {/* Column header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:m.color }} />
                <span style={{ fontSize:12, fontWeight:800, color:'var(--text-primary)' }}>{stage}</span>
              </div>
              <span style={{ fontSize:11, fontWeight:800, color:m.color, background:m.bg, padding:'2px 8px', borderRadius:99 }}>{stageLeads.length}</span>
            </div>

            {/* Cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {stageLeads.map(lead => (
                <motion.div key={lead.id} layout
                  draggable onDragStart={e => handleDragStart(e, lead)}
                  whileHover={{ y:-2, boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}
                  style={{ background:'var(--card-bg)', borderRadius:12, padding:12, border:'1px solid var(--card-border)', cursor:'grab', boxShadow:'var(--card-shadow)', transition:'box-shadow 0.2s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <Avatar name={lead.name} size={28} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, fontWeight:800, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{lead.name}</p>
                      <p style={{ fontSize:10, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{lead.company}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', background:'var(--bg-darker)', padding:'2px 7px', borderRadius:6 }}>{lead.source}</span>
                    <ScoreBadge score={lead.score} />
                  </div>
                  <div style={{ display:'flex', gap:4, marginTop:8, justifyContent:'flex-end' }}>
                    <button onClick={() => onEdit(lead)} style={{ width:24, height:24, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer' }}>
                      <Edit2 size={11} color="#f59e0b" />
                    </button>
                    <button onClick={() => onDelete(lead)} style={{ width:24, height:24, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer' }}>
                      <Trash2 size={11} color="#ef4444" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {stageLeads.length === 0 && (
                <div style={{ textAlign:'center', padding:'24px 12px', color:'var(--text-muted)', fontSize:12 }}>
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Leads Component ─────────────────────────────────────────────────────
export default function Leads() {
  const [leads, setLeads]           = useState(SEED_LEADS);
  const [view, setView]             = useState('table'); // 'table' | 'kanban'
  const [search, setSearch]         = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sortKey, setSortKey]       = useState('date');
  const [sortDir, setSortDir]       = useState('desc');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [selected, setSelected]     = useState(new Set());
  const [showForm, setShowForm]     = useState(false);
  const [editLead, setEditLead]     = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const { toasts, add: addToast }   = useToast();

  const [filters, setFilters] = useState({
    status:'All', source:'All', owner:'All', scoreMin:0, scoreMax:100, dateFrom:'', dateTo:'',
  });

  // Simulate initial load
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Derived: filtered + sorted
  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    const matchStage = stageFilter === 'All' || l.status === stageFilter;
    const matchStatus = filters.status === 'All' || l.status === filters.status;
    const matchSource = filters.source === 'All' || l.source === filters.source;
    const matchOwner  = filters.owner  === 'All' || l.owner  === filters.owner;
    const matchScore  = l.score >= filters.scoreMin && l.score <= filters.scoreMax;
    const matchDateFrom = !filters.dateFrom || l.date >= filters.dateFrom;
    const matchDateTo   = !filters.dateTo   || l.date <= filters.dateTo;
    return matchQ && matchStage && matchStatus && matchSource && matchOwner && matchScore && matchDateFrom && matchDateTo;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page-1)*pageSize, page*pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSave = (form) => {
    if (form.id && leads.find(l => l.id === form.id)) {
      setLeads(prev => prev.map(l => l.id===form.id ? form : l));
      addToast('Lead updated successfully', 'success');
    } else {
      setLeads(prev => [form, ...prev]);
      addToast('Lead added successfully', 'success');
    }
    setShowForm(false);
    setEditLead(null);
  };

  const handleDelete = () => {
    setLeads(prev => prev.filter(l => l.id !== deleteLead.id));
    addToast(`"${deleteLead.name}" deleted`, 'error');
    setDeleteLead(null);
  };

  const handleBulkDelete = () => {
    setLeads(prev => prev.filter(l => !selected.has(l.id)));
    addToast(`${selected.size} leads deleted`, 'error');
    setSelected(new Set());
  };

  const handleStatusChange = (id, status) => {
    setLeads(prev => prev.map(l => l.id===id ? { ...l, status } : l));
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(l => l.id)));
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ArrowUpDown size={12} style={{ opacity:0.3 }} />;
    return sortDir==='asc' ? <ChevronUp size={12} color="#2563eb" /> : <ChevronDown size={12} color="#2563eb" />;
  };

  const thStyle = (k) => ({
    padding:'11px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text-muted)',
    letterSpacing:'0.06em', whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
    background:'var(--bg-darker)', borderBottom:'1px solid var(--card-border)',
  });

  const activeFiltersCount = [
    filters.status!=='All', filters.source!=='All', filters.owner!=='All',
    filters.scoreMin>0, filters.scoreMax<100, !!filters.dateFrom, !!filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div style={{ padding:'28px', minHeight:'100%', background:'var(--bg-page)' }}>
      <Toast toasts={toasts} />

      {/* ── Page Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:14 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', marginBottom:4 }}>Leads</h1>
          <p style={{ fontSize:13, color:'var(--text-muted)' }}>{filtered.length} leads · {leads.filter(l=>l.status==='Converted').length} converted</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            <Upload size={14} /> Import
          </button>
          <button onClick={() => { addToast('Exporting leads...', 'info'); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            <Download size={14} /> Export
          </button>
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.06)', color:'#ef4444', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <Trash2 size={14} /> Delete ({selected.size})
            </button>
          )}
          <button onClick={() => { setEditLead(null); setShowForm(true); }}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
            <Plus size={15} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── KPI Stage Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {KPI_STAGES.map((k, i) => {
          const m = STAGE_META[k.stage];
          const pct = Math.round(((k.count - k.prev) / k.prev) * 100);
          const up = pct >= 0;
          const Icon = k.icon;
          return (
            <motion.div key={k.stage}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
              whileHover={{ y:-3, boxShadow:'0 16px 40px rgba(0,0,0,0.1)' }}
              onClick={() => { setStageFilter(stageFilter===k.stage?'All':k.stage); setPage(1); }}
              style={{ background:'var(--card-bg)', border:`2px solid ${stageFilter===k.stage?m.color:'var(--card-border)'}`, borderRadius:16, padding:'18px', cursor:'pointer', transition:'all 0.2s', boxShadow:'var(--card-shadow)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.gradient, opacity:0.08, filter:'blur(20px)', pointerEvents:'none' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:k.gradient, display:'grid', placeItems:'center', boxShadow:`0 4px 12px ${m.color}40` }}>
                  <Icon size={16} color="white" />
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:up?'#10b981':'#ef4444', background:up?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', padding:'3px 8px', borderRadius:99, display:'flex', alignItems:'center', gap:3 }}>
                  {up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{up?'+':''}{pct}%
                </span>
              </div>
              <p style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-1px', lineHeight:1 }}>{leads.filter(l=>l.status===k.stage).length}</p>
              <p style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginTop:4 }}>{k.stage}</p>
              <div style={{ height:4, background:'var(--card-border)', borderRadius:99, overflow:'hidden', marginTop:10 }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${(leads.filter(l=>l.status===k.stage).length/leads.length)*100}%` }}
                  transition={{ delay:0.3+i*0.06, duration:0.6 }}
                  style={{ height:'100%', background:k.gradient, borderRadius:99 }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, padding:'14px 18px', marginBottom:16, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', boxShadow:'var(--card-shadow)' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
          <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search leads, companies, emails..."
            style={{ width:'100%', paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:10, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-primary)', fontSize:13, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
            onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor='var(--card-border)'} />
          {search && <button onClick={()=>setSearch('')} style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'grid', placeItems:'center' }}><X size={12}/></button>}
        </div>

        {/* Stage quick filter */}
        <div style={{ display:'flex', gap:4 }}>
          {['All', ...STAGES].map(s => {
            const m = STAGE_META[s];
            return (
              <button key={s} onClick={()=>{ setStageFilter(s); setPage(1); }}
                style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${stageFilter===s?(m?.color||'#2563eb'):'var(--card-border)'}`, background:stageFilter===s?(m?.bg||'rgba(37,99,235,0.1)'):'transparent', color:stageFilter===s?(m?.color||'#2563eb'):'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                {s}
              </button>
            );
          })}
        </div>

        <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
          {/* Filter button */}
          <button onClick={()=>setShowFilter(true)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:`1.5px solid ${activeFiltersCount>0?'#2563eb':'var(--card-border)'}`, background:activeFiltersCount>0?'rgba(37,99,235,0.08)':'var(--bg-darker)', color:activeFiltersCount>0?'#2563eb':'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
            <Filter size={13} /> Filters {activeFiltersCount>0&&<span style={{ background:'#2563eb', color:'white', borderRadius:99, fontSize:10, fontWeight:800, padding:'1px 6px' }}>{activeFiltersCount}</span>}
          </button>

          {/* View toggle */}
          <div style={{ display:'flex', background:'var(--bg-darker)', borderRadius:10, padding:3, gap:2 }}>
            {[{ id:'table', icon:LayoutList }, { id:'kanban', icon:Kanban }].map(({ id, icon:Icon }) => (
              <button key={id} onClick={()=>setView(id)}
                style={{ width:32, height:32, borderRadius:8, border:'none', background:view===id?'var(--card-bg)':'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:view===id?'#2563eb':'var(--text-muted)', boxShadow:view===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.2s' }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Kanban View ── */}
      {view === 'kanban' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <KanbanView leads={filtered} onEdit={l=>{ setEditLead(l); setShowForm(true); }} onDelete={setDeleteLead} onStatusChange={handleStatusChange} toast={addToast} />
        </motion.div>
      )}

      {/* ── Table View ── */}
      {view === 'table' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, boxShadow:'var(--card-shadow)', overflow:'hidden' }}>

          {/* Empty state */}
          {!loading && sorted.length === 0 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 32px', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:20, background:'var(--bg-darker)', border:'1px solid var(--card-border)', display:'grid', placeItems:'center', marginBottom:16 }}>
                <Users size={28} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', marginBottom:6 }}>No leads found</h3>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20, maxWidth:280, lineHeight:1.6 }}>
                {search || activeFiltersCount > 0 ? 'Try adjusting your search or filters.' : 'Get started by adding your first lead.'}
              </p>
              <button onClick={()=>{ setEditLead(null); setShowForm(true); }}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
                <Plus size={15} /> Add Your First Lead
              </button>
            </div>
          )}

          {(loading || sorted.length > 0) && (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle(), width:40 }}>
                      <input type="checkbox" checked={paged.length>0&&selected.size===paged.length} onChange={toggleAll} style={{ cursor:'pointer', accentColor:'#2563eb' }} />
                    </th>
                    {[
                      { label:'Lead Name', key:'name' },
                      { label:'Company',   key:'company' },
                      { label:'Contact',   key:'email' },
                      { label:'Source',    key:'source' },
                      { label:'Status',    key:'status' },
                      { label:'Score',     key:'score' },
                      { label:'Assigned',  key:'owner' },
                      { label:'Date',      key:'date' },
                      { label:'Actions',   key:null },
                    ].map(({ label, key }) => (
                      <th key={label} onClick={()=>key&&handleSort(key)} style={{ ...thStyle(key), cursor:key?'pointer':'default' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          {label} {key && <SortIcon k={key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && Array.from({length:6}).map((_,i)=><SkeletonRow key={i}/>)}
                  {!loading && paged.map((lead, i) => {
                    const isHovered = hoveredRow === lead.id;
                    const isSelected = selected.has(lead.id);
                    return (
                      <tr key={lead.id}
                        onMouseEnter={()=>setHoveredRow(lead.id)}
                        onMouseLeave={()=>setHoveredRow(null)}
                        style={{ borderBottom:'1px solid var(--card-border)', background: isSelected?'rgba(37,99,235,0.04)':isHovered?'rgba(37,99,235,0.02)':i%2===0?'transparent':'var(--bg-darker)', transition:'background 0.12s' }}>

                        {/* Checkbox */}
                        <td style={{ padding:'12px' }}>
                          <input type="checkbox" checked={isSelected} onChange={()=>toggleSelect(lead.id)} style={{ cursor:'pointer', accentColor:'#2563eb' }} />
                        </td>

                        {/* Lead Name */}
                        <td style={{ padding:'12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <Avatar name={lead.name} size={34} />
                            <div>
                              <p style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', whiteSpace:'nowrap' }}>{lead.name}</p>
                              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>#{lead.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td style={{ padding:'12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <Building2 size={13} color="var(--text-muted)" />
                            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{lead.company}</span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td style={{ padding:'12px' }}>
                          <a href={`mailto:${lead.email}`} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#2563eb', textDecoration:'none', marginBottom:3 }}
                            onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                            onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                            <Mail size={11} /> {lead.email}
                          </a>
                          <a href={`tel:${lead.phone}`} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}
                            onMouseEnter={e=>e.currentTarget.style.color='#2563eb'}
                            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                            <Phone size={11} /> {lead.phone}
                          </a>
                        </td>

                        {/* Source */}
                        <td style={{ padding:'12px' }}>
                          <span style={{ fontSize:11, fontWeight:700, color:'var(--text-secondary)', background:'var(--bg-darker)', padding:'3px 9px', borderRadius:6, whiteSpace:'nowrap' }}>{lead.source}</span>
                        </td>

                        {/* Status */}
                        <td style={{ padding:'12px' }}><StatusBadge status={lead.status} /></td>

                        {/* Score */}
                        <td style={{ padding:'12px', minWidth:120 }}><ScoreBadge score={lead.score} /></td>

                        {/* Assigned */}
                        <td style={{ padding:'12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                            <Avatar name={lead.owner} size={24} />
                            <span style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{lead.owner.split(' ')[0]}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ padding:'12px', fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{lead.date}</td>

                        {/* Actions */}
                        <td style={{ padding:'12px' }}>
                          <div style={{ display:'flex', gap:4, opacity: isHovered?1:0.3, transition:'opacity 0.15s' }}>
                            {[
                              { icon:Eye,   color:'#6366f1', title:'View',   action:()=>addToast(`Viewing ${lead.name}`, 'info') },
                              { icon:Edit2, color:'#f59e0b', title:'Edit',   action:()=>{ setEditLead(lead); setShowForm(true); } },
                              { icon:Phone, color:'#10b981', title:'Call',   action:()=>addToast(`Calling ${lead.phone}`, 'info') },
                              { icon:Mail,  color:'#3b82f6', title:'Email',  action:()=>addToast(`Emailing ${lead.email}`, 'info') },
                              { icon:Trash2,color:'#ef4444', title:'Delete', action:()=>setDeleteLead(lead) },
                            ].map(({ icon:Ic, color, title, action }) => (
                              <button key={title} onClick={action} title={title}
                                style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer', transition:'all 0.15s' }}
                                onMouseOver={e=>{ e.currentTarget.style.background=color+'18'; e.currentTarget.style.borderColor=color+'44'; }}
                                onMouseOut={e=>{ e.currentTarget.style.background='var(--bg-darker)'; e.currentTarget.style.borderColor='var(--card-border)'; }}>
                                <Ic size={12} color={color} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && sorted.length > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', borderTop:'1px solid var(--card-border)', flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>
                  Showing <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{Math.min((page-1)*pageSize+1, sorted.length)}–{Math.min(page*pageSize, sorted.length)}</span> of <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{sorted.length}</span>
                </p>
                <select value={pageSize} onChange={e=>{ setPageSize(+e.target.value); setPage(1); }}
                  style={{ padding:'4px 8px', borderRadius:7, border:'1px solid var(--card-border)', background:'var(--bg-darker)', color:'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer', outline:'none' }}>
                  {[5,10,20,50].map(n=><option key={n} value={n}>{n}/page</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:page===1?'not-allowed':'pointer', opacity:page===1?0.4:1 }}>
                  <ChevronLeft size={13} color="var(--text-secondary)" />
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(n=>n===1||n===totalPages||Math.abs(n-page)<=1).reduce((acc,n,idx,arr)=>{ if(idx>0&&n-arr[idx-1]>1)acc.push('…'); acc.push(n); return acc; },[]).map((n,i)=>
                  n==='…' ? <span key={`e${i}`} style={{ width:30, textAlign:'center', fontSize:13, color:'var(--text-muted)', lineHeight:'30px' }}>…</span> : (
                    <button key={n} onClick={()=>setPage(n)}
                      style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:page===n?'#2563eb':'var(--bg-darker)', color:page===n?'white':'var(--text-primary)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                      {n}
                    </button>
                  )
                )}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?0.4:1 }}>
                  <ChevronRight size={13} color="var(--text-secondary)" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Modals & Drawers ── */}
      <AnimatePresence>
        {showForm && <LeadFormModal lead={editLead} onSave={handleSave} onClose={()=>{ setShowForm(false); setEditLead(null); }} />}
        {deleteLead && <ConfirmModal title={`Delete "${deleteLead.name}"?`} message="This action is permanent and cannot be undone." onConfirm={handleDelete} onCancel={()=>setDeleteLead(null)} />}
        {showFilter && <FilterDrawer filters={filters} onChange={setFilters} onApply={f=>{ setFilters(f); setPage(1); }} onReset={()=>{ setFilters({ status:'All', source:'All', owner:'All', scoreMin:0, scoreMax:100, dateFrom:'', dateTo:'' }); setPage(1); }} onClose={()=>setShowFilter(false)} />}
      </AnimatePresence>

      {/* Responsive card view on mobile */}
      <style>{`
        @media (max-width: 768px) {
          table { display: none !important; }
        }
      `}</style>
    </div>
  );
}
