import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  IndianRupee, TrendingUp, BedDouble, BarChart2, DollarSign,
  Download, RefreshCw, Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, ChevronDown, Info, Zap, Crown, Coffee
} from 'lucide-react';

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const DAILY_DATA = [
  { date: 'Mar 20', revenue: 42000, occupancy: 71, room: 28000, event: 8000, fnb: 4500, other: 1500 },
  { date: 'Mar 21', revenue: 51000, occupancy: 78, room: 34000, event: 10000, fnb: 5500, other: 1500 },
  { date: 'Mar 22', revenue: 38000, occupancy: 65, room: 24000, event: 8000, fnb: 4500, other: 1500 },
  { date: 'Mar 23', revenue: 65000, occupancy: 88, room: 45000, event: 12000, fnb: 6000, other: 2000 },
  { date: 'Mar 24', revenue: 72000, occupancy: 92, room: 50000, event: 14000, fnb: 6000, other: 2000 },
  { date: 'Mar 25', revenue: 80000, occupancy: 95, room: 58000, event: 14000, fnb: 6000, other: 2000 },
  { date: 'Mar 26', revenue: 68000, occupancy: 84, room: 47000, event: 13000, fnb: 6000, other: 2000 },
];

const WEEKLY_DATA = [
  { date: 'Week 8', revenue: 310000, occupancy: 72, room: 210000, event: 65000, fnb: 28000, other: 7000 },
  { date: 'Week 9', revenue: 345000, occupancy: 76, room: 235000, event: 72000, fnb: 30000, other: 8000 },
  { date: 'Week 10', revenue: 290000, occupancy: 68, room: 195000, event: 58000, fnb: 28000, other: 9000 },
  { date: 'Week 11', revenue: 420000, occupancy: 85, room: 295000, event: 82000, fnb: 34000, other: 9000 },
  { date: 'Week 12', revenue: 485000, occupancy: 90, room: 345000, event: 92000, fnb: 38000, other: 10000 },
  { date: 'Week 13', revenue: 512000, occupancy: 93, room: 368000, event: 94000, fnb: 40000, other: 10000 },
];

const MONTHLY_DATA = [
  { date: 'Jan', revenue: 1245000, occupancy: 72, room: 870000, event: 250000, fnb: 92000, other: 33000 },
  { date: 'Feb', revenue: 1380000, occupancy: 76, room: 960000, event: 280000, fnb: 102000, other: 38000 },
  { date: 'Mar', revenue: 1550000, occupancy: 82, room: 1085000, event: 315000, fnb: 115000, other: 35000 },
  { date: 'Apr', revenue: 1690000, occupancy: 86, room: 1183000, event: 340000, fnb: 126000, other: 41000 },
  { date: 'May', revenue: 1820000, occupancy: 88, room: 1274000, event: 380000, fnb: 128000, other: 38000 },
  { date: 'Jun', revenue: 1420000, occupancy: 74, room: 994000, event: 285000, fnb: 105000, other: 36000 },
];

const ROOM_TYPES = [
  { type: 'Deluxe Suite', total: 20, occupied: 19, revenue: 285000 },
  { type: 'Superior King', total: 40, occupied: 35, revenue: 420000 },
  { type: 'Standard Room', total: 60, occupied: 48, revenue: 360000 },
  { type: 'Executive Suite', total: 15, occupied: 13, revenue: 260000 },
  { type: 'Junior Suite', total: 25, occupied: 20, revenue: 300000 },
];

const REVENUE_PIE = [
  { name: 'Room Revenue', value: 62, color: '#2563eb' },
  { name: 'Event Revenue', value: 22, color: '#8b5cf6' },
  { name: 'Food & Beverage', value: 10, color: '#f59e0b' },
  { name: 'Other Services', value: 6, color: '#10b981' },
];

const INSIGHTS = [
  { icon: TrendingUp, color: '#10b981', bg: '#d1fae5', title: 'Weekend Surge', desc: 'Weekend occupancy is 92% — Peak demand this month.' },
  { icon: Crown, color: '#8b5cf6', bg: '#ede9fe', title: 'Top Revenue Room', desc: 'Deluxe Suites generate highest revenue per available room.' },
  { icon: Zap, color: '#f59e0b', bg: '#fef3c7', title: 'Event Boost', desc: 'Revenue increased 18% this week due to 3 major events.' },
  { icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2', title: 'Low Occupancy Alert', desc: 'Standard rooms at 80% — opportunity to upsell guests.' },
];

const PERIOD_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Custom'];
const fmt = (n) => '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n);
const fmtFull = (n) => '₹' + Number(n).toLocaleString('en-IN');

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, prefix = '₹', suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const inc = to / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 18);
    return () => clearInterval(t);
  }, [to]);
  const display = prefix === '₹' ? fmtFull(val) : `${prefix}${val}${suffix}`;
  return <span>{prefix === '₹' ? display : `${prefix}${val}${suffix}`}</span>;
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 12, color: p.color || '#fff', marginBottom: 3, fontWeight: 600 }}>
          <span>{p.name}</span>
          <span>{typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value + (p.name === 'Occupancy' ? '%' : '')}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Revenue() {
  const [periodMode, setPeriodMode] = useState('Day');
  const [filterPeriod, setFilterPeriod] = useState('Last 7 Days');
  const [sortCol, setSortCol] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');

  const chartData = periodMode === 'Day' ? DAILY_DATA : periodMode === 'Week' ? WEEKLY_DATA : MONTHLY_DATA;

  const totalRevenue = 1245000;
  const occupancyRate = 78;
  const arr = 3200;
  const revpar = Math.round(arr * (occupancyRate / 100));

  const sortedRooms = [...ROOM_TYPES].sort((a, b) => {
    const valA = sortCol === 'revenue' ? a.revenue : sortCol === 'occ' ? (a.occupied / a.total) : a.occupied;
    const valB = sortCol === 'revenue' ? b.revenue : sortCol === 'occ' ? (b.occupied / b.total) : b.occupied;
    return sortDir === 'desc' ? valB - valA : valA - valB;
  });

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const cardStyle = { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' };

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%', background: 'var(--bg-page)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #4f46e5)', display: 'grid', placeItems: 'center' }}>
            <BarChart2 size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Revenue & Occupancy</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Hotel performance, KPIs and revenue analytics</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="b24-select" style={{ minWidth: 140, width: 'auto', margin: 0 }}>
            {PERIOD_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="b24-btn b24-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} />Refresh
          </button>
          <button className="b24-btn b24-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} />Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          {
            label: 'Total Revenue', icon: IndianRupee, grad: 'linear-gradient(135deg,#2563eb,#4f46e5)', accent: '#2563eb', accBg: '#dbeafe',
            value: <Counter to={totalRevenue} />, sub: '+15% vs last month', trend: 15, extra: null
          },
          {
            label: 'Occupancy Rate', icon: BedDouble, grad: 'linear-gradient(135deg,#10b981,#059669)', accent: '#10b981', accBg: '#d1fae5',
            value: `${occupancyRate}%`, sub: '+5% growth this month', trend: 5, extra: (
              <div style={{ height: 6, borderRadius: 99, background: '#f0fdf4', overflow: 'hidden', marginTop: 10 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyRate}%` }} transition={{ duration: 1.2 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg,#10b981,#059669)', borderRadius: 99 }} />
              </div>
            )
          },
          {
            label: 'Avg Room Rate (ARR)', icon: DollarSign, grad: 'linear-gradient(135deg,#f59e0b,#d97706)', accent: '#f59e0b', accBg: '#fef3c7',
            value: `₹${arr.toLocaleString('en-IN')}`, sub: 'Stable — last 30 days', trend: 2, extra: null
          },
          {
            label: 'RevPAR', icon: TrendingUp, grad: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', accent: '#8b5cf6', accBg: '#ede9fe',
            value: `₹${revpar.toLocaleString('en-IN')}`, sub: 'ARR × Occupancy Rate', trend: 7, extra: (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info size={11} /> {arr} × {occupancyRate}% = ₹{revpar}
              </div>
            )
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3, boxShadow: `0 12px 30px ${card.accent}22` }}
              style={{ ...cardStyle, padding: 22, position: 'relative', overflow: 'hidden', cursor: 'default' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '0 16px 0 100px', background: `${card.accent}12`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.grad, display: 'grid', placeItems: 'center', boxShadow: `0 4px 12px ${card.accent}40` }}>
                  <Icon size={20} color="#fff" />
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#d1fae5', color: '#059669' }}>
                  <ArrowUpRight size={11} />+{card.trend}%
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1.1 }}>{card.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 4 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{card.sub}</div>
              {card.extra}
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Trend & Occupancy Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Revenue Trend Line Chart */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Revenue Trend</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Total revenue over time</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--input-border)' }}>
              {['Day', 'Week', 'Month'].map(m => (
                <button key={m} onClick={() => setPeriodMode(m)} style={{ padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: periodMode === m ? '#2563eb' : 'transparent', color: periodMode === m ? '#fff' : 'var(--text-muted)', transition: 'all 0.15s' }}>{m}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#2563eb' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Area Chart */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Occupancy Rate</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Room occupancy % over time</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => v + '%'} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#10b981" strokeWidth={2.5} fill="url(#occGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown + Room Type Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 20, marginBottom: 20 }}>

        {/* Pie Chart Revenue Breakdown */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Revenue Breakdown</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 20px' }}>By revenue source</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={REVENUE_PIE} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                {REVENUE_PIE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#f1f5f9' }} itemStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {REVENUE_PIE.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type Performance Table */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Room Type Performance</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Click column header to sort</p>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--input-bg)', borderRadius: 8 }}>
                {[
                  { key: 'type', label: 'Room Type' },
                  { key: 'total', label: 'Total Rooms' },
                  { key: 'occupied', label: 'Occupied' },
                  { key: 'occ', label: 'Occupancy %' },
                  { key: 'revenue', label: 'Revenue' },
                ].map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {col.label} {sortCol === col.key && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRooms.map((room, i) => {
                const occ = Math.round((room.occupied / room.total) * 100);
                const occColor = occ >= 80 ? '#10b981' : occ >= 60 ? '#f59e0b' : '#ef4444';
                return (
                  <tr key={i} className="b24-tr-hover" style={{ borderBottom: '1px solid var(--card-border)', cursor: 'default' }}>
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{room.type}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>{room.total}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>{room.occupied}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--input-bg)', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${occ}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                            style={{ height: '100%', background: occColor, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: occColor, minWidth: 36 }}>{occ}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{fmt(room.revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Stacked Bar + Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>

        {/* Stacked Bar revenue by category */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Revenue by Category</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 20px' }}>Room, Event, F&B and other revenue stacked</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="room" name="Room Revenue" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
              <Bar dataKey="event" name="Event Revenue" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="fnb" name="F&B" stackId="a" fill="#f59e0b" />
              <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'grid', placeItems: 'center' }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Smart Insights</h3>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>AI-powered performance analysis</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INSIGHTS.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, background: ins.bg, border: `1px solid ${ins.color}20` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: ins.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ins.color, marginBottom: 2 }}>{ins.title}</div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{ins.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
