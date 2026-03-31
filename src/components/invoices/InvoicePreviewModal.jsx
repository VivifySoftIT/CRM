import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Send, Check, Printer, Mail, CreditCard, AlertTriangle, FileText } from 'lucide-react';

const STATUS_STYLES = {
  Draft:   { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.22)' },
  Sent:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.22)' },
  Paid:    { color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.22)' },
  Overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.22)' },
};

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

export default function InvoicePreviewModal({ isOpen, onClose, invoice, onDownloadPdf, onStatusChange }) {
  if (!isOpen || !invoice) return null;

  const meta = STATUS_STYLES[invoice.status] || STATUS_STYLES.Draft;
  const isOverdue = invoice.status !== 'Paid' && new Date(invoice.dueDate) < new Date();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--card-bg)', width: '100%', maxWidth: 700, height: '100%',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-12px 0 48px rgba(0,0,0,0.12)',
            borderLeft: '1px solid var(--card-border)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 32px', borderBottom: '1px solid var(--card-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-darker)', flexShrink: 0,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  {invoice.invoiceNumber}
                </h3>
                <span style={{
                  padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                  background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
                  {invoice.status}
                </span>
                {isOverdue && (
                  <span style={{
                    padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                    background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <AlertTriangle size={10} /> OVERDUE
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Invoice Preview</div>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 8, borderRadius: '50%',
            }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            {/* Invoice Document */}
            <div style={{
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14,
              padding: '48px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', color: '#1a202c',
            }}>
              {/* Company Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                <div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    display: 'grid', placeItems: 'center', marginBottom: 14,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  }}>
                    <FileText color="#fff" size={22} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
                    VIVIFY<span style={{ color: '#2563eb' }}>CRM</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#718096', marginTop: 4, lineHeight: 1.6 }}>
                    VivifySoft IT Solutions<br />
                    Hyderabad, Telangana, India
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 28, fontWeight: 300, color: '#cbd5e0',
                    textTransform: 'uppercase', letterSpacing: '5px', marginBottom: 10,
                  }}>
                    INVOICE
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1a202c' }}>
                    #{invoice.invoiceNumber}
                  </div>
                  <div style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>
                    Date: {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{
                    fontSize: 12, marginTop: 2, fontWeight: 600,
                    color: isOverdue ? '#ef4444' : '#718096',
                  }}>
                    Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #edf2f7', margin: '28px 0' }} />

              {/* Customer & Payment Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Bill To
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{invoice.contactName}</div>
                  {invoice.companyName && <div style={{ fontSize: 13, color: '#4a5568', marginTop: 3 }}>{invoice.companyName}</div>}
                  {invoice.billingAddress && <div style={{ fontSize: 12, color: '#718096', marginTop: 3, lineHeight: 1.5 }}>{invoice.billingAddress}</div>}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Payment Details
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: meta.color, marginBottom: 4 }}>{invoice.status}</div>
                  {invoice.paymentMethod && <div style={{ fontSize: 12, color: '#718096' }}>Method: {invoice.paymentMethod}</div>}
                  {invoice.relatedDeal && <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginTop: 4 }}>Deal: {invoice.relatedDeal}</div>}
                  {invoice.relatedQuote && <div style={{ fontSize: 12, color: '#718096', fontFamily: 'monospace', marginTop: 2 }}>Quote: {invoice.relatedQuote}</div>}
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.06em' }}>#</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase' }}>Item</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: 10, fontWeight: 800, color: '#718096', textTransform: 'uppercase' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.items || []).map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '14px 12px', fontSize: 12, color: '#a0aec0', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '14px 12px', fontSize: 12, color: '#64748b' }}>{item.description || '—'}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: 13 }}>{item.quantity}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13 }}>{fmt(item.price)}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{fmt(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pricing Summary */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 280 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
                    <span style={{ color: '#718096' }}>Subtotal</span>
                    <span style={{ fontWeight: 700 }}>{fmt(invoice.subtotal)}</span>
                  </div>
                  {invoice.taxAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
                      <span style={{ color: '#718096' }}>Tax ({invoice.taxPercent}%)</span>
                      <span style={{ fontWeight: 700, color: '#f59e0b' }}>+ {fmt(invoice.taxAmount)}</span>
                    </div>
                  )}
                  {invoice.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
                      <span style={{ color: '#718096' }}>Discount ({invoice.discountPercent}%)</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>- {fmt(invoice.discountAmount)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '12px 0', borderTop: '2px solid #1e293b', marginTop: 8,
                    fontSize: 17, fontWeight: 900,
                  }}>
                    <span>Grand Total</span>
                    <span style={{ color: '#2563eb' }}>{fmt(invoice.totalAmount)}</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '10px 12px', fontSize: 13, color: '#059669',
                    background: '#f0fdf4', borderRadius: 8, marginTop: 8,
                  }}>
                    <span style={{ fontWeight: 700 }}>Amount Paid</span>
                    <span style={{ fontWeight: 900 }}>- {fmt(invoice.amountPaid)}</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                    borderTop: '1px solid #edf2f7', marginTop: 8,
                  }}>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>Balance Due</span>
                    <span style={{
                      fontWeight: 900, fontSize: 18,
                      color: invoice.balance > 0 ? '#ef4444' : '#10b981',
                    }}>
                      {fmt(invoice.balance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              {invoice.terms && (
                <div style={{
                  marginTop: 32, padding: '14px 18px', background: '#f8fafc',
                  borderRadius: 8, border: '1px solid #e2e8f0',
                }}>
                  <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.06em', margin: '0 0 6px' }}>Terms & Conditions</h4>
                  <p style={{ fontSize: 11, color: '#475569', margin: 0, lineHeight: 1.7 }}>{invoice.terms}</p>
                </div>
              )}

              {/* Signature */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 12 }}>
                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 10, width: 180, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Authorized Signature</span>
                </div>
                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 10, width: 180, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Client Acceptance</span>
                </div>
              </div>

              <div style={{ marginTop: 40, fontSize: 11, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
                Thank you for your business — VivifyCRM
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '18px 32px', borderTop: '1px solid var(--card-border)',
            display: 'flex', gap: 10, background: 'var(--bg-darker)', flexShrink: 0,
          }}>
            <button
              className="b24-btn b24-btn-secondary"
              style={{ flex: 1, justifyContent: 'center', height: 44, fontSize: 13 }}
              onClick={() => onDownloadPdf(invoice)}
            >
              <Download size={16} /> Download PDF
            </button>
            <button
              className="b24-btn b24-btn-secondary"
              style={{ flex: 1, justifyContent: 'center', height: 44, fontSize: 13 }}
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print
            </button>
            {invoice.status === 'Draft' && (
              <button
                className="b24-btn b24-btn-primary"
                style={{ flex: 1, justifyContent: 'center', height: 44, fontSize: 13, background: '#3b82f6' }}
                onClick={() => { onStatusChange(invoice.id, 'Sent'); onClose(); }}
              >
                <Send size={16} /> Send Invoice
              </button>
            )}
            {invoice.status !== 'Paid' && (
              <button
                className="b24-btn b24-btn-primary"
                style={{ flex: 1, justifyContent: 'center', height: 44, fontSize: 13, background: '#10b981' }}
                onClick={() => { onStatusChange(invoice.id, 'Paid'); onClose(); }}
              >
                <CreditCard size={16} /> Mark Paid
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
