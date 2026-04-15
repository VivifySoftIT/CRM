import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, DollarSign, CreditCard, ShieldCheck, Plus, TrendingUp,
  TrendingDown, Server, Zap, Database, Activity, AlertTriangle,
  XCircle, CheckCircle, Download, Eye, Edit2, Ban, Search,
  ChevronLeft, ChevronRight, Clock, UserCheck, LogIn, Wifi
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { superAdminApi } from '../../utils/api';

// ─── Animated Counter ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let s = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

// ─── Chart Toggle ─────────────────────────────────────────────────────────────
function ChartToggle({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-darker)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '5px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontSize: '11px', fontWeight: '700', transition: 'all 0.2s',
          background: value === o ? 'var(--card-bg)' : 'transparent',
          color: value === o ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: value === o ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
        }}>{o}</button>
      ))}
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px' }}>
      <p style={{ fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: '700' }}>{p.name}: {prefix}{p.value?.toLocaleString()}</p>)}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, gradient, label, value, prefix = '', suffix = '', trend, trendUp, sub, delay = 0 }) {
  const count = useCountUp(typeof value === 'number' ? value : 0);
  const display = typeof value === 'number' ? `${prefix}${count.toLocaleString()}${suffix}` : value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, boxShadow: '0 24px 56px rgba(0,0,0,0.13)' }}
      style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: '20px', padding: '22px', position: 'relative', overflow: 'hidden',
        cursor: 'default', transition: 'box-shadow 0.3s, transform 0.3s', boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ position: 'absolute', top: -28, right: -28, width: 110, height: 110, borderRadius: '50%', background: gradient, opacity: 0.1, filter: 'blur(28px)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ width: 42, height: 42, borderRadius: '13px', background: gradient, display: 'grid', placeItems: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.15)', flexShrink: 0 }}>
          <Icon size={19} color="white" />
        </div>
        {trend && (
          <span style={{ fontSize: '11px', fontWeight: '700', color: trendUp ? '#10b981' : '#ef4444', background: trendUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 9px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{trend}
          </span>
        )}
      </div>
      <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1.2px', lineHeight: 1 }}>{display}</p>
      <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '5px' }}>{label}</p>
      {sub && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</p>}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const adminLoginData = {
  Daily:   [{ d:'Mon',v:18 },{ d:'Tue',v:24 },{ d:'Wed',v:21 },{ d:'Thu',v:29 },{ d:'Fri',v:32 },{ d:'Sat',v:14 },{ d:'Sun',v:11 }],
  Weekly:  [{ d:'W1',v:98 },{ d:'W2',v:124 },{ d:'W3',v:110 },{ d:'W4',v:138 }],
  Monthly: [{ d:'Jan',v:310 },{ d:'Feb',v:380 },{ d:'Mar',v:420 },{ d:'Apr',v:460 },{ d:'May',v:510 },{ d:'Jun',v:490 }],
};
const revenueData = {
  Daily:   [{ d:'Mon',v:4200 },{ d:'Tue',v:5100 },{ d:'Wed',v:4800 },{ d:'Thu',v:6200 },{ d:'Fri',v:7100 },{ d:'Sat',v:5500 },{ d:'Sun',v:6400 }],
  Weekly:  [{ d:'W1',v:28000 },{ d:'W2',v:34000 },{ d:'W3',v:31000 },{ d:'W4',v:42000 }],
  Monthly: [{ d:'Jan',v:98000 },{ d:'Feb',v:112000 },{ d:'Mar',v:108000 },{ d:'Apr',v:128000 },{ d:'May',v:142000 },{ d:'Jun',v:158000 }],
};
const subSplit = [
  { name:'Enterprise', value:28, color:'#6366f1' },
  { name:'Pro',        value:45, color:'#8b5cf6' },
  { name:'Starter',    value:18, color:'#3b82f6' },
  { name:'Free',       value:9,  color:'#e2e8f0' },
];

const ADMIN_ACTIVITY = [
  { id:1, name:'Sarah Chen',    org:'Nexus Corp',       time:'2m ago',  status:'Online',  action:'Logged in' },
  { id:2, name:'Tom Walker',    org:'Apex Dynamics',    time:'14m ago', status:'Online',  action:'Updated billing' },
  { id:3, name:'Yuki Tanaka',   org:'Pinnacle Systems', time:'38m ago', status:'Online',  action:'Added team member' },
  { id:4, name:'Marcus Reid',   org:'Velocity Labs',    time:'1h ago',  status:'Offline', action:'Exported report' },
  { id:5, name:'Alice Johnson', org:'Meridian Group',   time:'2h ago',  status:'Offline', action:'Changed plan' },
  { id:6, name:'Priya Nair',    org:'Orbit Solutions',  time:'3h ago',  status:'Offline', action:'Logged in' },
];

const ALERTS_DATA = [
  { id:1, type:'danger',  icon: XCircle,       title:'Payment Failed',          sub:'Dune Ventures — $999 overdue',        color:'#ef4444', bg:'rgba(239,68,68,0.06)'  },
  { id:2, type:'warning', icon: Clock,         title:'Subscription Expiring',   sub:'Bloom Digital — expires in 3 days',   color:'#f59e0b', bg:'rgba(245,158,11,0.06)' },
  { id:3, type:'warning', icon: AlertTriangle, title:'Suspicious Login',        sub:'Orbit Solutions — unusual IP',        color:'#f59e0b', bg:'rgba(245,158,11,0.06)' },
  { id:4, type:'danger',  icon: Server,        title:'API Latency Spike',       sub:'Avg 840ms — above threshold',         color:'#ef4444', bg:'rgba(239,68,68,0.06)'  },
];

const ORGS = [
  { id:1, name:'Nexus Corp',       admin:'Sarah Chen',    plan:'Enterprise', status:'Active',    revenue:'$2,450', joined:'Jan 2024' },
  { id:2, name:'Velocity Labs',    admin:'Marcus Reid',   plan:'Pro',        status:'Active',    revenue:'$999',   joined:'Mar 2024' },
  { id:3, name:'Orbit Solutions',  admin:'Priya Nair',    plan:'Pro',        status:'Suspended', revenue:'$999',   joined:'Feb 2024' },
  { id:4, name:'Apex Dynamics',    admin:'Tom Walker',    plan:'Enterprise', status:'Active',    revenue:'$2,450', joined:'Nov 2023' },
  { id:5, name:'Bloom Digital',    admin:'Lena Müller',   plan:'Starter',    status:'Active',    revenue:'$99',    joined:'Apr 2024' },
  { id:6, name:'Pinnacle Systems', admin:'Yuki Tanaka',   plan:'Enterprise', status:'Active',    revenue:'$2,450', joined:'Dec 2023' },
];

const PLAN_STYLE = {
  Enterprise:{ bg:'rgba(99,102,241,0.1)',  color:'#6366f1' },
  Pro:       { bg:'rgba(139,92,246,0.1)',  color:'#8b5cf6' },
  Starter:   { bg:'rgba(59,130,246,0.1)',  color:'#3b82f6' },
  Free:      { bg:'rgba(148,163,184,0.1)', color:'#94a3b8' },
};

// ─── Analytics Section ────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [loginPeriod, setLoginPeriod] = useState('Monthly');
  const [revPeriod,   setRevPeriod]   = useState('Monthly');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '18px', marginBottom: '20px' }}>

      {/* Admin Activity Chart */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Admin Logins</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Admin login activity over time</p>
          </div>
          <ChartToggle options={['Daily','Weekly','Monthly']} value={loginPeriod} onChange={setLoginPeriod} />
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={adminLoginData[loginPeriod]} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="v" name="Logins" stroke="#6366f1" strokeWidth={2.5}
              dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revenue Bar */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Revenue Analytics</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Monthly subscription revenue</p>
          </div>
          <ChartToggle options={['Daily','Weekly','Monthly']} value={revPeriod} onChange={setRevPeriod} />
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={revenueData[revPeriod]} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
            <Tooltip content={<Tip prefix="$" />} />
            <Bar dataKey="v" name="Revenue" fill="#10b981" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Subscription Donut */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>Subscription Split</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>Plan distribution</p>
        <ResponsiveContainer width="100%" height={148}>
          <PieChart>
            <Pie data={subSplit} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
              {subSplit.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={v => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '6px' }}>
          {subSplit.map(s => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: 9, height: 9, borderRadius: '3px', background: s.color }} />
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{s.name}</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-primary)' }}>{s.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── System Health ────────────────────────────────────────────────────────────
function SystemHealthCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)', gridColumn: 'span 3' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>System Health</h3>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '99px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
          All Systems Operational
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { icon: Server,   label:'Server Status', value:'Online',  color:'#10b981', sub:'99.97% uptime' },
          { icon: Zap,      label:'API Speed',      value:'124ms',   color:'#6366f1', sub:'Avg response' },
          { icon: Database, label:'DB Health',      value:'78%',     color:'#f59e0b', sub:'Capacity used', bar: 78 },
          { icon: Wifi,     label:'Error Rate',     value:'0.02%',   color:'#10b981', sub:'Last 24h' },
        ].map(({ icon: Ic, label, value, color, sub, bar }) => (
          <div key={label} style={{ background: 'var(--bg-darker)', borderRadius: '14px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '9px', background: color + '18', display: 'grid', placeItems: 'center' }}>
                <Ic size={14} color={color} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{label}</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>
            {bar !== undefined && (
              <div style={{ height: '4px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden', marginTop: '8px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${bar}%` }} transition={{ delay: 0.6, duration: 0.7 }}
                  style={{ height: '100%', background: color, borderRadius: '99px' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Recent Admin Activity ────────────────────────────────────────────────────
function AdminActivityPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Recent Admin Activity</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Admin logins & actions</p>
        </div>
        <button style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 11px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          View all
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {ADMIN_ACTIVITY.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 10px', borderRadius: '11px', transition: 'background 0.15s', cursor: 'default' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            {/* Avatar */}
            <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{a.name[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</p>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '99px', flexShrink: 0,
                  background: a.status === 'Online' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.12)',
                  color: a.status === 'Online' ? '#10b981' : '#94a3b8' }}>
                  {a.status}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{a.org} · {a.action}</p>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', flexShrink: 0 }}>{a.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Alerts Panel ─────────────────────────────────────────────────────────────
function AlertsPanel() {
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Alerts</h3>
        <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 8px', borderRadius: '99px' }}>
          {alerts.length} active
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {alerts.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '11px', background: a.bg, borderLeft: `3px solid ${a.color}` }}>
            <a.icon size={14} color={a.color} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{a.title}</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sub}</p>
            </div>
            <button onClick={() => setAlerts(prev => prev.filter(x => x.id !== a.id))}
              style={{ width: 22, height: 22, borderRadius: '6px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <XCircle size={11} color="var(--text-muted)" />
            </button>
          </motion.div>
        ))}
        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            <CheckCircle size={22} color="#10b981" style={{ margin: '0 auto 6px', display: 'block' }} />
            <p style={{ fontSize: '12px', fontWeight: '600' }}>All clear</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Org Table ────────────────────────────────────────────────────────────────
function OrgTable({ orgs }) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [page, setPage]       = useState(1);
  const PAGE = 5;

  const filtered = orgs.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.name.toLowerCase().includes(q) || o.admin.toLowerCase().includes(q))
      && (filter === 'All' || o.status === filter);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page-1)*PAGE, page*PAGE);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Organizations</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{filtered.length} registered</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..."
              style={{ paddingLeft: '28px', paddingRight: '10px', paddingTop: '7px', paddingBottom: '7px', borderRadius: '9px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', width: '160px' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
          </div>
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            style={{ padding: '7px 10px', borderRadius: '9px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {['All','Active','Suspended'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
              {['Organization','Admin','Plan','Status','Revenue','Actions'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((org) => (
              <tr key={org.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '9px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{org.name[0]}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{org.name}</p>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Joined {org.joined}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{org.admin}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: PLAN_STYLE[org.plan]?.bg, color: PLAN_STYLE[org.plan]?.color }}>{org.plan}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content',
                    background: org.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: org.status === 'Active' ? '#10b981' : '#ef4444' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: org.status === 'Active' ? '#10b981' : '#ef4444' }} />
                    {org.status}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.revenue}<span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>/mo</span></td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[{ icon: Eye, color: '#6366f1', title: 'View' }, { icon: Edit2, color: '#f59e0b', title: 'Edit' }, { icon: Ban, color: '#ef4444', title: 'Suspend' }].map(({ icon: Ic, color, title }) => (
                      <button key={title} title={title}
                        style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseOver={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.borderColor = color + '44'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                        <Ic size={12} color={color} />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.min((page-1)*PAGE+1, filtered.length)}–{Math.min(page*PAGE, filtered.length)} of {filtered.length}</p>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page===1?'not-allowed':'pointer', opacity: page===1?0.4:1 }}>
            <ChevronLeft size={13} color="var(--text-secondary)" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: page===n?'#6366f1':'var(--bg-darker)', color: page===n?'white':'var(--text-primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page===totalPages?'not-allowed':'pointer', opacity: page===totalPages?0.4:1 }}>
            <ChevronRight size={13} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SuperAdmin() {
  const [orgData, setOrgData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await superAdminApi.getOrganizations();
        if (response && response.success && response.data) {
          setOrgData(response.data);
        } else {
          setOrgData(ORGS);
        }
      } catch (err) {
        console.error('Failed to fetch orgs:', err);
        setOrgData(ORGS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%', padding: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '4px' }}>
            Platform Overview
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Wednesday, April 1, 2026 · All systems operational
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <Download size={14} /> Export Report
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            <Plus size={14} /> Add Organization
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <KPICard icon={Building2}   gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" label="Total Organizations"  value={isLoading ? 0 : orgData.length}    trend="+8%"  trendUp delay={0}    />
        <KPICard icon={DollarSign}  gradient="linear-gradient(135deg,#10b981,#34d399)" label="Monthly Revenue"      value={142500} prefix="$"  trend="+18%" trendUp delay={0.05} />
        <KPICard icon={CreditCard}  gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" label="Active Subscriptions" value={98}     trend="+5%"  trendUp delay={0.1}  />
        <KPICard icon={ShieldCheck} gradient="linear-gradient(135deg,#3b82f6,#06b6d4)" label="Admin Activity"       value={24}     sub="Logins today"  delay={0.15} />
        <KPICard icon={Plus}        gradient="linear-gradient(135deg,#ec4899,#f43f5e)" label="New Organizations"    value={12}     sub="This month"    delay={0.2}  />

      </div>

      {/* Analytics Charts */}
      <AnalyticsSection />

      {/* Bottom Grid: Activity + Alerts + Org Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
        <AdminActivityPanel />
        <AlertsPanel />
      </div>

      <OrgTable orgs={isLoading ? [] : orgData.length > 0 ? orgData : ORGS} />

      {/* Responsive */}
      <style>{`
        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
