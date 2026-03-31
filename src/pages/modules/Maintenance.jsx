import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, AlertTriangle, CheckCircle2, Clock, User, 
  Search, Plus, Filter, MoreVertical, X, 
  Settings, Zap, Droplets, Wind, Trash2, 
  MessageSquare, Camera, ArrowRight, History
} from 'lucide-react';

const TICKETS = [
  { id: 'TKT-1001', room: 'Suite 301', guest: 'Alice Johnson', type: 'AC', priority: 'High', assigned: 'John Smith', created: '2026-03-24 09:12', status: 'Open', desc: 'AC making loud rattling noise and not cooling correctly.' },
  { id: 'TKT-1002', room: 'Deluxe 205', guest: 'Bob Smith', type: 'Plumbing', priority: 'Medium', assigned: 'Mike Ross', created: '2026-03-24 10:30', status: 'In Progress', desc: 'Slow drain in the bathroom sink.' },
  { id: 'TKT-1003', room: 'Room 102', guest: 'Diana Prince', type: 'Electrical', priority: 'High', assigned: 'Sarah Jenkins', created: '2026-03-24 11:45', status: 'Open', desc: 'Main light fixture flickering.' },
  { id: 'TKT-1004', room: 'Suite 302', guest: 'George Clooney', type: 'Cleaning', priority: 'Low', assigned: 'Unassigned', created: '2026-03-23 16:20', status: 'Resolved', desc: 'Spilled coffee on the rug.' },
  { id: 'TKT-1005', room: 'Room 401', guest: 'Charlie Brown', type: 'AC', priority: 'Medium', assigned: 'John Smith', created: '2026-03-24 14:00', status: 'In Progress', desc: 'Remote control not working.' },
];

const STAFF = ['John Smith', 'Mike Ross', 'Sarah Jenkins', 'Carlos Rivera'];

const TYPE_ICONS = {
  AC: { icon: Wind, color: '#3b82f6' },
  Plumbing: { icon: Droplets, color: '#0ea5e9' },
  Electrical: { icon: Zap, color: '#f59e0b' },
  Cleaning: { icon: Sparkles, color: '#ec4899' },
  Other: { icon: Settings, color: '#64748b' }
};

const PRIORITY_META = {
  High: { color: '#dc2626', bg: '#fee2e2' },
  Medium: { color: '#d97706', bg: '#fef3c7' },
  Low: { color: '#059669', bg: '#d1fae5' }
};

const STATUS_META = {
  Open: { color: '#2563eb', bg: '#dbeafe', icon: AlertTriangle },
  'In Progress': { color: '#d97706', bg: '#fef3c7', icon: Clock },
  Resolved: { color: '#059669', bg: '#d1fae5', icon: CheckCircle2 }
};

export default function Maintenance() {
  const [tickets, setTickets] = useState(TICKETS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = tickets.filter(t => {
     const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                          t.room.toLowerCase().includes(search.toLowerCase()) || 
                          t.guest.toLowerCase().includes(search.toLowerCase());
     const matchesFilter = filter === 'All' || t.status === filter;
     return matchesSearch && matchesFilter;
  });

  const updateStatus = (id, status) => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status } : t));
    if (selected && selected.id === id) setSelected({ ...selected, status });
  };

  const cardStyle = { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100%', padding: '0 4px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Maintenance & Engineering</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0' }}>Track equipment repairs, room fixes and technical issues</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="b24-btn b24-btn-primary" style={{ padding: '10px 20px', fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Create Service Ticket
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Tickets', value: tickets.length, color: '#3b82f6', icon: Wrench },
          { label: 'Open Issues', value: tickets.filter(t => t.status === 'Open').length, color: '#dc2626', icon: AlertTriangle },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: '#d97706', icon: Clock },
          { label: 'Resolved This Week', value: 12, color: '#059669', icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'grid', placeItems: 'center' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ ...cardStyle, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 8, padding: '9px 14px', flex: 1, minWidth: 240 }}>
          <Search size={15} color='var(--text-muted)' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Ticket ID, Room or Guest..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 14, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
          {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                background: filter === tab ? 'var(--card-bg)' : 'transparent',
                color: filter === tab ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: filter === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List Table */}
      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
                {['Ticket ID', 'Status', 'Room & Guest', 'Type', 'Priority', 'Assigned', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const Meta = STATUS_META[t.status];
                const Type = TYPE_ICONS[t.type] || TYPE_ICONS['Other'];
                return (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                    onClick={() => setSelected(t)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{t.id}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, background: Meta.bg, color: Meta.color, display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                        <Meta.icon size={12} /> {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.room}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{t.guest}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                        <Type.icon size={14} color={Type.color} /> {t.type}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_META[t.priority].color, display: 'inline-block', marginRight: 8 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--input-bg)', display: 'grid', placeItems: 'center' }}><User size={12} /></div>
                         <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.assigned}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{t.created}</td>
                    <td style={{ padding: '16px 20px' }}>
                       <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
             <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={e => e.stopPropagation()}
               style={{ background: 'var(--card-bg)', width: '100%', maxWidth: 500, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', borderLeft: '1px solid var(--card-border)' }}>
               
               <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)' }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selected.id} Details</h3>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Reported by: <span style={{ fontWeight: 700 }}>{selected.guest}</span></div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22} /></button>
               </div>

               <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                     <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--input-bg)' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Room Number</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{selected.room}</div>
                     </div>
                     <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--card-border)', background: PRIORITY_META[selected.priority].bg }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: PRIORITY_META[selected.priority].color, textTransform: 'uppercase', marginBottom: 4 }}>Priority Level</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: PRIORITY_META[selected.priority].color }}>{selected.priority}</div>
                     </div>
                  </div>

                  <div style={{ marginBottom: 30 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Issue Description</div>
                    <div style={{ padding: '16px', borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--card-border)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                       {selected.desc}
                    </div>
                  </div>

                  <div style={{ marginBottom: 30 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Ticket Timeline</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                       {[
                         { date: selected.created, action: 'Ticket Created', note: 'Reported by Front Desk' },
                         { date: '2026-03-24 10:15', action: 'Assigned to Staff', note: `Assigned to ${selected.assigned}` },
                         ...(selected.status === 'Resolved' ? [{ date: '2026-03-24 15:45', action: 'Resolved', note: 'Issue fixed and verified.' }] : [])
                       ].map((step, idx) => (
                         <div key={idx} style={{ display: 'flex', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                               <div style={{ width: 12, height: 12, borderRadius: '50%', background: idx === 0 ? '#2563eb' : '#059669', border: '3px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }} />
                               {idx < (selected.status === 'Resolved' ? 2 : 1) && <div style={{ width: 1, flex: 1, background: '#e2e8f0', margin: '4px 0' }} />}
                            </div>
                            <div style={{ paddingBottom: 10 }}>
                               <div style={{ fontSize: 13, fontWeight: 700 }}>{step.action}</div>
                               <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{step.date}</div>
                               <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{step.note}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div style={{ padding: '20px', borderRadius: 16, background: 'var(--bg-darker)', border: '1px solid var(--card-border)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}><User size={16} color="#64748b" /></div>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Staff</div>
                           <select value={selected.assigned} onChange={e => setTickets(ts => ts.map(t => t.id === selected.id ? { ...t, assigned: e.target.value } : t))}
                             style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, outline: 'none', padding: '4px 0' }}>
                             <option value="Unassigned">Unassigned</option>
                             {STAFF.map(s => <option key={s}>{s}</option>)}
                           </select>
                        </div>
                     </div>
                     <button className="b24-btn b24-btn-secondary" style={{ width: '100%', justifyContent: 'center', background: '#fff' }}>
                       <MessageSquare size={14} /> Send Message to Staff
                     </button>
                  </div>
               </div>

               <div style={{ padding: '24px 30px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', gap: 10 }}>
                  {selected.status !== 'Resolved' ? (
                    <>
                      <button className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 44 }} onClick={() => updateStatus(selected.id, 'In Progress')}>
                        <Clock size={16} /> Start Work
                      </button>
                      <button className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center', height: 44 }} onClick={() => updateStatus(selected.id, 'Resolved')}>
                        <CheckCircle2 size={16} /> Mark Resolved
                      </button>
                    </>
                  ) : (
                    <button className="b24-btn b24-btn-secondary" style={{ width: '100%', justifyContent: 'center', height: 44 }} onClick={() => updateStatus(selected.id, 'Open')}>
                      <History size={16} /> Re-open Ticket
                    </button>
                  )}
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
