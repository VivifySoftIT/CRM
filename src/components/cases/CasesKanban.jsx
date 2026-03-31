import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Clock, MessageSquare, Briefcase, Paperclip, CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_OPTIONS, STATUS_COLORS, PRIORITY_COLORS } from '../../data/mockCases';

export default function CasesKanban({ cases, onStatusChange }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [draggedCaseId, setDraggedCaseId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedCaseId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    const ghost = e.target.cloneNode(true);
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== status) setDragOverCol(status);
  };

  const handleDragLeave = (e, status) => {
    e.preventDefault();
    if (dragOverCol === status) setDragOverCol(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const caseId = e.dataTransfer.getData('text/plain');
    if (caseId && newStatus) {
      onStatusChange(caseId, newStatus);
    }
    setDraggedCaseId(null);
  };

  const timeAgo = (dateStr) => {
    const hours = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%', minHeight: 600, overflowX: 'auto', paddingBottom: 24 }}>
      {STATUS_OPTIONS.map((status) => {
        const colCases = cases.filter(c => c.status === status);
        const stColor = STATUS_COLORS[status];
        
        return (
          <div 
            key={status}
            style={{ 
              display: 'flex', flexDirection: 'column', minWidth: 320, maxWidth: 320, borderRadius: 16, transition: 'all 0.2s',
              background: dragOverCol === status ? (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc') : 'transparent',
              border: `1px dashed ${dragOverCol === status ? stColor.dot : 'var(--card-border)'}`,
              padding: 12
            }}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={(e) => handleDragLeave(e, status)}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stColor.dot }} className={stColor.bg} />
                <h3 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  {status}
                </h3>
              </div>
              <span className={stColor.text} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 800, background: 'var(--card-bg)' }}>
                {colCases.length}
              </span>
            </div>

            {/* Cases List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              <AnimatePresence>
                {colCases.map((c) => (
                  <motion.div
                    key={c.id}
                    layoutId={c.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: draggedCaseId === c.id ? 0.5 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, c.id)}
                    onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                    style={{ 
                      background: 'var(--card-bg)', border: `1px solid ${draggedCaseId === c.id ? stColor.dot : 'var(--card-border)'}`, borderRadius: 12, padding: 16, cursor: 'grab', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Header: ID & Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        {c.caseNumber}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldAlert size={12} className={PRIORITY_COLORS[c.priority]?.icon} />
                        <span className={PRIORITY_COLORS[c.priority]?.text} style={{ fontSize: 10, fontWeight: 800 }}>
                          {c.priority}
                        </span>
                      </div>
                    </div>

                    {/* Subject */}
                    <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                      {c.subject}
                    </h4>

                    {/* Customer Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>
                        {c.contactName.charAt(0)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                        {c.contactName}
                      </span>
                    </div>

                    {/* Footer Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }} title="Comments">
                          <MessageSquare size={12} /> {c.comments?.length || 0}
                        </span>
                        {c.attachments?.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }} title="Attachments">
                            <Paperclip size={12} /> {c.attachments.length}
                          </span>
                        )}
                        {c.relatedDeal && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#60a5fa' }} title="Linked Deal">
                            <Briefcase size={12} />
                          </span>
                        )}
                      </div>
                      
                      {status === 'Closed' ? (
                         <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#10b981' }}>
                           <CheckCircle2 size={12} /> Resolved
                         </div>
                      ) : (
                         <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: timeAgo(c.updatedAt).includes('d') ? '#f97316' : 'var(--text-muted)' }}>
                           <Clock size={12} />
                           {timeAgo(c.updatedAt)}
                         </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {colCases.length === 0 && (
                <div style={{ flex: 1, minHeight: 100, border: `2px dashed ${dragOverCol === status ? stColor.dot : 'var(--card-border)'}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', transition: 'colors 0.2s' }}>
                  {dragOverCol === status ? 'Drop Case Here' : 'No Cases'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
