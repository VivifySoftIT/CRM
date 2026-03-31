import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Briefcase, DollarSign, CheckCircle2, 
  Clock, ArrowUpRight, ArrowDownRight, Plus, Search, 
  MoreVertical, Calendar, Phone, MessageSquare, 
  ChevronRight, Filter, Download, ExternalLink,
  Target, TrendingUp, Zap, PieChart as PieIcon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// ── Dummy CRM Data ────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { label: 'Total Leads',     value: '2,840', change: '+12.5%', trend: 'up',   icon: UserPlus,    color: '#2563eb' },
  { label: 'Converted Leads', value: '1,245', change: '+8.2%',  trend: 'up',   icon: Target,      color: '#10b981' },
  { label: 'Active Deals',    value: '458',   change: '-3.1%',  trend: 'down', icon: Briefcase,   color: '#f59e0b' },
  { label: 'Total Revenue',   value: '$482k', change: '+15.4%', trend: 'up',   icon: DollarSign,  color: '#8b5cf6' },
  { label: 'Tasks Due',       value: '24',    change: 'Today',  trend: 'none', icon: CheckCircle2, color: '#3b82f6' },
];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, deals: 12 },
  { name: 'Tue', revenue: 5100, deals: 18 },
  { name: 'Wed', revenue: 4800, deals: 15 },
  { name: 'Thu', revenue: 6200, deals: 22 },
  { name: 'Fri', revenue: 7100, deals: 25 },
  { name: 'Sat', revenue: 8500, deals: 30 },
  { name: 'Sun', revenue: 7800, deals: 28 },
];

const LEAD_SOURCES = [
  { name: 'Website', value: 450, color: '#2563eb' },
  { name: 'Ads',     value: 300, color: '#60a5fa' },
  { name: 'Referral',value: 180, color: '#93c5fd' },
  { name: 'Social',  value: 120, color: '#bfdbfe' },
];

const PIPELINE_STAGES = [
  { stage: 'New',       count: 45, value: '$120k', color: '#64748b' },
  { stage: 'Qualified', count: 32, value: '$85k',  color: '#3b82f6' },
  { stage: 'Proposal',  count: 18, value: '$140k', color: '#f59e0b' },
  { stage: 'Negotiation',count: 12, value: '$95k',  color: '#8b5cf6' },
  { stage: 'Closed',    count: 24, value: '$210k', color: '#10b981' },
];

const RECENT_ACTIVITIES = [
  { id: 1, user: 'John Sales', action: 'Call completed with', target: 'Alice Johnson', time: '10 min ago', type: 'call', icon: Phone, color: '#3b82f6' },
  { id: 2, user: 'Sarah Doe',  action: 'New lead added:',      target: 'Vertex Corp',    time: '25 min ago', type: 'lead', icon: UserPlus, color: '#10b981' },
  { id: 3, user: 'Mike Ross',  action: 'Deal closed for:',     target: '$12,500',        time: '1 hour ago', type: 'deal', icon: Briefcase, color: '#8b5cf6' },
  { id: 4, user: 'Admin',      action: 'Meeting scheduled:',   target: 'Product Demo',   time: '2 hours ago',type: 'meet', icon: Calendar, color: '#f59e0b' },
];

const TASKS = [
  { id: 1, text: 'Follow up with David regarding the proposal', due: 'Today', priority: 'High', completed: false },
  { id: 2, text: 'Prepare Q1 sales deck for management',      due: 'Today', priority: 'Medium', completed: false },
  { id: 3, text: 'Review contract for BlueSky project',       due: 'Expired', priority: 'High', completed: false },
  { id: 4, text: 'Update lead status for 20 new entries',    due: 'Tomorrow', priority: 'Low', completed: true },
];

const TOP_STAFF = [
  { name: 'John Sales',  deals: 42, revenue: '$145,000', avatar: 'JS' },
  { name: 'Sarah Connor',deals: 38, revenue: '$122,000', avatar: 'SC' },
  { name: 'Mike Ross',   deals: 35, revenue: '$118,000', avatar: 'MR' },
  { name: 'Emma Wilson', deals: 31, revenue: '$98,000',  avatar: 'EW' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('This Month');
  const [taskState, setTaskState] = useState(TASKS);

  const toggleTask = (id) => {
    setTaskState(ts => ts.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const cardStyle = { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 24 };

  return (
    <div style={{ padding: '32px', background: 'var(--bg-page)', minHeight: '100%' }}>

      {/* ── Top Header Section ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.8px' }}>
            CRM Dashboard
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Welcome back, here's your sales overview for <span style={{ fontWeight: 700, color: '#2563eb' }}>{period}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', background: 'var(--card-bg)', padding: 4, borderRadius: 12, border: '1px solid var(--card-border)' }}>
            {['Today', 'This Week', 'This Month'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: period === p ? '#2563eb' : 'transparent', color: period === p ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {p}
              </button>
            ))}
          </div>
          <button className="b24-btn b24-btn-secondary" style={{ height: 44, padding: '0 16px' }}><Download size={18} /> Export</button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginBottom: 32 }}>
        {KPI_CARDS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
              style={{ ...cardStyle, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: kpi.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${kpi.color}15`, display: 'grid', placeItems: 'center' }}>
                  <Icon size={20} color={kpi.color} />
                </div>
                {kpi.trend !== 'none' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 800, color: kpi.trend === 'up' ? '#10b981' : '#f43f5e' }}>
                    {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.change}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{kpi.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>{kpi.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main Charts Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 24, marginBottom: 32 }}>
        
        {/* Revenue Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Revenue Trend</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Daily revenue and deals performance</p>
            </div>
            <button style={{ height: 36, width: 36, borderRadius: 10, border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}><MoreVertical size={18}/></button>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(v)=>`$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, boxShadow: 'var(--card-shadow)' }}
                  itemStyle={{ fontSize: 13, fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Lead Sources</h3>
            <PieIcon size={18} color="var(--text-muted)" />
          </div>
          <div style={{ height: 260, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={LEAD_SOURCES} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {LEAD_SOURCES.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
               <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>1,050</div>
               <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Leads</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
             {LEAD_SOURCES.map(src => (
               <div key={src.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div style={{ width: 10, height: 10, borderRadius: '50%', background: src.color }} />
                 <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{src.name}</span>
                 <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', marginLeft: 'auto' }}>{Math.round(src.value/10.5)}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── Sales Pipeline (Kanban Overview) ── */}
      <div style={{ ...cardStyle, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Sales Pipeline Overview</h3>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            View Full Pipeline <ChevronRight size={16} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
           {PIPELINE_STAGES.map((s, i) => (
             <div key={i} style={{ padding: '20px', borderRadius: 16, background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderTop: `4px solid ${s.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                   <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.stage}</span>
                   <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{s.count}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ height: 6, borderRadius: 10, background: 'var(--card-border)', marginTop: 16, overflow: 'hidden' }}>
                   <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count/45)*100}%` }} style={{ height: '100%', background: s.color, borderRadius: 10 }} />
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* ── Lower Panels: Activities, Tasks, Leaderboard ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        
        {/* Recent Activities */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={18} color="#f59e0b" /> Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {RECENT_ACTIVITIES.map(act => (
              <div key={act.id} style={{ display: 'flex', gap: 14 }}>
                 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${act.color}15`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                   <act.icon size={16} color={act.color} />
                 </div>
                 <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                       <span style={{ fontWeight: 800 }}>{act.user}</span> {act.action} <span style={{ fontWeight: 800, color: act.type==='deal'?'#10b981':'#2563eb' }}>{act.target}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{act.time}</div>
                 </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '12px', marginTop: 20, borderRadius: 10, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View All Timeline</button>
        </div>

        {/* Tasks Widget */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#10b981" /> Tasks & To-dos
            </h3>
            <button style={{ background: '#2563eb', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Plus size={16}/></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {taskState.map(task => (
              <label key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px', borderRadius: 12, background: 'var(--input-bg)', border: '1px solid var(--card-border)', cursor: 'pointer', transition: 'all 0.15s' }}>
                 <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} style={{ marginTop: 3, cursor: 'pointer' }} />
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                       <span style={{ fontSize: 10, color: task.due==='Expired'?'#f43f5e':'var(--text-muted)', fontWeight: 800 }}>Due: {task.due}</span>
                       <span style={{ fontSize: 10, fontWeight: 900, color: task.priority==='High'?'#f43f5e':task.priority==='Medium'?'#f59e0b':'#3b82f6', textTransform: 'uppercase' }}>{task.priority}</span>
                    </div>
                 </div>
              </label>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} color="#8b5cf6" /> Top Performers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TOP_STAFF.map((staff, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                 <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>{staff.avatar}</div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{staff.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{staff.deals} Deals closed</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#10b981' }}>{staff.revenue}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>REVENUE</div>
                 </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: '16px', borderRadius: 12, background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)' }}>
             <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Team Performance vs Goal</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>82%</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target: $1.2M</span>
             </div>
             <div style={{ height: 6, borderRadius: 10, background: 'var(--card-border)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} style={{ height: '100%', background: '#2563eb' }} />
             </div>
          </div>
        </div>

      </div>

      {/* ── Quick Action Floating Buttons (Speed Dial Mock) ── */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Add Lead"
           style={{ width: 56, height: 56, borderRadius: 16, background: '#2563eb', color: '#fff', border: 'none', boxShadow: '0 8px 32px rgba(37,99,235,0.4)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <UserPlus size={24} />
         </motion.button>
         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Create Deal"
           style={{ width: 56, height: 56, borderRadius: 16, background: '#10b981', color: '#fff', border: 'none', boxShadow: '0 8px 32px rgba(16,185,129,0.4)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Briefcase size={24} />
         </motion.button>
      </div>

    </div>
  );
}
