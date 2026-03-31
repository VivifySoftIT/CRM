import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Plus, Map, List, Calendar as CalendarIcon, CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_VISITS } from '../../data/mockVisits';

import VisitsTable from '../../components/visits/VisitsTable';
import VisitsCalendar from '../../components/visits/VisitsCalendar';
import VisitsMap from '../../components/visits/VisitsMap';
import VisitFormModal from '../../components/visits/VisitFormModal';
import VisitDetailsPanel from '../../components/visits/VisitDetailsPanel';

export default function Visits() {
  const { isDark } = useTheme();

  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem('crm_visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'map'
  const [filterPeriod, setFilterPeriod] = useState('All'); // 'All', 'Today', 'Upcoming', 'Completed'
  
  const [activeVisit, setActiveVisit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_visits', JSON.stringify(visits));
  }, [visits]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: visits.length,
      today: visits.filter(v => new Date(v.visitDate).toDateString() === today).length,
      upcoming: visits.filter(v => new Date(v.visitDate) > new Date() && v.status !== 'Completed').length,
      completed: visits.filter(v => v.status === 'Completed').length
    };
  }, [visits]);

  const filteredVisits = useMemo(() => {
    const today = new Date().toDateString();
    return visits.filter(v => {
      if (filterPeriod === 'Today') return new Date(v.visitDate).toDateString() === today;
      if (filterPeriod === 'Upcoming') return new Date(v.visitDate) > new Date() && v.status !== 'Completed';
      if (filterPeriod === 'Completed') return v.status === 'Completed';
      return true;
    }).sort((a,b) => new Date(b.visitDate) - new Date(a.visitDate));
  }, [visits, filterPeriod]);

  const handleSaveVisit = (visitData) => {
    if (visitToEdit) {
      setVisits(prev => prev.map(v => v.id === visitToEdit.id ? { ...v, ...visitData } : v));
    } else {
      setVisits(prev => [{
        ...visitData,
        id: `v-${Date.now()}`,
        status: 'Scheduled',
        checkInTime: null, checkOutTime: null, outcome: null,
        createdAt: new Date().toISOString()
      }, ...prev]);
    }
    setIsFormOpen(false);
    setVisitToEdit(null);
  };

  const handleStatusChange = (id, newStatus, additionalData = {}) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus, ...additionalData } : v));
    if (activeVisit && activeVisit.id === id) {
       setActiveVisit(prev => ({ ...prev, status: newStatus, ...additionalData }));
    }
  };

  const openEdit = (visit) => {
    setActiveVisit(null);
    setVisitToEdit(visit);
    setIsFormOpen(true);
  };

  const cardStyle = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Field Visits</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>Track external meetings, on-site audits, and sales visits</p>
        </div>
        
        <button 
          onClick={() => { setVisitToEdit(null); setIsFormOpen(true); }}
          className="b24-btn b24-btn-primary"
          style={{ padding: '10px 20px', borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={16} /> Schedule Visit
        </button>
      </div>

       {/* KPIs */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Visits', value: stats.total, icon: Navigation, color: '#3b82f6' },
          { label: 'Visits Today', value: stats.today, icon: Clock, color: '#f59e0b' },
          { label: 'Upcoming', value: stats.upcoming, icon: CalendarCheck, color: '#8b5cf6' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: '#10b981' }
        ].map((stat, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'grid', placeItems: 'center' }}>
              <stat.icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

       {/* Toolbar */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
          {['All', 'Today', 'Upcoming', 'Completed'].map((period) => (
            <button
              key={period} onClick={() => setFilterPeriod(period)}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: filterPeriod === period ? 'var(--card-bg)' : 'transparent', color: filterPeriod === period ? '#3b82f6' : 'var(--text-muted)', boxShadow: filterPeriod === period ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {period}
            </button>
          ))}
        </div>
        
        {/* View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
          {[
             { id: 'list', icon: List, label: 'List' },
             { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
             { id: 'map', icon: Map, label: 'Map' }
          ].map((v) => (
            <button
              key={v.id} onClick={() => setViewMode(v.id)}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
                background: viewMode === v.id ? 'var(--card-bg)' : 'transparent', color: viewMode === v.id ? '#3b82f6' : 'var(--text-muted)', boxShadow: viewMode === v.id ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <v.icon size={14} /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board */}
      <div style={{ minHeight: 400 }}>
         {viewMode === 'list' && (
           <VisitsTable visits={filteredVisits} onViewDetails={setActiveVisit} />
         )}
         {viewMode === 'calendar' && (
           <VisitsCalendar visits={filteredVisits} onViewDetails={setActiveVisit} />
         )}
         {viewMode === 'map' && (
           <VisitsMap visits={filteredVisits} onViewDetails={setActiveVisit} />
         )}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {isFormOpen && (
          <VisitFormModal 
             onClose={() => setIsFormOpen(false)}
             onSave={handleSaveVisit}
             visitToEdit={visitToEdit}
          />
        )}
        {activeVisit && (
          <>
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, backdropFilter:'blur(2px)'}} onClick={() => setActiveVisit(null)} />
             <VisitDetailsPanel 
                visit={activeVisit}
                onClose={() => setActiveVisit(null)}
                onStatusChange={handleStatusChange}
                onEdit={openEdit}
             />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
