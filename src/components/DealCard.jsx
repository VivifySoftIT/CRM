import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Building2, Calendar } from 'lucide-react';
import StatusDropdown from './StatusDropdown';

export const STAGES = [
  { id: 'new',        label: 'New',       color: '#64748b', bg: 'rgba(100,116,139,0.08)',  prob: 20 },
  { id: 'contacted',  label: 'Contacted', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',   prob: 40 },
  { id: 'qualified',  label: 'Qualified', color: '#eab308', bg: 'rgba(234,179,8,0.08)',    prob: 60 },
  { id: 'proposal',   label: 'Proposal',  color: '#f97316', bg: 'rgba(249,115,22,0.08)',   prob: 80 },
  { id: 'converted',  label: 'Converted', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    prob: 100 }
];

export const stageOf = dealStageId => STAGES.find(s => s.id === dealStageId) || STAGES[0];

export default function DealCard({ deal, onEdit, onView, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const stage = stageOf(deal.stage);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        background: 'var(--card-bg)',
        border: `1px solid var(--card-border)`,
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
      {/* Title & Edit */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, cursor: 'pointer' }}
          onPointerDown={e => e.stopPropagation()}
          onClick={() => onView && onView(deal)}
        >
          {deal.name}
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }} onPointerDown={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit && onEdit(deal)}
            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Edit Deal"
          >
            <Edit2 size={13} />
          </button>
        </div>
      </div>

      {/* Company & Amount */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Building2 size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{deal.account || 'No Company'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
            ₹{Number(deal.amount || 0).toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <Calendar size={12} />
            {deal.closeDate || 'No Date'}
          </div>
        </div>
      </div>

      {/* Status Dropdown & Owner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <div onPointerDown={e => e.stopPropagation()}>
          <StatusDropdown 
             currentStageId={deal.stage} 
             onStageChange={(newStageId) => onStatusChange && onStatusChange(deal.id, newStageId)} 
          />
        </div>
        
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }} title={`Owner: ${deal.owner}`}>
          {(deal.owner || 'U').charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--card-border)', overflow: 'hidden' }}>
           <div style={{ height: '100%', width: `${deal.probability}%`, background: stage.color, borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>{deal.probability}%</span>
      </div>
    </div>
  );
}
