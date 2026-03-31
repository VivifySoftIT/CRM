import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, MessageSquare, User, Briefcase, Paperclip, 
  ShieldAlert, Send, CheckCircle2, History, FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../data/mockCases';

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [supportCase, setSupportCase] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [suggestedSolutions, setSuggestedSolutions] = useState([]);
  
  // Simulated Auth User
  const currentUser = "John Sales"; 

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('crm_cases');
    if (saved) {
      const cases = JSON.parse(saved);
      const found = cases.find(c => c.id === id);
      if (found) {
         if(!found.comments) found.comments = [];
         setSupportCase(found);
         
         // Fetch matching solutions
         const savedSols = localStorage.getItem('crm_solutions');
         if (savedSols) {
            const allSols = JSON.parse(savedSols).filter(s => s.status === 'Published');
            const kw = found.subject.toLowerCase();
            const matches = allSols.filter(s => s.title.toLowerCase().includes(kw) || s.tags.some(t => kw.includes(t.toLowerCase())));
            setSuggestedSolutions(matches.slice(0, 3)); 
         }
      } else {
         navigate('/dashboard/cases');
      }
    } else {
      navigate('/dashboard/cases');
    }
  }, [id, navigate]);

  const saveToStorage = (updatedCase) => {
    const saved = localStorage.getItem('crm_cases');
    const cases = JSON.parse(saved);
    const updatedCases = cases.map(c => c.id === id ? updatedCase : c);
    localStorage.setItem('crm_cases', JSON.stringify(updatedCases));
    setSupportCase(updatedCase);
  };

  const handleStatusChange = (newStatus) => {
     saveToStorage({ 
       ...supportCase, 
       status: newStatus,
       updatedAt: new Date().toISOString()
     });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: currentUser,
      date: new Date().toISOString()
    };

    saveToStorage({
      ...supportCase,
      comments: [comment, ...supportCase.comments],
      updatedAt: new Date().toISOString()
    });
    setNewComment('');
  };

  if (!supportCase) return null;

  const stColor = STATUS_COLORS[supportCase.status];
  const prColor = PRIORITY_COLORS[supportCase.priority];

  const formatDate = (ds) => new Date(ds).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Navigation */}
      <button 
        onClick={() => navigate('/dashboard/cases')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 24, transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Cases
      </button>

      {/* Header Profile */}
      <div style={{ ...cardStyle, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 10 }}>
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  {supportCase.caseNumber}
                </span>
                
                <span className={`${stColor.bg} ${stColor.text}`} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className={stColor.dot} style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {supportCase.status}
                </span>

                <span className={prColor.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <ShieldAlert size={12} className={prColor.icon} />
                  {supportCase.priority} Priority
                </span>
             </div>
             
             <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.2 }}>
               {supportCase.subject}
             </h1>

             <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14, fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                  <User size={16} /> Contact: <span style={{ color: 'var(--text-primary)' }}>{supportCase.contactName}</span>
                </div>
                {supportCase.relatedDeal && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                    <Briefcase size={16} color="#3b82f6" />
                    Deal: <span style={{ color: '#3b82f6' }}>{supportCase.relatedDeal}</span>
                  </div>
                )}
             </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
             {supportCase.status !== 'Closed' && (
               <button 
                 onClick={() => handleStatusChange('Closed')}
                 style={{ padding: '10px 24px', background: '#10b981', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: 8 }}
               >
                 <CheckCircle2 size={18} /> Close Case
               </button>
             )}
             {supportCase.status === 'Open' && (
               <button 
                 onClick={() => handleStatusChange('Escalated')}
                 style={{ padding: '10px 24px', background: '#f97316', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)', display: 'flex', alignItems: 'center', gap: 8 }}
               >
                 <ShieldAlert size={18} /> Escalate
               </button>
             )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        
        {/* Main Content (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Description Block */}
          <div style={cardStyle}>
             <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' }}>
               Case Description
             </h3>
             <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: 0 }}>
               {supportCase.description}
             </p>
          </div>

          {/* Discussion / Comments */}
          <div style={{ ...cardStyle, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
               <MessageSquare size={18} color="#3b82f6" />
               <h3 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0 }}>
                 Internal Discussion
               </h3>
            </div>
            
            <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 300 }}>
              {/* Comment List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 24, overflowY: 'auto' }}>
                 {supportCase.comments.map((cm) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     key={cm.id} 
                     style={{ display: 'flex', gap: 16 }}
                   >
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                       {cm.author.split(' ').map(n=>n[0]).join('')}
                     </div>
                     <div style={{ flex: 1, background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb', padding: 16, borderRadius: 16, borderTopLeftRadius: 0, border: '1px solid var(--card-border)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                         <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{cm.author}</span>
                         <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>{formatDate(cm.date)}</span>
                       </div>
                       <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
                         {cm.text}
                       </p>
                     </div>
                   </motion.div>
                 ))}
                 
                 {supportCase.comments.length === 0 && (
                   <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontWeight: 800, fontSize: 14 }}>
                     No internal notes or discussion yet.
                   </div>
                 )}
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} style={{ padding: 16, borderTop: '1px solid var(--card-border)', display: 'flex', alignItems: 'flex-end', gap: 12, background: isDark ? 'rgba(255,255,255,0.01)' : '#f8fafc' }}>
              <textarea 
                rows="2"
                placeholder="Type a note or reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="b24-textarea"
                style={{ flex: 1, resize: 'none', padding: 12 }}
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: '#2563eb', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !newComment.trim() ? 'not-allowed' : 'pointer', opacity: !newComment.trim() ? 0.5 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s' }}
              >
                <Send size={18} />
              </button>
            </form>

          </div>

        </div>

        {/* Sidebar Info (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Properties */}
          <div style={cardStyle}>
             <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
               <History size={14} /> Case Properties
             </h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>Assigned Agent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--input-bg)', border: '1px solid var(--card-border)', fontWeight: 800, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      {supportCase.assignedTo.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{supportCase.assignedTo}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>Created On</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>{formatDate(supportCase.createdAt)}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>Last Updated</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>{formatDate(supportCase.updatedAt)}</span>
                </div>
             </div>
          </div>

          {/* Attachments */}
          <div style={cardStyle}>
             <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
               <Paperclip size={14} /> Attachments ({(supportCase.attachments || []).length})
             </h3>
             
             {(supportCase.attachments && supportCase.attachments.length > 0) ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {supportCase.attachments.map((file, i) => (
                   <div key={i} style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--card-border)' }}>
                     <Paperclip size={16} color="#3b82f6" />
                     <span style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, color: 'var(--text-primary)' }}>{file}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                 No files attached.
               </div>
             )}
          </div>

          {/* Suggested Solutions */}
          {suggestedSolutions.length > 0 && (
            <div style={cardStyle}>
               <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                 <FileText size={14} /> Suggested Solutions
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {suggestedSolutions.map(sol => (
                   <div key={sol.id} style={{ padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid var(--card-border)', background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         <span style={{ fontSize: 10, fontWeight: 900, color: '#3b82f6', background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', padding: '2px 8px', borderRadius: 20 }}>{sol.category}</span>
                      </div>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{sol.title}</h4>
                      <button 
                        onClick={() => navigate(`/dashboard/solutions/${sol.id}`)}
                        className="b24-btn b24-btn-secondary"
                        style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, alignSelf: 'flex-start', marginTop: 4 }}
                      >
                        View Article
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
