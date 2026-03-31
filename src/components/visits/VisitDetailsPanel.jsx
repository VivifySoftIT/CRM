import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Navigation, Clock, CheckCircle2, XOctagon, User, Briefcase, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockVisits';

export default function VisitDetailsPanel({ visit, onClose, onStatusChange, onEdit }) {
  const { isDark } = useTheme();

  if (!visit) return null;

  const handleCheckIn = () => {
    // In real app, call navigator.geolocation.getCurrentPosition here
    alert('📍 GPS Location Captured! Checking in...');
    onStatusChange(visit.id, 'Checked-In', { checkInTime: new Date().toISOString() });
  };

  const handleCheckOut = () => {
    const outcome = prompt('Visit Outcome (e.g., Follow-up required):', 'Success');
    if (outcome !== null) {
       onStatusChange(visit.id, 'Completed', { checkOutTime: new Date().toISOString(), outcome });
    }
  };

  const formatDate = (ds) => new Date(ds).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (ds) => new Date(ds).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const stColor = STATUS_COLORS[visit.status];

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 500, zIndex: 100, background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}
    >
       <div style={{ padding: 24, borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Visit Details</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => onEdit(visit)} className="b24-btn b24-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Edit</button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
          </div>
       </div>

       <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          <div>
            <span style={{ background: stColor.bg, color: stColor.text, border: `1px solid ${stColor.border}`, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'inline-block' }}>
              {visit.status}
            </span>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.2 }}>
              {visit.title}
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 20, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', fontSize: 14 }}>
                 <Calendar size={18} color="#3b82f6" style={{flexShrink:0}}/> <strong>{formatDate(visit.visitDate)}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 14 }}>
                 <Clock size={18} color="#f59e0b" style={{flexShrink:0}}/> {formatTime(visit.visitDate)} ({visit.duration} Mins)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', fontSize: 14 }}>
                 <MapPin size={18} color="#10b981" style={{flexShrink:0}}/> <span style={{ fontWeight: 600 }}>{visit.location}</span>
              </div>
              <button className="b24-btn b24-btn-secondary" style={{ marginTop: 8, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 16px', borderRadius: 20 }}>
                 <Navigation size={14} /> Open in Google Maps
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             {visit.status === 'Scheduled' && (
               <button onClick={handleCheckIn} style={{ width: '100%', padding: '16px', borderRadius: 12, background: '#f59e0b', color: '#fff', fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                 <MapPin size={20} /> CHECK IN NOW
               </button>
             )}
             {visit.status === 'Checked-In' && (
               <button onClick={handleCheckOut} style={{ width: '100%', padding: '16px', borderRadius: 12, background: '#10b981', color: '#fff', fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                 <CheckCircle2 size={20} /> COMPLETE & CHECK OUT
               </button>
             )}
             {(visit.status === 'Scheduled' || visit.status === 'Checked-In') && (
                <button onClick={() => onStatusChange(visit.id, 'Missed')} style={{ width: '100%', padding: '12px', borderRadius: 12, background: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', color: '#ef4444', fontSize: 14, fontWeight: 800, border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <XOctagon size={16} /> Mark as Missed
                </button>
             )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>CRM Context</h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid var(--card-border)', borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--input-bg)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{visit.contactName}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Contact</div>
                </div>
             </div>
             
             {visit.dealName && (
               <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid var(--card-border)', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--input-bg)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{visit.dealName}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Associated Deal</div>
                  </div>
               </div>
             )}
          </div>

          <div>
             <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12 }}>Agenda & Notes</h3>
             <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--input-bg)', padding: 16, borderRadius: 12, margin: 0 }}>
               {visit.notes || 'No agenda provided.'}
             </p>
          </div>

          {visit.checkInTime && (
            <div style={{ paddingTop: 24, borderTop: '1px solid var(--card-border)' }}>
               <h3 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>Audit Trail</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}/> Checked in at {formatTime(visit.checkInTime)}
                  </div>
                  {visit.checkOutTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}/> Checked out at {formatTime(visit.checkOutTime)}
                      <br/>Outcome: {visit.outcome}
                    </div>
                  )}
               </div>
            </div>
          )}

       </div>
    </motion.div>
  );
}
