import { useState } from 'react';
import { LifeBuoy, CheckSquare, Briefcase, CheckCircle2, TrendingUp, TrendingDown, Clock, UserPlus, Phone, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStaffTheme } from '../../context/useStaffTheme';

const WORK_TREND = [
  { day:'Mon', tasks:8,  tickets:5 }, { day:'Tue', tasks:12, tickets:7 },
  { day:'Wed', tasks:9,  tickets:4 }, { day:'Thu', tasks:15, tickets:9 },
  { day:'Fri', tasks:11, tickets:6 }, { day:'Sat', tasks:6,  tickets:3 },
  { day:'Sun', tasks:4,  tickets:2 },
];
const TICKET_STATUS = [
  { name:'Open',        value:14, color:'#3b82f6' },
  { name:'In Progress', value:8,  color:'#f59e0b' },
  { name:'Closed',      value:22, color:'#10b981' },
];
const TASK_DIST = [
  { name:'Completed', value:18, color:'#10b981' },
  { name:'Pending',   value:9,  color:'#f59e0b' },
  { name:'Overdue',   value:4,  color:'#ef4444' },
];
const ACTIVITIES = [
  { Icon:UserPlus,     iconBg:'#1e3a5f', iconBgL:'#eff6ff', iconColor:'#60a5fa', iconColorL:'#2563eb', text:'New lead assigned: Vertex Corp',         time:'10m ago' },
  { Icon:LifeBuoy,     iconBg:'#451a03', iconBgL:'#fffbeb', iconColor:'#fbbf24', iconColorL:'#d97706', text:'Ticket TKT-1042 updated to In Progress', time:'25m ago' },
  { Icon:CheckCircle2, iconBg:'#052e16', iconBgL:'#f0fdf4', iconColor:'#4ade80', iconColorL:'#16a34a', text:'Task "Follow up with David" completed',   time:'1h ago'  },
  { Icon:Phone,        iconBg:'#2e1065', iconBgL:'#faf5ff', iconColor:'#c084fc', iconColorL:'#7c3aed', text:'Call logged with Acme Corp',             time:'2h ago'  },
  { Icon:Calendar,     iconBg:'#4c0519', iconBgL:'#fff1f2', iconColor:'#fb7185', iconColorL:'#e11d48', text:'Meeting scheduled: Product Demo',        time:'3h ago'  },
];
const KPI_META = [
  { Icon:LifeBuoy,     label:'Assigned Tickets', value:14, change:'+3', up:true  },
  { Icon:CheckSquare,  label:'Open Tasks',        value:9,  change:'-2', up:false },
  { Icon:Briefcase,    label:'Deals in Progress', value:6,  change:'+1', up:true  },
  { Icon:CheckCircle2, label:'Completed Work',    value:18, change:'+5', up:true  },
];
const FILTERS = ['Today', 'This Week', 'This Month'];

export default function StaffDashboard() {
  const { t, isDark } = useStaffTheme();
  const [period, setPeriod] = useState('This Week');

  const card = { background: t.card, borderRadius:'16px', border:`1px solid ${t.cardBorder}`, boxShadow: t.cardShadow, transition:'background 0.2s, border-color 0.2s' };
  const tooltipStyle = { borderRadius:12, border:`1px solid ${t.cardBorder}`, boxShadow:'0 4px 24px rgba(0,0,0,0.15)', fontSize:13, background: t.card, color: t.text };

  return (
    <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'24px', minHeight:'100%', background: t.bg, transition:'background 0.2s' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div>
          <h2 style={{ fontSize:'24px', fontWeight:900, color: t.text, margin:0, letterSpacing:'-0.5px' }}>Good morning, Emma 👋</h2>
          <p style={{ fontSize:'14px', color: t.textSecondary, margin:'4px 0 0' }}>Here's what's happening with your work today.</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', background: t.card, border:`1px solid ${t.cardBorder}`, borderRadius:'12px', padding:'4px', boxShadow: t.cardShadow }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setPeriod(f)}
              style={{ padding:'7px 16px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, transition:'all 0.15s', background: period===f ? '#2563eb' : 'transparent', color: period===f ? 'white' : t.textSecondary }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
        {KPI_META.map(({ Icon, label, value, change, up }, i) => {
          const k = t.kpi[i];
          return (
            <div key={label} style={{ ...card, border:`1px solid ${k.border}`, padding:'20px', display:'flex', flexDirection:'column', gap:'16px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background: k.iconBg, display:'grid', placeItems:'center', flexShrink:0 }}>
                  <Icon size={22} color={k.iconColor} />
                </div>
                <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: up ? (isDark?'#052e16':'#f0fdf4') : (isDark?'#450a0a':'#fef2f2'), color: up ? (isDark?'#4ade80':'#16a34a') : (isDark?'#fca5a5':'#dc2626') }}>
                  {up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {change}
                </span>
              </div>
              <div>
                <p style={{ fontSize:'32px', fontWeight:900, color: t.text, margin:0, lineHeight:1 }}>{value}</p>
                <p style={{ fontSize:'13px', color: t.textSecondary, fontWeight:500, margin:'4px 0 0' }}>{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px' }}>
        <div style={{ ...card, padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <div>
              <h3 style={{ fontSize:'15px', fontWeight:700, color: t.text, margin:0 }}>Work Trend</h3>
              <p style={{ fontSize:'12px', color: t.textMuted, margin:'3px 0 0' }}>Tasks vs Tickets this week</p>
            </div>
            <span style={{ fontSize:'12px', color: t.textMuted, background: t.bgSecondary, padding:'4px 12px', borderRadius:'8px', fontWeight:500 }}>{period}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WORK_TREND}>
              <defs>
                <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gK" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} />
              <XAxis dataKey="day" tick={{ fontSize:12, fill: t.chartTick }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fill: t.chartTick }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color: t.textSecondary }} />
              <Area type="monotone" dataKey="tasks"   stroke="#3b82f6" strokeWidth={2.5} fill="url(#gT)" name="Tasks"   dot={{ r:4, fill:'#3b82f6' }} />
              <Area type="monotone" dataKey="tickets" stroke="#10b981" strokeWidth={2.5} fill="url(#gK)" name="Tickets" dot={{ r:4, fill:'#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding:'20px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:700, color: t.text, margin:'0 0 4px' }}>Task Distribution</h3>
          <p style={{ fontSize:'12px', color: t.textMuted, margin:'0 0 16px' }}>By completion status</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={TASK_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {TASK_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginTop:'12px' }}>
            {TASK_DIST.map(({ name, value, color }) => (
              <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:color, flexShrink:0 }} />
                  <span style={{ fontSize:'13px', color: t.textSecondary, fontWeight:500 }}>{name}</span>
                </div>
                <span style={{ fontSize:'13px', fontWeight:700, color: t.text }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px' }}>
        <div style={{ ...card, padding:'20px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:700, color: t.text, margin:'0 0 4px' }}>Ticket Status Breakdown</h3>
          <p style={{ fontSize:'12px', color: t.textMuted, margin:'0 0 20px' }}>Open · In Progress · Closed</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TICKET_STATUS} layout="vertical" barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize:12, fill: t.chartTick }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:13, fill: t.textSecondary, fontWeight:600 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0,8,8,0]} name="Count">
                {TICKET_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding:'20px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:700, color: t.text, margin:'0 0 16px' }}>Recent Activity</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {ACTIVITIES.map(({ Icon, iconBg, iconBgL, iconColor, iconColorL, text, time }, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background: isDark ? iconBg : iconBgL, display:'grid', placeItems:'center', flexShrink:0 }}>
                  <Icon size={15} color={isDark ? iconColor : iconColorL} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'13px', color: t.text, fontWeight:500, margin:0, lineHeight:1.4 }}>{text}</p>
                  <p style={{ fontSize:'11px', color: t.textMuted, margin:'3px 0 0', display:'flex', alignItems:'center', gap:'4px' }}>
                    <Clock size={10} /> {time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
