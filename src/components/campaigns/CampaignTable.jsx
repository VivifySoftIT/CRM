import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, Edit2, Trash2, Eye, 
  Mail, MessageSquare, Share2, Calendar, Megaphone,
  TrendingUp, BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockCampaigns';

export default function CampaignTable({ campaigns, onEdit, onDelete }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Email Campaign': return { icon: Mail, color: '#3b82f6' };
      case 'SMS Campaign': return { icon: MessageSquare, color: '#f59e0b' };
      case 'Social Media Campaign': return { icon: Share2, color: '#10b981' };
      case 'Event Campaign': return { icon: Calendar, color: '#8b5cf6' };
      default: return { icon: Megaphone, color: '#64748b' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const headerStyle = {
    padding: '16px 20px',
    fontSize: 11,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--card-border)',
    textAlign: 'left'
  };

  const cellStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid var(--card-border)',
    fontSize: 14,
    color: 'var(--text-primary)'
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
        <thead style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
          <tr>
            <th style={{ ...headerStyle, paddingLeft: 30 }}>Campaign Name</th>
            <th style={headerStyle}>Type</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Date Range</th>
            <th style={headerStyle}>Budget</th>
            <th style={headerStyle}>Performance</th>
            <th style={headerStyle}>Owner</th>
            <th style={{ ...headerStyle, textAlign: 'right', paddingRight: 30 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                No campaigns found.
              </td>
            </tr>
          ) : (
            campaigns.map((c) => {
              const { icon: TypeIcon, color: typeColor } = getTypeIcon(c.type);
              const st = STATUS_COLORS[c.status];
              const roi = c.actualCost > 0 ? ((c.metrics.revenue / c.actualCost) * 100).toFixed(0) : 0;

              return (
                <tr 
                  key={c.id}
                  style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => navigate(`/dashboard/campaigns/${c.id}`)}
                >
                  <td style={{ ...cellStyle, paddingLeft: 30 }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Added on {formatDate(c.createdAt)}</div>
                  </td>
                  
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${typeColor}15`, color: typeColor, display: 'grid', placeItems: 'center' }}>
                        <TypeIcon size={16} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{c.type.replace(' Campaign', '')}</span>
                    </div>
                  </td>

                  <td style={cellStyle}>
                    <span style={{ 
                      background: st.bg, color: st.text, border: `1px solid ${st.border}`,
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 900,
                      display: 'inline-flex', alignItems: 'center', gap: 6
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
                      {c.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{formatDate(c.startDate)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>to {formatDate(c.endDate)}</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={{ fontWeight: 800 }}>${c.budget.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Spent: ${c.actualCost.toLocaleString()}</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--input-bg)', borderRadius: 10, overflow: 'hidden', minWidth: 80 }}>
                        <div style={{ width: `${Math.min(roi / 2, 100)}%`, height: '100%', background: '#8b5cf6', borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#8b5cf6' }}>{roi}% ROI</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{c.metrics.leads} Leads Generated</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', fontSize: 11, fontWeight: 900, display: 'grid', placeItems: 'center' }}>
                        {c.owner.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{c.owner}</span>
                    </div>
                  </td>

                  <td style={{ ...cellStyle, textAlign: 'right', paddingRight: 30 }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button 
                        onClick={() => navigate(`/dashboard/campaigns/${c.id}`)}
                        className="b24-btn b24-btn-secondary" 
                        style={{ padding: 8, borderRadius: 8 }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(c)}
                        className="b24-btn b24-btn-secondary" 
                        style={{ padding: 8, borderRadius: 8 }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(c.id)}
                        className="b24-btn b24-btn-secondary" 
                        style={{ padding: 8, borderRadius: 8, color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
