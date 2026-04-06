import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit2, Ban, CheckCircle, Trash2, CreditCard, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PLAN_STYLES = {
  Free:       { bg: 'rgba(148,163,184,0.12)', color: '#64748b' },
  Starter:    { bg: 'rgba(20,184,166,0.1)',   color: '#14b8a6' },
  Pro:        { bg: 'rgba(139,92,246,0.1)',   color: '#8b5cf6' },
  Enterprise: { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
};

const COLS = ['Organization', 'Admin', 'Email', 'Plan', 'Users', 'Status', 'Created', 'Actions'];

function ActionBtn({ icon: Icon, title, color, onClick }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width: 30, height: 30, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
      onMouseOver={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.borderColor = color + '44'; }}
      onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
      <Icon size={13} color={color} />
    </button>
  );
}

export default function OrganizationTable({ orgs, page, totalPages, totalCount, pageSize, onPageChange, onPageSizeChange, onView, onEdit, onToggleStatus, onChangePlan, onDelete }) {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalCount);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
              {COLS.map(h => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: 'var(--bg-darker)' }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orgs.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center' }}>
                      <Users size={22} color="var(--text-muted)" />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>No organizations found</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
            {orgs.map((org, i) => {
              const plan = PLAN_STYLES[org.plan] || PLAN_STYLES.Free;
              return (
                <motion.tr key={org.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s', cursor: 'default' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Organization */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'white' }}>{org.name[0]}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{org.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>ID #{org.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Admin */}
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{org.adminName}</td>

                  {/* Email */}
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{org.email}</td>

                  {/* Plan */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '99px', background: plan.bg, color: plan.color, whiteSpace: 'nowrap' }}>
                      {org.plan}
                    </span>
                  </td>

                  {/* Users */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.users}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {org.maxUsers}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge label={org.status} />
                  </td>

                  {/* Created */}
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{org.createdDate}</td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <ActionBtn icon={Eye}      title="View Details"  color="#6366f1" onClick={() => onView(org)} />
                      <ActionBtn icon={Edit2}    title="Edit"          color="#f59e0b" onClick={() => onEdit(org)} />
                      <ActionBtn icon={CreditCard} title="Change Plan" color="#8b5cf6" onClick={() => onChangePlan(org)} />
                      <ActionBtn icon={org.status === 'Active' ? Ban : CheckCircle} title={org.status === 'Active' ? 'Suspend' : 'Activate'} color={org.status === 'Active' ? '#ef4444' : '#10b981'} onClick={() => onToggleStatus(org)} />
                      <ActionBtn icon={Trash2}   title="Delete"        color="#ef4444" onClick={() => onDelete(org)} />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{start}–{end}</span> of <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{totalCount}</span>
          </p>
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}
            style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
            style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            <ChevronLeft size={14} color="var(--text-secondary)" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1).reduce((acc, n, idx, arr) => {
            if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
            acc.push(n);
            return acc;
          }, []).map((n, i) => n === '...' ? (
            <span key={`e${i}`} style={{ width: 32, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>…</span>
          ) : (
            <button key={n} onClick={() => onPageChange(n)}
              style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--card-border)', background: page === n ? '#6366f1' : 'var(--bg-darker)', color: page === n ? 'white' : 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
              {n}
            </button>
          ))}
          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
            style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
            <ChevronRight size={14} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
