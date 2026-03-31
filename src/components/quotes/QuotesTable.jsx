import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Edit, Trash2, Download, Send, CheckCircle2, XCircle, Eye, Clock, FileText, Calendar, User } from 'lucide-react';

const STATUS_STYLE = {
  Draft:    { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
  Sent:     { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  Accepted: { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
  Rejected: { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
};

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function QuotesTable({ quotes, onEdit, onDelete, onStatusChange, onPreview, onDownloadPdf }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const isExpired = (validUntil) => new Date(validUntil) < new Date();

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
              {['Quote #', 'Customer', 'Related Deal', 'Total Amount', 'Status', 'Valid Until', 'Created', 'Owner', ''].map((h, i) => (
                <th key={i} style={{ padding: '12px 14px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 && (
              <tr>
                <td colSpan="9" style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ margin: '0 auto 16px', width: 56, height: 56, background: 'var(--bg-page)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText color="var(--text-muted)" size={28} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>No quotes yet</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Create your first quote to start tracking proposals.</p>
                </td>
              </tr>
            )}
            {quotes.map((q, i) => {
              const st = STATUS_STYLE[q.status] || STATUS_STYLE.Draft;
              const expired = isExpired(q.validUntil) && q.status !== 'Accepted';
              return (
                <motion.tr
                  key={q.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer', background: expired ? 'rgba(239,68,68,0.03)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = expired ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.015)'}
                  onMouseLeave={e => e.currentTarget.style.background = expired ? 'rgba(239,68,68,0.03)' : 'transparent'}
                  onClick={() => onPreview(q)}
                >
                  {/* Quote Number */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#2563eb', fontFamily: 'monospace' }}>{q.quoteNumber}</span>
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{q.contactName}</div>
                    {q.companyName && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{q.companyName}</div>}
                  </td>

                  {/* Deal */}
                  <td style={{ padding: '12px 14px' }}>
                    {q.relatedDeal ? (
                      <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{q.relatedDeal}</span>
                    ) : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{fmt(q.totalAmount)}</span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99, background: st.bg, color: st.text, letterSpacing: '0.05em' }}>
                      {q.status}
                    </span>
                    {expired && q.status !== 'Accepted' && (
                      <span style={{ display: 'block', fontSize: 10, color: '#ef4444', fontWeight: 600, marginTop: 3 }}>⚠ Expired</span>
                    )}
                  </td>

                  {/* Valid Until */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: expired ? '#ef4444' : 'var(--text-secondary)', fontWeight: 600 }}>
                      <Calendar size={11} /> {new Date(q.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  {/* Created */}
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>

                  {/* Owner */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: 'var(--text-muted)', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {q.owner?.charAt(0) || 'U'}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{q.owner}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 14px', position: 'relative', textAlign: 'right' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === q.id ? null : q.id); }}
                      style={{ padding: 6, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 7 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === q.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          style={{ position: 'absolute', right: 34, top: 34, width: 220, background: 'var(--card-bg)', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--card-border)', padding: 6, zIndex: 50, textAlign: 'left' }}
                        >
                          <button onClick={(e) => { e.stopPropagation(); onPreview(q); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--text-primary)', border: 'none', borderRadius: 8 }}>
                            <Eye size={14} /> Preview Quote
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onEdit(q); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--text-primary)', border: 'none', borderRadius: 8, marginTop: 2 }}>
                            <Edit size={14} /> Edit
                          </button>

                          {q.status === 'Draft' && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(q.id, 'Sent'); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: '#2563eb', border: 'none', borderRadius: 8, marginTop: 2 }}>
                              <Send size={14} /> Mark as Sent
                            </button>
                          )}
                          {q.status === 'Sent' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); onStatusChange(q.id, 'Accepted'); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: '#10b981', border: 'none', borderRadius: 8, marginTop: 2 }}>
                                <CheckCircle2 size={14} /> Mark Accepted
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onStatusChange(q.id, 'Rejected'); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: '#ef4444', border: 'none', borderRadius: 8, marginTop: 2 }}>
                                <XCircle size={14} /> Mark Rejected
                              </button>
                            </>
                          )}

                          <button onClick={(e) => { e.stopPropagation(); onDownloadPdf(q); setActiveMenu(null); }} className="b24-btn b24-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--text-primary)', border: 'none', borderRadius: 8, marginTop: 2 }}>
                            <Download size={14} /> Download PDF
                          </button>

                          <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

                          <button onClick={(e) => { e.stopPropagation(); onDelete(q.id); setActiveMenu(null); }} className="b24-btn b24-btn-danger" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', border: 'none', borderRadius: 8, marginTop: 2 }}>
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
      {quotes.length > 0 && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {quotes.length} quote{quotes.length === 1 ? '' : 's'}
          </span>
        </div>
      )}
    </div>
  );
}
