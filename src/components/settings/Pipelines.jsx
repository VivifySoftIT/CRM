import React, { useState } from 'react';
import { GripVertical, Plus, Edit2, Trash2, Clock, TrendingUp } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const INITIAL_STAGES = [
  { id: '1', name: 'New Lead', probability: 10, color: '#94a3b8' },
  { id: '2', name: 'Contacted', probability: 25, color: '#6366f1' },
  { id: '3', name: 'Qualified', probability: 50, color: '#8b5cf6' },
  { id: '4', name: 'Proposal Sent', probability: 75, color: '#f59e0b' },
  { id: '5', name: 'Negotiation', probability: 90, color: '#ec4899' },
  { id: '6', name: 'Closed Won', probability: 100, color: '#10b981' },
  { id: '7', name: 'Closed Lost', probability: 0, color: '#ef4444' },
];

function SortableItem({ stage }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'var(--card-bg)', 
    padding: '16px 20px', 
    borderRadius: '16px', 
    border: '1px solid var(--card-border)', 
    marginBottom: '12px',
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
    >
      <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex' }}>
        <GripVertical size={20} />
      </div>
      <div 
        style={{ width: '4px', height: '32px', borderRadius: '4px', backgroundColor: stage.color }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{stage.name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <TrendingUp size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {stage.probability}% Win Probability
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
        <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function Pipelines() {
  const [stages, setStages] = useState(INITIAL_STAGES);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const statCardStyle = {
    padding: '20px', borderRadius: '20px', background: 'var(--bg-darker)', border: '1px solid var(--card-border)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Deal Pipelines</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Customize the stages of your sales cycle. Drag to reorder.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
          background: 'var(--primary)', color: '#ffffff', borderRadius: '12px',
          fontSize: '14px', fontWeight: '800', border: 'none', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)',
          cursor: 'pointer', transition: 'all 0.15s'
        }}>
          <Plus size={18} /> Add New Stage
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={stages.map(i => i.id)} 
              strategy={verticalListSortingStrategy}
            >
              {stages.map(stage => (
                <SortableItem key={stage.id} stage={stage} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={statCardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} /> Pipeline Analytics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Stages</span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>{stages.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg. Duration</span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>14 Days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Rate</span>
                <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>64%</span>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '24px', borderRadius: '24px', background: 'var(--primary)', 
            color: '#ffffff', boxShadow: '0 16px 32px rgba(79, 70, 229, 0.25)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <TrendingUp size={20} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 8px' }}>Smart Forecasts</h4>
            <p style={{ fontSize: '12px', lineHeight: 1.6, opacity: 0.8, margin: '0 0 24px' }}>
              Win probabilities enable our AI engine to calculate weighted revenue forecasts based on your deal pipeline movement.
            </p>
            <button style={{ 
              width: '100%', padding: '10px', background: '#ffffff', color: 'var(--primary)', 
              borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s' 
            }}>
              Configure Probabilities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
