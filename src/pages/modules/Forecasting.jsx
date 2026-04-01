import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Target, AlertCircle,
  Search, Filter, RefreshCw, ChevronDown
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { STAGES } from '../../components/DealCard';

// ── Fallback seed deals ───────────────────────────────────────────────────────
const SEED_DEALS = [
  { id: 1,  name: 'Acme Enterprise License',  account: 'Acme Corp',      contact: 'Alice Smith',  amount: 150000, stage: 'proposal',   probability: 80,  closeDate: '2026-04-15', owner: 'John Sales'  },
  { id: 2,  name: 'Globex Cloud Platform',    account: 'Globex Inc',     contact: 'Bob Jones',    amount: 80000,  stage: 'qualified',  probability: 60,  closeDate: '2026-05-01', owner: 'Sarah Doe'   },
  { id: 3,  name: 'Initech SaaS Upgrade',     account: 'Initech',        contact: 'Carol Davis',  amount: 35000,  stage: 'contacted',  probability: 40,  closeDate: '2026-04-30', owner: 'Mike Ross'   },
  { id: 4,  name: 'TechCorp Analytics Suite', account: 'TechCorp',       contact: 'Dan Lee',      amount: 220000, stage: 'new',        probability: 20,  closeDate: '2026-06-10', owner: 'John Sales'  },
  { id: 5,  name: 'Nova CRM Implementation',  account: 'Nova Solutions', contact: 'Emma Wilson',  amount: 65000,  stage: 'converted',  probability: 100, closeDate: '2026-03-15', owner: 'Sarah Doe'   },
  { id: 6,  name: 'BlueSky Data Migration',   account: 'BlueSky Ltd',    contact: 'Frank Green',  amount: 95000,  stage: 'proposal',   probability: 75,  closeDate: '2026-04-20', owner: 'Mike Ross'   },
  { id: 7,  name: 'Horizon ERP Integration',  account: 'Horizon Tech',   contact: 'Grace Hall',   amount: 180000, stage: 'qualified',  probability: 65,  closeDate: '2026-05-25', owner: 'John Sales'  },
  { id: 8,  name: 'PeakSoft Security Audit',  account: 'PeakSoft',       contact: 'Henry King',   amount: 42000,  stage: 'new',        probability: 25,  closeDate: '2026-06-30', owner: 'Sarah Doe'   },
  { id: 9,  name: 'Cloudify DevOps Suite',    account: 'Cloudify',       contact: 'Iris Lane',    amount: 130000, stage: 'proposal',   probability: 85,  closeDate: '2026-04-10', owner: 'Mike Ross'   },
  { id: 10, name: 'DataBridge Analytics',     account: 'DataBridge',     contact: 'Jack Moore',   amount: 58000,  stage: 'contacted',  probability: 45,  closeDate: '2026-05-15', owner: 'John Sales'  },
];

const OWNERS = ['John Sales', 'Sarah Doe', 'Mike Ross'];
const PERIODS = ['Monthly', 'Quarterly', 'Yearly'];

const fmt = v => '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }}>
      <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700, margin: '2px 0' }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, color, sub, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'grid', placeItems: 'center' }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color, letterSpacing: '-0.5px', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{sub}</div>}
    </motion.div>
  );
}

// ── Stage badge ───────────────────────────────────────────────────────────────
function StageBadge({ stageId }) {
  const s = STAGES.find(x => x.id === stageId) || STAGES[0];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Forecasting() {
  const navigate = useNavigate();

  // Load deals from localStorage or fallback to seed
  const allDeals = useMemo(() => {
    try {
      const saved = localStorage.getItem('crm_deals');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length ? parsed : SEED_DEALS;
    } catch { return SEED_DEALS; }
  }, []);

  // Filters
  const [period, setPeriod]         = useState('Monthly');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [search, setSearch]         = useState('');
  const [dateFrom, setDateFrom]     = useState('');
  const [dateTo, setDateTo]         = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Unique owners from deals
  const owners = useMemo(() => [...new Set(allDeals.map(d => d.owner).filter(Boolean))], [allDeals]);

  // Filtered deals
  const filtered = useMemo(() => {
    return allDeals.filter(d => {
      const matchOwner  = !ownerFilter || d.owner === ownerFilter;
      const matchStage  = !stageFilter || d.stage === stageFilter;
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
                          (d.account || '').toLowerCase().includes(search.toLowerCase()) ||
                          (d.owner || '').toLowerCase().includes(search.toLowerCase());
      const matchFrom   = !dateFrom || (d.closeDate && d.closeDate >= dateFrom);
      const matchTo     = !dateTo   || (d.closeDate && d.closeDate <= dateTo);
      return matchOwner && matchStage && matchSearch && matchFrom && matchTo;
    });
  }, [allDeals, ownerFilter, stageFilter, search, dateFrom, dateTo]);

  // KPI calculations
  const kpis = useMemo(() => {
    const forecast = filtered.reduce((s, d) => s + (d.amount * d.probability) / 100, 0);
    const closed   = filtered.filter(d => d.stage === 'converted').reduce((s, d) => s + d.amount, 0);
    const gap      = forecast - closed;
    return { forecast, closed, gap };
  }, [filtered]);

  // Trend data — group by period bucket
  const trendData = useMemo(() => {
    const buckets = {};
    filtered.forEach(d => {
      if (!d.closeDate) return;
      const dt = new Date(d.closeDate);
      let key;
      if (period === 'Monthly')     key = dt.toLocaleString('default', { month: 'short', year: '2-digit' });
      else if (period === 'Quarterly') {
        const q = Math.ceil((dt.getMonth() + 1) / 3);
        key = `Q${q} '${String(dt.getFullYear()).slice(2)}`;
      } else key = String(dt.getFullYear());

      if (!buckets[key]) buckets[key] = { period: key, forecast: 0, actual: 0, _date: dt };
      buckets[key].forecast += (d.amount * d.probability) / 100;
      if (d.stage === 'converted') buckets[key].actual += d.amount;
    });
    return Object.values(buckets).sort((a, b) => a._date - b._date);
  }, [filtered, period]);

  // Stage-wise bar data
  const stageData = useMemo(() => {
    return STAGES.map(s => {
      const deals = filtered.filter(d => d.stage === s.id);
      return {
        stage: s.label,
        color: s.color,
        weighted: deals.reduce((sum, d) => sum + (d.amount * d.probability) / 100, 0),
        total: deals.reduce((sum, d) => sum + d.amount, 0),
        count: deals.length,
      };
    }).filter(s => s.count > 0);
  }, [filtered]);

  // Table sorted: high probability first
  const tableDeals = useMemo(() =>
    [...filtered].sort((a, b) => b.probability - a.probability),
    [filtered]
  );

  const clearFilters = () => {
    setOwnerFilter(''); setStageFilter('');
    setSearch(''); setDateFrom(''); setDateTo('');
  };
  const hasFilters = ownerFilter || stageFilter || search || dateFrom || dateTo;

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ padding: '28px 32px', maxWidth: 1600, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px' }}>
              Revenue Forecasting
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Weighted pipeline forecast based on deal probability
            </p>
          </div>

          {/* Period Selector */}
          <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 4, gap: 2 }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.18s',
                  background: period === p ? '#2563eb' : 'transparent',
                  color: period === p ? '#fff' : 'var(--text-muted)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 28 }}>
          <KpiCard label="Forecast Revenue"  value={fmt(kpis.forecast)} icon={TrendingUp}   color="#2563eb" sub={`${filtered.length} deals in pipeline`}  delay={0} />
          <KpiCard label="Closed Revenue"    value={fmt(kpis.closed)}   icon={DollarSign}   color="#10b981" sub={`${filtered.filter(d=>d.stage==='converted').length} deals won`} delay={0.06} />
          <KpiCard label="Gap to Forecast"   value={fmt(Math.abs(kpis.gap))} icon={kpis.gap >= 0 ? Target : AlertCircle} color={kpis.gap >= 0 ? '#f59e0b' : '#ef4444'} sub={kpis.gap >= 0 ? 'Remaining pipeline' : 'Forecast shortfall'} delay={0.12} />
        </div>

        {/* ── Search & Filter Bar ── */}
        <div style={{ ...cardStyle, padding: '14px 18px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search deals, accounts, owners..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 9, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={() => setShowFilters(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, border: '1px solid var(--card-border)', background: showFilters ? 'rgba(37,99,235,0.08)' : 'var(--input-bg)', color: showFilters ? '#2563eb' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Filter size={14} /> Filters {hasFilters && <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, borderRadius: 99, padding: '1px 6px' }}>!</span>}
              <ChevronDown size={13} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 9, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <RefreshCw size={13} /> Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--card-border)' }}>
              {[
                { label: 'Owner', value: ownerFilter, set: setOwnerFilter, options: owners },
                { label: 'Stage', value: stageFilter, set: setStageFilter, options: STAGES.map(s => s.id), labels: STAGES.reduce((a,s) => ({...a,[s.id]:s.label}),{}) },
              ].map(f => (
                <div key={f.label} style={{ minWidth: 160 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <select value={f.value} onChange={e => f.set(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13 }}>
                    <option value="">All {f.label}s</option>
                    {f.options.map(o => <option key={o} value={o}>{f.labels ? f.labels[o] : o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ minWidth: 150 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Close Date From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13 }} />
              </div>
              <div style={{ minWidth: 150 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Close Date To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13 }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Charts ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Area chart — Forecast vs Actual */}
          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Forecast vs Actual Revenue</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Weighted forecast compared to closed revenue by {period.toLowerCase()}</p>
            </div>
            {trendData.length === 0 ? (
              <div style={{ height: 280, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No data for selected filters</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 12 }} />
                  <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#2563eb" strokeWidth={2.5} fill="url(#gForecast)" dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="actual"   name="Actual"   stroke="#10b981" strokeWidth={2.5} fill="url(#gActual)"   dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar chart — Stage distribution */}
          <div style={cardStyle}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Stage-wise Weighted Revenue</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Contribution per pipeline stage</p>
            </div>
            {stageData.length === 0 ? (
              <div style={{ height: 280, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No data for selected filters</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="weighted" name="Weighted Revenue" radius={[6, 6, 0, 0]} barSize={36}>
                    {stageData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Forecast Table ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Deal Forecast Breakdown</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>{tableDeals.length} deals · sorted by probability</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>High probability (&gt;70%)</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
                  {['Deal Name', 'Account', 'Owner', 'Stage', 'Close Date', 'Amount', 'Probability', 'Weighted Revenue'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableDeals.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No deals match your filters.</td></tr>
                )}
                {tableDeals.map((deal, i) => {
                  const weighted = (deal.amount * deal.probability) / 100;
                  const isHigh   = deal.probability > 70;
                  return (
                    <motion.tr key={deal.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                      onClick={() => navigate(`/dashboard/deals/${deal.id}`)}
                      style={{
                        borderBottom: '1px solid var(--card-border)', cursor: 'pointer',
                        background: isHigh ? 'rgba(16,185,129,0.03)' : 'transparent',
                        borderLeft: isHigh ? '3px solid #10b981' : '3px solid transparent',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isHigh ? 'rgba(16,185,129,0.07)' : 'var(--bg-page)'}
                      onMouseLeave={e => e.currentTarget.style.background = isHigh ? 'rgba(16,185,129,0.03)' : 'transparent'}
                    >
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isHigh && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />}
                          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{deal.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{deal.account || '—'}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            {(deal.owner || 'U').charAt(0)}
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{deal.owner || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 14px' }}><StageBadge stageId={deal.stage} /></td>
                      <td style={{ padding: '13px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{deal.closeDate || '—'}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{fmt(deal.amount)}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--card-border)', overflow: 'hidden', minWidth: 60 }}>
                            <div style={{ height: '100%', width: `${deal.probability}%`, background: deal.probability > 70 ? '#10b981' : deal.probability > 40 ? '#f59e0b' : '#ef4444', borderRadius: 99, transition: 'width 0.4s' }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 900, color: deal.probability > 70 ? '#10b981' : deal.probability > 40 ? '#f59e0b' : '#ef4444', minWidth: 28 }}>{deal.probability}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 900, color: '#2563eb' }}>{fmt(weighted)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
              {tableDeals.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--card-border)', background: 'var(--bg-page)' }}>
                    <td colSpan={5} style={{ padding: '12px 14px', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }}>{fmt(tableDeals.reduce((s,d)=>s+d.amount,0))}</td>
                    <td style={{ padding: '12px 14px' }} />
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 900, color: '#2563eb' }}>{fmt(kpis.forecast)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
