import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Trash2, Check, Calendar, Flag } from 'lucide-react';
import { useAdminDashboard } from '../../context/AdminDashboardContext';
import { useTheme } from '../../context/ThemeContext';

const PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };
const STATUS_COLORS   = { Pending: '#f59e0b', 'In Progress': '#2563eb', Completed: '#10b981' };

function AddTaskForm({ onAdd, onCancel, isDark }) {
  const [title, setTitle]       = useState('');
  const [dueDate, setDueDate]   = useState('');
  const [priority, setPriority] = useState('Medium');
  const txt    = isDark ? '#f1f5f9' : '#0f172a';
  const border = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), dueDate, priority, status: 'Pending' });
    setTitle(''); setDueDate(''); setPriority('Medium');
  };

  return (
    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      style={{ background: isDark ? 'rgba(37,99,235,0.06)' : '#eff6ff', borderRadius: 12, padding: '14px', border: `1px solid ${isDark ? 'rgba(37,99,235,0.2)' : '#bfdbfe'}`, marginBottom: 10 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title..."
        style={{ width: '100%', fontSize: 13, fontWeight: 600, padding: '8px 12px', borderRadius: 9, border: `1px solid ${border}`, background: inputBg, color: txt, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
          style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: txt, outline: 'none', cursor: 'pointer' }} />
        <select value={priority} onChange={e => setPriority(e.target.value)}
          style={{ fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: PRIORITY_COLORS[priority], outline: 'none', cursor: 'pointer' }}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          <button type="button" onClick={onCancel}
            style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit"
            style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
            Add Task
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default function TaskList() {
  const { tasks, addTask, toggleTaskComplete, deleteTask } = useAdminDashboard();
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const bg     = isDark ? '#131b2e' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const txt    = isDark ? '#f1f5f9' : '#0f172a';
  const sub    = isDark ? '#64748b' : '#94a3b8';

  const pending   = tasks.filter(t => t.status !== 'Completed').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div style={{ background: bg, borderRadius: 16, padding: '20px 22px', boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#10b98118', display: 'grid', placeItems: 'center' }}>
            <CheckSquare size={16} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: txt }}>Tasks</div>
            <div style={{ fontSize: 11, color: sub }}>{pending} pending · {completed} done</div>
          </div>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <Plus size={13} /> Add Task
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <AddTaskForm
            onAdd={(task) => { addTask(task); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: sub, fontSize: 13 }}>No tasks yet</div>
        )}
        <AnimatePresence>
 