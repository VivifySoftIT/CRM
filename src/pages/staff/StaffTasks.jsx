import { useState } from 'react';
import { CheckCircle2, Circle, Edit2, Clock, AlertCircle } from 'lucide-react';
import { useStaffTheme } from '../../context/useStaffTheme';

const INIT = [
  { id:1, title:'Follow up with David regarding the proposal', deadline:'Today',     priority:'High',   status:'Pending',   done:false },
  { id:2, title:'Prepare Q1 sales deck for management review', deadline:'Today',     priority:'Medium', status:'Pending',   done:false },
  { id:3, title:'Review contract for BlueSky project',         deadline:'Overdue',   priority:'High',   status:'Overdue',   done:false },
  { id:4, title:'Update lead status for 20 new entries',       deadline:'Tomorrow',  priority:'Low',    status:'Completed', done:true  },
  { id:5, title:'Send invoice to Nexus Group',                 deadline:'Tomorrow',  priority:'Medium', status:'Pending',   done:false },
  { id:6, title:'Schedule demo call with Orion Systems',       deadline:'This Week', priority:'High',   status:'Pending',   done:false },
  { id:7, title:'Update CRM records for Q4 accounts',          deadline:'This Week', priority:'Low',    status:'Completed', done:true  },
];
const COLS = [
  { key:'Pending',   label:'Pending',   top:'#3b82f6' },
  { key:'Overdue',   label:'Overdue',   top:'#ef4444' },
  { key:'Completed', label:'Completed', top:'#10b981' },
];

export default function StaffTasks() {
  const { t } = useStaffTheme();
  const [view, setView] = useState('list');
  const [tasks, setTasks] = useState(INIT);
  const toggle = id => setTasks(ts => ts.map(tk => tk.id===id ? { ...tk, done:!tk.done, status:!tk.done?'Completed':'Pending' } : tk));
  const card = { background: t.card, borderRadius:'16px', border:`1px solid ${t.cardBorder}`, boxShadow: t.cardShadow };

  return (
    <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'20px', background: t.bg, minHeight:'100%', transition:'background 0.2s' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontSize:'24px', fontWeight:900, color: t.text, margin:0 }}>Tasks</h2>
          <p style={{ fontSize:'14px', color: t.textSecondary, margin:'4px 0 0' }}>{tasks.filter(tk=>!tk.done).length} tasks remaining</p>
        </div>
        <div style={{ display:'flex', gap:'4px', background: t.card, border:`1px solid ${t.cardBorder}`, borderRadius:'12px', padding:'4px' }}>
          {['list','kanban'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding:'7px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, background: view===v?'#2563eb':'transparent', color: view===v?'white': t.textSecondary, textTransform:'capitalize' }}>
              {v === 'list' ? 'List' : 'Kanban'}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' && (
        <div style={card}>
          {tasks.map((tk, i) => {
            const pb = t.badge[tk.priority]; const sb = t.badge[tk.status];
            return (
              <div key={tk.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 20px', borderBottom: i<tasks.length-1?`1px solid ${t.divider}`:'none', opacity: tk.done?0.55:1, transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = t.hover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <button onClick={() => toggle(tk.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0, display:'grid', placeItems:'center' }}>
                  {tk.done ? <CheckCircle2 size={22} color="#10b981"/> : <Circle size={22} color={t.textMuted}/>}
                </button>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'14px', fontWeight:600, color: tk.done ? t.textMuted : t.text, margin:0, textDecoration: tk.done?'line-through':'none' }}>{tk.title}</p>
                  <span style={{ fontSize:'12px', color: tk.deadline==='Overdue'?'#ef4444': t.textMuted, display:'flex', alignItems:'center', gap:'4px', marginTop:'3px' }}>
                    <Clock size={11}/>{tk.deadline}
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                  <span style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: pb.bg, color: pb.color, border:`1px solid ${pb.border}` }}>{tk.priority}</span>
                  <span style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: sb.bg, color: sb.color }}>{tk.status}</span>
                  <button style={{ width:'32px', height:'32px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, display:'grid', placeItems:'center', cursor:'pointer', color: t.textMuted }}><Edit2 size={14}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'kanban' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {COLS.map(col => {
            const colTasks = tasks.filter(tk => tk.status === col.key);
            return (
              <div key={col.key} style={{ ...card, borderTop:`4px solid ${col.top}`, display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${t.divider}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ width:'10px', height:'10px', borderRadius:'50%', background: col.top }} />
                    <span style={{ fontSize:'14px', fontWeight:700, color: t.text }}>{col.label}</span>
                  </div>
                  <span style={{ width:'24px', height:'24px', borderRadius:'6px', background: t.bgSecondary, display:'grid', placeItems:'center', fontSize:'12px', fontWeight:800, color: t.textSecondary }}>{colTasks.length}</span>
                </div>
                <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:'10px', minHeight:'200px' }}>
                  {colTasks.length === 0 && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, color: t.textMuted, paddingTop:'40px' }}>
                      <AlertCircle size={28} color={t.textMuted}/><p style={{ fontSize:'12px', margin:'8px 0 0' }}>No tasks</p>
                    </div>
                  )}
                  {colTasks.map(tk => {
                    const pb = t.badge[tk.priority];
                    return (
                      <div key={tk.id} style={{ background: t.bgSecondary, borderRadius:'12px', padding:'14px', border:`1px solid ${t.cardBorder}`, cursor:'pointer', transition:'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.boxShadow='0 2px 8px rgba(59,130,246,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor= t.cardBorder; e.currentTarget.style.boxShadow='none'; }}>
                        <p style={{ fontSize:'13px', fontWeight:600, color: t.text, margin:0, lineHeight:1.4 }}>{tk.title}</p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'10px' }}>
                          <span style={{ fontSize:'12px', color: tk.deadline==='Overdue'?'#ef4444': t.textMuted, display:'flex', alignItems:'center', gap:'4px' }}><Clock size={11}/>{tk.deadline}</span>
                          <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'6px', background: pb.bg, color: pb.color }}>{tk.priority}</span>
                        </div>
                        <div style={{ display:'flex', gap:'10px', marginTop:'10px', paddingTop:'10px', borderTop:`1px solid ${t.divider}` }}>
                          <button onClick={() => toggle(tk.id)} style={{ fontSize:'12px', color:'#10b981', fontWeight:600, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', padding:0 }}><CheckCircle2 size={12}/> Complete</button>
                          <button style={{ fontSize:'12px', color:'#3b82f6', fontWeight:600, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', padding:0, marginLeft:'auto' }}><Edit2 size={12}/> Edit</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
