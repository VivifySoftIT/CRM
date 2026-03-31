import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Calendar as CalendarIcon, Filter, Search, ChevronDown, CheckSquare, X, RefreshCw } from 'lucide-react';
import MeetingsTable from '../../components/meetings/MeetingsTable';
import CalendarView from '../../components/meetings/CalendarView';
import ScheduleMeetingModal from '../../components/meetings/ScheduleMeetingModal';

const MOCK_MEETINGS = [
  {
    id: '1',
    title: 'Product Roadmap Review Q3',
    description: 'Discuss upcoming features and timelines.',
    participants: [{ id: 'c1', name: 'John Doe' }],
    relatedContact: 'John Doe',
    relatedDeal: 'Enterprise Upgrade',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 60,
    locationType: 'Online',
    status: 'Scheduled',
    owner: 'John Sales'
  },
  {
    id: '2',
    title: 'Client Onboarding',
    description: 'Initial kickoff meeting.',
    participants: [{ id: 'c2', name: 'Jane Smith' }],
    relatedContact: 'Jane Smith',
    relatedDeal: 'Q4 Enterprise Deal',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '14:30',
    duration: 45,
    locationType: 'Online',
    status: 'Scheduled',
    owner: 'Alice Admin'
  },
  {
    id: '3',
    title: 'Contract Negotiation',
    description: 'Finalize terms.',
    participants: [{ id: 'c3', name: 'Acme Corp' }],
    relatedContact: 'Acme Corp',
    relatedDeal: 'Website Redesign',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: '09:00',
    duration: 30,
    locationType: 'Offline',
    status: 'Completed',
    owner: 'John Sales'
  }
];

export default function Meetings() {
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const processedMeetings = useMemo(() => {
    return meetings.filter(m => 
      (!searchTerm || 
       m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       m.relatedContact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       m.relatedDeal?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
  }, [meetings, searchTerm]);

  const handleSaveMeeting = (meeting) => {
    setMeetings(prev => {
      const exists = prev.find(m => m.id === meeting.id);
      if (exists) {
        return prev.map(m => m.id === meeting.id ? meeting : m);
      }
      return [...prev, meeting];
    });
    
    // Custom inline toast
    const alertBox = document.createElement('div');
    Object.assign(alertBox.style, {
      position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#10b981', color: '#fff',
      padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
    });
    alertBox.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> ${meeting.title} saved!`;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const openScheduleModal = () => {
    setEditingMeeting(null);
    setIsModalOpen(true);
  };

  const openEditModal = (meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleDateClick = (dateStr) => {
    setEditingMeeting({
      title: '', description: '', participants: [], users: [], relatedContact: '', relatedDeal: '',
      date: dateStr, startTime: '09:00', endTime: '10:00', duration: 60, locationType: 'Online',
      meetingLink: '', address: '', status: 'Scheduled', owner: 'John Sales'
    });
    setIsModalOpen(true);
  };

  const handleEventDrop = (id, newDate, newStartTime) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, date: newDate, startTime: newStartTime };
      }
      return m;
    }));
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: 12 }}>
              Meetings
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              Manage your team's scheduled meetings and calendar.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
             <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: 4, borderRadius: 8 }}>
              <button onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--primary)' : 'transparent', color: view === 'list' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}>
                <List size={14} /> List
              </button>
              <button onClick={() => setView('calendar')} style={{ background: view === 'calendar' ? 'var(--primary)' : 'transparent', color: view === 'calendar' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}>
                <CalendarIcon size={14} /> Calendar
              </button>
            </div>
            <button
              className="b24-btn b24-btn-primary"
              onClick={openScheduleModal}
              style={{ gap: 7 }}
            >
              <Plus size={15} /> Schedule Meeting
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              placeholder="Search meetings by title or contact…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="b24-input" style={{ paddingLeft: 38, borderRadius: 8, border: '1px solid var(--card-border)' }}
            />
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => setShowFilter(v => !v)}>
            <Filter size={14} /> Filters
          </button>
          <button className="b24-btn b24-btn-secondary" onClick={() => setSearchTerm('')}>
             <RefreshCw size={14} />
          </button>
        </div>

      </div>

      {/* ── Main Content Area ── */}
      <div style={{ padding: '0 32px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ flex: 1 }}>
              <MeetingsTable 
                meetings={processedMeetings} 
                onEdit={openEditModal} 
                onDelete={handleDeleteMeeting} 
                onStatusChange={handleStatusChange} 
              />
            </motion.div>
          ) : (
            <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ flex: 1 }}>
              <CalendarView 
                meetings={meetings} 
                onEdit={openEditModal} 
                onDateClick={handleDateClick} 
                onEventDrop={handleEventDrop} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScheduleMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveMeeting} meeting={editingMeeting} />
    </div>
  );
}
