import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Briefcase, Phone, Target, CalendarDays, ArrowRight, UserPlus, FileText } from 'lucide-react';

export default function StaffDashboard() {
  const KPICard = ({ icon: Icon, label, value, sub, color, bg }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, color: color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={22} />
      </div>
      <div>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{value}</h3>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>{sub}</p>
      </div>
    </motion.div>
  );

  return (
    <div style={{ padding: '32px', minHeight: '100%', background: 'var(--bg-page)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 20, padding: 32, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(49, 46, 129, 0.2)' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Welcome back, <span style={{ color: '#818cf8' }}>Emma!</span> 👋
          </h1>
          <p style={{ fontSize: 14, color: '#c7d2fe', margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
            You have <strong>4</strong> priority tasks and <strong>2</strong> meetings scheduled for today. Let's crush those targets!
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '12px 20px', borderRadius: 10, border: 'none', background: '#4f46e5', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            Log a Call
          </button>
          <button style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
            Add Task
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
         <KPICard icon={Target}       label="My Monthly Target" value="75%"    sub="₹1.5L / ₹2.0L closed" color="#10b981" bg="rgba(16,185,129,0.15)" />
         <KPICard icon={Briefcase}    label="Deals Won"         value="12"     sub="This quarter"         color="#6366f1" bg="rgba(99,102,241,0.15)" />
         <KPICard icon={CheckSquare}  label="Pending Tasks"     value="8"      sub="4 high priority"      color="#f59e0b" bg="rgba(245,158,11,0.15)" />
         <KPICard icon={Phone}        label="Calls Made"        value="45"     sub="Avg 12 mins/call"     color="#ec4899" bg="rgba(236,72,153,0.15)" />
      </div>

      {/* Split Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
         
         {/* Today's Tasks */}
         <div style={{ background: 'var(--card-bg)', borderRadius: 20, border: '1px solid var(--card-border)', padding: 24, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>My Schedule Today</h2>
               <button style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {[
                 { title: 'Product demo with Apex Corp', time: '11:00 AM', type: 'Meeting', icon: CalendarDays, color: '#8b5cf6' },
                 { title: 'Follow up on Q3 proposal', time: '02:30 PM', type: 'Call', icon: Phone, color: '#10b981' },
                 { title: 'Send updated SLA draft', time: '04:00 PM', type: 'Task', icon: FileText, color: '#f59e0b' }
               ].map((task, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${task.color}15`, color: task.color, display: 'grid', placeItems: 'center' }}>
                       <task.icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{task.title}</p>
                       <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>{task.type} • {task.time}</p>
                    </div>
                    <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                       <ArrowRight size={14} />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Recent Assigned Leads */}
         <div style={{ background: 'var(--card-bg)', borderRadius: 20, border: '1px solid var(--card-border)', padding: 24, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Recently Assigned Leads</h2>
               <button style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Pipeline</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {[
                 { name: 'John Peterson', company: 'Global Tech', status: 'New', time: '2h ago' },
                 { name: 'Sarah Connor', company: 'Cyberdyne', status: 'Contacted', time: '5h ago' },
                 { name: 'Michael Scott', company: 'Dunder Mifflin', status: 'Negotiation', time: '1d ago' }
               ].map((lead, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>
                       {lead.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{lead.name}</p>
                       <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>{lead.company} • Assigned {lead.time}</p>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: lead.status==='New'?'rgba(99,102,241,0.1)':lead.status==='Contacted'?'rgba(245,158,11,0.1)':'rgba(16,185,129,0.1)', color: lead.status==='New'?'#6366f1':lead.status==='Contacted'?'#f59e0b':'#10b981' }}>
                       {lead.status}
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
