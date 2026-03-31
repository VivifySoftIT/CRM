import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, Plus, Search, Download, 
  List, Columns, ShieldAlert,
  Clock, XCircle, TrendingUp
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import CasesTable from '../../components/cases/CasesTable';
import CasesKanban from '../../components/cases/CasesKanban';
import CreateCaseModal from '../../components/cases/CreateCaseModal';
import { INITIAL_CASES, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../data/mockCases';

export default function Cases() {
  const { isDark } = useTheme();
  
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('crm_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewType, setViewType] = useState('table'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseToEdit, setCaseToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_cases', JSON.stringify(cases));
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: cases.length,
      open: cases.filter(c => c.status === 'Open').length,
      escalated: cases.filter(c => c.status === 'Escalated').length,
      highPriority: cases.filter(c => c.priority === 'High').length
    };
  }, [cases]);

  const handleSaveCase = (formData) => {
    if (caseToEdit) {
      setCases(prev => prev.map(c => 
        c.id === caseToEdit.id ? { ...formData, updatedAt: new Date().toISOString() } : c
      ));
    } else {
      const newCase = {
        ...formData,
        id: `case-${Date.now()}`,
        caseNumber: `CAS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      };
      setCases(prev => [newCase, ...prev]);
    }
    setIsModalOpen(false);
    setCaseToEdit(null);
  };

  const handleDeleteCase = (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
       setCases(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setCases(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    ));
  };

  const exportToCSV = () => {
    const headers = ['Case Number', 'Subject', 'Customer', 'Priority', 'Status', 'Assigned To', 'Created At'];
    const rows = filteredCases.map(c => [
      c.caseNumber, `"${c.subject}"`, c.contactName, c.priority, c.status, c.assignedTo, c.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cases_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Support Cases</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>Resolve customer issues and track support tickets</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={exportToCSV}
            className="b24-btn b24-btn-secondary"
            style={{ padding: '10px 16px', borderRadius: 10 }}
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => { setCaseToEdit(null); setIsModalOpen(true); }}
            className="b24-btn b24-btn-primary"
            style={{ padding: '10px 20px', borderRadius: 10, background: '#10b981' }}
          >
            <Plus size={16} /> Create Case
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Cases', value: stats.total, icon: LifeBuoy, color: '#3b82f6' },
          { label: 'Open Issues', value: stats.open, icon: Clock, color: '#f59e0b' },
          { label: 'Escalated', value: stats.escalated, icon: TrendingUp, color: '#ef4444' },
          { label: 'High Priority', value: stats.highPriority, icon: ShieldAlert, color: '#8b5cf6' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
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

      {/* Controls Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search Subject, Output, Contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="b24-input"
              style={{ paddingLeft: 40, borderRadius: 10 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
            {['All', ...STATUS_OPTIONS].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: filterStatus === status ? 'var(--card-bg)' : 'transparent',
                  color: filterStatus === status ? '#3b82f6' : 'var(--text-muted)',
                  boxShadow: filterStatus === status ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
          <button 
            onClick={() => setViewType('table')}
            style={{ padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: viewType === 'table' ? 'var(--card-bg)' : 'transparent', color: viewType === 'table' ? '#3b82f6' : 'var(--text-muted)' }}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewType('kanban')}
            style={{ padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: viewType === 'kanban' ? 'var(--card-bg)' : 'transparent', color: viewType === 'kanban' ? '#3b82f6' : 'var(--text-muted)' }}
          >
            <Columns size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', minHeight: 500 }}>
        {viewType === 'table' ? (
          <CasesTable 
            cases={filteredCases} 
            onEdit={(c) => { setCaseToEdit(c); setIsModalOpen(true); }}
            onDelete={handleDeleteCase}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <CasesKanban 
            cases={filteredCases}
            onStatusChange={handleStatusChange}
          />
        )}

        {filteredCases.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
             <XCircle size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
             <h3 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No Support Cases Found</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 350 }}>
               Try clearing filters or adding a new case to start managing customer issues.
             </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateCaseModal 
            onClose={() => { setIsModalOpen(false); setCaseToEdit(null); }}
            onSubmit={handleSaveCase}
            caseToEdit={caseToEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
