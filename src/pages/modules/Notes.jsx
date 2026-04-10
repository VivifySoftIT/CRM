import React, { useState } from 'react';
import { StickyNote, Plus, Search, Trash2, Edit2, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Meeting with TechCorp', content: 'They are interested in the enterprise tier. Needs custom SLA. Follow up by Friday.', date: 'Today, 10:30 AM', color: '#fef3c7' },
    { id: 2, title: 'Ideas for Q3 Campaign', content: '1. Focus on AI features.\n2. Webinar series.\n3. Case study with Acme.', date: 'Yesterday', color: '#d1fae5' },
    { id: 3, title: 'Personal Reminders', content: 'Submit expense report before EOM.', date: 'April 5', color: '#e0e7ff' }
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', color: '#fef3c7' });
  const colors = ['#fef3c7', '#d1fae5', '#e0e7ff', '#fee2e2', '#f3e8ff'];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.content) return;
    setNotes([{ id: Date.now(), title: form.title || 'Untitled Note', content: form.content, date: 'Just now', color: form.color }, ...notes]);
    setOpenModal(false);
    setForm({ title: '', content: '', color: '#fef3c7' });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', padding: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'grid', placeItems: 'center', color: '#f59e0b' }}>
              <StickyNote size={20} />
            </div>
            Notes & Drafts
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Capture your thoughts, meeting minutes, and quick ideas.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search notes..." style={{ padding: '0 16px 0 40px', height: 44, borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={() => setOpenModal(true)} style={{ padding: '0 20px', height: 44, borderRadius: 10, border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
            <Plus size={18} /> New Note
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        <AnimatePresence>
          {notes.map(note => (
            <motion.div key={note.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: note.color, borderRadius: 16, padding: 24, position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                 <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1f2937', margin: 0 }}>{note.title}</h3>
                 <Pin size={16} color="#9ca3af" />
               </div>
               
               <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 24px 0', whiteSpace: 'pre-line' }}>
                 {note.content}
               </p>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
                 <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}>{note.date}</span>
                 <div style={{ display: 'flex', gap: 8 }}>
                   <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#6b7280' }}><Edit2 size={14}/></button>
                   <button onClick={() => deleteNote(note.id)} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14}/></button>
                 </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {openModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--card-bg)', width: '100%', maxWidth: 500, borderRadius: 20, padding: 32, border: '1px solid var(--card-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
             <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Write a Note</h2>
             <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input autoFocus value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="b24-input" style={{ width: '100%', fontSize: 16, fontWeight: 700 }} placeholder="Note Title" />
                <textarea value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="b24-input" style={{ width: '100%', minHeight: 150, resize: 'vertical' }} placeholder="Type your note here..." />
                
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Color Label</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {colors.map(c => (
                       <button key={c} type="button" onClick={() => setForm({...form, color: c})}
                         style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: form.color === c ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.1s' }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="button" onClick={() => setOpenModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-primary)', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: 10, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Save Note</button>
                </div>
             </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
