import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Search, Filter, RefreshCw, Phone, Clock, FileText } from 'lucide-react';
import CallsTable from '../../components/calls/CallsTable';
import TimelineView from '../../components/calls/TimelineView';
import LogCallModal from '../../components/calls/LogCallModal';
import ScheduleCallModal from '../../components/calls/ScheduleCallModal';

const MOCK_CALLS = [
  {
    id: '1',
    contactName: 'Jane Smith',
    relatedDeal: 'Q4 Enterprise Deal',
    purpose: 'Initial Discovery',
    type: 'Incoming',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:30',
    duration: 15,
    status: 'Completed',
    notes: 'Client is interested in the premium package. Need to send a proposal by Friday.',
    owner: 'John Sales'
  },
  {
    id: '2',
    contactName: 'Acme Corp',
    relatedDeal: 'Website Redesign',
    purpose: 'Follow-up on Proposal',
    type: 'Outgoing',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
    startTime: '14:00',
    duration: 0,
    status: 'Missed',
    notes: 'Left a voicemail. Will try again tomorrow morning.',
    owner: 'Alice Admin'
  },
  {
    id: '3',
    contactName: 'John Doe',
    relatedDeal: '',
    purpose: 'Quarterly Check-in',
    type: 'Outgoing',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
    startTime: '11:00',
    duration: 30,
    status: 'Scheduled',
    notes: 'Review the last quarter metrics and discuss upsell opportunities.',
    owner: 'John Sales'
  }
];

export default function Calls() {
  const [view, setView] = useState('list'); // 'list' | 'timeline'
  const [calls, setCalls] = useState(MOCK_CALLS);
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const processedCalls = useMemo(() => {
    return calls.filter(c => 
      (statusFilter === 'All' || c.status === statusFilter) &&
      (!searchTerm || 
       c.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       c.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       c.relatedDeal?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));
  }, [calls, searchTerm, statusFilter]);

  const showToast = (message) => {
    const alertBox = document.createElement('div');
    Object.assign(alertBox.style, {
      position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#10b981', color: '#fff',
      padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
    });
    alertBox.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="lucide lucide-check-circle" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> ${message}`;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  const handleSaveCall = (call) => {
    setCalls(prev => {
      const exists = prev.find(c => c.id === call.id);
      if (exists) return prev.map(c => c.id === call.id ? call : c);
      return [call, ...prev]; // Add to top for simple visual feedback
    });
    showToast(call.status === 'Scheduled' ? 'Call Scheduled Successfully' : 'Call Logged Successfully');
  };

  const handleDeleteCall = (id) => {
    if (window.confirm('Are you sure you want to delete this call record?')) {
      setCalls(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setCalls(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast(`Call marked as ${status}`);
  };

  const openLogModal = () => {
    setEditingCall(null);
    setIsLogModalOpen(true);
  };

  const openScheduleModal = () => {
    setEditingCall(null);
    setIsScheduleModalOpen(true);
  };

  const openEditModal = (call) => {
    setEditingCall(call);
    if (call.status === 'Scheduled') {
      setIsScheduleModalOpen(true);
    } else {
      setIsLogModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: 12 }}>
              Calls
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              Log, schedule, and track customer calls.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
             <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: 4, borderRadius: 8 }}>
              <button onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--primary)' : 'transparent', color: view === 'list' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}>
                <List size={14} /> List
              </button>
              <button onClick={() => setView('timeline')} style={{ background: view === 'timeline' ? 'var(--primary)' : 'transparent', color: view === 'timeline' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}>
                <FileText size={14} /> Timeline
              </button>
            </div>
            
            <button className="b24-btn b24-btn-secondary" onClick={openScheduleModal} style={{ gap: 7, marginLeft: 8 }}>
              <Clock size={15} /> Schedule Call
            </button>
            
            <button className="b24-btn b24-btn-primary" onClick={openLogModal} style={{ gap: 7, background: '#10b981' }}>
              <Plus size={15} /> Log Call
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              placeholder="Search calls by contact, deal, or context…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="b24-input" style={{ paddingLeft: 38, borderRadius: 8, border: '1px solid var(--card-border)' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '0 12px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="b24-select" style={{ border: 'none', padding: '8px 10px 8px 0', background: 'transparent', fontSize: 13, fontWeight: 600 }}>
              <option value="All">All Calls</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <button className="b24-btn b24-btn-secondary" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
             <RefreshCw size={14} />
          </button>
        </div>

      </div>

      {/* ── Main Content Area ── */}
      <div style={{ padding: '0 32px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ flex: 1 }}>
              <CallsTable 
                calls={processedCalls} 
                onEdit={openEditModal} 
                onDelete={handleDeleteCall} 
                onStatusChange={handleStatusChange} 
              />
            </motion.div>
          ) : (
             <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ flex: 1 }}>
              <TimelineView calls={processedCalls} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LogCallModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onSave={handleSaveCall} callParams={editingCall} />
      <ScheduleCallModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} onSave={handleSaveCall} callParams={editingCall} />
    </div>
  );
}
