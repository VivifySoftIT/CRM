import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, FileText, LayoutGrid, Folders
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SolutionsTable from '../../components/solutions/SolutionsTable';
import AddSolutionForm from '../../components/solutions/AddSolutionForm';
import { INITIAL_SOLUTIONS, INITIAL_CATEGORIES } from '../../data/mockSolutions';

export default function Solutions() {
  const { isDark } = useTheme();
  
  const [solutions, setSolutions] = useState(() => {
    const saved = localStorage.getItem('crm_solutions');
    return saved ? JSON.parse(saved) : INITIAL_SOLUTIONS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('crm_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solutionToEdit, setSolutionToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_solutions', JSON.stringify(solutions));
  }, [solutions]);

  useEffect(() => {
    localStorage.setItem('crm_categories', JSON.stringify(categories));
  }, [categories]);

  const filteredSolutions = useMemo(() => {
    return solutions.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = filterCategory === 'All' || s.category === filterCategory;
      const matchStatus = filterStatus === 'All' || s.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [solutions, searchTerm, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: solutions.length,
      published: solutions.filter(s => s.status === 'Published').length,
      drafts: solutions.filter(s => s.status === 'Draft').length,
      views: solutions.reduce((acc, curr) => acc + (curr.viewCount || 0), 0)
    };
  }, [solutions]);

  const handleSave = (formData) => {
    if (solutionToEdit) {
      setSolutions(prev => prev.map(s => s.id === solutionToEdit.id ? { ...formData, updatedAt: new Date().toISOString() } : s));
    } else {
      setSolutions(prev => [{
        ...formData,
        id: `sol-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0
      }, ...prev]);
    }
    setIsModalOpen(false);
    setSolutionToEdit(null);
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this solution?')) {
      setSolutions(prev => prev.filter(s => s.id !== id));
    }
  };

  const cardStyle = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Solutions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}></p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => { setSolutionToEdit(null); setIsModalOpen(true); }}
            className="b24-btn b24-btn-primary"
            style={{ padding: '10px 20px', borderRadius: 10, background: '#3b82f6' }}
          >
            <Plus size={16} /> Add Solution
          </button>
        </div>
      </div>

       {/* Stats Quick View */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Articles', value: stats.total, icon: BookOpen, color: '#3b82f6' },
          { label: 'Published', value: stats.published, icon: FileText, color: '#10b981' },
          { label: 'Drafts', value: stats.drafts, icon: LayoutGrid, color: '#64748b' },
          { label: 'Total Views', value: stats.views, icon: Search, color: '#8b5cf6' }
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
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search Subject, Tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="b24-input"
              style={{ paddingLeft: 40, borderRadius: 10 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--card-border)' }}>
            {['All', 'Published', 'Draft'].map((status) => (
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
          
          <select 
             value={filterCategory} 
             onChange={e=>setFilterCategory(e.target.value)}
             className="b24-select"
             style={{ borderRadius: 10, minWidth: 200 }}
          >
             <option value="All">All Categories</option>
             {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ minHeight: 400 }}>
        {filteredSolutions.length > 0 ? (
          <SolutionsTable solutions={filteredSolutions} onEdit={(s) => {setSolutionToEdit(s); setIsModalOpen(true);}} onDelete={handleDelete}/>
        ) : (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
             No solutions found matching your criteria.
          </div>
        )}
      </div>

      <AnimatePresence>
         {isModalOpen && (
            <AddSolutionForm 
               onClose={() => setIsModalOpen(false)}
               onSubmit={handleSave}
               solutionToEdit={solutionToEdit}
               categories={categories}
            />
         )}
      </AnimatePresence>

    </div>
  );
}
