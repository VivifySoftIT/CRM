import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, User, Calendar, Package, DollarSign, Download, Send, CheckCircle2 } from 'lucide-react';

const STATUS_STYLE = {
  Draft:    { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
  Sent:     { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  Accepted: { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
  Rejected: { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
};

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

export default function QuotePreviewModal({ isOpen, onClose, quote, onDownloadPdf, onStatusChange }) {
  if (!isOpen || !quote) return null;

  const st = STATUS_STYLE[quote.status] || STATUS_STYLE.Draft;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'var(--card-bg)', borderRadius: 14, width: '100%', maxWidth: 720, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.12)', display: 'grid', placeItems: 'center' }}>
                <FileText size={18} color="#2563eb" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Quote Preview</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'monospace' }}>{quote.quoteNumber}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800, background: st.bg, color: st.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{quote.status}</span>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><X size={18} /></button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Company Header (simulated letterhead) */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: 12, padding: '20px 24px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>VIVIFY<span style={{ color: '#60a5fa' }}>CRM</span></div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Professional Quotation</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, opacity: 0.8, lineHeight: 1.7 }}>
                  <div>123 Business Avenue, Mumbai</div>
                  <div>contact@vivifycrm.com</div>
                </div>
              </div>
            </div>

            {/* Customer + Quote Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: '14px 16px', background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}><User size={11} /> Bill To</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{quote.contactName}</div>
                {quote.companyName && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{quote.companyName}</div>}
                {quote.relatedDeal && <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>Deal: {quote.relatedDeal}</div>}
              </div>
              <div style={{ padding: '14px 16px', background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={11} /> Quote Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{new Date(quote.quoteDate || quote.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Valid Until:</span>
                    <span style={{ fontWeight: 700, color: new Date(quote.validUntil) < new Date() ? '#ef4444' : 'var(--text-primary)' }}>{new Date(quote.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Owner:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{quote.owner}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ borderRadius: 10, border: '1px solid var(--card-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)' }}>
                    {['#', 'Item', 'Description', 'Qty', 'Price', 'Total'].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: i >= 3 ? 'right' : 'left', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quote.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200 }}>{item.description || '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)', textAlign: 'right', fontWeight: 600 }}>{item.quantity}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)', textAlign: 'right', fontWeight: 600 }}>{fmt(item.price)}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', textAlign: 'right', fontWeight: 800 }}>{fmt(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 280, background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(quote.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>Tax ({quote.taxPercent}%)</span><span style={{ fontWeight: 700, color: '#f59e0b' }}>+ {fmt(quote.taxAmount)}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>Discount ({quote.discountPercent}%)</span><span style={{ fontWeight: 700, color: '#ef4444' }}>- {fmt(quote.discountAmount)}</span>
                  </div>
                )}
                <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                  <span style={{ color: '#10b981' }}>{fmt(quote.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            {quote.terms && (
              <div style={{ padding: '14px 16px', background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Terms & Conditions</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{quote.terms}</p>
              </div>
            )}

            {/* Signature */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
              <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: 8, textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Authorized Signature</span>
              </div>
              <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: 8, textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Client Acceptance</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'var(--input-bg)' }}>
            <button className="b24-btn b24-btn-secondary" onClick={onClose}>Close</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {quote.status === 'Draft' && (
                <button className="b24-btn b24-btn-ghost" onClick={() => { onStatusChange(quote.id, 'Sent'); onClose(); }}>
                  <Send size={14} /> Mark as Sent
                </button>
              )}
              {quote.status === 'Sent' && (
                <button className="b24-btn" style={{ background: '#10b981', color: '#fff' }} onClick={() => { onStatusChange(quote.id, 'Accepted'); onClose(); }}>
                  <CheckCircle2 size={14} /> Accept
                </button>
              )}
              <button className="b24-btn b24-btn-primary" onClick={() => { onDownloadPdf(quote); }}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
