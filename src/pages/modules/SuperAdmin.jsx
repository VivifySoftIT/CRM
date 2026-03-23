import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, Users, CheckCircle2, ToggleLeft, ToggleRight, Plus, MapPin, Server, ShieldAlert, Download, TrendingUp, TrendingDown, DollarSign, BedDouble, AlertCircle, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [{ label: '', data, borderColor: color, borderWidth: 2, fill: true, backgroundColor: color + '22', tension: 0.4, pointRadius: 0 }]
  };
  const opts = { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false }, legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
  return <div style={{ height: '36px', width: '100%' }}><Line data={chartData} options={opts} /></div>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, iconColor, label, rawValue, displayValue, sub, subColor, subIcon, progress, sparkData, sparkColor, delay }) {
  const count = useCountUp(rawValue);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, boxShadow: '0 20px 48px rgba(0,0,0,0.13)' }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'var(--card-shadow)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, display: 'grid', placeItems: 'center' }}>
          {React.cloneElement(icon, { size: 18, color: iconColor })}
        </div>
        <span style={{ fontSize: '11px', fontWeight: '700', color: subColor || '#10b981', background: (subColor || '#10b981') + '18', padding: '3px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {subIcon}{sub}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>{displayValue(count)}</p>
        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</p>
      </div>
      {progress !== undefined && (
        <div>
          <div style={{ height: '6px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: iconColor, borderRadius: '99px' }} />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{progress}% occupancy rate</p>
        </div>
      )}
      {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
    </motion.div>
  );
}

// ── Hotel Performance Table ───────────────────────────────────────────────────
const HOTELS = [
  { id:1, name:'Taj Hotel',        location:'Chennai',   occupancy:82, revenue:120000, bookings:320, rating:4.5, status:'Active', trend:'+8%'  },
  { id:2, name:'OYO Rooms',        location:'Bangalore', occupancy:65, revenue:80000,  bookings:210, rating:4.0, status:'Active', trend:'+3%'  },
  { id:3, name:'ITC Grand',        location:'Mumbai',    occupancy:45, revenue:60000,  bookings:150, rating:3.8, status:'Issue',  trend:'-5%'  },
  { id:4, name:'Marriott Suites',  location:'Delhi',     occupancy:91, revenue:210000, bookings:480, rating:4.8, status:'Active', trend:'+12%' },
  { id:5, name:'Lemon Tree',       location:'Hyderabad', occupancy:58, revenue:72000,  bookings:190, rating:4.1, status:'Active', trend:'+2%'  },
  { id:6, name:'Radisson Blu',     location:'Pune',      occupancy:39, revenue:45000,  bookings:110, rating:3.5, status:'Issue',  trend:'-9%'  },
  { id:7, name:'The Leela Palace', location:'Goa',       occupancy:88, revenue:195000, bookings:410, rating:4.9, status:'Active', trend:'+15%' },
  { id:8, name:'Hyatt Regency',    location:'Kolkata',   occupancy:72, revenue:98000,  bookings:260, rating:4.3, status:'Active', trend:'+6%'  },
];
const PAGE_SIZE_TABLE = 5;

function Stars({ rating }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'3px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize:'12px', fontWeight:'700', color:'var(--text-secondary)', marginLeft:'4px' }}>{rating}</span>
    </div>
  );
}

function OccupancyBar({ pct }) {
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ minWidth:'90px' }}>
      <span style={{ fontSize:'13px', fontWeight:'700', color, display:'block', marginBottom:'4px' }}>{pct}%</span>
      <div style={{ height:'5px', background:'var(--card-border)', borderRadius:'99px', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7, ease:'easeOut' }}
          style={{ height:'100%', background:color, borderRadius:'99px' }} />
      </div>
    </div>
  );
}

function HotelPerformanceTable() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [cityFilter, setCity]     = useState('All');
  const [sortKey, setSortKey]     = useState(null);
  const [sortDir, setSortDir]     = useState('desc');
  const [page, setPage]           = useState(1);

  const cities = ['All', ...Array.from(new Set(HOTELS.map(h => h.location)))];

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const handleExport = () => {
    const rows = [['Hotel','Location','Occupancy%','Revenue','Bookings','Rating','Status'],
      ...HOTELS.map(h => [h.name, h.location, h.occupancy, h.revenue, h.bookings, h.rating, h.status])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'hotel-performance.csv'; a.click();
  };

  let data = HOTELS.filter(h => {
    const q = search.toLowerCase();
    return (!q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q))
      && (statusFilter === 'All' || h.status === statusFilter)
      && (cityFilter === 'All' || h.location === cityFilter);
  });
  if (sortKey) data = [...data].sort((a, b) => sortDir === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE_TABLE));
  const paged = data.slice((page - 1) * PAGE_SIZE_TABLE, page * PAGE_SIZE_TABLE);

  const SortIcon = ({ k }) => sortKey === k
    ? <span style={{ fontSize:'10px', marginLeft:'3px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
    : <span style={{ fontSize:'10px', marginLeft:'3px', opacity:0.3 }}>↕</span>;

  const iStyle = { padding:'9px 14px', borderRadius:'10px', border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:'13px', outline:'none' };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'20px', padding:'24px', boxShadow:'var(--card-shadow)', marginTop:'28px' }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h3 style={{ fontSize:'17px', fontWeight:'800', color:'var(--text-primary)' }}>Hotel Performance Overview</h3>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginTop:'2px' }}>Compare performance across all hotels</p>
        </div>
        <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'10px', border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'18px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:'180px' }}>
          <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search hotel or city..."
            style={{ ...iStyle, paddingLeft:'34px', width:'100%', boxSizing:'border-box' }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ ...iStyle, cursor:'pointer' }}>
          {['All','Active','Issue'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={cityFilter} onChange={e => { setCity(e.target.value); setPage(1); }} style={{ ...iStyle, cursor:'pointer' }}>
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
          <thead>
            <tr style={{ background:'var(--bg-darker)' }}>
              {[{label:'Hotel Name',key:null},{label:'Occupancy',key:'occupancy'},{label:'Revenue',key:'revenue'},{label:'Bookings',key:'bookings'},{label:'Rating',key:'rating'},{label:'Status',key:null},{label:'Actions',key:null}].map(({ label, key }) => (
                <th key={label} onClick={() => key && handleSort(key)}
                  style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:'800', color:'var(--text-secondary)', letterSpacing:'0.06em', whiteSpace:'nowrap', cursor: key ? 'pointer':'default', userSelect:'none' }}>
                  {label.toUpperCase()}{key && <SortIcon k={key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', color:'var(--text-secondary)', fontSize:'14px' }}>No hotels found.</td></tr>
            )}
            {paged.map((h, i) => (
              <tr key={h.id}
                style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-darker)', borderBottom:'1px solid var(--card-border)', transition:'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-darker)'}>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'#eef2ff', display:'grid', placeItems:'center', flexShrink:0 }}>
                      <Building2 size={16} color="#6366f1" />
                    </div>
                    <div>
                      <p style={{ fontWeight:'700', fontSize:'14px', color:'var(--text-primary)' }}>{h.name}</p>
                      <p style={{ fontSize:'11px', color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:'3px' }}><MapPin size={10}/>{h.location}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 16px' }}><OccupancyBar pct={h.occupancy} /></td>
                <td style={{ padding:'14px 16px' }}>
                  <p style={{ fontWeight:'700', fontSize:'14px', color:'var(--text-primary)' }}>&#8377;{h.revenue.toLocaleString()}</p>
                  <p style={{ fontSize:'11px', color: h.trend.startsWith('+') ? '#10b981':'#ef4444', fontWeight:'700', display:'flex', alignItems:'center', gap:'2px' }}>
                    {h.trend.startsWith('+') ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {h.trend}
                  </p>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <p style={{ fontWeight:'700', fontSize:'14px', color:'var(--text-primary)' }}>{h.bookings}</p>
                  <p style={{ fontSize:'11px', color:'var(--text-secondary)' }}>this month</p>
                </td>
                <td style={{ padding:'14px 16px' }}><Stars rating={h.rating} /></td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ fontSize:'11px', fontWeight:'800', padding:'4px 10px', borderRadius:'99px', background: h.status === 'Active' ? '#f0fdf4':'#fef2f2', color: h.status === 'Active' ? '#16a34a':'#dc2626' }}>
                    {h.status}
                  </span>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', fontSize:'12px', fontWeight:'700', color:'#6366f1', cursor:'pointer' }}>View</button>
                    <button style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', cursor:'pointer', display:'grid', placeItems:'center' }}>
                      <MoreVertical size={14} color="var(--text-secondary)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'16px', flexWrap:'wrap', gap:'8px' }}>
        <p style={{ fontSize:'13px', color:'var(--text-secondary)' }}>
          Showing {Math.min((page-1)*PAGE_SIZE_TABLE+1, data.length)}–{Math.min(page*PAGE_SIZE_TABLE, data.length)} of {data.length} hotels
        </p>
        <div style={{ display:'flex', gap:'6px' }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:'13px', fontWeight:'600', cursor: page===1?'not-allowed':'pointer', opacity: page===1?0.4:1 }}>
            ← Prev
          </button>
          {Array.from({ length:totalPages }, (_,i) => i+1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              style={{ padding:'7px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background: page===n?'#6366f1':'var(--card-bg)', color: page===n?'white':'var(--text-primary)', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:'13px', fontWeight:'600', cursor: page===totalPages?'not-allowed':'pointer', opacity: page===totalPages?0.4:1 }}>
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main SuperAdmin Component ─────────────────────────────────────────────────
const SuperAdmin = () => {
  const location = useLocation();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', admin: '', email: '', plan: 'Pro' });
  const [companies, setCompanies] = useState([
    { id:1, name:'Grand Omni Hotel',     admin:'Harish M.',     plan:'Enterprise', status:'Active',   revenue:'$2,450/mo', location:'New York, USA', email:'harish@omnihotel.com',    activeModules:['Guest Directory','Event Bookings','Marketing','Maintenance','Analytics'] },
    { id:2, name:'Riviera Resort & Spa', admin:'Alice Johnson', plan:'Pro',        status:'Active',   revenue:'$999/mo',   location:'Nice, France',  email:'alice@rivieraresort.com', activeModules:['Guest Directory','Marketing','Analytics'] },
    { id:3, name:'Urban Boutique Stay',  admin:'Bob Smith',     plan:'Basic',      status:'Past Due', revenue:'$299/mo',   location:'London, UK',    email:'bob@urbanstay.co',        activeModules:['Guest Directory','Support'] },
  ]);
  const allModules = ['Guest Directory','Event Bookings','Marketing','Maintenance','Analytics','Invoices','Contracts'];

  const handleAddHotel = (e) => {
    e.preventDefault();
    setCompanies([...companies, {
      ...newHotel, id: companies.length + 1, status: 'Active',
      revenue: newHotel.plan === 'Pro' ? '$999/mo' : newHotel.plan === 'Enterprise' ? '$2,450/mo' : '$299/mo',
      activeModules: ['Guest Directory']
    }]);
    setShowAddForm(false);
    setNewHotel({ name:'', location:'', admin:'', email:'', plan:'Pro' });
  };

  const toggleModule = (mod) => {
    if (!selectedCompany) return;
    const updated = selectedCompany.activeModules.includes(mod)
      ? selectedCompany.activeModules.filter(m => m !== mod)
      : [...selectedCompany.activeModules, mod];
    setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...c, activeModules: updated } : c));
    setSelectedCompany({ ...selectedCompany, activeModules: updated });
  };

  const renderContent = () => {

    // ── DASHBOARD ──────────────────────────────────────────────────────────────
    if (location.pathname.includes('/super-admin/dashboard')) {
      return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
            <div>
              <h1 style={{ fontSize:'28px', fontWeight:'800', color:'var(--text-primary)', marginBottom:'4px', letterSpacing:'-1px' }}>Platform Dashboard</h1>
              <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>OmniPlatform Global performance and statistics.</p>
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              <button className="btn-outline" style={{ gap:'8px', fontSize:'14px', padding:'10px 20px' }}>
                <Download size={16} /> Download Report
              </button>
              <button onClick={() => setShowAddForm(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#10b981', color:'white', border:'none', borderRadius:'12px', fontWeight:'700', fontSize:'14px', cursor:'pointer' }}>
                <Plus size={16} /> Add Hotel
              </button>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 220px))', gap:'28px', marginBottom:'32px' }}>
            <StatCard delay={0}   icon={<DollarSign />}  iconBg="#dcfce7" iconColor="#16a34a" label="Total Revenue"    rawValue={142500} displayValue={v => '$' + v.toLocaleString()} sub="+12% vs last month"    subColor="#16a34a" subIcon={<TrendingUp size={11}/>}   sparkData={[80,95,88,110,105,130,142]} sparkColor="#16a34a" />
            <StatCard delay={0.1} icon={<Building2 />}   iconBg="#dbeafe" iconColor="#2563eb" label="Active Hotels"    rawValue={14}     displayValue={v => v}                         sub="2 pending onboarding" subColor="#2563eb"                                sparkData={[8,9,10,10,12,13,14]}       sparkColor="#2563eb" />
            <StatCard delay={0.2} icon={<BedDouble />}   iconBg="#ede9fe" iconColor="#7c3aed" label="Occupancy Rate"   rawValue={78}     displayValue={v => v + '%'}                   sub="+5% this week"        subColor="#7c3aed" subIcon={<TrendingUp size={11}/>}   sparkData={[60,65,70,68,72,75,78]}     sparkColor="#7c3aed" progress={78} />
            <StatCard delay={0.3} icon={<AlertCircle />} iconBg="#fff7ed" iconColor="#ea580c" label="Pending Payments" rawValue={18200}  displayValue={v => '$' + v.toLocaleString()} sub="24 invoices pending"  subColor="#ea580c" subIcon={<TrendingDown size={11}/>} sparkData={[22000,20000,21000,19500,18800,18500,18200]} sparkColor="#ea580c" />
          </div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
            style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'20px', padding:'28px', boxShadow:'var(--card-shadow)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div>
                <h3 style={{ fontSize:'17px', fontWeight:'800', color:'var(--text-primary)' }}>Revenue Sources</h3>
                <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginTop:'2px' }}>Monthly breakdown by hotel category</p>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                {[['#10b981','Room Bookings'],['#6366f1','Events'],['#f59e0b','Spa & Dining']].map(([c,l]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--text-secondary)', fontWeight:'600' }}>
                    <div style={{ width:'10px', height:'10px', borderRadius:'3px', background:c }} />{l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height:'260px' }}>
              <Bar
                data={{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets:[
                  { label:'Room Bookings', data:[52000,61000,58000,72000,80000,91000,95000], backgroundColor:'#10b981cc', borderRadius:6 },
                  { label:'Events',        data:[18000,22000,19000,25000,28000,31000,30000], backgroundColor:'#6366f1cc', borderRadius:6 },
                  { label:'Spa & Dining',  data:[9000,11000,10000,13000,14000,16000,17500],  backgroundColor:'#f59e0bcc', borderRadius:6 },
                ]}}
                options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ mode:'index', intersect:false } }, scales:{ x:{ grid:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:12 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ color:'#94a3b8', font:{ size:12 }, callback: v => '$' + (v/1000) + 'k' } } } }}
              />
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // ── COMPANIES ──────────────────────────────────────────────────────────────
    if (location.pathname.includes('/super-admin/companies')) {
      return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
            <div>
              <h1 style={{ fontSize:'28px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'4px' }}>Hotel Network</h1>
              <p style={{ color:'var(--text-secondary)' }}>Provision and manage modules for your hotel clients.</p>
            </div>
            <button onClick={() => setShowAddForm(true)} className="btn-primary"><Plus size={18}/> Register New Hotel</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: selectedCompany ? '1fr 380px' : '1fr', gap:'24px' }}>
            <div className="glass-card" style={{ padding:'32px', background:'var(--card-bg)', border:'1px solid var(--card-border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-darker)', borderBottom:'1px solid var(--card-border)' }}>
                    {['HOTEL IDENTITY','PLAN','STATUS','REVENUE'].map((h,i) => (
                      <th key={h} style={{ textAlign: i===3?'right':'left', padding:'16px', fontSize:'12px', fontWeight:'800', color:'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c.id} onClick={() => setSelectedCompany(c)} style={{ borderBottom:'1px solid var(--card-border)', cursor:'pointer', background: selectedCompany?.id===c.id ? 'rgba(99,102,241,0.08)':'transparent' }}>
                      <td style={{ padding:'20px 16px' }}>
                        <p style={{ fontWeight:'700', fontSize:'15px' }}>{c.name}</p>
                        <p style={{ fontSize:'12px', color:'#94a3b8' }}>{c.location}</p>
                      </td>
                      <td style={{ padding:'16px' }}><span style={{ fontSize:'11px', fontWeight:'800', padding:'4px 10px', borderRadius:'20px', background:'#f1f5f9' }}>{c.plan}</span></td>
                      <td style={{ padding:'16px' }}><p style={{ color:'#10b981', fontWeight:'700', fontSize:'13px' }}>{c.status}</p></td>
                      <td style={{ padding:'16px', textAlign:'right', fontWeight:'700' }}>{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedCompany && (
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="glass-card" style={{ padding:'32px', background:'var(--card-bg)' }}>
                <h4 style={{ fontSize:'18px', marginBottom:'20px' }}>Plugin Overrides</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {allModules.map(mod => (
                    <div key={mod} onClick={() => toggleModule(mod)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
                      <span style={{ fontSize:'14px', fontWeight:'600' }}>{mod}</span>
                      {selectedCompany.activeModules.includes(mod) ? <ToggleRight color="#6366f1" size={36}/> : <ToggleLeft color="#cbd5e1" size={36}/>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    // ── PLANS ──────────────────────────────────────────────────────────────────
    if (location.pathname.includes('/super-admin/plans')) {
      return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div style={{ marginBottom:'32px' }}>
            <h1 style={{ fontSize:'28px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'4px' }}>Subscription Tiers</h1>
            <p style={{ color:'var(--text-secondary)' }}>Configure pricing and module limits for your SaaS offerings.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px' }}>
            {[
              { name:'Starter',    price:'$299/mo',   features:['1 Hotel Location','Guest Directory','Maintenance Support'] },
              { name:'Pro',        price:'$999/mo',   features:['3 Hotel Locations','Full Marketing Suite','Advanced Analytics','Custom Subdomains'] },
              { name:'Enterprise', price:'$2,450/mo', features:['Unlimited Locations','Whitelabeling','Dedicated Account Manager','Custom Integrations'] },
            ].map((plan, i) => (
              <div key={i} className="glass-card" style={{ padding:'32px', background:'var(--card-bg)', border: i===1 ? '2px solid #6366f1':'1px solid var(--card-border)' }}>
                <h3 style={{ fontSize:'20px', marginBottom:'8px' }}>{plan.name}</h3>
                <h2 style={{ fontSize:'32px', marginBottom:'24px' }}>{plan.price}</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {plan.features.map((f,fi) => (
                    <div key={fi} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="#10b981"/> {f}
                    </div>
                  ))}
                </div>
                <button className={i===1 ? 'btn-primary':'btn-outline'} style={{ width:'100%', marginTop:'32px', justifyContent:'center' }}>Edit Plan</button>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    // ── SETTINGS ───────────────────────────────────────────────────────────────
    if (location.pathname.includes('/super-admin/settings')) {
      return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div style={{ marginBottom:'32px' }}>
            <h1 style={{ fontSize:'28px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'4px' }}>Global Platform Settings</h1>
            <p style={{ color:'var(--text-secondary)' }}>Whitelabeling, domain management, and security policies.</p>
          </div>
          <div className="glass-card" style={{ padding:'32px', background:'var(--card-bg)', maxWidth:'600px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
              <div>
                <label style={{ display:'block', fontWeight:'700', fontSize:'14px', marginBottom:'12px' }}>Platform Name</label>
                <input type="text" defaultValue="OmniHotel SaaS" style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'1px solid var(--input-border)', background:'var(--input-bg)', color:'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:'700', fontSize:'14px', marginBottom:'12px' }}>Support Email</label>
                <input type="email" defaultValue="support@omnihotel.io" style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'1px solid var(--input-border)', background:'var(--input-bg)', color:'var(--text-primary)' }} />
              </div>
              <div style={{ padding:'20px', background:'#fff7ed', borderRadius:'12px', border:'1px solid #ffedd5' }}>
                <h4 style={{ color:'#c2410c', fontSize:'15px', display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}><ShieldAlert size={18}/> Maintenance Mode</h4>
                <p style={{ fontSize:'13px', color:'#9a3412', marginBottom:'16px' }}>Enabling this will block all hotel staff from accessing their dashboards.</p>
                <button className="btn-primary" style={{ background:'#ea580c' }}>Activate Global Lockdown</button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div style={{ position:'relative', minHeight:'100%' }}>
      {renderContent()}

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', backdropFilter:'blur(8px)', zIndex:1000, display:'grid', placeItems:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
              style={{ background:'var(--card-bg)', width:'500px', borderRadius:'24px', padding:'40px', boxShadow:'0 50px 100px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize:'24px', fontWeight:'700', marginBottom:'8px' }}>Onboard New Hotel</h2>
              <p style={{ color:'var(--text-secondary)', marginBottom:'32px' }}>Provision a new tenant on the platform.</p>
              <form onSubmit={handleAddHotel} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:'700', marginBottom:'6px', color:'var(--text-secondary)' }}>HOTEL NAME</label>
                    <input required type="text" placeholder="Grand Royal..." value={newHotel.name} onChange={e => setNewHotel({...newHotel, name:e.target.value})} style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--input-border)', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:'700', marginBottom:'6px', color:'var(--text-secondary)' }}>LOCATION</label>
                    <input required type="text" placeholder="Dubai, UAE" value={newHotel.location} onChange={e => setNewHotel({...newHotel, location:e.target.value})} style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--input-border)', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none' }} />
                  </div>
                </div>
                <div style={{ display:'flex', gap:'12px', marginTop:'12px' }}>
                  <button type="button" onClick={() => setShowAddForm(false)} style={{ flex:1, padding:'14px', borderRadius:'12px', border:'1px solid var(--input-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontWeight:'700', cursor:'pointer' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex:2, padding:'14px', borderRadius:'12px', border:'none', fontWeight:'700' }}>Confirm Provisioning</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdmin;
