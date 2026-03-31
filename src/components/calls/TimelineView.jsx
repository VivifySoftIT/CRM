import React from 'react';
import { PhoneIncoming, PhoneOutgoing, Clock, CheckCircle2, XCircle, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusIcon = (status) => {
  if (status === 'Completed') return <CheckCircle2 size={14} color="#10b981" />;
  if (status === 'Missed') return <XCircle size={14} color="#ef4444" />;
  return <Clock size={14} color="#f59e0b" />;
};

export default function TimelineView({ calls }) {
  // Group calls by date
  const groupedCalls = calls.reduce((acc, call) => {
    if (!acc[call.date]) acc[call.date] = [];
    acc[call.date].push(call);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedCalls).sort((a, b) => new Date(b) - new Date(a));

  if (calls.length === 0) {
    return (
      <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 60, textAlign: 'center' }}>
        <div style={{ margin: '0 auto 16px', width: 56, height: 56, background: 'var(--bg-page)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock color="var(--text-muted)" size={28} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>No calls on record</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Start making connections by logging a call.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page)', height: 'calc(100vh - 180px)', overflowY: 'auto', padding: '0 20px 40px' }} className="custom-scrollbar">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {sortedDates.map((dateStr, dimIdx) => {
          const dayCalls = groupedCalls[dateStr].sort((a, b) => {
            const timeA = a.startTime || "00:00";
            const timeB = b.startTime || "00:00";
            return timeB.localeCompare(timeA);
          });

          return (
            <div key={dateStr} style={{ marginBottom: 32 }}>
              {/* Date Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ padding: '6px 14px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, boxShadow: 'var(--card-shadow)', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Calendar size={14} color="var(--primary)" />
                   {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
              </div>

              {/* Day's Timeline Items */}
              <div style={{ position: 'relative', paddingLeft: 24, paddingBottom: 10 }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: 35, top: 12, bottom: 0, width: 2, background: 'var(--card-border)' }} />

                {dayCalls.map((call, idx) => {
                    const isIncoming = call.type === 'Incoming';
                    const TypeIcon = isIncoming ? PhoneIncoming : PhoneOutgoing;
                    const typeColor = isIncoming ? '#10b981' : '#3b82f6';
                    
                  return (
                    <motion.div 
                      key={call.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: dimIdx * 0.1 + idx * 0.05 }}
                      style={{ position: 'relative', display: 'flex', gap: 24, marginBottom: 24 }}
                    >
                      {/* Timeline Node */}
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--card-bg)', border: `2px solid ${typeColor}`, color: typeColor, display: 'grid', placeItems: 'center', zIndex: 2, flexShrink: 0, marginTop: 4 }}>
                         <TypeIcon size={12} />
                      </div>

                      {/* Card */}
                      <div style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, boxShadow: 'var(--card-shadow)', padding: '16px 20px', transition: 'all 0.2s' }}
                           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                           onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                           <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{call.contactName || 'Unknown Entity'}</span>
                                <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 800, color: typeColor, background: `${typeColor}15`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  {call.type} Call
                                </span>
                             </div>
                             <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                               Purpose: <span style={{ color: 'var(--text-primary)' }}>{call.purpose}</span>
                             </div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                               <Clock size={12} color="var(--text-muted)" /> {call.startTime} • {call.duration}m
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                               {getStatusIcon(call.status)} {call.status}
                             </div>
                           </div>
                         </div>

                         {call.notes && (
                           <div style={{ padding: '10px 14px', background: 'var(--input-bg)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--card-border)' }}>
                             "{call.notes}"
                           </div>
                         )}
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
                           {call.relatedDeal && (
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                                Related Deal: <span style={{ color: 'var(--primary)' }}>{call.relatedDeal}</span>
                              </div>
                           )}
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                             <User size={12} color="var(--text-muted)" />
                             <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{call.owner}</span>
                           </div>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
