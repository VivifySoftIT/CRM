import React, { useState } from 'react';
import { BellRing, Plus, Calendar, Clock, Contact, MoreVertical, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reminders() {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Call John regarding proposal', date: '2026-04-10', time: '10:00 AM', context: 'Alice Johnson', type: 'Call', completed: false },
    { id: 2, text: 'Follow up on SaaS renewal', date: '2026-04-12', time: '02:00 PM', context: 'Acme Corp', type: 'Follow-up', completed: false },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'Call', context: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setReminders([{ id: Date.now(), ...form, completed: false }, ...reminders]);
    setOpenModal(false);
    setForm({ title: '', date: '', time: '', type: 'Call', context: '' });
  };

  const toggleComplete = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', padding: '32px', position: 'relative' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'grid', placeItems: 'center', color: '#ef4444' }}>
              <BellRing size={20} />
            </div>
            Follow-up Reminders
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Never miss a critical follow-up or lead interaction.</p>
        </div>
        <button onClick={() => setOpenModal(true)} style={{ padding: '0 20px', height: 44, borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>
          <Plus size={18} /> New Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
         {[ 
           { label: 'Upcoming Today', value: reminders.filter(r => !r.completed).length, color: '#ef4444' },
           { label: 'Automated Reminders', value: '4 Active', color: '#8b5cf6' },
           { label: 'Completed', value: reminders.filter(r => r.completed).length, color: '#10b981' }
         ].map((stat, i) => (
           <div key={i} style={{ background: 'var(--card-bg)', padding: 24, borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
           </div>
         ))}
      </div>

      {/* Reminders Grid */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Your Upcoming Schedule</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        <AnimatePresence>
          {reminders.map(rem => (
            <motion.div key={rem.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', opacity: rem.completed ? 0.6 : 1 }}>
               {rem.completed && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                 <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: 20 }}>{rem.type}</span>
                 <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
               </div>
               <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, textDecoration: rem.completed ? 'line-through' : 'none' }}>
                 {rem.title || rem.text}
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}><Calendar size={14}/> Date: {rem.date || 'Soon'}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}><Clock size={14}/> Time: {rem.time || '--:--'}</div>
                 {rem.context && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2563eb', fontWeight: 600 }}><Contact size={14}/> Relates to: {rem.context}</div>}
               </div>

               <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                 <button onClick={() => toggleComplete(rem.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: rem.completed ? 'rgba(16,185,129,0.1)' : 'var(--input-bg)', color: rem.completed ? '#10b981' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                   <CheckCircle2 size={16} /> {rem.completed ? 'Completed' : 'Mark as Done'}
                 </button>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Reminder Modal */}
      {openModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--card-bg)', width: '100%', maxWidth: 450, borderRadius: 20, padding: 32, border: '1px solid var(--card-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Create Reminder</h2>
               <button onClick={() => setOpenModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X/></button>
             </div>

             <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Remind me to...</label>
                  <input autoFocus value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="b24-input" style={{ width: '100%' }} placeholder="E.g. Follow up on Q4 proposal required" />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Date</label>
                     <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="b24-input" style={{ width: '100%' }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Time</label>
                     <input type="time" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} className="b24-input" style={{ width: '100%' }} />
                   </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Related To (Optional)</label>
                  <input value={form.context} onChange={e=>setForm({...form, context: e.target.value})} className="b24-input" style={{ width: '100%' }} placeholder="Lead, Contact, or Deal name" />
                </div>
                <button type="submit" style={{ marginTop: 10, padding: '14px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Save Reminder</button>
             </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
