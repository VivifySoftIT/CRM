import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import {
  Cpu, MemoryStick, Users, AlertTriangle, Server, Database,
  Wifi, Mail, Globe, Download, Bell, RefreshCw, X,
  TrendingUp, TrendingDown, Moon, Sun, ChevronRight,
  CheckCircle2, Clock, Zap, Shield
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const now = () => new Date().toLocaleTimeString('en-US', { hour12: false });

const genTimeLabels = (n = 20) => {
  const labels = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(d - i * 3000);
    labels.push(t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }
  return labels;
};

const genSeries = (n, min, max) => Array.from({ length: n }, () => rand(min, max));

const statusColor = (val, warn, crit) =>
  val >= crit ? '#ef4444' : val >= warn ? '#f59e0b' : '#10b981';

const statusLabel = (val, warn, crit) =>
  val >= crit ? 'Critical' : val >= warn ? 'Warning' : 'Healthy';

// ─── Initial dummy data ───────────────────────────────────────────────────────

const INIT_LABELS = genTimeLabels(20);

const INIT_METRICS = {
  cpu: rand(30, 55),
  memory: rand(45, 65),
  activeUsers: rand(110, 145),
  errorRate: rand(1, 4),
  disk: rand(55, 70),
  network: rand(20, 60),
};

const API_ENDPOINTS = [
  { method: 'GET',    path: '/api/bookings',      base: 120 },
  { method: 'POST',   path: '/api/payment',        base: 850 },
  { method: 'GET',    path: '/api/guests',         base: 95  },
  { method: 'PUT',    path: '/api/rooms',          base: 210 },
  { method: 'GET',    path: '/api/analytics',      base: 340 },
  { method: 'POST',   path: '/api/auth/login',     base: 180 },
  { method: 'DELETE', path: '/api/reservations',   base: 155 },
];

const ERROR_MESSAGES = [
  'Connection timeout after 30s',
  'Database query exceeded limit',
  'JWT token expired',
  'Rate limit exceeded (429)',
  'Null reference in booking flow',
  'Payment gateway unreachable',
  'Redis cache miss — fallback used',
  'S3 upload failed: permission denied',
];

const genErrors = (n = 8) =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    time: new Date(Date.now() - i * rand(30000, 180000)).toLocaleTimeString(),
    endpoint: API_ENDPOINTS[rand(0, API_ENDPOINTS.length - 1)].path,
    message: ERROR_MESSAGES[rand(0, ERROR_MESSAGES.length - 1)],
    code: [400, 401, 403, 404, 429, 500, 502, 503][rand(0, 7)],
  }));

const SERVICES = [
  { name: 'Database Cluster (Primary)', icon: <Database size={16} />, status: 'operational' },
  { name: 'Redis Caching Layer',        icon: <Zap size={16} />,      status: 'operational' },
  { name: 'ElasticSearch Instance',     icon: <Server size={16} />,   status: 'operational' },
  { name: 'Email Relay (SendGrid)',      icon: <Mail size={16} />,     status: 'degraded'    },
  { name: 'Frontend CDN',               icon: <Globe size={16} />,    status: 'operational' },
  { name: 'WebSocket Server',           icon: <Wifi size={16} />,     status: 'operational' },
  { name: 'Auth Service',               icon: <Shield size={16} />,   status: 'operational' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PulsingDot = ({ color = '#10b981' }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
    <span style={{
      position: 'absolute', inset: 0, borderRadius: '50%',
      background: color, opacity: 0.4,
      animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite'
    }} />
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
  </span>
);

const Card = ({ children, dark, style = {} }) => (
  <div style={{
    background: dark ? 'rgba(30,41,59,0.95)' : 'white',
    borderRadius: 16,
    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
    boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)',
    padding: 24,
    ...style
  }}>{children}</div>
);

const ProgressRing = ({ pct, color, size = 80, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
};

const KpiCard = ({ icon, label, value, unit, sub, warn, crit, dark, extra }) => {
  const numVal = parseFloat(value);
  const color = statusColor(numVal, warn, crit);
  const status = statusLabel(numVal, warn, crit);
  return (
    <Card dark={dark} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'grid', placeItems: 'center', color }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${color}20`, color }}>{status}</span>
      </div>
      <p style={{ fontSize: 12, color: dark ? '#94a3b8' : '#64748b', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: dark ? 'white' : '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 14, color: dark ? '#64748b' : '#94a3b8', marginBottom: 4 }}>{unit}</span>}
      </div>
      {typeof numVal === 'number' && unit === '%' && (
        <div style={{ height: 5, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', overflow: 'hidden', marginBottom: 8 }}>
          <motion.div animate={{ width: `${numVal}%` }} transition={{ duration: 0.6 }}
            style={{ height: '100%', borderRadius: 99, background: color }} />
        </div>
      )}
      <p style={{ fontSize: 12, color: dark ? '#475569' : '#94a3b8' }}>{sub}</p>
      {extra}
      <div style={{ position: 'absolute', bottom: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: `${color}08` }} />
    </Card>
  );
};

const miniChartOpts = (dark) => ({
  responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
  plugins: { legend: { display: false }, tooltip: {
    backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#fff',
    padding: 10, cornerRadius: 8, displayColors: false,
    callbacks: { title: (i) => i[0].label, label: (i) => `${i.raw}${i.dataset.unit || ''}` }
  }},
  scales: {
    x: { display: false },
    y: { display: false }
  },
  elements: { point: { radius: 0, hoverRadius: 4 } }
});

const MiniChart = ({ data, color, unit, dark }) => {
  const cfg = {
    labels: data.labels,
    datasets: [{
      data: data.values, unit,
      borderColor: color, backgroundColor: `${color}18`,
      fill: true, tension: 0.4, borderWidth: 2,
      pointRadius: 0, pointHoverRadius: 4
    }]
  };
  return (
    <div style={{ height: 60 }}>
      <Line data={cfg} options={miniChartOpts(dark)} />
    </div>
  );
};

// ─── API Detail Modal ─────────────────────────────────────────────────────────

const ApiModal = ({ row, onClose, dark }) => {
  if (!row) return null;
  const color = row.ms < 200 ? '#10b981' : row.ms < 600 ? '#f59e0b' : '#ef4444';
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 9000, display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          style={{ background: dark ? '#1e293b' : 'white', borderRadius: 20, padding: 36, width: 480, boxShadow: '0 40px 80px rgba(0,0,0,0.3)', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: dark ? 'white' : '#0f172a' }}>Endpoint Details</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: row.method === 'GET' ? '#dbeafe' : row.method === 'POST' ? '#dcfce7' : row.method === 'DELETE' ? '#fee2e2' : '#fef9c3', color: row.method === 'GET' ? '#1d4ed8' : row.method === 'POST' ? '#15803d' : row.method === 'DELETE' ? '#dc2626' : '#854d0e' }}>{row.method}</span>
            <code style={{ fontSize: 14, color: dark ? '#818cf8' : '#6366f1', fontWeight: 600 }}>{row.path}</code>
          </div>
          {[['Avg Response Time', `${row.ms} ms`, color], ['Status', row.ms < 200 ? 'Fast' : row.ms < 600 ? 'Slow' : 'Critical', color], ['Last Updated', row.updated, dark ? '#94a3b8' : '#64748b'], ['Requests / min', `${rand(40, 200)}`, dark ? 'white' : '#0f172a'], ['P95 Latency', `${row.ms + rand(20, 80)} ms`, dark ? '#94a3b8' : '#64748b']].map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f8fafc'}` }}>
              <span style={{ fontSize: 13, color: dark ? '#64748b' : '#94a3b8', fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SystemHealth = () => {
  const { isDark: dark } = useTheme();
  const [metrics, setMetrics] = useState(INIT_METRICS);
  const [labels, setLabels] = useState(INIT_LABELS);
  const [cpuSeries,    setCpuSeries]    = useState(genSeries(20, 25, 60));
  const [memSeries,    setMemSeries]    = useState(genSeries(20, 40, 70));
  const [errSeries,    setErrSeries]    = useState(genSeries(20, 0, 8));
  const [userSeries,   setUserSeries]   = useState(genSeries(20, 90, 160));
  const [apiRows,      setApiRows]      = useState(API_ENDPOINTS.map(e => ({ ...e, ms: e.base + rand(-20, 80), updated: now() })));
  const [errors,       setErrors]       = useState(genErrors(8));
  const [lastUpdated,  setLastUpdated]  = useState(now());
  const [selectedApi,  setSelectedApi]  = useState(null);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [alertBanner,  setAlertBanner]  = useState(true);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    const newLabel = now();
    const newCpu    = rand(25, 85);
    const newMem    = rand(40, 78);
    const newErr    = parseFloat((Math.random() * 8).toFixed(1));
    const newUsers  = rand(90, 165);

    setLabels(l => [...l.slice(1), newLabel]);
    setCpuSeries(s  => [...s.slice(1),  newCpu]);
    setMemSeries(s  => [...s.slice(1),  newMem]);
    setErrSeries(s  => [...s.slice(1),  newErr]);
    setUserSeries(s => [...s.slice(1),  newUsers]);
    setMetrics({ cpu: newCpu, memory: newMem, activeUsers: newUsers, errorRate: newErr, disk: rand(55, 72), network: rand(15, 65) });
    setApiRows(rows => rows.map(r => ({ ...r, ms: r.base + rand(-30, 120), updated: newLabel })));
    setLastUpdated(newLabel);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 5000);
    return () => clearInterval(intervalRef.current);
  }, [tick]);

  const bg = dark ? '#0b1120' : '#f1f5f9';
  const cardBg = dark ? 'rgba(15,23,42,0.95)' : 'white';
  const text = dark ? 'white' : '#0f172a';
  const sub = dark ? '#64748b' : '#94a3b8';
  const border = dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';

  const chartOpts = (unit = '') => ({
    responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: sub, font: { size: 11 }, boxWidth: 10, padding: 16 } },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#fff', padding: 12, cornerRadius: 10, callbacks: { label: i => ` ${i.raw}${unit}` } }
    },
    scales: {
      x: { grid: { color: dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }, ticks: { color: sub, font: { size: 10 }, maxTicksLimit: 6 } },
      y: { grid: { color: dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }, ticks: { color: sub, font: { size: 10 } } }
    },
    elements: { point: { radius: 0, hoverRadius: 5 } }
  });

  const mkLine = (series, color, label, fill = true) => ({
    labels,
    datasets: [{
      label, data: series, borderColor: color,
      backgroundColor: fill ? `${color}18` : 'transparent',
      fill, tension: 0.4, borderWidth: 2
    }]
  });

  const apiResponseData = {
    labels,
    datasets: [
      { label: 'GET /bookings', data: cpuSeries.map((_, i) => apiRows[0]?.ms + rand(-10, 10) || 120), borderColor: '#6366f1', backgroundColor: 'transparent', fill: false, tension: 0.4, borderWidth: 2 },
      { label: 'POST /payment', data: cpuSeries.map((_, i) => apiRows[1]?.ms + rand(-20, 20) || 850), borderColor: '#ef4444', backgroundColor: 'transparent', fill: false, tension: 0.4, borderWidth: 2 },
      { label: 'GET /guests',   data: cpuSeries.map((_, i) => apiRows[2]?.ms + rand(-5, 15) || 95),  borderColor: '#10b981', backgroundColor: 'transparent', fill: false, tension: 0.4, borderWidth: 2 },
    ]
  };

  const errColor = (code) => code >= 500 ? '#ef4444' : code >= 400 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100%', background: bg, borderRadius: 16, padding: 0 }}>
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .api-row:hover { background: ${dark ? 'rgba(255,255,255,0.04)' : '#f8fafc'} !important; cursor: pointer; }
        .err-row:hover { background: ${dark ? 'rgba(255,255,255,0.03)' : '#fafafa'} !important; }
      `}</style>

      {/* Alert Banner */}
      <AnimatePresence>
        {alertBanner && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: '12px 12px 0 0', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={16} color="white" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Email Relay Service is experiencing degraded performance. Engineers are investigating.</span>
            </div>
            <button onClick={() => setAlertBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${border}` }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: text, letterSpacing: '-0.5px', marginBottom: 2 }}>System Health Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PulsingDot color="#10b981" />
            <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>Live — Updated {lastUpdated}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => tick()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1px solid ${border}`, background: 'transparent', color: sub, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1px solid ${border}`, background: 'transparent', color: sub, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setNotifOpen(n => !n)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${border}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: sub }}>
              <Bell size={16} />
            </button>
            <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: `2px solid ${bg}` }} />
            {notifOpen && (
              <div style={{ position: 'absolute', top: 44, right: 0, width: 280, background: dark ? '#1e293b' : 'white', borderRadius: 14, border: `1px solid ${border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: text }}>Notifications</p>
                </div>
                {[['Email relay degraded', '2m ago', '#f59e0b'], ['High error rate detected', '8m ago', '#ef4444'], ['CPU spike on Node-3', '15m ago', '#f59e0b']].map(([msg, t, c]) => (
                  <div key={msg} style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, marginTop: 4, flexShrink: 0 }} />
                    <div><p style={{ fontSize: 12, color: text, fontWeight: 600 }}>{msg}</p><p style={{ fontSize: 11, color: sub }}>{t}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 13 }}>AD</div>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <KpiCard dark={dark} icon={<Cpu size={20} />} label="CPU Usage" value={metrics.cpu} unit="%" sub={`${rand(4,8)} cores active`} warn={60} crit={80}
            extra={<MiniChart data={{ labels, values: cpuSeries }} color={statusColor(metrics.cpu, 60, 80)} dark={dark} unit="%" />} />
          <KpiCard dark={dark} icon={<MemoryStick size={20} />} label="Memory Usage" value={metrics.memory} unit="%" sub={`${(metrics.memory * 0.32).toFixed(1)} GB / 32 GB`} warn={65} crit={85}
            extra={<MiniChart data={{ labels, values: memSeries }} color={statusColor(metrics.memory, 65, 85)} dark={dark} unit="%" />} />
          <KpiCard dark={dark} icon={<Users size={20} />} label="Active Users" value={metrics.activeUsers} unit="" sub="Live users online now" warn={999} crit={9999}
            extra={<MiniChart data={{ labels, values: userSeries }} color="#6366f1" dark={dark} />} />
          <KpiCard dark={dark} icon={<AlertTriangle size={20} />} label="Error Rate" value={metrics.errorRate} unit="%" sub="Last 5 minutes" warn={3} crit={6}
            extra={<MiniChart data={{ labels, values: errSeries }} color={statusColor(metrics.errorRate, 3, 6)} dark={dark} unit="%" />} />
        </div>

        {/* Extra KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Disk Usage', val: `${metrics.disk}%`, color: statusColor(metrics.disk, 70, 85), icon: <Server size={16} /> },
            { label: 'Network I/O', val: `${metrics.network} MB/s`, color: '#6366f1', icon: <Wifi size={16} /> },
            { label: 'Uptime', val: '99.97%', color: '#10b981', icon: <CheckCircle2 size={16} /> },
          ].map(({ label, val, color, icon }) => (
            <div key={label} style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'grid', placeItems: 'center', color }}>{icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: sub }}>{label}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>API Response Time</p>
            <p style={{ fontSize: 12, color: sub, marginBottom: 16 }}>Live latency per endpoint (ms)</p>
            <div style={{ height: 200 }}>
              <Line data={apiResponseData} options={chartOpts('ms')} />
            </div>
          </div>
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>Error Rate Trend</p>
            <p style={{ fontSize: 12, color: sub, marginBottom: 16 }}>% over time — spikes in red</p>
            <div style={{ height: 200 }}>
              <Line data={mkLine(errSeries, '#ef4444', 'Error %')} options={chartOpts('%')} />
            </div>
          </div>
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>Active Users Trend</p>
            <p style={{ fontSize: 12, color: sub, marginBottom: 16 }}>Concurrent sessions</p>
            <div style={{ height: 200 }}>
              <Line data={mkLine(userSeries, '#6366f1', 'Users')} options={chartOpts('')} />
            </div>
          </div>
        </div>

        {/* Bottom: API Table + Error Log + Services */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* API Performance Table */}
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: text }}>API Performance</p>
                <p style={{ fontSize: 12, color: sub }}>Click row for details</p>
              </div>
              <PulsingDot color="#10b981" />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                    {['Endpoint', 'Avg (ms)', 'Status', 'Updated'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 800, color: sub, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apiRows.map((row, i) => {
                    const c = row.ms < 200 ? '#10b981' : row.ms < 600 ? '#f59e0b' : '#ef4444';
                    const lbl = row.ms < 200 ? 'Fast' : row.ms < 600 ? 'Slow' : 'Critical';
                    return (
                      <tr key={i} className="api-row" onClick={() => setSelectedApi(row)}
                        style={{ borderTop: `1px solid ${border}`, transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: row.method === 'GET' ? '#dbeafe' : row.method === 'POST' ? '#dcfce7' : row.method === 'DELETE' ? '#fee2e2' : '#fef9c3', color: row.method === 'GET' ? '#1d4ed8' : row.method === 'POST' ? '#15803d' : row.method === 'DELETE' ? '#dc2626' : '#854d0e' }}>{row.method}</span>
                            <code style={{ fontSize: 12, color: dark ? '#818cf8' : '#6366f1' }}>{row.path}</code>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: c }}>{row.ms} ms</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${c}18`, color: c }}>{lbl}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: sub }}>{row.updated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error Log */}
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: text }}>Recent Error Log</p>
                <p style={{ fontSize: 12, color: sub }}>Last 8 errors</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#fee2e218', color: '#ef4444' }}>{errors.length} errors</span>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 320 }}>
              {errors.map((e, i) => (
                <div key={i} className="err-row" style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <code style={{ fontSize: 12, color: dark ? '#818cf8' : '#6366f1', fontWeight: 600 }}>{e.endpoint}</code>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: `${errColor(e.code)}18`, color: errColor(e.code) }}>{e.code}</span>
                      <span style={{ fontSize: 10, color: sub, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{e.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: e.code >= 500 ? '#ef4444' : sub }}>{e.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${border}`, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${border}` }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: text }}>Infrastructure Services</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {SERVICES.map((s, i) => {
              const c = s.status === 'operational' ? '#10b981' : '#f59e0b';
              return (
                <div key={i} style={{ padding: '16px 20px', borderRight: i % 4 !== 3 ? `1px solid ${border}` : 'none', borderBottom: i < 4 ? `1px solid ${border}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c}18`, display: 'grid', placeItems: 'center', color: c, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 2 }}>{s.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <PulsingDot color={c} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: c, textTransform: 'capitalize' }}>{s.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ApiModal row={selectedApi} onClose={() => setSelectedApi(null)} dark={dark} />
    </div>
  );
};

export default SystemHealth;
