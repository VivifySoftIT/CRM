import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Line, Bar, Doughnut, Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import {
  TrendingUp, TrendingDown, Users, Bed, CreditCard, Activity,
  Download, FileText, Filter, RefreshCw, Star, MapPin,
  ChevronUp, ChevronDown, ArrowUpRight
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const revenueData = {
  current:  [42,58,51,67,74,89,95,102,88,110,125,138],
  previous: [35,44,40,55,60,72,80,88,75,92,105,118],
};

const hotelRevenue = {
  labels: ['Grand Omni','Riviera Resort','Urban Boutique','Sky Palace','The Meridian'],
  current:  [2450,1820,980,1650,2100],
  previous: [2100,1600,850,1400,1900],
};

const occupancyData = [88, 74, 62, 91, 79];
const occupancyLabels = ['Grand Omni','Riviera','Urban','Sky Palace','Meridian'];
const occupancyColors = ['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6'];

const guestTrend = {
  labels: MONTHS,
  newGuests:       [320,410,380,490,520,610,580,670,640,720,800,880],
  returningGuests: [180,220,200,260,290,340,310,380,360,410,450,490],
};

const cityRevenue = {
  labels: ['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Pune','Goa'],
  values: [4200,3800,2900,2400,2100,1800,3500],
};

const bookingTrend = {
  labels: MONTHS,
  bookings:      [210,280,260,320,350,410,390,450,420,480,530,590],
  cancellations: [18,22,20,25,28,32,30,35,33,38,42,46],
};

const topHotels = [
  { name:'Grand Omni Hotel',    city:'Mumbai',    revenue:'₹24.5L', occupancy:88, rating:4.8, bookings:412, trend:'up' },
  { name:'Sky Palace Resort',   city:'Goa',       revenue:'₹21.0L', occupancy:91, rating:4.9, bookings:389, trend:'up' },
  { name:'The Meridian',        city:'Delhi',     revenue:'₹19.8L', occupancy:79, rating:4.6, bookings:356, trend:'up' },
  { name:'Riviera Resort & Spa',city:'Chennai',   revenue:'₹18.2L', occupancy:74, rating:4.7, bookings:298, trend:'down' },
  { name:'Urban Boutique Stay', city:'Bangalore', revenue:'₹9.8L',  occupancy:62, rating:4.3, bookings:201, trend:'down' },
];

// ─── Chart defaults ───────────────────────────────────────────────────────────

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#94a3b8',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
    }
  }
};

// ─── Reusable UI ──────────────────────────────────────────────────────────────

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--card-bg)', borderRadius: '16px',
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)',
    padding: '24px', ...style
  }}>{children}</div>
);

const Skeleton = ({ h = 20, w = '100%', r = 8 }) => (
  <div style={{
    height: h, width: w, borderRadius: r,
    background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite'
  }} />
);

const KpiCard = ({ icon, label, value, sub, growth, color, loading }) => (
  <Card style={{ position: 'relative', overflow: 'hidden' }}>
    {loading ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton h={16} w="60%" /><Skeleton h={32} w="80%" /><Skeleton h={14} w="50%" />
      </div>
    ) : (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'grid', placeItems: 'center', color }}>{icon}</div>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
            background: growth >= 0 ? '#dcfce7' : '#fee2e2',
            color: growth >= 0 ? '#16a34a' : '#dc2626',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(growth)}%
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>{label}</p>
        <h3 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: 4 }}>{value}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}08` }} />
      </>
    )}
  </Card>
);

const SectionTitle = ({ title, sub, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
    <div>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</h4>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const PeriodBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: active ? '#6366f1' : '#f1f5f9', color: active ? 'white' : '#64748b', transition: 'all 0.15s'
  }}>{label}</button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [revPeriod, setRevPeriod] = useState('monthly');
  const [guestPeriod, setGuestPeriod] = useState('monthly');
  const [sortCol, setSortCol] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');
  const [filters, setFilters] = useState({ from: '2025-01-01', to: '2025-12-31', city: 'all', category: 'all' });
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const handleExport = (type) => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => sortCol === col
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} style={{ opacity: 0.3 }} />;

  // ── Chart configs ──────────────────────────────────────────────────────────

  const revenueLineConfig = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Current Year',
        data: revenueData.current,
        borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)',
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#6366f1', borderWidth: 2
      },
      {
        label: 'Previous Year',
        data: revenueData.previous,
        borderColor: '#e2e8f0', backgroundColor: 'transparent',
        tension: 0.4, fill: false, pointRadius: 3, borderDash: [5,4], borderWidth: 2,
        pointBackgroundColor: '#94a3b8'
      }
    ]
  };

  const hotelBarConfig = {
    labels: hotelRevenue.labels,
    datasets: [
      { label: 'Current', data: hotelRevenue.current, backgroundColor: '#6366f1', borderRadius: 8, barThickness: 18 },
      { label: 'Previous', data: hotelRevenue.previous, backgroundColor: '#e0e7ff', borderRadius: 8, barThickness: 18 }
    ]
  };

  const occupancyDonutConfig = {
    labels: occupancyLabels,
    datasets: [{ data: occupancyData, backgroundColor: occupancyColors, borderWidth: 0, hoverOffset: 6 }]
  };

  const guestLineConfig = {
    labels: MONTHS,
    datasets: [
      { label: 'New Guests', data: guestTrend.newGuests, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 },
      { label: 'Returning', data: guestTrend.returningGuests, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 }
    ]
  };

  const guestPieConfig = {
    labels: ['New Guests', 'Returning Guests'],
    datasets: [{ data: [62, 38], backgroundColor: ['#6366f1','#10b981'], borderWidth: 0, hoverOffset: 6 }]
  };

  const cityBarConfig = {
    labels: cityRevenue.labels,
    datasets: [{ label: 'Revenue (₹L)', data: cityRevenue.values, backgroundColor: cityRevenue.values.map((_, i) => i === 0 ? '#6366f1' : '#e0e7ff'), borderRadius: 8, barThickness: 22 }]
  };

  const bookingBarConfig = {
    labels: MONTHS,
    datasets: [
      { label: 'Bookings', data: bookingTrend.bookings, backgroundColor: '#6366f1', borderRadius: 6, barThickness: 14 },
      { label: 'Cancellations', data: bookingTrend.cancellations, backgroundColor: '#fca5a5', borderRadius: 6, barThickness: 14 }
    ]
  };

  const chartOpts = (extra = {}) => ({
    ...chartDefaults,
    plugins: { ...chartDefaults.plugins, legend: { display: false }, ...extra.plugins },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'var(--text-muted)', font: { size: 11 } } },
      y: { grid: { color: 'var(--card-border)' }, ticks: { color: 'var(--text-muted)', font: { size: 11 } } },
      ...extra.scales
    },
    ...extra
  });

  const donutOpts = {
    ...chartDefaults,
    cutout: '72%',
    plugins: { ...chartDefaults.plugins, legend: { display: true, position: 'bottom', labels: { color: '#64748b', font: { size: 11 }, padding: 12, boxWidth: 10, borderRadius: 4 } } }
  };

  const pieOpts = {
    ...chartDefaults,
    plugins: { ...chartDefaults.plugins, legend: { display: true, position: 'bottom', labels: { color: '#64748b', font: { size: 11 }, padding: 12, boxWidth: 10 } } }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .th-sort { cursor:pointer; user-select:none; }
        .th-sort:hover { color:#6366f1; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 4 }}>Analytics Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Platform-wide performance across all hotel tenants.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => handleExport('excel')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card-bg)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Download size={15} /> Export Excel
          </button>
          <button onClick={() => handleExport('pdf')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
            <FileText size={15} /> Download Report
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <Card style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</p>
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({...f, from: e.target.value}))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>To</p>
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({...f, to: e.target.value}))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</p>
            <select value={filters.city} onChange={e => setFilters(f => ({...f, city: e.target.value}))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)', cursor: 'pointer' }}>
              <option value="all">All Cities</option>
              {['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Goa'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</p>
            <select value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--input-border)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', background: 'var(--input-bg)', cursor: 'pointer' }}>
              <option value="all">All Categories</option>
              {['Luxury','Budget','Business','Resort'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 900); }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
            <Filter size={14} /> Apply Filters
          </button>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 900); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1px solid var(--input-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </Card>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard loading={loading} icon={<CreditCard size={20} />} label="Total Revenue" value="₹1.42Cr" sub="vs ₹1.18Cr last year" growth={20.3} color="#6366f1" />
        <KpiCard loading={loading} icon={<Bed size={20} />} label="Occupancy Rate" value="82.4%" sub="Across all properties" growth={8.1} color="#10b981" />
        <KpiCard loading={loading} icon={<Activity size={20} />} label="Total Bookings" value="4,820" sub="+340 this month" growth={12.5} color="#f59e0b" />
        <KpiCard loading={loading} icon={<Users size={20} />} label="Active Guests" value="1,284" sub="Currently checked-in" growth={-3.2} color="#ec4899" />
      </div>

      {/* ── Revenue Analytics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <SectionTitle
            title="Monthly Revenue Growth"
            sub="Current vs previous year (₹ Lakhs)"
            action={
              <div style={{ display: 'flex', gap: 6 }}>
                {['monthly','quarterly'].map(p => <PeriodBtn key={p} label={p.charAt(0).toUpperCase()+p.slice(1)} active={revPeriod===p} onClick={() => setRevPeriod(p)} />)}
              </div>
            }
          />
          {loading ? <Skeleton h={260} r={12} /> : (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {[['#6366f1','Current Year'],['#94a3b8','Previous Year']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
                  </div>
                ))}
              </div>
              <div style={{ height: 240 }}>
                <Line data={revenueLineConfig} options={chartOpts()} />
              </div>
            </>
          )}
        </Card>

        <Card>
          <SectionTitle title="Revenue by Hotel" sub="Top 5 properties (₹L)" />
          {loading ? <Skeleton h={260} r={12} /> : (
            <div style={{ height: 260 }}>
              <Bar data={hotelBarConfig} options={chartOpts({ indexAxis: 'y', scales: { x: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } } }, y: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } } } })} />
            </div>
          )}
        </Card>
      </div>

      {/* ── Occupancy Analytics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <SectionTitle title="Occupancy by Hotel" sub="Current period" />
          {loading ? <Skeleton h={220} r={12} /> : (
            <div style={{ height: 220 }}>
              <Doughnut data={occupancyDonutConfig} options={donutOpts} />
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Occupancy Rate" sub="Per property breakdown" />
          {loading
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{[...Array(5)].map((_,i) => <Skeleton key={i} h={18} r={6} />)}</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {occupancyLabels.map((name, i) => (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: occupancyColors[i] }}>{occupancyData[i]}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${occupancyData[i]}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{ height: '100%', borderRadius: 99, background: occupancyColors[i] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </Card>
      </div>

      {/* ── Top Performing Hotels Table ── */}
      <Card style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <SectionTitle title="Top Performing Hotels" sub="Sortable by revenue, occupancy, and rating" />
        </div>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(5)].map((_,i) => <Skeleton key={i} h={20} r={6} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-darker)' }}>
                  {[['#',''],['name','Hotel Name'],['city','City'],['revenue','Revenue'],['occupancy','Occupancy'],['rating','Rating'],['bookings','Bookings'],['trend','Trend']].map(([col, label]) => (
                    <th key={col} onClick={() => col !== '#' && col !== 'trend' && handleSort(col)}
                      className={col !== '#' && col !== 'trend' ? 'th-sort' : ''}
                      style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {label} {col !== '#' && col !== 'trend' && <SortIcon col={col} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...topHotels].sort((a,b) => {
                  const va = sortCol === 'revenue' ? parseFloat(a.revenue) : sortCol === 'occupancy' ? a.occupancy : sortCol === 'rating' ? a.rating : a.bookings;
                  const vb = sortCol === 'revenue' ? parseFloat(b.revenue) : sortCol === 'occupancy' ? b.occupancy : sortCol === 'rating' ? b.rating : b.bookings;
                  return sortDir === 'asc' ? va - vb : vb - va;
                }).map((h, i) => (
                  <tr key={h.name} style={{ borderTop: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{i+1}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${occupancyColors[i % 5]}15`, display: 'grid', placeItems: 'center', color: occupancyColors[i % 5], fontWeight: 800, fontSize: 13 }}>
                          {h.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{h.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#64748b' }}><MapPin size={12} />{h.city}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{h.revenue}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 6, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ width: `${h.occupancy}%`, height: '100%', borderRadius: 99, background: h.occupancy > 80 ? '#10b981' : h.occupancy > 65 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{h.occupancy}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>
                        <Star size={13} fill="#f59e0b" />{h.rating}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{h.bookings.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: h.trend === 'up' ? '#dcfce7' : '#fee2e2', color: h.trend === 'up' ? '#16a34a' : '#dc2626' }}>
                        {h.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {h.trend === 'up' ? 'Growing' : 'Declining'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Guest Analytics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <SectionTitle
            title="Guest Trends"
            sub="New vs returning guests over time"
            action={
              <div style={{ display: 'flex', gap: 6 }}>
                {['monthly','daily'].map(p => <PeriodBtn key={p} label={p.charAt(0).toUpperCase()+p.slice(1)} active={guestPeriod===p} onClick={() => setGuestPeriod(p)} />)}
              </div>
            }
          />
          {loading ? <Skeleton h={220} r={12} /> : (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                {[['#6366f1','New Guests'],['#10b981','Returning']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
                  </div>
                ))}
              </div>
              <div style={{ height: 220 }}>
                <Line data={guestLineConfig} options={chartOpts()} />
              </div>
            </>
          )}
        </Card>

        <Card>
          <SectionTitle title="Guest Composition" sub="New vs returning split" />
          {loading ? <Skeleton h={220} r={12} /> : (
            <>
              <div style={{ height: 180 }}>
                <Pie data={guestPieConfig} options={pieOpts} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
                {[['#6366f1','New','62%'],['#10b981','Returning','38%']].map(([c,l,v]) => (
                  <div key={l} style={{ textAlign: 'center', padding: '10px 16px', borderRadius: 12, background: `${c}10` }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{l}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ── Location + Booking Trends ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <SectionTitle title="Revenue by City" sub="Top cities (₹ Lakhs)" />
          {loading ? <Skeleton h={240} r={12} /> : (
            <div style={{ height: 240 }}>
              <Bar data={cityBarConfig} options={chartOpts()} />
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Booking Trends" sub="Bookings vs cancellations" />
          {loading ? <Skeleton h={240} r={12} /> : (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                {[['#6366f1','Bookings'],['#fca5a5','Cancellations']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
                  </div>
                ))}
              </div>
              <div style={{ height: 210 }}>
                <Bar data={bookingBarConfig} options={chartOpts()} />
              </div>
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Avg Cancellation Rate:</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>7.2%</span>
                <TrendingDown size={14} color="#ef4444" />
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, background: '#0f172a', color: 'white', padding: '14px 22px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontSize: 14, fontWeight: 600 }}>
          <ArrowUpRight size={16} color="#4ade80" /> Report exported successfully
        </motion.div>
      )}
    </motion.div>
  );
};

export default Analytics;

