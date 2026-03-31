import React from 'react';
import { MoreHorizontal, Edit, Trash2, Calendar, Clock, MapPin, Video, User, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return { bg: 'rgba(56,130,246,0.12)', text: '#2563eb' };
    case 'Completed': return { bg: 'rgba(16,185,129,0.12)', text: '#10b981' };
    case 'Cancelled': return { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' };
    case 'Postponed': return { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' };
    default: return { bg: 'rgba(100,116,139,0.12)', text: '#64748b' };
  }
};

export default function MeetingsTable({ meetings, onEdit, onDelete, onStatusChange }) {
  const [activeMenu, setActiveMenu] = React.useState(null);

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
              {['Meeting Title', 'Related To', 'Date & Time', 'Duration', 'Location', 'Status', 'Owner', ''].map((head, i) => (
                <th key={i} style={{ padding: '12px 14px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ margin: '0 auto 16px', width: 56, height: 56, background: 'var(--bg-page)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar color="var(--text-muted)" size={28} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>No meetings scheduled</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Get started by scheduling a new meeting.</p>
                </td>
              </tr>
            )}
            {meetings.map((meeting, i) => {
              const statusColors = getStatusColor(meeting.status);
              return (
                <motion.tr 
                  key={meeting.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer', background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.2 }}>{meeting.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meeting.participants?.map(p => p.name).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {meeting.relatedContact && (
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{meeting.relatedContact} (Contact)</div>
                    )}
                    {meeting.relatedDeal && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{meeting.relatedDeal} (Deal)</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                      <Calendar size={12} color="var(--primary)" />
                      <span>{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>
                      <Clock size={11} color="var(--text-muted)" />
                      <span>{meeting.startTime}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {meeting.duration} min
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {meeting.locationType === 'Online' ? <Video size={12} color="var(--primary)" /> : <MapPin size={12} color="var(--text-muted)" />}
                      <span>{meeting.locationType}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', padding: '1px 7px', borderRadius: 99, background: statusColors.bg, color: statusColors.text, letterSpacing: '0.05em' }}>
                      {meeting.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: 'var(--primary)', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {meeting.owner ? meeting.owner.charAt(0) : 'U'}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{meeting.owner || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', position: 'relative', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === meeting.id ? null : meeting.id); }}
                      style={{ padding: '6px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 7 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === meeting.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          style={{ position: 'absolute', right: 34, top: 34, width: 220, background: 'var(--card-bg)', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--card-border)', padding: '6px', zIndex: 50, textAlign: 'left' }}
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(meeting); setActiveMenu(null); }}
                            className="b24-btn b24-btn-ghost"
                            style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--text-primary)', border: 'none', borderRadius: 8 }}
                          >
                            <Edit size={14} /> Edit Meeting
                          </button>
                          
                          {meeting.status !== 'Completed' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onStatusChange(meeting.id, 'Completed'); setActiveMenu(null); }}
                              className="b24-btn b24-btn-ghost"
                              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: '#10b981', border: 'none', borderRadius: 8, marginTop: 4 }}
                            >
                              <CheckCircle2 size={14} /> Mark as Completed
                            </button>
                          )}
                          
                          {meeting.status !== 'Cancelled' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onStatusChange(meeting.id, 'Cancelled'); setActiveMenu(null); }}
                              className="b24-btn b24-btn-ghost"
                              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: '#ef4444', border: 'none', borderRadius: 8, marginTop: 4 }}
                            >
                              <XCircle size={14} /> Cancel Meeting
                            </button>
                          )}

                          <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(meeting.id); setActiveMenu(null); }}
                            className="b24-btn b24-btn-danger"
                            style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', border: 'none', borderRadius: 8, marginTop: 4 }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {meetings.length > 0 && (
         <div style={{ padding: '14px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {meetings.length} meeting{meetings.length === 1 ? '' : 's'}
          </span>
         </div>
      )}
    </div>
  );
}
