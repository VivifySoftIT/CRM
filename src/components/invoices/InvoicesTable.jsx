import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Edit3, Trash2, Download, Check, Send, MoreVertical,
  ChevronUp, ChevronDown, AlertTriangle
} from 'lucide-react';

const STATUS_STYLES = {
  Draft:   { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.22)' },
  Sent:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.22)' },
  Paid:    { color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.22)' },
  Overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.22)' },
};

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function InvoicesTable({ invoices, onEdit, onDelete, onStatusChange, onPreview, onDownloadPdf }) {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [openMenu, setOpenMenu] = useState(null);

  const sorted = [...invoices].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'totalAmount' || sortKey === 'amountPaid' || sortKey === 'balance') {
      va = Number(va) || 0; vb = Number(vb) || 0;
    }
    if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: 4, opacity: sortKey === col ? 1 : 0.3 }}>
      <ChevronUp size={10} style={{ marginBottom: -3, color: sortKey === col && sortDir === 'asc' ? '#3b82f6' : 'inherit' }} />
      <ChevronDown size={10} style={{ color: sortKey === col && sortDir === 'desc' ? '#3b82f6' : 'inherit' }} />
    </span>
  );

  const isOverdue = (inv) => {
    if (inv.status === 'Paid') return false;
    return new Date(inv.dueDate) < new Date();
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', width: '11%' },
    { key: 'contactName',   label: 'Customer',  width: '14%' },
    { key: 'relatedDeal',   label: 'Deal / Quote', width: '12%' },
    { key: 'totalAmount',   label: 'Total (₹)',  width: '10%', align: 'right' },
    { key: 'amountPaid',    label: 'Paid (₹)',   width: '9%', align: 'right' },
    { key: 'balance',       label: 'Balance (₹)', width: '9%', align: 'right' },
    { key: 'status',        label: 'Status',     width: '9%' },
    { key: 'dueDate',       label: 'Due Date',   width: '9%' },
    { key: 'createdAt',     label: 'Created',    width: '8%' },
    { key: 'owner',         label: 'Owner',      width: '8%' },
  ];

  const thStyle = (col) => ({
    padding: '13px 14px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer',
    whiteSpace: 'nowrap', textAlign: col.align || 'left', userSelect: 'none',
    width: col.width, borderBottom: '2px solid var(--card-border)',
    background: sortKey === col.key ? 'rgba(59,130,246,0.04)' : 'transparent',
    transition: 'background 0.15s',
  });

  if (invoices.length === 0) {
    return (
      <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(99,102,241,0.08)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <AlertTriangle size={28} color="#6366f1" style={{ opacity: 0.5 }} />
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>No invoices found</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or filters, or create a new invoice.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr style={{ background: 'var(--bg-darker)' }}>
              {columns.map(col => (
                <th key={col.key} style={thStyle(col)} onClick={() => toggleSort(col.key)}>
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th style={{ ...thStyle({ key: '__actions', width: '9%' }), cursor: 'default', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inv, i) => {
              const meta = STATUS_STYLES[inv.status] || STATUS_STYLES.Draft;
              const overdue = isOverdue(inv);
              return (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  style={{
                    borderBottom: '1px solid var(--card-border)', cursor: 'pointer',
                    background: overdue && inv.status !== 'Paid' ? 'rgba(239,68,68,0.03)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                  onClick={() => onPreview(inv)}
                  onMouseEnter={e => { if (!overdue || inv.status === 'Paid') e.currentTarget.style.background = 'rgba(59,130,246,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = overdue && inv.status !== 'Paid' ? 'rgba(239,68,68,0.03)' : 'transparent'; }}
                >
                  {/* Invoice Number */}
                  <td style={{ padding: '14px', fontSize: 13, fontWeight: 800, color: '#3b82f6', fontFamily: 'monospace' }}>
                    {inv.invoiceNumber}
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{inv.contactName}</div>
                    {inv.companyName && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{inv.companyName}</div>}
                  </td>

                  {/* Related Deal / Quote */}
                  <td style={{ padding: '14px' }}>
                    {inv.relatedDeal && <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{inv.relatedDeal}</div>}
                    {inv.relatedQuote && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{inv.relatedQuote}</div>}
                    {!inv.relatedDeal && !inv.relatedQuote && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}
                  </td>

                  {/* Total */}
                  <td style={{ padding: '14px', textAlign: 'right', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {fmt(inv.totalAmount)}
                  </td>

                  {/* Amount Paid */}
                  <td style={{ padding: '14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                    {fmt(inv.amountPaid)}
                  </td>

                  {/* Balance */}
                  <td style={{ padding: '14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: inv.balance > 0 ? '#ef4444' : '#10b981' }}>
                    {fmt(inv.balance)}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
                      {inv.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: '14px' }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600,
                      color: overdue && inv.status !== 'Paid' ? '#ef4444' : 'var(--text-secondary)',
                    }}>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </div>
                    {overdue && inv.status !== 'Paid' && (
                      <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <AlertTriangle size={10} /> Overdue
                      </div>
                    )}
                  </td>

                  {/* Created */}
                  <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-muted)' }}>
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                  </td>

                  {/* Owner */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 6, fontSize: 9, fontWeight: 800,
                        background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        {(inv.owner || 'U').split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{inv.owner}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 5, position: 'relative' }}>
                      <button onClick={() => onPreview(inv)} title="View"
                        style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.06)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#3b82f6', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}>
                        <Eye size={13} />
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)} title="More"
                          style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--card-border)', background: 'var(--input-bg)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--input-bg)'}>
                          <MoreVertical size={13} />
                        </button>

                        {openMenu === inv.id && (
                          <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setOpenMenu(null)} />
                            <div style={{
                              position: 'absolute', right: 0, top: '100%', marginTop: 6,
                              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                              borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                              zIndex: 51, minWidth: 170, padding: '6px 0', overflow: 'hidden',
                            }}>
                              {[
                                { icon: Edit3, label: 'Edit Invoice', action: () => { onEdit(inv); setOpenMenu(null); }, color: '#6366f1' },
                                ...(inv.status !== 'Sent' && inv.status !== 'Paid' ? [{ icon: Send, label: 'Send Invoice', action: () => { onStatusChange(inv.id, 'Sent'); setOpenMenu(null); }, color: '#3b82f6' }] : []),
                                ...(inv.status !== 'Paid' ? [{ icon: Check, label: 'Mark as Paid', action: () => { onStatusChange(inv.id, 'Paid'); setOpenMenu(null); }, color: '#10b981' }] : []),
                                { icon: Download, label: 'Download PDF', action: () => { onDownloadPdf(inv); setOpenMenu(null); }, color: '#8b5cf6' },
                                { icon: Trash2, label: 'Delete', action: () => { onDelete(inv.id); setOpenMenu(null); }, color: '#ef4444' },
                              ].map((item, idx) => (
                                <button key={idx} onClick={item.action}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 16px', background: 'transparent', border: 'none',
                                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: item.color,
                                    transition: 'background 0.12s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <item.icon size={14} />{item.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid var(--card-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-darker)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
          Total Value: <span style={{ color: '#10b981', fontWeight: 800 }}>{fmt(invoices.reduce((s, i) => s + (i.totalAmount || 0), 0))}</span>
        </span>
      </div>
    </div>
  );
}
