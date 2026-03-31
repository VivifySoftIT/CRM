import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, Edit2, Trash2, ShieldAlert,
  Clock, Hash, User, Briefcase
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../data/mockCases';

export default function CasesTable({ cases, onEdit, onDelete, onStatusChange }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const tableHeaderStyle = {
    padding: '16px 20px',
    fontSize: 11,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--card-border)'
  };

  const tdStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid var(--card-border)',
  };

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
          <thead style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
            <tr>
              <th style={{ ...tableHeaderStyle, paddingLeft: 30 }}>Case Details</th>
              <th style={tableHeaderStyle}>Customer</th>
              <th style={tableHeaderStyle}>Priority</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Status</th>
              <th style={tableHeaderStyle}>Assigned To</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'right', paddingRight: 30 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr 
                key={c.id} 
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => navigate(`/dashboard/cases/${c.id}`)}
              >
                {/* Case Details */}
                <td style={{ ...tdStyle, paddingLeft: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(249, 115, 22, 0.1)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Hash size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                         {c.caseNumber}
                         <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--card-border)' }} />
                         <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {formatDate(c.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                      {c.contactName.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{c.contactName}</span>
                      {c.relatedDeal && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
                          <Briefcase size={12} /> {c.relatedDeal}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Priority */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={14} className={PRIORITY_COLORS[c.priority]?.icon || 'text-gray-400'} />
                    <span style={{ fontSize: 12, fontWeight: 800 }} className={`${PRIORITY_COLORS[c.priority]?.text || 'text-gray-500'}`}>
                      {c.priority}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span className={`${STATUS_COLORS[c.status]?.bg} ${STATUS_COLORS[c.status]?.text}`} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[c.status]?.dot}`} style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                    {c.status}
                  </span>
                </td>

                {/* Assigned To */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--input-bg)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, border: '1px solid var(--card-border)' }}>
                      {c.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}>{c.assignedTo}</span>
                  </div>
                </td>

                {/* Actions */}
                <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 30, position: 'relative' }} onClick={e => e.stopPropagation()}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button 
                        onClick={() => onEdit(c)}
                        style={{ padding: 6, borderRadius: 8, background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer' }}
                        title="Edit Case"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(c.id)}
                        style={{ padding: 6, borderRadius: 8, background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                        title="Delete Case"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      {/* Status Dropdown Trigger */}
                      <button
                        onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenu(activeMenu === c.id ? null : c.id);
                        }}
                        style={{ padding: 6, borderRadius: 8, background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', marginLeft: 8 }}
                      >
                        <MoreVertical size={16} />
                      </button>
                   </div>

                   {/* Quick Status Dropdown */}
                   {activeMenu === c.id && (
                     <>
                       <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setActiveMenu(null)} />
                       <div style={{ position: 'absolute', right: 30, top: 40, width: 160, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20, padding: '4px 0' }}>
                         {Object.keys(STATUS_COLORS).map(status => (
                           <button 
                             key={status}
                             onClick={() => { onStatusChange(c.id, status); setActiveMenu(null); }}
                             style={{
                               width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                               background: c.status === status ? (isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff') : 'transparent',
                               color: c.status === status ? '#3b82f6' : 'var(--text-primary)'
                             }}
                             onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'}
                             onMouseLeave={e => { if (c.status !== status) e.currentTarget.style.backgroundColor = 'transparent' }}
                           >
                             Mark as {status}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
