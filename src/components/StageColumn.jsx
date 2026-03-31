import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import DealCard from './DealCard';

export default function StageColumn({ stage, deals, onEdit, onView, onAddDealClick, onStatusChange }) {
  const { setNodeRef } = useSortable({ id: stage.id });
  const totalVal = deals.reduce((s, d) => s + d.amount, 0);

  return (
    <div style={{ width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Column Header */}
      <div style={{
        padding: '16px', borderRadius: '14px 14px 0 0', background: stage.bg,
        border: `1px solid ${stage.color}30`, borderBottom: 'none',
        display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color }} />
             <span style={{ fontSize: 13, fontWeight: 800, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               {stage.label}
             </span>
          </div>
          <span style={{ background: stage.color, color: '#fff', borderRadius: 99, fontSize: 11, fontWeight: 900, padding: '3px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
             {deals.length}
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
          ₹{totalVal.toLocaleString()}
        </div>
      </div>

      {/* Column Body */}
      <div ref={setNodeRef}
        style={{
          flex: 1, padding: '14px', background: 'var(--bg-darker)',
          border: `1px solid ${stage.color}20`, borderTop: 'none',
          borderRadius: '0 0 14px 14px', minHeight: 200,
          display: 'flex', flexDirection: 'column', gap: 12
        }}
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard 
               key={deal.id} 
               deal={deal} 
               onEdit={onEdit} 
               onView={onView} 
               onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>
        
        {/* Add Deal inline button */}
        <button
          onClick={() => onAddDealClick(stage.id)}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1.5px dashed var(--card-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
          className="hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Plus size={15} /> Add Deal
        </button>
      </div>
    </div>
  );
}
