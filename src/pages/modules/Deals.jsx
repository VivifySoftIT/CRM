import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  Search, Plus, Download, Upload, Filter, X,
  Columns, Table, DollarSign,
  TrendingUp, CheckCircle, RefreshCw, Check
} from 'lucide-react';
import DealCard, { STAGES, stageOf } from '../../components/DealCard';
import AddDealModal from '../../components/AddDealModal';
import { SuccessToast } from '../../components/AddContactModal';
import StageColumn from '../../components/StageColumn';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_DEALS = [
  { id: 1, name: 'Acme Enterprise License', account: 'Acme Corp', contact: 'Alice Smith', amount: 150000, stage: 'proposal', probability: 80, closeDate: '2026-05-15', owner: 'John Sales' },
  { id: 2, name: 'Globex Cloud Platform',   account: 'Globex Inc', contact: 'Bob Jones',   amount: 80000,  stage: 'qualified', probability: 60, closeDate: '2026-06-01', owner: 'Sarah Doe' },
  { id: 3, name: 'Initech SaaS Upgrade',    account: 'Initech',    contact: 'Carol Davis',  amount: 35000,  stage: 'contacted',probability: 40, closeDate: '2026-04-30', owner: 'Mike Ross' },
  { id: 4, name: 'TechCorp Analytics Suite',account: 'TechCorp',   contact: 'Dan Lee',      amount: 220000, stage: 'new',      probability: 20, closeDate: '2026-07-10', owner: 'John Sales' },
  { id: 5, name: 'Nova CRM Implementation', account: 'Nova Solutions', contact: 'Emma Wilson', amount: 65000, stage: 'converted',probability: 100, closeDate: '2026-03-15', owner: 'Sarah Doe' },
];

const OWNERS = ['John Sales', 'Sarah Doe', 'Mike Ross'];

// ─── Main Deals Kanban Page ───────────────────────────────────────────────────
export default function Deals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [view, setView] = useState('kanban'); // kanban | table (retained but main is kanban)
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => deals.filter(d =>
    (!search || d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.account.toLowerCase().includes(search.toLowerCase()) ||
     d.contact.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStage || d.stage === filterStage) &&
    (!filterOwner || d.owner === filterOwner)
  ), [deals, search, filterStage, filterOwner]);

  const dealsByStage = useMemo(() =>
    STAGES.reduce((acc, s) => ({ ...acc, [s.id]: filtered.filter(d => d.stage === s.id) }), {}),
    [filtered]);

  // Statistics
  const wonDeals = deals.filter(d => d.stage === 'converted');
  const pipeline = deals.filter(d => d.stage !== 'converted');
  const totalWon = wonDeals.reduce((s,d) => s + d.amount, 0);
  const totalPipeline = pipeline.reduce((s,d) => s + d.amount, 0);

  // Status Change Logic (via Dropdown)
  const handleStatusChange = (dealId, newStageId) => {
     const newStageProb = STAGES.find(s => s.id === newStageId)?.prob || 20;
     const stageLabel = STAGES.find(s => s.id === newStageId)?.label || newStageId;
     
     setDeals(prev => prev.map(d => 
       d.id === dealId ? { ...d, stage: newStageId, probability: newStageProb } : d
     ));
     setToastMessage(`Deal moved to ${stageLabel}`);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const draggedDeal = deals.find(d => d.id === active.id);
    const overDeal = deals.find(d => d.id === over.id);
    const targetStageId = overDeal ? overDeal.stage : over.id;

    if (!draggedDeal) { setActiveId(null); return; }

    if (draggedDeal.stage !== targetStageId && STAGES.find(s => s.id === targetStageId)) {
      // Different stage - change status & percentage
      const newStageProb = STAGES.find(s => s.id === targetStageId)?.prob || 20;
      const stageLabel = STAGES.find(s => s.id === targetStageId)?.label || targetStageId;
      
      setDeals(prev => prev.map(d => 
         d.id === active.id ? { ...d, stage: targetStageId, probability: newStageProb } : d
      ));
      setToastMessage(`Deal moved to ${stageLabel}`);
    } else {
      // Reorder vertically within same stage
      const stageDeals = deals.filter(d => d.stage === draggedDeal.stage);
      const oldIdx = stageDeals.findIndex(d => d.id === active.id);
      const newIdx = stageDeals.findIndex(d => d.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(stageDeals, oldIdx, newIdx);
        setDeals(prev => [
          ...prev.filter(d => d.stage !== draggedDeal.stage),
          ...reordered
        ]);
      }
    }
    setActiveId(null);
  }

  const handleAddDeal = (newDeal) => {
    setDeals(prev => [newDeal, ...prev]);
    setToastMessage(`✅ Deal "${newDeal.name}" Created Successfully`);
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;
  const activeStage = activeDeal ? stageOf(activeDeal.stage) : null;

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Modals & Toasts */}
      <AddDealModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddDeal} />
      {toastMessage && <SuccessToast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.7px' }}>Deals </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}></p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary"><Upload size={16} /> Import</button>
            <button className="b24-btn b24-btn-primary" onClick={() => setAddModalOpen(true)} style={{ gap: 8 }}>
              <Plus size={16} /> Add Deal
            </button>
          </div>
        </div>

        {/* Revenue Forecast Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Total Expected Revenue', val: totalPipeline + totalWon, icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
            { label: 'Pipeline Revenue', val: totalPipeline, icon: DollarSign, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
            { label: 'Closed & Won Revenue', val: totalWon, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          ].map(f => (
            <div key={f.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <f.icon size={20} color={f.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>₹{f.val.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search deals by name, company, or contact..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="b24-input" style={{ width: '100%', paddingLeft: 40, borderRadius: 10 }}
            />
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => setShowFilter(v => !v)}>
            <Filter size={14} /> Filters {(filterStage || filterOwner) && <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, borderRadius: 99, padding: '1px 6px', marginLeft: 4 }}>!</span>}
          </button>
          
          <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
            <button onClick={() => setView('kanban')} style={{ padding: '9px 16px', border: 'none', background: view === 'kanban' ? '#2563eb' : 'transparent', color: view === 'kanban' ? '#fff' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, transition: 'all 0.2s' }}>
              <Columns size={14} /> Kanban
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Stage</label>
                  <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="b24-select">
                    <option value="">All Stages</option>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Owner</label>
                  <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className="b24-select">
                    <option value="">All Owners</option>
                    {OWNERS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button className="b24-btn b24-btn-secondary" style={{ alignSelf: 'flex-end', height: 36 }}
                  onClick={() => { setFilterStage(''); setFilterOwner(''); }}>
                  <X size={14} /> Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── KANBAN VIEW ─── */}
      {view === 'kanban' && (
        <div style={{ flex: 1, padding: '0 32px 32px', overflowX: 'auto', display: 'flex' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter}
            onDragStart={e => setActiveId(e.active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}>
            
            <div style={{ display: 'flex', gap: 20, minWidth: 'max-content', alignItems: 'flex-start' }}>
              {STAGES.map(stage => (
                <StageColumn 
                  key={stage.id} 
                  stage={stage} 
                  deals={dealsByStage[stage.id] || []}
                  onEdit={d => alert('Edit Deal Modal here.')}
                  onView={d => navigate(`/dashboard/deals/${d.id}`)}
                  onAddDealClick={() => setAddModalOpen(true)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            
            <DragOverlay>
              {activeDeal && (
                <div style={{ 
                  background: 'var(--card-bg)', 
                  border: `2px solid ${activeStage?.color || '#2563eb'}`, 
                  borderRadius: 14, 
                  padding: '16px', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
                  rotate: '3deg', 
                  cursor: 'grabbing', 
                  width: 280 
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{activeDeal.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: activeStage?.color || '#2563eb' }}>₹{activeDeal.amount.toLocaleString()}</div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}
