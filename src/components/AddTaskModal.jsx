import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, AlertCircle, Calendar, Link2, Bell, Tag, Flag, CheckSquare, AlignLeft, Users, Loader2
} from 'lucide-react';

export const TASK_STATUSES = [
  { id: 'Open',        label: 'Open',        color: '#64748b', bg: 'rgba(100,116,139,0.08)' },
  { id: 'In Progress', label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { id: 'Completed',   label: 'Completed',   color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { id: 'Deferred',    label: 'Deferred',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' }
];

export const TASK_PRIORITIES = [
  { id: 'High',   color: '#ef4444' },
  { id: 'Medium', color: '#f59e0b' },
  { id: 'Low',    color: '#10b981' }
];

export const OWNERS = ['John Sales', 'Sarah Doe', 'Mike Ross'];

function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#e53935', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: '#e53935' }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, color = '#2563eb' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontWeight: 800, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 16, paddingBottom: 10,
      borderBottom: '1px solid var(--card-border)'
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        background: `${color}18`, display: 'grid', placeItems: 'center'
      }}>
        <Icon size={14} color={color} />
      </span>
      {title}
    </div>
  );
}

const INIT_FORM = {
  title: '', description: '',
  assignedTo: OWNERS[0],
  relatedContact: '', relatedDeal: '',
  dueDate: '', reminder: false,
  status: 'Open', priority: 'Medium'
};

export default function AddTaskModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(INIT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { 
      setForm(INIT_FORM); 
      setErrors({}); 
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const newTask = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
      owner: form.assignedTo,
      relatedContact: form.relatedContact,
      relatedDeal: form.relatedDeal,
      createdAt: new Date().toISOString().slice(0, 10),
      reminder: form.reminder
    };

    onAdd(newTask);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1101, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px', pointerEvents: 'none'
            }}
          >
             <div style={{
               pointerEvents: 'auto', background: 'var(--card-bg)', borderRadius: 16, width: '100%', maxWidth: 640,
               maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)'
             }}>
               {/* ── Header ── */}
               <div style={{
                 padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 background: 'var(--bg-darker)', borderRadius: '16px 16px 0 0'
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'grid', placeItems: 'center' }}>
                     <CheckSquare size={20} color="#2563eb" />
                   </div>
                   <div>
                     <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Create Task</h2>
                     <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Schedule an activity or to-do</p>
                   </div>
                 </div>
                 <button onClick={() => !loading && onClose()} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, width: 36, height: 36, padding: 0, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                   <X size={18} />
                 </button>
               </div>

               {/* ── Scrollable Body ── */}
               <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                 
                 {/* Section 1: Task Info */}
                 <div>
                    <SectionHeading icon={AlignLeft} title="Task Info" color="#2563eb" />
                    <Field label="Task Title" required error={errors.title}>
                      <input className={`b24-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Call client for follow-up" value={form.title} onChange={e => set('title', e.target.value)} />
                    </Field>
                    <Field label="Description">
                      <textarea className="b24-textarea" placeholder="Add additional details about the task..." rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
                    </Field>
                 </div>

                 {/* Section 2: Assignment & Links */}
                 <div>
                    <SectionHeading icon={Link2} title="Assignment & Links" color="#8b5cf6" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Assign To">
                         <div style={{ position: 'relative' }}>
                           <Users size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                           <select className="b24-select" style={{ paddingLeft: 34 }} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                             {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                      </Field>
                      <Field label="Related Contact">
                         <input className="b24-input" placeholder="Search contact..." value={form.relatedContact} onChange={e => set('relatedContact', e.target.value)} />
                      </Field>
                      <Field label="Related Deal">
                         <input className="b24-input" placeholder="Search deal..." value={form.relatedDeal} onChange={e => set('relatedDeal', e.target.value)} />
                      </Field>
                    </div>
                 </div>

                 {/* Section 3 & 4 combined contextually for UI balance */}
                 <div>
                    <SectionHeading icon={Calendar} title="Timeline & Status" color="#10b981" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Due Date" required error={errors.dueDate}>
                         <div style={{ position: 'relative' }}>
                           <Calendar size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents:'none' }} />
                           <input type="date" className={`b24-input ${errors.dueDate ? 'error' : ''}`} style={{ paddingLeft: 34 }} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                         </div>
                      </Field>
                      
                      <Field label="Reminder">
                         <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                           <input type="checkbox" checked={form.reminder} onChange={e => set('reminder', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#2563eb' }} />
                           <Bell size={14} color={form.reminder ? '#2563eb' : 'var(--text-muted)'} />
                           Set email reminder
                         </label>
                      </Field>
                      
                      <Field label="Priority">
                         <div style={{ position: 'relative' }}>
                           <Flag size={14} color={TASK_PRIORITIES.find(p=>p.id===form.priority)?.color || 'var(--text-muted)'} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                           <select className="b24-select" style={{ paddingLeft: 34 }} value={form.priority} onChange={e => set('priority', e.target.value)}>
                             {TASK_PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
                           </select>
                         </div>
                      </Field>
                      
                      <Field label="Status">
                         <div style={{ position: 'relative' }}>
                           <Tag size={14} color={TASK_STATUSES.find(s=>s.id===form.status)?.color || 'var(--text-muted)'} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                           <select className="b24-select" style={{ paddingLeft: 34 }} value={form.status} onChange={e => set('status', e.target.value)}>
                             {TASK_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                           </select>
                         </div>
                      </Field>
                    </div>
                 </div>

               </div>

               {/* ── Footer ── */}
               <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 12, justifyContent: 'flex-end', background: 'var(--bg-page)', borderRadius: '0 0 16px 16px' }}>
                 <button className="b24-btn b24-btn-secondary" onClick={() => !loading && onClose()} disabled={loading} style={{ padding: '10px 20px' }}>Cancel</button>
                 <button className="b24-btn b24-btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px' }}>
                   {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={16} /></motion.div> : "Save Task"}
                 </button>
               </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
