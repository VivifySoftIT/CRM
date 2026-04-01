import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Trophy, Plus, X, Check, Edit2, Trash2,
  Search, Filter, ChevronDown, Medal, DollarSign,
  UserCheck, Briefcase, AlertTriangle, RefreshCw,
  BarChart2, Crown, TrendingUp, Users, Calendar,
  ChevronRight, ArrowUpRight
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_USERS = ['John Sales', 'Sarah Doe', 'Mike Ross', 'Emily Clark'];
const ALL_TEAMS = ['Sales Team A', 'Sales Team B', 'Enterprise Team'];
const TARGET_TYPES = [
  { id: 'revenue',         label: 'Revenue Target',   icon: DollarSign, unit: '₹', color: '#2563eb', bg: 'rgba(37,99,235,0.08)'   },
  { id: 'deals_closed',    label: 'Deals Closed',     icon: Briefcase,  unit: '#', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
  { id: 'leads_converted', label: 'Leads Converted',  icon: UserCheck,  unit: '#', color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
];
const PERIODS = ['Monthly', 'Quarterly'];
const TEAM_MAP = {
  'Sales Team A':    ['John Sales', 'Sarah Doe'],
  'Sales Team B':    ['Mike Ross', 'Emily Clark'],
  'Enterprise Team': ['John Sales', 'Mike Ross'],
};
const AVATAR_COLORS = ['#2563eb','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899'];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_TARGETS = [
  { id:'t1', assigneeType:'user', assignee:'John Sales',     type:'revenue',         period:'Monthly',   targetValue:500000,  startDate:'2026-03-01', endDate:'2026-03-31' },
  { id:'t2', assigneeType:'user', assignee:'Sarah Doe',      type:'revenue',         period:'Monthly',   targetValue:400000,  startDate:'2026-03-01', endDate:'2026-03-31' },
  { id:'t3', assigneeType:'user', assignee:'Mike Ross',      type:'deals_closed',    period:'Monthly',   targetValue:8,       startDate:'2026-03-01', endDate:'2026-03-31' },
  { id:'t4', assigneeType:'user', assignee:'Emily Clark',    type:'leads_converted', period:'Monthly',   targetValue:15,      startDate:'2026-03-01', endDate:'2026-03-31' },
  { id:'t5', assigneeType:'team', assignee:'Sales Team A',   type:'revenue',         period:'Quarterly', targetValue:2000000, startDate:'2026-01-01', endDate:'2026-03-31' },
  { id:'t6', assigneeType:'team', assignee:'Enterprise Team',type:'deals_closed',    period:'Quarterly', targetValue:20,      startDate:'2026-01-01', endDate:'2026-03-31' },
];
const SEED_DEALS = [
  { id:1,  amount:150000, stage:'converted', owner:'John Sales',  closeDate:'2026-03-10' },
  { id:2,  amount:80000,  stage:'converted', owner:'Sarah Doe',   closeDate:'2026-03-12' },
  { id:3,  amount:35000,  stage:'converted', owner:'Mike Ross',   closeDate:'2026-03-08' },
  { id:4,  amount:220000, stage:'proposal',  owner:'John Sales',  closeDate:'2026-03-20' },
  { id:5,  amount:65000,  stage:'converted', owner:'Sarah Doe',   closeDate:'2026-03-15' },
  { id:6,  amount:95000,  stage:'converted', owner:'Mike Ross',   closeDate:'2026-03-18' },
  { id:7,  amount:180000, stage:'converted', owner:'John Sales',  closeDate:'2026-03-22' },
  { id:8,  amount:42000,  stage:'new',       owner:'Sarah Doe',   closeDate:'2026-03-25' },
  { id:9,  amount:130000, stage:'converted', owner:'Mike Ross',   closeDate:'2026-03-05' },
  { id:10, amount:58000,  stage:'converted', owner:'John Sales',  closeDate:'2026-03-28' },
];
const SEED_LEADS = [
  { id:1,  status:'Converted', assigned:'John Sales',  date:'2026-03-10' },
  { id:2,  status:'Converted', assigned:'Sarah Doe',   date:'2026-03-12' },
  { id:3,  status:'Converted', assigned:'Mike Ross',   date:'2026-03-08' },
  { id:4,  status:'New',       assigned:'John Sales',  date:'2026-03-20' },
  { id:5,  status:'Converted', assigned:'Emily Clark', date:'2026-03-15' },
  { id:6,  status:'Converted', assigned:'Emily Clark', date:'2026-03-18' },
  { id:7,  status:'Converted', assigned:'Sarah Doe',   date:'2026-03-22' },
  { id:8,  status:'Converted', assigned:'Emily Clark', date:'2026-03-25' },
  { id:9,  status:'Converted', assigned:'Mike Ross',   date:'2026-03-05' },
  { id:10, status:'Converted', assigned:'John Sales',  date:'2026-03-28' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt    = v => '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtVal = (v, type) => type === 'revenue' ? fmt(v) : Number(v).toLocaleString();

function progressColor(pct) {
  if (pct >= 75) return '#10b981';
  if (pct >= 40) return '#f59e0b';
  return '#ef4444';
}
function statusMeta(pct) {
  if (pct >= 100) return { label:'Completed', color:'#10b981', bg:'rgba(16,185,129,0.1)',  dot:'#10b981' };
  if (pct >= 40)  return { label:'On Track',  color:'#2563eb', bg:'rgba(37,99,235,0.1)',   dot:'#2563eb' };
  return               { label:'At Risk',   color:'#ef4444', bg:'rgba(239,68,68,0.1)',   dot:'#ef4444' };
}
function inRange(d, s, e) { return d && d >= s && d <= e; }

function computeAchieved(t, deals, leads) {
  const match = owner => t.assigneeType === 'user'
    ? owner === t.assignee
    : (TEAM_MAP[t.assignee] || []).includes(owner);

  if (t.type === 'revenue')
    return deals.filter(d => d.stage === 'converted' && match(d.owner) && inRange(d.closeDate, t.startDate, t.endDate))
                .reduce((s, d) => s + Number(d.amount || 0), 0);
  if (t.type === 'deals_closed')
    return deals.filter(d => d.stage === 'converted' && match(d.owner) && inRange(d.closeDate, t.startDate, t.endDate)).length;
  if (t.type === 'leads_converted')
    return leads.filter(l => l.status === 'Converted' && match(l.assigned) && inRange(l.date, t.startDate, t.endDate)).length;
  return 0;
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, height = 7, showLabel = true }) {
  const color  = progressColor(pct);
  const capped = Math.min(pct, 100);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ flex:1, height, borderRadius:99, background:'var(--card-border)', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${capped}%` }} transition={{ duration:0.8, ease:'easeOut' }}
          style={{ height:'100%', background:`linear-gradient(90deg, ${color}cc, ${color})`, borderRadius:99 }} />
      </div>
      {showLabel && <span style={{ fontSize:11, fontWeight:900, color, minWidth:32, textAlign:'right' }}>{Math.round(pct)}%</span>}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 36 }) {
  const color = avatarColor(name);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:`${color}18`, border:`1.5px solid ${color}30`, display:'grid', placeItems:'center', flexShrink:0 }}>
      <span style={{ fontSize:size*0.35, fontWeight:900, color }}>{initials}</span>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, color, sub, trend, delay = 0 }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.4 }}
      whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(0,0,0,0.1)' }}
      style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:18, padding:'22px 24px', position:'relative', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', cursor:'default' }}>
      {/* Top accent bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${color},${color}88)`, borderRadius:'18px 18px 0 0' }} />
      {/* Subtle bg glow */}
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}08`, pointerEvents:'none' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <span style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</span>
        <div style={{ width:38, height:38, borderRadius:11, background:`${color}12`, border:`1px solid ${color}20`, display:'grid', placeItems:'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontSize:30, fontWeight:900, color, letterSpacing:'-0.8px', lineHeight:1, marginBottom:6 }}>{value}</div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {sub && <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{sub}</span>}
        {trend && (
          <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, fontWeight:800, color:'#10b981' }}>
            <ArrowUpRight size={12} />{trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function AddTargetModal({ onClose, onSave, editTarget }) {
  const [form, setForm] = useState(editTarget || {
    assigneeType:'user', assignee:ALL_USERS[0], type:'revenue',
    period:'Monthly', targetValue:'', startDate:'2026-03-01', endDate:'2026-03-31',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const assigneeOptions = form.assigneeType === 'user' ? ALL_USERS : ALL_TEAMS;
  const valid = form.assignee && form.type && Number(form.targetValue) > 0;

  const handlePeriod = p => {
    set('period', p);
    set('startDate', p === 'Monthly' ? '2026-03-01' : '2026-01-01');
    set('endDate', '2026-03-31');
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300, backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{ scale:0.92, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:24 }}
        transition={{ type:'spring', damping:26, stiffness:260 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:22, width:'100%', maxWidth:500, boxShadow:'0 32px 80px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)', overflow:'hidden' }}>

        {/* Modal Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg,rgba(37,99,235,0.05),rgba(139,92,246,0.03))' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', display:'grid', placeItems:'center' }}>
              <Target size={19} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ margin:0, fontSize:16, fontWeight:900, color:'var(--text-primary)' }}>{editTarget ? 'Edit Target' : 'Create New Target'}</h2>
              <p style={{ margin:0, fontSize:12, color:'var(--text-muted)' }}>Set performance goals for users or teams</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}><X size={16} /></button>
        </div>

        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'70vh', overflowY:'auto' }}>

          {/* Assign to toggle */}
          <div>
            <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Assign To</label>
            <div style={{ display:'flex', background:'var(--input-bg)', border:'1px solid var(--card-border)', borderRadius:11, padding:3, gap:3 }}>
              {[['user','👤 Individual'],['team','👥 Team']].map(([t,lbl]) => (
                <button key={t} onClick={() => { set('assigneeType',t); set('assignee', t==='user'?ALL_USERS[0]:ALL_TEAMS[0]); }}
                  style={{ flex:1, padding:'9px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.18s',
                    background: form.assigneeType===t ? '#2563eb' : 'transparent',
                    color: form.assigneeType===t ? '#fff' : 'var(--text-muted)',
                    boxShadow: form.assigneeType===t ? '0 2px 8px rgba(37,99,235,0.3)' : 'none' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
              {form.assigneeType==='user' ? 'Select User' : 'Select Team'}
            </label>
            <select value={form.assignee} onChange={e => set('assignee', e.target.value)}
              style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:14, outline:'none' }}>
              {assigneeOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Target type cards */}
          <div>
            <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Target Type</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {TARGET_TYPES.map(tt => {
                const Icon = tt.icon;
                const active = form.type === tt.id;
                return (
                  <button key={tt.id} onClick={() => set('type', tt.id)}
                    style={{ padding:'14px 8px', borderRadius:12, border:`2px solid ${active ? tt.color : 'var(--card-border)'}`, background: active ? tt.bg : 'var(--input-bg)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:7, transition:'all 0.18s', boxShadow: active ? `0 4px 12px ${tt.color}25` : 'none' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background: active ? `${tt.color}20` : 'var(--card-border)', display:'grid', placeItems:'center' }}>
                      <Icon size={16} color={active ? tt.color : 'var(--text-muted)'} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:800, color: active ? tt.color : 'var(--text-muted)', textAlign:'center', lineHeight:1.4, letterSpacing:'0.02em' }}>{tt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Period + Value */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Period</label>
              <select value={form.period} onChange={e => handlePeriod(e.target.value)}
                style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:14, outline:'none' }}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>
                Value {form.type==='revenue' ? '(₹)' : '(count)'}
              </label>
              <input type="number" min="1" value={form.targetValue} onChange={e => set('targetValue', e.target.value)}
                placeholder={form.type==='revenue' ? '500000' : '10'}
                style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['startDate','Start Date'],['endDate','End Date']].map(([k,lbl]) => (
              <div key={k}>
                <label style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>{lbl}</label>
                <input type="date" value={form[k]} onChange={e => set(k, e.target.value)}
                  style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box', outline:'none' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--card-border)', display:'flex', gap:10, background:'var(--bg-page)' }}>
          <button onClick={onClose}
            style={{ flex:1, padding:'11px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-secondary)', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            Cancel
          </button>
          <button onClick={() => valid && onSave(form)} disabled={!valid}
            style={{ flex:2, padding:'11px', borderRadius:11, border:'none', background: valid ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : 'var(--card-border)', color: valid ? '#fff' : 'var(--text-muted)', fontSize:14, fontWeight:800, cursor: valid ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: valid ? '0 4px 16px rgba(37,99,235,0.35)' : 'none', transition:'all 0.2s' }}>
            <Check size={15} /> {editTarget ? 'Save Changes' : 'Create Target'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function DetailDrawer({ target, onClose }) {
  if (!target) return null;
  const pct       = target.targetValue > 0 ? Math.min((target.achieved / target.targetValue) * 100, 100) : 0;
  const status    = statusMeta(pct);
  const tt        = TARGET_TYPES.find(t => t.id === target.type);
  const Icon      = tt?.icon || Target;
  const remaining = Math.max(target.targetValue - target.achieved, 0);
  const color     = progressColor(pct);

  return (
    <>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:190, backdropFilter:'blur(4px)' }} />
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
        transition={{ type:'spring', damping:28, stiffness:220 }}
        style={{ position:'fixed', top:0, right:0, bottom:0, width:400, background:'var(--card-bg)', borderLeft:'1px solid var(--card-border)', zIndex:191, display:'flex', flexDirection:'column', boxShadow:'-16px 0 48px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:`linear-gradient(135deg,${tt?.color || '#2563eb'}08,transparent)` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <Avatar name={target.assignee} size={42} />
            <div>
              <h3 style={{ margin:0, fontSize:15, fontWeight:900, color:'var(--text-primary)' }}>{target.assignee}</h3>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                <div style={{ width:20, height:20, borderRadius:6, background:`${tt?.color}15`, display:'grid', placeItems:'center' }}>
                  <Icon size={11} color={tt?.color} />
                </div>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{tt?.label} · {target.period}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}><X size={15} /></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'22px' }}>

          {/* Big completion display */}
          <div style={{ background:`linear-gradient(135deg,${color}10,${color}05)`, border:`1px solid ${color}25`, borderRadius:18, padding:'28px 24px', textAlign:'center', marginBottom:18 }}>
            <div style={{ fontSize:56, fontWeight:900, color, lineHeight:1, letterSpacing:'-2px' }}>{Math.round(pct)}<span style={{ fontSize:28 }}>%</span></div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:6, fontWeight:600 }}>Overall Completion</div>
            <div style={{ margin:'16px 0 12px' }}><ProgressBar pct={pct} height={10} /></div>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:800, background:status.bg, color:status.color }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:status.dot, display:'inline-block' }} />
              {status.label}
            </span>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {[
              { label:'Target',    value:fmtVal(target.targetValue, target.type), color:'#2563eb' },
              { label:'Achieved',  value:fmtVal(target.achieved, target.type),    color:'#10b981' },
              { label:'Remaining', value:fmtVal(remaining, target.type),          color:'#f59e0b' },
              { label:'Period',    value:target.period,                           color:'#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background:'var(--input-bg)', borderRadius:12, padding:'14px', border:'1px solid var(--card-border)' }}>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{s.label}</div>
                <div style={{ fontSize:17, fontWeight:900, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Date range */}
          <div style={{ background:'var(--input-bg)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--card-border)', display:'flex', alignItems:'center', gap:10 }}>
            <Calendar size={15} color="var(--text-muted)" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Date Range</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{target.startDate} → {target.endDate}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Goals() {
  const deals = useMemo(() => { try { const s = localStorage.getItem('crm_deals'); return s ? JSON.parse(s) : SEED_DEALS; } catch { return SEED_DEALS; } }, []);
  const leads = useMemo(() => { try { const s = localStorage.getItem('crm_leads'); return s ? JSON.parse(s) : SEED_LEADS; } catch { return SEED_LEADS; } }, []);

  const [targets, setTargets] = useState(() => {
    try { const s = localStorage.getItem('crm_goals'); return s ? JSON.parse(s) : SEED_TARGETS; } catch { return SEED_TARGETS; }
  });
  useEffect(() => { localStorage.setItem('crm_goals', JSON.stringify(targets)); }, [targets]);

  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterType, setFilterType]     = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [search, setSearch]             = useState('');
  const [showFilters, setShowFilters]   = useState(false);
  const [toast, setToast]               = useState(null);
  const [activeTab, setActiveTab]       = useState('all'); // all | user | team

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const enriched = useMemo(() =>
    targets.map(t => {
      const achieved = computeAchieved(t, deals, leads);
      const pct = t.targetValue > 0 ? (achieved / t.targetValue) * 100 : 0;
      return { ...t, achieved, pct };
    }), [targets, deals, leads]);

  const filtered = useMemo(() =>
    enriched.filter(t =>
      (activeTab === 'all' || t.assigneeType === activeTab) &&
      (!filterPeriod   || t.period === filterPeriod) &&
      (!filterType     || t.type === filterType) &&
      (!filterAssignee || t.assigneeType === filterAssignee) &&
      (!search || t.assignee.toLowerCase().includes(search.toLowerCase()))
    ), [enriched, activeTab, filterPeriod, filterType, filterAssignee, search]);

  const kpis = useMemo(() => ({
    total:      filtered.length,
    completed:  filtered.filter(t => t.pct >= 100).length,
    atRisk:     filtered.filter(t => t.pct < 40).length,
    avgPct:     filtered.length ? filtered.reduce((s,t) => s+t.pct, 0) / filtered.length : 0,
  }), [filtered]);

  const leaderboard = useMemo(() => {
    const map = {};
    enriched.filter(t => t.assigneeType === 'user').forEach(t => {
      if (!map[t.assignee]) map[t.assignee] = { name:t.assignee, total:0, count:0 };
      map[t.assignee].total += t.pct; map[t.assignee].count++;
    });
    return Object.values(map).map(u => ({ ...u, avg: u.count ? u.total/u.count : 0 }))
      .sort((a,b) => b.avg - a.avg).slice(0,5);
  }, [enriched]);

  const handleSave = form => {
    const p = { ...form, targetValue: Number(form.targetValue) };
    if (editTarget) setTargets(prev => prev.map(t => t.id === editTarget.id ? { ...t, ...p } : t));
    else            setTargets(prev => [{ ...p, id:`t-${Date.now()}` }, ...prev]);
    showToast(editTarget ? 'Target updated' : 'Target created');
    setModalOpen(false); setEditTarget(null);
  };
  const handleDelete = id => { setTargets(prev => prev.filter(t => t.id !== id)); showToast('Target deleted'); };
  const openEdit = (t, e) => { e.stopPropagation(); setEditTarget(t); setModalOpen(true); };

  const rankBadge = i => {
    const styles = [
      { bg:'linear-gradient(135deg,#f59e0b,#fbbf24)', icon:<Crown size={12} color="#fff" /> },
      { bg:'linear-gradient(135deg,#94a3b8,#cbd5e1)', icon:<Medal size={12} color="#fff" /> },
      { bg:'linear-gradient(135deg,#cd7c2f,#d97706)', icon:<Medal size={12} color="#fff" /> },
    ];
    const s = styles[i];
    return s
      ? <div style={{ width:22, height:22, borderRadius:7, background:s.bg, display:'grid', placeItems:'center', flexShrink:0 }}>{s.icon}</div>
      : <div style={{ width:22, height:22, borderRadius:7, background:'var(--input-bg)', border:'1px solid var(--card-border)', display:'grid', placeItems:'center', flexShrink:0, fontSize:10, fontWeight:900, color:'var(--text-muted)' }}>#{i+1}</div>;
  };

  const hasFilters = filterPeriod || filterType || filterAssignee || search;
  const detailEnriched = detailTarget ? enriched.find(t => t.id === detailTarget.id) : null;

  const card = { background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:18, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ minHeight:'100%', background:'var(--bg-page)', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ padding:'28px 32px 40px', maxWidth:1600, margin:'0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:14 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', display:'grid', placeItems:'center' }}>
                <Target size={19} color="#2563eb" />
              </div>
              <h1 style={{ fontSize:26, fontWeight:900, color:'var(--text-primary)', margin:0, letterSpacing:'-0.6px' }}>Goals & Targets</h1>
            </div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, paddingLeft:48 }}>Track individual and team performance against set targets</p>
          </div>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px rgba(37,99,235,0.35)', whiteSpace:'nowrap' }}>
            <Plus size={16} /> Create Target
          </motion.button>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:16, marginBottom:28 }}>
          <KpiCard label="Total Targets"  value={kpis.total}                      icon={Target}        color="#2563eb" sub={`${filtered.length} active`}         delay={0}    />
          <KpiCard label="Completed"      value={kpis.completed}                  icon={Trophy}        color="#10b981" sub="Achieved 100%+"                       delay={0.07} />
          <KpiCard label="At Risk"        value={kpis.atRisk}                     icon={AlertTriangle} color="#ef4444" sub="Below 40% completion"                 delay={0.14} />
          <KpiCard label="Avg Completion" value={`${Math.round(kpis.avgPct)}%`}   icon={BarChart2}     color="#8b5cf6" sub="Across all targets"                   delay={0.21} />
        </div>

        {/* ── Main Content Grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' }}>

          {/* ── Left: Targets Panel ── */}
          <div style={{ ...card, overflow:'hidden' }}>

            {/* Panel Header */}
            <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', background:'var(--input-bg)', border:'1px solid var(--card-border)', borderRadius:10, padding:3, gap:2 }}>
                {[['all','All'],['user','Individual'],['team','Team']].map(([k,lbl]) => (
                  <button key={k} onClick={() => setActiveTab(k)}
                    style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.18s',
                      background: activeTab===k ? '#2563eb' : 'transparent',
                      color: activeTab===k ? '#fff' : 'var(--text-muted)',
                      boxShadow: activeTab===k ? '0 2px 8px rgba(37,99,235,0.25)' : 'none' }}>
                    {lbl}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ position:'relative' }}>
                  <Search size={13} color="var(--text-muted)" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    style={{ padding:'8px 10px 8px 30px', borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:13, outline:'none', width:160 }} />
                </div>
                <button onClick={() => setShowFilters(v => !v)}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 12px', borderRadius:9, border:'1px solid var(--card-border)', background: showFilters ? 'rgba(37,99,235,0.08)' : 'var(--input-bg)', color: showFilters ? '#2563eb' : 'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  <Filter size={12} /> Filters
                  {hasFilters && <span style={{ width:6, height:6, borderRadius:'50%', background:'#2563eb', display:'inline-block' }} />}
                </button>
                {hasFilters && (
                  <button onClick={() => { setFilterPeriod(''); setFilterType(''); setFilterAssignee(''); setSearch(''); }}
                    style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}>
                    <RefreshCw size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
                  <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', gap:12, flexWrap:'wrap', background:'var(--bg-page)' }}>
                    {[
                      { label:'Period',   value:filterPeriod,   set:setFilterPeriod,   opts:PERIODS },
                      { label:'Type',     value:filterType,     set:setFilterType,     opts:TARGET_TYPES.map(t=>t.id), labels:TARGET_TYPES.reduce((a,t)=>({...a,[t.id]:t.label}),{}) },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:5 }}>{f.label}</label>
                        <select value={f.value} onChange={e => f.set(e.target.value)}
                          style={{ padding:'7px 12px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:12, minWidth:130 }}>
                          <option value="">All</option>
                          {f.opts.map(o => <option key={o} value={o}>{f.labels ? f.labels[o] : o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table */}
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-page)' }}>
                    {['Name & Type','Period','Target','Achieved','Progress','Status',''].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid var(--card-border)', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:'56px', textAlign:'center' }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                        <div style={{ width:52, height:52, borderRadius:16, background:'var(--input-bg)', display:'grid', placeItems:'center' }}><Target size={24} color="var(--text-muted)" /></div>
                        <p style={{ fontSize:14, fontWeight:700, color:'var(--text-muted)', margin:0 }}>No targets found</p>
                        <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Create a target to start tracking performance</p>
                      </div>
                    </td></tr>
                  )}
                  {filtered.map((t, i) => {
                    const tt     = TARGET_TYPES.find(x => x.id === t.type);
                    const Icon   = tt?.icon || Target;
                    const status = statusMeta(t.pct);
                    return (
                      <motion.tr key={t.id}
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                        onClick={() => setDetailTarget(t)}
                        style={{ borderBottom:'1px solid var(--card-border)', cursor:'pointer', transition:'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <Avatar name={t.assignee} size={36} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', lineHeight:1.2 }}>{t.assignee}</div>
                              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                                <div style={{ width:16, height:16, borderRadius:5, background:`${tt?.color}15`, display:'grid', placeItems:'center' }}>
                                  <Icon size={9} color={tt?.color} />
                                </div>
                                <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>
                                  {t.assigneeType === 'team' ? '👥' : '👤'} {tt?.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding:'14px 16px' }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', background:'var(--input-bg)', padding:'4px 10px', borderRadius:7, border:'1px solid var(--card-border)', whiteSpace:'nowrap' }}>
                            {t.period}
                          </span>
                        </td>

                        <td style={{ padding:'14px 16px', fontSize:13, fontWeight:800, color:'var(--text-primary)', whiteSpace:'nowrap' }}>
                          {fmtVal(t.targetValue, t.type)}
                        </td>

                        <td style={{ padding:'14px 16px', fontSize:13, fontWeight:900, color:'#10b981', whiteSpace:'nowrap' }}>
                          {fmtVal(t.achieved, t.type)}
                        </td>

                        <td style={{ padding:'14px 16px', minWidth:160 }}>
                          <ProgressBar pct={t.pct} />
                        </td>

                        <td style={{ padding:'14px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 11px', borderRadius:99, fontSize:11, fontWeight:800, background:status.bg, color:status.color, whiteSpace:'nowrap' }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:status.dot, display:'inline-block' }} />
                            {status.label}
                          </span>
                        </td>

                        <td style={{ padding:'14px 12px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display:'flex', gap:4 }}>
                            <button onClick={e => openEdit(t, e)}
                              style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'transparent', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)', transition:'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background='rgba(37,99,235,0.08)'; e.currentTarget.style.color='#2563eb'; e.currentTarget.style.borderColor='rgba(37,99,235,0.3)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--card-border)'; }}>
                              <Edit2 size={12} />
                            </button>
                            <button onClick={() => handleDelete(t.id)}
                              style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'transparent', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)', transition:'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.color='#ef4444'; e.currentTarget.style.borderColor='rgba(239,68,68,0.3)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--card-border)'; }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            {filtered.length > 0 && (
              <div style={{ padding:'12px 20px', borderTop:'1px solid var(--card-border)', background:'var(--bg-page)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{filtered.length} target{filtered.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>Click a row to view details</span>
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Leaderboard */}
            <div style={{ ...card, padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', display:'grid', placeItems:'center' }}>
                  <Trophy size={16} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ margin:0, fontSize:14, fontWeight:900, color:'var(--text-primary)' }}>Leaderboard</h3>
                  <p style={{ margin:0, fontSize:11, color:'var(--text-muted)' }}>Top performers by avg %</p>
                </div>
              </div>

              {leaderboard.length === 0
                ? <p style={{ fontSize:13, color:'var(--text-muted)', textAlign:'center', padding:'16px 0' }}>No user targets yet</p>
                : leaderboard.map((u, i) => (
                  <motion.div key={u.name} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i < leaderboard.length-1 ? '1px solid var(--card-border)' : 'none' }}>
                    {rankBadge(i)}
                    <Avatar name={u.name} size={32} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:'var(--text-primary)', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</div>
                      <ProgressBar pct={u.avg} height={5} />
                    </div>
                  </motion.div>
                ))
              }
            </div>

            {/* Type breakdown */}
            <div style={{ ...card, padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', display:'grid', placeItems:'center' }}>
                  <BarChart2 size={16} color="#8b5cf6" />
                </div>
                <h3 style={{ margin:0, fontSize:14, fontWeight:900, color:'var(--text-primary)' }}>By Target Type</h3>
              </div>
              {TARGET_TYPES.map((tt, i) => {
                const typeTargets = enriched.filter(t => t.type === tt.id);
                const avg = typeTargets.length ? typeTargets.reduce((s,t)=>s+t.pct,0)/typeTargets.length : 0;
                const Icon = tt.icon;
                return (
                  <div key={tt.id} style={{ marginBottom: i < TARGET_TYPES.length-1 ? 14 : 0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ width:24, height:24, borderRadius:7, background:tt.bg, display:'grid', placeItems:'center' }}>
                          <Icon size={12} color={tt.color} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>{tt.label}</span>
                      </div>
                      <span style={{ fontSize:11, fontWeight:900, color:progressColor(avg) }}>{Math.round(avg)}%</span>
                    </div>
                    <ProgressBar pct={avg} height={5} showLabel={false} />
                  </div>
                );
              })}
            </div>

            {/* Quick stats */}
            <div style={{ ...card, padding:'20px' }}>
              <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:900, color:'var(--text-primary)' }}>Quick Stats</h3>
              {[
                { label:'On Track',  value:filtered.filter(t=>t.pct>=40&&t.pct<100).length, color:'#2563eb' },
                { label:'Completed', value:filtered.filter(t=>t.pct>=100).length,           color:'#10b981' },
                { label:'At Risk',   value:filtered.filter(t=>t.pct<40).length,             color:'#ef4444' },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--card-border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:s.color, display:'inline-block' }} />
                    <span style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize:16, fontWeight:900, color:s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {modalOpen && <AddTargetModal onClose={() => { setModalOpen(false); setEditTarget(null); }} onSave={handleSave} editTarget={editTarget} />}
      </AnimatePresence>
      <AnimatePresence>
        {detailTarget && <DetailDrawer target={detailEnriched} onClose={() => setDetailTarget(null)} />}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:24, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:24, scale:0.95 }}
            style={{ position:'fixed', bottom:28, right:28, zIndex:999, background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#fff', padding:'12px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:10, boxShadow:'0 16px 40px rgba(0,0,0,0.3)', fontSize:13, fontWeight:700, border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width:24, height:24, borderRadius:7, background:'#10b981', display:'grid', placeItems:'center' }}><Check size={13} color="#fff" /></div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
