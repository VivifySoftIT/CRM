import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, Clock, AlertTriangle, User, RefreshCw, 
  History, Info, MoreVertical, X, CheckCircle2, AlertCircle,
  ShieldCheck, Ban, Camera, MessageSquare, ClipboardList, Plus
} from 'lucide-react';

const ROOMS = [
  { id:'r101', name:'Room 101', floor:1, type:'Standard'  },
  { id:'r102', name:'Room 102', floor:1, type:'Standard'  },
  { id:'r201', name:'Room 201', floor:2, type:'Deluxe'    },
  { id:'r202', name:'Room 202', floor:2, type:'Deluxe'    },
  { id:'r301', name:'Suite 301',floor:3, type:'Suite'     },
  { id:'r302', name:'Suite 302',floor:3, type:'Suite'     },
  { id:'r401', name:'Penthouse',floor:4, type:'Penthouse' },
  { id:'r103', name:'Room 103', floor:1, type:'Standard'  },
];

const STAFF = ['Maria Santos','John Doe','Priya Nair','Carlos Rivera','Emma White'];

const INIT_STATUS = Object.fromEntries(ROOMS.map((r,i) => [r.id, ['Clean','Dirty','In Progress','Clean','Dirty','Clean','In Progress','Dirty'][i]]));
const INIT_ASSIGN = Object.fromEntries(ROOMS.map(r => [r.id, '']));

const ROOM_HISTORY = {
  'r101': [
    { date: '2026-03-25 09:15', staff: 'Maria Santos', action: 'Cleaned', type: 'Daily' },
    { date: '2026-03-24 14:20', staff: 'John Doe', action: 'Inspected', type: 'Supervisor' },
    { date: '2026-03-24 10:00', staff: 'Maria Santos', action: 'Dirty', type: 'Checkout' },
  ],
  'r201': [
    { date: '2026-03-25 11:30', staff: 'Priya Nair', action: 'In Progress', type: 'Stayover' },
    { date: '2026-03-24 10:15', staff: 'Priya Nair', action: 'Cleaned', type: 'Stayover' },
  ]
};

const STATUS_META = {
  Clean:         { color:'#059669', bg:'rgba(5,150,105,0.1)', icon: CheckCircle2,  label: 'Clean' },
  Dirty:         { color:'#dc2626', bg:'rgba(220,38,38,0.1)', icon: AlertCircle,   label: 'Dirty' },
  'In Progress': { color:'#d97706', bg:'rgba(217,119,6,0.1)', icon: Clock,         label: 'Cleaning' },
  'Inspected':   { color:'#2563eb', bg:'rgba(37,99,235,0.1)', icon: ShieldCheck,   label: 'Inspected' },
};

export default function Support() {
  const [statuses, setStatuses] = useState(INIT_STATUS);
  const [assigns, setAssigns]   = useState(INIT_ASSIGN);
  const [filter, setFilter]     = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const updateStatus = (id, status) => { 
    setStatuses(s=>({...s,[id]:status})); 
    showToast(`Room ${ROOMS.find(r=>r.id===id).name} updated to ${status}`); 
  };
  
  const updateAssign = (id, staff)  => { setAssigns(a=>({...a,[id]:staff})); };

  const filtered = ROOMS.filter(r => filter==='All' || statuses[r.id]===filter);

  const counts = Object.fromEntries(['Clean','Dirty','In Progress','Inspected'].map(s => [s, Object.values(statuses).filter(v=>v===s).length]));

  const cardStyle = { background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)', overflow:'hidden' };

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%', padding: '0 4px' }}>
      
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'var(--text-primary)', margin:0, letterSpacing:'-0.5px' }}>Housekeeping & Room Status</h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', margin:'6px 0 0' }}>Monitor room cleaning progress, assignments, and inspections</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="b24-btn b24-btn-secondary" style={{ padding: '12px 20px', fontSize:14 }}><ClipboardList size={18}/> Daily Report</button>
          <button className="b24-btn b24-btn-primary" style={{ padding: '12px 20px', fontSize:14 }}><Plus size={18}/> Assign Duty</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:28 }}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} style={{ ...cardStyle, padding:'24px 28px', borderLeft: `5px solid ${meta.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:800, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{meta.label}</span>
              <meta.icon size={22} color={meta.color} />
            </div>
            <div style={{ fontSize:32, fontWeight:900, color:meta.color }}>{counts[key] || 0}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ ...cardStyle, padding:'18px 24px', marginBottom:24, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontSize:13, fontWeight:800, color:'var(--text-secondary)', marginRight:10 }}>Filter By:</span>
        {['All','Clean','Dirty','In Progress','Inspected'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} 
            style={{ 
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
              background: filter===f ? 'var(--primary)' : 'var(--input-bg)',
              color: filter===f ? '#fff' : 'var(--text-secondary)'
            }}>
            {f}
          </button>
        ))}
        <div style={{ margin:'0 15px', height:24, width:1, background:'var(--card-border)' }} />
        <button style={{ height:40, width:40, padding:0, justifyContent:'center' }} className="b24-btn b24-btn-secondary" onClick={() => setFilter('All')}><RefreshCw size={16}/></button>
      </div>

      {/* Room Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
        {filtered.map((room, i) => {
          const status = statuses[room.id];
          const meta = STATUS_META[status] || STATUS_META['Dirty'];
          const Icon = meta.icon;
          return (
            <motion.div key={room.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
              style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setSelectedRoom(room)}>
              
              <div style={{ height:7, background:meta.color }} />
              
              <div style={{ padding:'24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                  <div>
                    <h3 style={{ fontSize:20, fontWeight:900, color:'var(--text-primary)', margin:0 }}>{room.name}</h3>
                    <div style={{ fontSize:14, color:'var(--text-secondary)', marginTop:4 }}>{room.type} · Floor {room.floor}</div>
                  </div>
                  <div style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${meta.color}20` }}>
                    <Icon size={14}/> {meta.label}
                  </div>
                </div>

                {/* Quick Status Toggles */}
                <div style={{ display:'flex', gap:8, marginBottom:20 }} onClick={e => e.stopPropagation()}>
                  {['Clean','Dirty','In Progress'].map(s => (
                    <button key={s} onClick={()=>updateStatus(room.id, s)} title={`Mark as ${s}`}
                      style={{ 
                        flex:1, height:40, borderRadius:10, border: `1px solid ${status===s ? STATUS_META[s].color : 'var(--card-border)'}`, 
                        background: status===s ? STATUS_META[s].bg : 'var(--input-bg)',
                        color: status===s ? STATUS_META[s].color : 'var(--text-secondary)',
                        display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.1s'
                      }}>
                      {s === 'Clean' ? <CheckCircle2 size={16}/> : s === 'Dirty' ? <AlertCircle size={16}/> : <Clock size={16}/>}
                    </button>
                  ))}
                  <button onClick={() => updateStatus(room.id, 'Inspected')} title="Mark as Inspected"
                    style={{ 
                      flex:1, height:40, borderRadius:10, border: `1px solid ${status==='Inspected' ? STATUS_META['Inspected'].color : 'var(--card-border)'}`, 
                      background: status==='Inspected' ? STATUS_META['Inspected'].bg : 'var(--input-bg)',
                      color: status==='Inspected' ? STATUS_META['Inspected'].color : 'var(--text-secondary)',
                      display: 'grid', placeItems: 'center', cursor: 'pointer'
                    }}>
                    <ShieldCheck size={16}/>
                  </button>
                </div>

                <div style={{ height:1, background:'var(--card-border)', margin: '0 0 20px' }} />

                <div style={{ display:'flex', alignItems:'center', gap:12 }} onClick={e => e.stopPropagation()}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--input-bg)', display:'grid', placeItems:'center' }}><User size={16} color="var(--text-muted)" /></div>
                  <select value={assigns[room.id]} onChange={e => updateAssign(room.id, e.target.value)} 
                    style={{ flex:1, height:38, borderRadius:10, border:'1px solid var(--card-border)', background:'transparent', color:'var(--text-primary)', fontSize:13, fontWeight:600, outline:'none', padding:'0 10px' }}>
                    <option value="">Unassigned</option>
                    {STAFF.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Room Detail Drawer */}
      <AnimatePresence>
        {selectedRoom && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', justifyContent:'flex-end' }} onClick={()=>setSelectedRoom(null)}>
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:25, stiffness:200 }}
              onClick={e=>e.stopPropagation()}
              style={{ background:'var(--card-bg)', width:'100%', maxWidth:540, height:'100%', display:'flex', flexDirection:'column', boxShadow:'-10px 0 40px rgba(0,0,0,0.1)', borderLeft:'1px solid var(--card-border)' }}>
              
              <div style={{ padding:'28px 36px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background: 'var(--bg-darker)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                   <div style={{ width:48, height:48, borderRadius:14, background:'var(--primary)', display:'grid', placeItems:'center', color:'#fff' }}>
                     <Sparkles size={24} />
                   </div>
                   <div>
                     <h3 style={{ fontSize:22, fontWeight:900, color:'var(--text-primary)', margin:0 }}>{selectedRoom.name}</h3>
                     <div style={{ fontSize:14, color:'var(--text-secondary)' }}>Status: <span style={{ fontWeight:800, color: STATUS_META[statuses[selectedRoom.id]]?.color }}>{statuses[selectedRoom.id]}</span></div>
                   </div>
                </div>
                <button onClick={()=>setSelectedRoom(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding: 10, borderRadius:'50%' }}><X size={26} /></button>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'40px' }}>
                
                {/* Special Flags */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 36 }}>
                   {[
                     { label: 'Out of Order', icon: Ban, color: '#ef4444' },
                     { label: 'DND Active', icon: Clock, color: '#f59e0b' },
                     { label: 'Rush Order', icon: Sparkles, color: '#ec4899' },
                   ].map(flag => (
                     <button key={flag.label} style={{ height: 90, borderRadius: 16, border: '1px solid var(--card-border)', background: 'var(--input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}>
                        <flag.icon size={22} color={flag.color} />
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>{flag.label}</span>
                     </button>
                   ))}
                </div>

                <div style={{ fontSize:13, fontWeight:900, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing: '0.06em', marginBottom:16, display: 'flex', alignItems: 'center', gap: 10 }}>
                   <History size={16} /> Room Activity History
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--card-border)', borderRadius: 16, overflow: 'hidden' }}>
                   {(ROOM_HISTORY[selectedRoom.id] || []).map((h, idx) => (
                     <div key={idx} style={{ padding: '20px', borderBottom: idx === (ROOM_HISTORY[selectedRoom.id]||[]).length-1 ? 'none' : '1px solid var(--card-border)', display: 'flex', gap: 18 }}>
                        <div style={{ position: 'relative' }}>
                           <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563eb', marginTop: 6 }} />
                           {idx !== (ROOM_HISTORY[selectedRoom.id]||[]).length-1 && <div style={{ position: 'absolute', top: 18, left: 5.5, bottom: -20, width: 1, background: 'var(--card-border)' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{h.action}</span>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.date}</span>
                           </div>
                           <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>By {h.staff} · <span style={{ opacity: 0.8, fontWeight: 600 }}>{h.type}</span></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div style={{ marginTop: 40 }}>
                   <div style={{ fontSize:13, fontWeight:900, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing: '0.06em', marginBottom:16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ClipboardList size={16} /> Notes & Instructions
                   </div>
                   <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', color: '#1e40af', fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>
                      Guest requested non-allergenic pillows and extra towels. Please ensure the coffee station is fully restocked.
                   </div>
                </div>

              </div>

              <div style={{ padding:'28px 36px', borderTop:'1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', gap: 12 }}>
                 <button className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 52, fontSize:15 }}>
                   <Camera size={18}/> Report Issue
                 </button>
                 <button className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center', height: 52, fontSize:15 }} onClick={() => updateStatus(selectedRoom.id, 'Clean')}>
                   <Check size={18}/> Mark as Ready
                 </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'12px 20px', borderRadius:8, background:'#059669', color:'#fff', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 32px rgba(0,0,0,0.25)' }}>
          <Check size={16}/> {toast}
        </motion.div>
      )}
    </div>
  );
}
