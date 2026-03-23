import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import {
  TrendingUp, TrendingDown, Wallet, BedDouble, AlertTriangle,
  CreditCard, Download, RefreshCw, SlidersHorizontal,
  Trophy, AlertOctagon, MapPin, Sparkles, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(end, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [end, duration]);
  return val;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const QUARTERS = ['Q1','Q2','Q3','Q4'];
const CITIES   = ['All Cities','Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Goa'];
const CATS     = ['All Categories','Luxury','Budget','Boutique','Resort'];

const revMonthly   = { cur:[42,58,51,67,74,89,95,102,88,110,125,142], prev:[35,44,40,55,60,72,80,88,75,92,105,118] };
const revQuarterly = { cur:[151,230,285,377], prev:[119,187,243,315] };
const hotelRev     = { labels:['Grand Omni','Riviera','Urban Boutique','Sky Palace','Meridian'], cur:[2450,1820,980,1650,2100], prev:[2100,1600,850,1400,1900] };
const cityData     = { labels:['Chennai','Bangalore','Mumbai','Delhi','Hyderabad','Goa'], values:[40,35,30,28,22,18] };
const distData     = { labels:['Room Booking','Events','Spa & Dining'], values:[62,24,14], colors:['#818cf8','#34d399','#fbbf24'] };

const HOTELS = [
  { rank:1, name:'Taj Hotel',       city:'Chennai',   rev:'₹12L', growth:18,  occ:88, cancel:12, fail:'Gateway Timeout',      failC:'#f97316', status:'top' },
  { rank:2, name:'ITC Grand',       city:'Mumbai',    rev:'₹10L', growth:12,  occ:82, cancel:8,  fail:'Card Declined',         failC:'#ef4444', status:'top' },
  { rank:3, name:'OYO Elite',       city:'Bangalore', rev:'₹8L',  growth:9,   occ:76, cancel:18, fail:'Insufficient Balance',  failC:'#f59e0b', status:'avg' },
  { rank:4, name:'Marriott Suites', city:'Delhi',     rev:'₹7.5L',growth:6,   occ:79, cancel:6,  fail:'Gateway Timeout',       failC:'#f97316', status:'avg' },
  { rank:5, name:'The Leela',       city:'Goa',       rev:'₹6.8L',growth:4,   occ:71, cancel:14, fail:'Card Declined',         failC:'#ef4444', status:'avg' },
  { rank:6, name:'Radisson Blu',    city:'Pune',      rev:'—',    growth:null, occ:39, cancel:22, fail:'Insufficient Balance',  failC:'#f59e0b', status:'risk' },
  { rank:7, name:'ITC Sonar',       city:'Kolkata',   rev:'—',    growth:null, occ:44, cancel:18, fail:'Card Declined',         failC:'#ef4444', status:'risk' },
  { rank:8, name:'Urban Boutique',  city:'Hyderabad', rev:'—',    growth:null, occ:47, cancel:15, fail:'Gateway Timeout',       failC:'#f97316', status:'risk' },
];

const STATUS_META = {
  top:  { label:'Top Performer',   bg:'rgba(52,211,153,0.12)',  color:'#10b981', dot:'#10b981' },
  avg:  { label:'Average',         bg:'rgba(251,191,36,0.12)',  color:'#d97706', dot:'#f59e0b' },
  risk: { label:'Needs Attention', bg:'rgba(239,68,68,0.12)',   color:'#dc2626', dot:'#ef4444' },
};

// ── Primitives ────────────────────────────────────────────────────────────────
const GlassCard = ({ children, style = {}, glow }) => (
  <div style={{
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: glow
      ? `var(--card-shadow), 0 0 0 1px ${glow}22, 0 8px 32px ${glow}18`
      : 'var(--card-shadow)',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const Tag = ({ children, bg, color }) => (
  <span style={{ fontSize:'10px', fontWeight:'800', padding:'3px 9px', borderRadius:'20px', background:bg, color, letterSpacing:'0.04em', display:'inline-flex', alignItems:'center', gap:'4px' }}>
    {children}
  </span>
);

const OccBar = ({ pct }) => {
  const c = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <span style={{ fontSize:'12px', fontWeight:'800', color:c }}>{pct}%</span>
      <div style={{ height:'5px', background:'var(--card-border)', borderRadius:'99px', overflow:'hidden', marginTop:'5px', width:'80px' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, ease:'easeOut' }}
          style={{ height:'100%', background:`linear-gradient(90deg,${c}99,${c})`, borderRadius:'99px' }} />
      </div>
    </div>
  );
};

// ── Circular progress ─────────────────────────────────────────────────────────
const Ring = ({ pct, color, size = 56, stroke = 5 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--card-border)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration:1.2, ease:'easeOut' }} />
    </svg>
  );
};

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ delay, gradient, icon, iconColor, value, label, sub, trend, invertTrend, ring, ringColor, extra }) {
  const good = invertTrend ? trend < 0 : trend > 0;
  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.45, ease:'easeOut' }}
      whileHover={{ y:-4, boxShadow:`0 24px 56px ${iconColor}22` }}
      style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'20px', padding:'22px',
        boxShadow:'var(--card-shadow)', display:'flex', flexDirection:'column', gap:'14px', position:'relative', overflow:'hidden', cursor:'default' }}>
      {/* gradient accent top-right */}
      <div style={{ position:'absolute', top:0, right:0, width:'120px', height:'120px', borderRadius:'0 20px 0 120px',
        background:`linear-gradient(135deg,${iconColor}18,${iconColor}06)`, pointerEvents:'none' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:gradient, display:'grid', placeItems:'center', boxShadow:`0 4px 14px ${iconColor}30` }}>
          {React.cloneElement(icon, { size:20, color:'white' })}
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'800',
          color: good?'#10b981':'#ef4444', background: good?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',
          padding:'4px 9px', borderRadius:'20px' }}>
          {good ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}{Math.abs(trend)}%
        </span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        {ring !== undefined && <Ring pct={ring} color={iconColor} />}
        <div>
          <p style={{ fontSize:'28px', fontWeight:'900', color:'var(--text-primary)', letterSpacing:'-1.5px', lineHeight:1 }}>{value}</p>
          <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-secondary)', marginTop:'4px' }}>{label}</p>
          <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>{sub}</p>
        </div>
      </div>
      {extra}
    </motion.div>
  );
}

// ── Chart defaults ────────────────────────────────────────────────────────────
const chartBase = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display:true, position:'top', labels:{ font:{ size:11, weight:'600' }, color:'#94a3b8', boxWidth:10, padding:16, usePointStyle:true } },
    tooltip: { mode:'index', intersect:false, backgroundColor:'rgba(15,23,42,0.92)', titleColor:'#f1f5f9', bodyColor:'#94a3b8', padding:12, cornerRadius:10, borderColor:'rgba(255,255,255,0.08)', borderWidth:1 }
  },
  scales: {
    x: { grid:{ display:false }, ticks:{ color:'#64748b', font:{ size:11 } }, border:{ display:false } },
    y: { grid:{ color:'rgba(148,163,184,0.06)' }, ticks:{ color:'#64748b', font:{ size:11 }, callback: v => '₹'+v+'L' }, border:{ display:false } }
  }
};

// ── Main Component ────────────────────────────────────────────────────────────
const Analytics = () => {
  const [revMode, setRevMode] = useState('monthly');
  const [fromDate, setFrom]   = useState('2025-01-01');
  const [toDate, setTo]       = useState('2025-12-31');
  const [city, setCity]       = useState('All Cities');
  const [cat, setCat]         = useState('All Categories');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const apply = () => { setLoading(true); setTimeout(() => setLoading(false), 800); };
  const reset = () => { setFrom('2025-01-01'); setTo('2025-12-31'); setCity('All Cities'); setCat('All Categories'); };

  const revLabels = revMode === 'monthly' ? MONTHS : QUARTERS;
  const revCur    = revMode === 'monthly' ? revMonthly.cur : revQuarterly.cur;
  const revPrev   = revMode === 'monthly' ? revMonthly.prev : revQuarterly.prev;

  const lineData = {
    labels: revLabels,
    datasets: [
      { label:'2025', data:revCur,  borderColor:'#818cf8', backgroundColor:'rgba(129,140,248,0.1)', borderWidth:2.5, fill:true, tension:0.45, pointRadius:0, pointHoverRadius:5, pointBackgroundColor:'#818cf8' },
      { label:'2024', data:revPrev, borderColor:'#475569', backgroundColor:'transparent', borderWidth:1.5, fill:false, tension:0.45, pointRadius:0, pointHoverRadius:4, borderDash:[5,5] },
    ]
  };

  const barData = {
    labels: hotelRev.labels,
    datasets: [
      { label:'2025', data:hotelRev.cur,  backgroundColor:'rgba(129,140,248,0.85)', borderRadius:8, borderSkipped:false },
      { label:'2024', data:hotelRev.prev, backgroundColor:'rgba(71,85,105,0.4)',    borderRadius:8, borderSkipped:false },
    ]
  };

  const cityBarData = {
    labels: cityData.labels,
    datasets: [{ label:'Revenue (₹L)', data:cityData.values,
      backgroundColor:['rgba(129,140,248,0.85)','rgba(52,211,153,0.85)','rgba(251,191,36,0.85)','rgba(236,72,153,0.85)','rgba(139,92,246,0.85)','rgba(6,182,212,0.85)'],
      borderRadius:8, borderSkipped:false }]
  };

  const donutData = {
    labels: distData.labels,
    datasets: [{ data:distData.values, backgroundColor:distData.colors, borderWidth:0, hoverOffset:8 }]
  };
  const donutOpts = {
    responsive:true, maintainAspectRatio:false, cutout:'72%',
    plugins: {
      legend:{ display:true, position:'bottom', labels:{ font:{ size:12, weight:'600' }, color:'#94a3b8', padding:18, boxWidth:10, usePointStyle:true } },
      tooltip:{ callbacks:{ label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }, backgroundColor:'rgba(15,23,42,0.92)', titleColor:'#f1f5f9', bodyColor:'#94a3b8', padding:12, cornerRadius:10 }
    }
  };

  const iStyle = { padding:'9px 14px', borderRadius:'10px', border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:'13px', outline:'none', transition:'border-color 0.2s' };

  const filteredHotels = activeTab === 'all' ? HOTELS : HOTELS.filter(h => h.status === activeTab);

  return (
    <div style={{ minHeight:'100%' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'grid', placeItems:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
              <Sparkles size={18} color="white"/>
            </div>
            <h1 style={{ fontSize:'24px', fontWeight:'900', color:'var(--text-primary)', letterSpacing:'-0.8px' }}>Analytics Dashboard</h1>
          </div>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)', paddingLeft:'46px' }}>Platform-wide performance across all hotel tenants</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'12px',
          border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)',
          fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow:'var(--card-shadow)' }}>
          <Download size={14}/> Export Excel
        </button>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
        style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'16px',
          padding:'14px 20px', marginBottom:'24px', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end',
          boxShadow:'var(--card-shadow)' }}>
        {[['FROM', fromDate, setFrom, 'date'], ['TO', toDate, setTo, 'date']].map(([lbl, val, set, type]) => (
          <div key={lbl}>
            <p style={{ fontSize:'10px', fontWeight:'800', color:'var(--text-muted)', marginBottom:'5px', letterSpacing:'0.08em' }}>{lbl}</p>
            <input type={type} value={val} onChange={e => set(e.target.value)} style={iStyle} />
          </div>
        ))}
        {[['CITY', city, setCity, CITIES], ['CATEGORY', cat, setCat, CATS]].map(([lbl, val, set, opts]) => (
          <div key={lbl}>
            <p style={{ fontSize:'10px', fontWeight:'800', color:'var(--text-muted)', marginBottom:'5px', letterSpacing:'0.08em' }}>{lbl}</p>
            <select value={val} onChange={e => set(e.target.value)} style={{ ...iStyle, cursor:'pointer' }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display:'flex', gap:'8px', marginLeft:'auto' }}>
          <button onClick={reset} title="Reset" style={{ padding:'9px 12px', borderRadius:'10px', border:'1px solid var(--card-border)', background:'var(--card-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-secondary)' }}>
            <RefreshCw size={14}/>
          </button>
          <button onClick={apply} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 20px', borderRadius:'10px', border:'none',
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:'13px', fontWeight:'700', cursor:'pointer',
            boxShadow:'0 4px 14px rgba(99,102,241,0.35)' }}>
            <SlidersHorizontal size={13}/> Apply
          </button>
        </div>
      </motion.div>

      {/* ── Metric Cards ── */}
      <AnimatePresence>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', marginBottom:'24px' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'20px', padding:'22px', height:'170px', animation:'shimmer 1.5s infinite' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'var(--bg-darker)', marginBottom:'16px' }} />
                <div style={{ height:'28px', width:'60%', borderRadius:'8px', background:'var(--bg-darker)', marginBottom:'8px' }} />
                <div style={{ height:'13px', width:'40%', borderRadius:'6px', background:'var(--bg-darker)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', marginBottom:'24px' }}>
            <MetricCard delay={0} gradient="linear-gradient(135deg,#10b981,#059669)" iconColor="#10b981"
              icon={<Wallet/>} value="₹1.42Cr" label="Total Revenue" sub="vs ₹1.18Cr last year" trend={20.3} />
            <MetricCard delay={0.08} gradient="linear-gradient(135deg,#8b5cf6,#6366f1)" iconColor="#8b5cf6"
              icon={<BedDouble/>} value="82.4%" label="Occupancy Rate" sub="Across all properties" trend={8.1} ring={82} ringColor="#8b5cf6" />
            <MetricCard delay={0.16} gradient="linear-gradient(135deg,#f97316,#ef4444)" iconColor="#f97316"
              icon={<AlertTriangle/>} value="₹18.5L" label="Revenue Leakage" sub="Refunds · Cancellations · No-shows" trend={-4.2} invertTrend
              extra={
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                  {[['Refunds','₹8L','#ef4444'],['Cancels','₹6L','#f97316'],['No-shows','₹4.5L','#f59e0b']].map(([l,v,c]) => (
                    <span key={l} style={{ fontSize:'10px', fontWeight:'800', padding:'2px 8px', borderRadius:'6px', background:c+'18', color:c }}>{l} {v}</span>
                  ))}
                </div>
              }
            />
            <MetricCard delay={0.24} gradient="linear-gradient(135deg,#06b6d4,#0ea5e9)" iconColor="#06b6d4"
              icon={<CreditCard/>} value="96.2%" label="Payment Success" sub="Successful transactions" trend={1.4} ring={96} ringColor="#06b6d4"
              extra={
                <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', borderRadius:'10px', background:'rgba(6,182,212,0.06)', border:'1px solid rgba(6,182,212,0.12)' }}>
                  <span style={{ fontSize:'11px', color:'#10b981', fontWeight:'800' }}>✓ 96.2%</span>
                  <span style={{ fontSize:'11px', color:'#ef4444', fontWeight:'800' }}>✗ 3.8%</span>
                </div>
              }
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Charts Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'20px', marginBottom:'20px' }}>
        <GlassCard glow="#6366f1">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
            <div>
              <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>Revenue Growth</h3>
              <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'2px' }}>2025 vs 2024</p>
            </div>
            <div style={{ display:'flex', gap:'3px', background:'var(--bg-darker)', borderRadius:'10px', padding:'3px' }}>
              {['monthly','quarterly'].map(m => (
                <button key={m} onClick={() => setRevMode(m)} style={{ padding:'5px 13px', borderRadius:'8px', border:'none', fontSize:'11px', fontWeight:'700', cursor:'pointer',
                  background: revMode===m ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                  color: revMode===m ? 'white' : 'var(--text-secondary)', transition:'all 0.2s',
                  boxShadow: revMode===m ? '0 2px 8px rgba(99,102,241,0.3)' : 'none' }}>
                  {m === 'monthly' ? 'Monthly' : 'Quarterly'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height:'230px' }}><Line data={lineData} options={chartBase} /></div>
        </GlassCard>

        <GlassCard glow="#10b981">
          <div style={{ marginBottom:'20px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>Revenue by Hotel</h3>
            <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'2px' }}>Top 5 — 2025 vs 2024</p>
          </div>
          <div style={{ height:'230px' }}><Bar data={barData} options={chartBase} /></div>
        </GlassCard>
      </div>

      {/* ── Insight Table ── */}
      <GlassCard style={{ marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>Hotel Insights Overview</h3>
            <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'2px' }}>Performance, risk & payment health across all properties</p>
          </div>
          {/* Tab filter */}
          <div style={{ display:'flex', gap:'4px', background:'var(--bg-darker)', borderRadius:'12px', padding:'4px' }}>
            {[['all','All'],['top','Top'],['avg','Average'],['risk','At Risk']].map(([k,l]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={{ padding:'5px 13px', borderRadius:'8px', border:'none', fontSize:'11px', fontWeight:'700', cursor:'pointer',
                background: activeTab===k ? 'var(--card-bg)' : 'transparent',
                color: activeTab===k ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab===k ? 'var(--card-shadow)' : 'none', transition:'all 0.2s' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'820px' }}>
            <thead>
              <tr>
                {['#','Hotel','City','Revenue','Growth','Occupancy','Cancel Rate','Failure Reason','Status'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'10px', fontWeight:'900',
                    color:'var(--text-muted)', letterSpacing:'0.08em', background:'var(--bg-darker)',
                    borderBottom:'1px solid var(--card-border)',
                    ...(h==='#' ? { borderRadius:'10px 0 0 10px' } : h==='Status' ? { borderRadius:'0 10px 10px 0' } : {}) }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((h, i) => {
                const sm = STATUS_META[h.status];
                const initials = h.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
                const avatarColors = ['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#ef4444','#f97316'];
                const ac = avatarColors[i % avatarColors.length];
                return (
                  <motion.tr key={h.name} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.04 }}
                    style={{ borderBottom:'1px solid var(--card-border)', transition:'background 0.15s', cursor:'default' }}
                    onMouseOver={e => e.currentTarget.style.background='rgba(99,102,241,0.04)'}
                    onMouseOut={e => e.currentTarget.style.background='transparent'}>

                    <td style={{ padding:'14px 14px' }}>
                      <div style={{ width:'26px', height:'26px', borderRadius:'8px',
                        background: h.rank===1?'linear-gradient(135deg,#fbbf24,#f59e0b)':h.rank===2?'linear-gradient(135deg,#94a3b8,#64748b)':h.rank===3?'linear-gradient(135deg,#f97316,#ea580c)':`linear-gradient(135deg,${avatarColors[i % avatarColors.length]}99,${avatarColors[i % avatarColors.length]}cc)`,
                        display:'grid', placeItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
                        <span style={{ fontSize:'11px', fontWeight:'900', color:'white' }}>{h.rank}</span>
                      </div>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:`linear-gradient(135deg,${ac}cc,${ac})`,
                          display:'grid', placeItems:'center', flexShrink:0, boxShadow:`0 3px 10px ${ac}40` }}>
                          <span style={{ fontSize:'11px', fontWeight:'900', color:'white' }}>{initials}</span>
                        </div>
                        <span style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-primary)' }}>{h.name}</span>
                      </div>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      <span style={{ fontSize:'12px', color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:'3px' }}>
                        <MapPin size={10}/>{h.city}
                      </span>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      <span style={{ fontSize:'13px', fontWeight:'800', color: h.rev==='—'?'var(--text-muted)':'var(--text-primary)' }}>{h.rev}</span>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      {h.growth !== null ? (
                        <span style={{ fontSize:'11px', fontWeight:'800', color:'#10b981', background:'rgba(16,185,129,0.1)', padding:'3px 9px', borderRadius:'20px', display:'inline-flex', alignItems:'center', gap:'3px' }}>
                          <TrendingUp size={10}/>+{h.growth}%
                        </span>
                      ) : (
                        <span style={{ fontSize:'11px', fontWeight:'800', color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'3px 9px', borderRadius:'20px', display:'inline-flex', alignItems:'center', gap:'3px' }}>
                          <TrendingDown size={10}/>Low
                        </span>
                      )}
                    </td>

                    <td style={{ padding:'14px 14px' }}><OccBar pct={h.occ} /></td>

                    <td style={{ padding:'14px 14px' }}>
                      <span style={{ fontSize:'12px', fontWeight:'800', color: h.cancel<10?'#10b981':h.cancel<=20?'#f59e0b':'#ef4444' }}>{h.cancel}%</span>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      <span style={{ fontSize:'11px', fontWeight:'700', color:h.failC, background:h.failC+'15', padding:'3px 9px', borderRadius:'7px' }}>{h.fail}</span>
                    </td>

                    <td style={{ padding:'14px 14px' }}>
                      <span style={{ fontSize:'11px', fontWeight:'800', padding:'4px 11px', borderRadius:'20px', background:sm.bg, color:sm.color, display:'inline-flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:sm.dot, display:'inline-block' }}/>
                        {sm.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Bottom Charts ── */}
      <div style={{ display:'grid', gridTemplateColumns:'0.8fr 1.2fr', gap:'20px' }}>
        <GlassCard glow="#818cf8">
          <div style={{ marginBottom:'20px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>Revenue Distribution</h3>
            <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'2px' }}>By category this year</p>
          </div>
          <div style={{ height:'220px', position:'relative' }}>
            <Doughnut data={donutData} options={donutOpts} />
            <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
              <p style={{ fontSize:'18px', fontWeight:'900', color:'var(--text-primary)', lineHeight:1 }}>₹1.42Cr</p>
              <p style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'2px' }}>Total</p>
            </div>
          </div>
          {/* Legend pills */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'16px' }}>
            {distData.labels.map((l,i) => (
              <span key={l} style={{ fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px', background:distData.colors[i]+'18', color:distData.colors[i] }}>
                {l} {distData.values[i]}%
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard glow="#34d399">
          <div style={{ marginBottom:'20px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>City-wise Performance</h3>
            <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'2px' }}>Revenue in ₹L by city</p>
          </div>
          <div style={{ height:'260px' }}>
            <Bar data={cityBarData} options={{ ...chartBase,
              plugins:{ ...chartBase.plugins, legend:{ display:false } },
              scales:{ x:{ grid:{ display:false }, ticks:{ color:'#64748b', font:{ size:11 } }, border:{ display:false } },
                y:{ grid:{ color:'rgba(148,163,184,0.06)' }, ticks:{ color:'#64748b', font:{ size:11 }, callback: v => '₹'+v+'L' }, border:{ display:false } } }
            }} />
          </div>
        </GlassCard>
      </div>

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default Analytics;
