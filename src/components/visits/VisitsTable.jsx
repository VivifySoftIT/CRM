import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2, MapPin, Calendar, Clock, User, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockVisits';

export default function VisitsTable({ visits, onViewDetails }) {
  const { isDark } = useTheme();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit'
    });
  };

  const tableHeaderStyle = {
    padding: '16px 20px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)'
  };

  const tdStyle = {
    padding: '16px 20px', borderBottom: '1px solid var(--card-border)'
  };

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
          <thead style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
            <tr>
              <th style={{ ...tableHeaderStyle, paddingLeft: 30 }}>Visit Info</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Date & Time</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Owner</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'right', paddingRight: 30 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => {
              const stColor = STATUS_COLORS[visit.status];
              
              return (
                <tr 
                  key={visit.id} 
                  style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => onViewDetails(visit)}
                >
                  {/* Visit Info */}
                  <td style={{ ...tdStyle, paddingLeft: 30 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{visit.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12}/>{visit.contactName}</div>
                         {visit.dealName && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8b5cf6' }}><Briefcase size={12}/>{visit.dealName}</div>}
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <MapPin size={14} color="#3b82f6" />
                      <span>{visit.location}</span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td style={tdStyle}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                          <Calendar size={13} color="var(--text-muted)" /> {formatDate(visit.visitDate)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                          <Clock size={13} /> {formatTime(visit.visitDate)} ({visit.duration}m)
                        </div>
                     </div>
                  </td>

                  {/* Status */}
                  <td style={tdStyle}>
                    <span style={{ 
                      background: stColor.bg, color: stColor.text, border: `1px solid ${stColor.border}`,
                      padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', 
                      display: 'inline-flex', alignItems: 'center', gap: 6 
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: stColor.dot }} />
                      {visit.status}
                    </span>
                  </td>

                  {/* Owner */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--input-bg)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                        {visit.owner.charAt(0)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{visit.owner}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 30 }} onClick={e => e.stopPropagation()}>
                     <button 
                       onClick={() => onViewDetails(visit)}
                       className="b24-btn b24-btn-secondary"
                       style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                     >
                       Open <Navigation2 size={12} />
                     </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
