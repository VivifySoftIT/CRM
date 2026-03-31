import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Link2, CheckSquare, Edit2, ChevronDown, Check } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from './AddTaskModal';

export const StatusDropdown = ({ currentStatusId, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentStatus = TASK_STATUSES.find(s => s.id === currentStatusId) || TASK_STATUSES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }} onPointerDown={e => e.stopPropagation()}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: currentStatus.bg, color: currentStatus.color,
          border: `1px solid ${currentStatus.color}40`, padding: '4px 10px',
          borderRadius: 8, fontSize: 11, fontWeight: 800,
          cursor: 'pointer', transition: 'all 0.2s'
        }}
        className="hover:opacity-80"
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentStatus.color }} />
        {currentStatus.label}
        <ChevronDown size={14} style={{ opacity: 0.7 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 6,
              background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 50, minWidth: 140, padding: '6px'
            }}
          >
            {TASK_STATUSES.map(s => {
              const active = s.id === currentStatusId;
              return (
                <button
                  key={s.id}
                  onClick={(e) => { e.stopPropagation(); setOpen(false); if(s.id !== currentStatusId) onStatusChange(s.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '8px 12px', borderRadius: 6, border: 'none',
                    background: active ? s.bg : 'transparent', color: active ? s.color : 'var(--text-primary)',
                    fontSize: 12, fontWeight: active ? 800 : 600, cursor: 'pointer', textAlign: 'left'
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                    {s.label}
                  </div>
                  {active && <Check size={14} color={s.color} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function TaskCard({ task, onEdit, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id.toString() });
  const status = TASK_STATUSES.find(s => s.id === task.status) || TASK_STATUSES[0];
  const priority = TASK_PRIORITIES.find(p => p.id === task.priority) || TASK_PRIORITIES[1];

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = task.dueDate < today && task.status !== 'Completed';

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        background: 'var(--card-bg)',
        border: `1px solid ${isOverdue ? '#ef4444' : 'var(--card-border)'}`,
        borderRadius: 14,
        padding: '16px',
        marginBottom: 12,
        cursor: 'grab',
        boxShadow: isDragging ? 'none' : '0 2px 10px rgba(0,0,0,0.03)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
      {...attributes}
      {...listeners}
    >
      {/* Header element */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
           <span style={{ background: `${priority.color}15`, color: priority.color, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{task.priority}</span>
           {isOverdue && <span style={{ background: '#fef2f2', color: '#ef4444', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>OVERDUE</span>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
          onPointerDown={e => e.stopPropagation()}
          style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Edit2 size={13} />
        </button>
      </div>

      {/* Title & Description */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }} title={task.title}>
          {task.title}
        </div>
        {(task.relatedContact || task.relatedDeal) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
            <Link2 size={12} /> {task.relatedContact || task.relatedDeal}
          </div>
        )}
      </div>

      {/* Due Date & Owner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--card-border)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: isOverdue ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>
           <Clock size={12} /> {task.dueDate}
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
           <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center' }} title={task.owner}>
             {(task.owner || 'U').charAt(0).toUpperCase()}
           </div>
         </div>
      </div>

      {/* Status Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusDropdown currentStatusId={task.status} onStatusChange={(newStatus) => onStatusChange && onStatusChange(task.id, newStatus)} />
        {task.status === 'Completed' && <CheckSquare size={16} color="#10b981" />}
      </div>
    </div>
  );
}
