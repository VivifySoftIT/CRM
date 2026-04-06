import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ArrowUpDown, RefreshCw, XCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PLAN_STYLES = {
  Free:       { bg: 'rgba(148,163,184,0.12)', color: '#64748b' },
  Starter:    { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  Pro:        { bg: 'rgba(139,92,246,0.1)',   color: '#8b5cf6' },
  Enterprise: { bg: 'rgba(245,158,11,0.1)',   color: '#f59e0b' },
};

const BILLING_COLORS = { Monthly: '#6366f1', Yearly: '#10b981' };

function ExpiryCell({ date }) {
  if (!date || date === '—') return <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>;
  const d = new Date(date);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  const color = diff < 0 ? '#ef4444' : diff <= 14 ? '#f59e0b' : 'var(--text-secondary)';
  return (
    <div>
      <p style={{ fontSize: '13px', fontWeight: '600', color }}>{date}</p>
      {diff >= 0 && diff <= 30 && <p style={{ fontSize: '10px', color, fontWeight: '700', marginTop: '1px' }}>{diff === 0 ? 'Expires today' : `${diff}d left`}</p>}
      {diff < 0 && <p style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700', marginTop: '1px' }}>Expired</p>}
    </div>
  );
}

export default function SubscriptionTable({ subscriptions, onChangePlan, onExtend, onCancel }) {
  const [search, setSearch]   = useState('');
  const [planF, setPlanF]     = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [page, setPage]       = useState(1);
  const PAGE = 8;

  const filtered = subscriptions.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.orgName.toLowerCase().includes(q) || s.adminEmail.toLowerCase().includes(q))
      && (planF === 'All' || s.plan === planF)
      && (statusF === 'All' || s.status === statusF);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search organization or email..."
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
          {search && <button onClick={() => { setSearch(''); setPage(1); }} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><X size={11} /></button>}
        </div>
        <select value={planF} onChange={e => { setPlanF(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
          {['All','Free','Starter','Pro','Enterprise'].map(p => <option key={p} value={p}>{p === 'All' ? 'All Plans' : p}</option>)}
        </select>
        <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
          {['All','Active','Expired','Suspended','Trial'].map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{filtered.length}</span> subscriptions
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '820px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
              {['Organization','Admin Email','Plan','Billing','Expiry','Status','Actions'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No subscriptions found.</td></tr>
            )}
            {paged.map((s, i) => {
              const plan = PLAN_STYLES[s.plan] || PLAN_STYLES.Free;
              return (
                <tr key={s.id}
                  style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '9px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{s.orgName[0]}</span>
                      </div>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{s.orgName}</p>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: 'var(--text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.adminEmail}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: plan.bg, color: plan.color }}>{s.plan}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: BILLING_COLORS[s.billing] || '#6366f1' }}>{s.billing}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}><ExpiryCell date={s.expiryDate} /></td>
                  <td style={{ padding: '13px 16px' }}><StatusBadge label={s.status} size="sm" /></td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {[
                        { icon: ArrowUpDown, title: 'Change Plan', color: '#8b5cf6', action: () => onChangePlan(s) },
                        { icon: RefreshCw,   title: 'Extend',      color: '#10b981', action: () => onExtend(s) },
                        { icon: XCircle,     title: 'Cancel',      color: '#ef4444', action: () => onCancel(s) },
                      ].map(({ icon: Ic, title, color, action }) => (
                        <button key={title} onClick={action} title={title}
                          style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseOver={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.borderColor = color + '44'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                          <Ic size={12} color={color} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {Math.min((page-1)*PAGE+1, filtered.length)}–{Math.min(page*PAGE, filtered.length)} of {filtered.length}
        </p>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            style={{ width: 30, height: 30, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page===1?'not-allowed':'pointer', opacity: page===1?0.4:1 }}>
            <ChevronLeft size={13} color="var(--text-secondary)" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              style={{ width: 30, height: 30, borderRadius: '7px', border: '1px solid var(--card-border)', background: page===n?'#6366f1':'var(--bg-darker)', color: page===n?'white':'var(--text-primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ width: 30, height: 30, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: page===totalPages?'not-allowed':'pointer', opacity: page===totalPages?0.4:1 }}>
            <ChevronRight size={13} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
