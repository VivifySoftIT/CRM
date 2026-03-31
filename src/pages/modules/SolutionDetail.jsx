import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Clock, CheckCircle2, Copy, Trash2, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockSolutions';

export default function SolutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [solution, setSolution] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('crm_solutions');
    if (saved) {
      const db = JSON.parse(saved);
      const found = db.find(s => s.id === id);
      if (found) {
         setSolution(found);
      } else {
         navigate('/dashboard/solutions');
      }
    } else {
      navigate('/dashboard/solutions');
    }
  }, [id, navigate]);

  const handleCopyLink = () => {
     // Simulate copying a public or deep link to this solution
     navigator.clipboard.writeText(window.location.href);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus) => {
    const saved = localStorage.getItem('crm_solutions');
    const db = JSON.parse(saved);
    const updatedSolutions = db.map(s => s.id === id ? { ...s, status: newStatus, updatedAt: new Date().toISOString() } : s);
    localStorage.setItem('crm_solutions', JSON.stringify(updatedSolutions));
    setSolution(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
  };

  if (!solution) return null;

  const formatDate = (ds) => new Date(ds).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const cardStyle = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 16, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000, margin: '0 auto', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Nav */}
      <button 
        onClick={() => navigate('/dashboard/solutions')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 24, transition: 'color 0.2s' }}
      >
        <ArrowLeft size={16} /> Back to Knowledge Base
      </button>

      {/* Main Header Card */}
      <div style={{ ...cardStyle, marginBottom: 24, position: 'relative' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
           
           <div style={{ flex: 1, minWidth: 200 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
               <span style={{ fontSize: 12, fontWeight: 800, color: '#3b82f6', background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', padding: '4px 12px', borderRadius: 20 }}>
                 {solution.category}
               </span>
               <span className={STATUS_COLORS[solution.status]?.text} style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 • {solution.status}
               </span>
             </div>

             <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.2 }}>
               {solution.title}
             </h1>

             <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={`https://ui-avatars.com/api/?name=${solution.author}&background=random`} alt={solution.author} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                  <span>By {solution.author}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} /> Last Updated: {formatDate(solution.updatedAt)}
                </div>
                <div>{solution.viewCount} Views</div>
             </div>
           </div>

           {/* Quick Actions */}
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={handleCopyLink}
                className="b24-btn b24-btn-secondary"
                style={{ padding: '8px 16px', borderRadius: 10, display: 'flex', gap: 8, background: copied ? '#10b981' : 'var(--card-bg)', color: copied ? '#fff' : 'var(--text-primary)' }}
              >
                {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy Article Link'}
              </button>
              
              {solution.status === 'Draft' ? (
                <button onClick={()=>handleStatusChange('Published')} className="b24-btn b24-btn-primary" style={{ padding: '8px 16px', borderRadius: 10, background: '#10b981' }}>
                  Publish
                </button>
              ) : (
                <button onClick={()=>handleStatusChange('Draft')} className="b24-btn b24-btn-secondary" style={{ padding: '8px 16px', borderRadius: 10 }}>
                  Unpublish
                </button>
              )}
           </div>
         </div>
      </div>

      <div style={cardStyle}>
         
         <div 
           className="solution-content"
           dangerouslySetInnerHTML={{ __html: solution.content }}
           style={{ color: 'var(--text-primary)', fontSize: 16, lineHeight: 1.8, fontFamily: 'sans-serif' }}
         />
         
         <style>{`
           .solution-content h3 { font-size: 20px; font-weight: 800; margin: 24px 0 16px; color: var(--text-primary); border-bottom: 1px solid var(--card-border); padding-bottom: 8px; }
           .solution-content p { margin-bottom: 16px; color: var(--text-muted); font-weight: 500; }
           .solution-content ul { padding-left: 24px; margin-bottom: 16px; }
           .solution-content li { margin-bottom: 8px; color: var(--text-muted); font-weight: 500; }
           .solution-content strong { color: var(--text-primary); font-weight: 800; }
         `}</style>
         
         {/* Tags Section */}
         {solution.tags && solution.tags.length > 0 && (
           <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Tags:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                 {solution.tags.map(t => (
                   <span key={t} style={{ background: 'var(--input-bg)', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                     #{t}
                   </span>
                 ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
