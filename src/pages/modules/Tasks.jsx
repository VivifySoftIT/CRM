import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import {
  Search, Plus, Filter, Columns, Table, Calendar as CalendarIcon,
  CheckCircle2, Circle, Edit2, Trash2, Link2, Clock, Check
} from 'lucide-react';
import AddTaskModal, { TASK_STATUSES, TASK_PRIORITIES } from '../../components/AddTaskModal';
import TaskCard, { StatusDropdown } from '../../components/TaskCard';
import { SuccessToast } from '../../components/AddContactModal';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

const INITIAL_TASKS = [
  { id: 1, title: 'Call client for contract follow-up', description: '', status: 'Open', priority: 'High', dueDate: today, owner: 'John Sales', relatedContact: 'Alice Smith', relatedDeal: 'Acme License' },
  { id: 2, title: 'Prepare Q3 performance review presentation', description: '', status: 'In Progress', priority: 'Medium', dueDate: d(2), owner: 'Sarah Doe', relatedContact: '', relatedDeal: '' },
  { id: 3, title: 'Send finalized invoice to billing', description: '', status: 'Completed', priority: 'High', dueDate: d(-1), owner: 'Mike Ross', relatedContact: 'Charlie Brown', relatedDeal: '' },
  { id: 4, title: 'Update SaaS deal quote pricing', description: '', status: 'Open', priority: 'Low', dueDate: d(4), owner: 'John Sales', relatedContact: '', relatedDeal: 'Initech SaaS' },
  { id: 5, title: 'Schedule onboarding demo', description: '', status: 'Open', priority: 'Medium', dueDate: today, owner: 'Sarah Doe', relatedContact: 'Emma Wilson', relatedDeal: 'Nova CRM' },
  { id: 6, title: 'Review legal terms for TechCorp', description: '', status: 'Deferred', priority: 'High', dueDate: d(10), owner: 'Mike Ross', relatedContact: 'Dan Lee', relatedDeal: 'TechCorp Analytics' },
];

// ─── Task Column (Kanban) ──────────────────────────────────────────────────
function TaskColumn({ statusObj, tasks, onEdit, onStatusChange }) {
  const { setNodeRef } = useSortable({ id: statusObj.id });

  return (
    <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 16px', borderRadius: '12px 12px 0 0', background: statusObj.bg,
        border: `1px solid ${statusObj.color}30`, borderBottom: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusObj.color }} />
           <span style={{ fontSize: 13, fontWeight: 800, color: statusObj.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             {statusObj.label}
           </span>
        </div>
        <span style={{ background: statusObj.color, color: '#fff', borderRadius: 99, fontSize: 11, fontWeight: 900, padding: '2px 8px' }}>
           {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef}
        style={{
          flex: 1, padding: '12px', background: 'var(--bg-dark)',
          border: `1px solid ${statusObj.color}20`, borderTop: 'none',
          borderRadius: '0 0 12px 12px', minHeight: 200,
          display: 'flex', flexDirection: 'column', gap: 10
        }}
      >
        <SortableContext items={tasks.map(t => t.id.toString())} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onStatusChange={onStatusChange} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No tasks in {statusObj.label}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Tasks Page ──────────────────────────────────────────────────────────
export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [view, setView] = useState('list'); // list | kanban | calendar
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeId, setActiveId] = useState(null);
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => tasks.filter(t =>
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) ||
     (t.relatedContact || '').toLowerCase().includes(search.toLowerCase()) ||
     (t.relatedDeal || '').toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || t.status === filterStatus)
  ).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)), [tasks, search, filterStatus]);

  const tasksByStatus = useMemo(() =>
    TASK_STATUSES.reduce((acc, s) => ({ ...acc, [s.id]: filtered.filter(t => t.status === s.id) }), {}),
    [filtered]);

  // Statistics
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const overdueCount = tasks.filter(t => t.dueDate < today && t.status !== 'Completed').length;

  const handleStatusChange = (taskId, newStatusId) => {
     setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatusId } : t));
     setToastMessage(`Task moved to ${newStatusId}`);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const draggedTask = tasks.find(t => t.id.toString() === active.id);
    const overTask = tasks.find(t => t.id.toString() === over.id);
    const targetStatusId = overTask ? overTask.status : over.id;

    if (!draggedTask) { setActiveId(null); return; }

    if (draggedTask.status !== targetStatusId && TASK_STATUSES.find(s => s.id === targetStatusId)) {
      setTasks(prev => prev.map(t => t.id.toString() === active.id ? { ...t, status: targetStatusId } : t));
      setToastMessage(`Task moved to ${targetStatusId}`);
    } else {
      const statusTasks = tasks.filter(t => t.status === draggedTask.status);
      const oldIdx = statusTasks.findIndex(t => t.id.toString() === active.id);
      const newIdx = statusTasks.findIndex(t => t.id.toString() === over.id);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(statusTasks, oldIdx, newIdx);
        setTasks(prev => [...prev.filter(t => t.status !== draggedTask.status), ...reordered]);
      }
    }
    setActiveId(null);
  }

  const activeTask = activeId ? tasks.find(t => t.id.toString() === activeId) : null;
  const activeStatusObj = activeTask ? TASK_STATUSES.find(s => s.id === activeTask.status) : null;

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Modals & Toasts */}
      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={(t) => { setTasks(p => [t, ...p]); setToastMessage('✅ Task Created Successfully'); }} />
      {toastMessage && <SuccessToast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.7px' }}>Tasks Dashboard</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{completedCount} of {tasks.length} completed · {overdueCount} overdue</p>
          </div>
          <button className="b24-btn b24-btn-primary" onClick={() => setAddModalOpen(true)} style={{ gap: 8 }}>
             <Plus size={16} /> Add Task
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search tasks by title or related records..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="b24-input" style={{ width: '100%', paddingLeft: 40, borderRadius: 10 }}
            />
          </div>
          
          <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
            {[{ key: 'list', icon: Table, label: 'List' }, { key: 'kanban', icon: Columns, label: 'Kanban' }, { key: 'calendar', icon: CalendarIcon, label: 'Calendar' }].map(v => (
              <button key={v.key} onClick={() => setView(v.key)}
                style={{ padding: '9px 16px', border: 'none', background: view === v.key ? '#2563eb' : 'transparent', color: view === v.key ? '#fff' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, transition: 'all 0.2s' }}>
                <v.icon size={14} />{v.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="b24-select" style={{ width: 140, borderRadius: 10, border: '1px solid var(--card-border)' }}>
              <option value="">All Statuses</option>
              {TASK_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── LIST VIEW ─── */}
      {view === 'list' && (
        <div style={{ padding: '0 32px 32px', flex: 1 }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '14px 16px', width: 40 }}><Circle size={14} color="var(--text-muted)" /></th>
                  {['Task Title', 'Related To', 'Priority', 'Status', 'Due Date', 'Owner', ''].map((h, i) => (
                    <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const pri = TASK_PRIORITIES.find(p => p.id === t.priority);
                  const stat = TASK_STATUSES.find(s => s.id === t.status);
                  const isDone = t.status === 'Completed';
                  const isOverdue = t.dueDate < today && !isDone;
                  
                  return (
                    <motion.tr key={t.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid var(--card-border)', opacity: isDone ? 0.6 : 1, background: isDone ? 'var(--input-bg)' : 'transparent' }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => handleStatusChange(t.id, isDone ? 'Open' : 'Completed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? '#10b981' : 'var(--text-muted)', display: 'flex', padding: 0 }}>
                          {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>{t.title}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                           {(t.relatedContact || t.relatedDeal) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Link2 size={12}/> {t.relatedContact} {t.relatedDeal ? `· ${t.relatedDeal}` : ''}</div>
                           ) : '—'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: `${pri.color}15`, color: pri.color, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>{t.priority}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusDropdown currentStatusId={t.status} onStatusChange={(nst) => handleStatusChange(t.id, nst)} />
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: isOverdue ? '#ef4444' : 'var(--text-secondary)', fontWeight: isOverdue ? 800 : 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={12} />{t.dueDate}
                          {isOverdue && <span style={{ fontSize: 9, background: '#fef2f2', color: '#ef4444', padding: '1px 5px', borderRadius: 4, marginLeft: 4 }}>OVERDUE</span>}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{(t.owner||'U').charAt(0)}</div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500" onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}><Trash2 size={13} /></button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── KANBAN VIEW ─── */}
      {view === 'kanban' && (
        <div style={{ flex: 1, padding: '0 32px 32px', overflowX: 'auto', display: 'flex' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter}
            onDragStart={e => setActiveId(e.active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}>
            
            <div style={{ display: 'flex', gap: 20, minWidth: 'max-content', alignItems: 'flex-start' }}>
              {TASK_STATUSES.map(statusObj => (
                <TaskColumn 
                  key={statusObj.id} 
                  statusObj={statusObj} 
                  tasks={tasksByStatus[statusObj.id] || []}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            
            <DragOverlay>
              {activeTask && (
                <div style={{ 
                  background: 'var(--card-bg)', border: `2px solid ${activeStatusObj?.color || '#2563eb'}`, 
                  borderRadius: 14, padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
                  rotate: '3deg', cursor: 'grabbing', width: 280 
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{activeTask.title}</div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* ─── CALENDAR VIEW ─── */}
      {view === 'calendar' && (
        <div style={{ flex: 1, padding: '0 32px 32px' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
             {Object.entries(filtered.reduce((acc, t) => {
                 (acc[t.dueDate] = acc[t.dueDate] || []).push(t); return acc;
             }, {})).sort(([d1], [d2]) => new Date(d1) - new Date(d2)).map(([date, dayTasks]) => (
                <div key={date} style={{ border: '1px solid var(--card-border)', borderRadius: 12, overflow: 'hidden' }}>
                   <div style={{ background: date < today ? '#fef2f2' : (date === today ? '#eff6ff' : 'var(--bg-page)'), padding: '12px 16px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: date < today ? '#ef4444' : (date === today ? '#2563eb' : 'var(--text-primary)') }}>
                        {date === today ? 'Today' : date}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--card-bg)', padding: '2px 8px', borderRadius: 12 }}>{dayTasks.length} tasks</span>
                   </div>
                   <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {dayTasks.map(t => (
                        <div key={t.id} style={{ padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}>
                           <div style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: t.status === 'Completed' ? 'line-through' : 'none', marginBottom: 4 }}>{t.title}</div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ color: TASK_STATUSES.find(s=>s.id===t.status)?.color, fontWeight: 700, fontSize: 10 }}>{t.status}</span>
                             <span style={{ color: 'var(--text-muted)' }}>{t.owner}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
        </div>
      )}

    </div>
  );
}
