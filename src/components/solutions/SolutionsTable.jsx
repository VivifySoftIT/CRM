import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, FileText, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockSolutions';

export default function SolutionsTable({ solutions, onEdit, onDelete }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

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
              <th style={{ ...tableHeaderStyle, paddingLeft: 30 }}>Title</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Last Updated</th>
              <th style={tableHeaderStyle}>Author</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'right', paddingRight: 30 }}>Actions</th>
             </tr>
          </thead>
          <tbody>
            {solutions.map((s) => (
              <tr 
                key={s.id} 
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => navigate(`/dashboard/solutions/${s.id}`)}
              >
                {/* Title */}
                <td style={{ ...tdStyle, paddingLeft: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                         {s.tags?.slice(0,3).map(t => (
                           <span key={t} style={{ background: 'var(--input-bg)', padding: '2px 6px', borderRadius: 4, fontSize: 9, textTransform: 'uppercase' }}>{t}</span>
                         ))}
                         {s.tags?.length > 3 && <span style={{ fontSize: 10 }}>+{s.tags.length-3}</span>}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.category}</span>
                </td>

                <td style={tdStyle}>
                   <span className={STATUS_COLORS[s.status]?.text} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid transparent`, borderColor: `currentColor` }}>
                     {s.status === 'Draft' ? <Lock size={12}/> : <Eye size={12}/>}
                     {s.status}
                   </span>
                </td>

                <td style={tdStyle}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{formatDate(s.updatedAt)}</span>
                </td>

                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--input-bg)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, border: '1px solid var(--card-border)' }}>
                      {s.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{s.author}</span>
                  </div>
                </td>

                <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 30 }} onClick={e => e.stopPropagation()}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button 
                        onClick={() => onEdit(s)}
                        style={{ padding: 6, borderRadius: 8, background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(s.id)}
                        style={{ padding: 6, borderRadius: 8, background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
