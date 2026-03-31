import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, RefreshCw, FileText, Download, DollarSign, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import QuotesTable from '../../components/quotes/QuotesTable';
import CreateQuoteModal from '../../components/quotes/CreateQuoteModal';
import QuotePreviewModal from '../../components/quotes/QuotePreviewModal';

const MOCK_QUOTES = [
  {
    id: 'q-1', quoteNumber: 'QT-100201', contactName: 'Jane Smith', companyName: 'TechNova Inc.', relatedDeal: 'Q4 Enterprise Deal',
    items: [
      { id: 1, name: 'CRM Pro License', description: '12-month enterprise license', quantity: 5, price: 24000 },
      { id: 2, name: 'Implementation', description: 'Setup & configuration', quantity: 1, price: 45000 },
      { id: 3, name: 'Training Sessions', description: '4 sessions x 2 hours', quantity: 4, price: 8000 },
    ],
    subtotal: 197000, taxPercent: 18, taxAmount: 35460, discountPercent: 5, discountAmount: 9850, totalAmount: 222610,
    status: 'Accepted', validUntil: '2026-04-30', quoteDate: '2026-03-10', createdAt: '2026-03-10',
    terms: 'Payment due within 30 days of invoice date. All prices are in INR.', notes: 'Priority client — expedited delivery.', owner: 'John Sales'
  },
  {
    id: 'q-2', quoteNumber: 'QT-100202', contactName: 'Acme Corp', companyName: 'Acme Industries', relatedDeal: 'Website Redesign',
    items: [
      { id: 1, name: 'Website Redesign', description: 'Full responsive redesign', quantity: 1, price: 150000 },
      { id: 2, name: 'SEO Package', description: '6-month optimization', quantity: 1, price: 60000 },
    ],
    subtotal: 210000, taxPercent: 18, taxAmount: 37800, discountPercent: 0, discountAmount: 0, totalAmount: 247800,
    status: 'Sent', validUntil: '2026-04-15', quoteDate: '2026-03-18', createdAt: '2026-03-18',
    terms: 'Payment due within 30 days of invoice date.', notes: '', owner: 'Alice Admin'
  },
  {
    id: 'q-3', quoteNumber: 'QT-100203', contactName: 'Charlie Brown', companyName: '', relatedDeal: 'Annual Maintenance',
    items: [
      { id: 1, name: 'Annual Maintenance Contract', description: 'Includes 24/7 support', quantity: 1, price: 120000 },
    ],
    subtotal: 120000, taxPercent: 18, taxAmount: 21600, discountPercent: 10, discountAmount: 12000, totalAmount: 129600,
    status: 'Draft', validUntil: '2026-04-20', quoteDate: '2026-03-22', createdAt: '2026-03-22',
    terms: 'Payment due within 30 days of invoice date.', notes: 'Awaiting manager approval.', owner: 'John Sales'
  },
  {
    id: 'q-4', quoteNumber: 'QT-100204', contactName: 'Diana Prince', companyName: 'Themyscira Ltd.', relatedDeal: 'Cloud Migration',
    items: [
      { id: 1, name: 'Cloud Migration', description: 'AWS infrastructure setup', quantity: 1, price: 300000 },
      { id: 2, name: 'Data Transfer', description: '500GB data migration', quantity: 1, price: 50000 },
    ],
    subtotal: 350000, taxPercent: 18, taxAmount: 63000, discountPercent: 0, discountAmount: 0, totalAmount: 413000,
    status: 'Rejected', validUntil: '2026-03-01', quoteDate: '2026-02-15', createdAt: '2026-02-15',
    terms: 'Payment due within 15 days.', notes: 'Client went with another vendor.', owner: 'Bob Manager'
  },
  {
    id: 'q-5', quoteNumber: 'QT-100205', contactName: 'Ethan Hunt', companyName: 'IMF Solutions', relatedDeal: '',
    items: [
      { id: 1, name: 'Security Audit', description: 'Comprehensive pen testing', quantity: 1, price: 85000 },
      { id: 2, name: 'Compliance Report', description: 'GDPR & SOC2 report', quantity: 1, price: 35000 },
    ],
    subtotal: 120000, taxPercent: 18, taxAmount: 21600, discountPercent: 0, discountAmount: 0, totalAmount: 141600,
    status: 'Sent', validUntil: '2026-04-25', quoteDate: '2026-03-25', createdAt: '2026-03-25',
    terms: 'Payment due within 30 days of invoice date.', notes: '', owner: 'Sarah Executive'
  },
];

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function Quotes() {
  const [quotes, setQuotes] = useState(MOCK_QUOTES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [previewQuote, setPreviewQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // ── Stats ──
  const stats = useMemo(() => {
    const total = quotes.reduce((s, q) => s + q.totalAmount, 0);
    const accepted = quotes.filter(q => q.status === 'Accepted').reduce((s, q) => s + q.totalAmount, 0);
    const pending = quotes.filter(q => q.status === 'Sent').reduce((s, q) => s + q.totalAmount, 0);
    const drafts = quotes.filter(q => q.status === 'Draft').length;
    return { total, accepted, pending, drafts };
  }, [quotes]);

  // ── Filtered ──
  const processedQuotes = useMemo(() => {
    return quotes.filter(q =>
      (statusFilter === 'All' || q.status === statusFilter) &&
      (!searchTerm ||
        q.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.relatedDeal?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [quotes, searchTerm, statusFilter]);

  // ── Helpers ──
  const showToast = (message) => {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#10b981', color: '#fff',
      padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px',
    });
    box.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> ${message}`;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3000);
  };

  const handleSave = (quote) => {
    setQuotes(prev => {
      const exists = prev.find(q => q.id === quote.id);
      if (exists) return prev.map(q => q.id === quote.id ? quote : q);
      return [quote, ...prev];
    });
    showToast(editingQuote ? 'Quote Updated Successfully' : 'Quote Created Successfully');
    setEditingQuote(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(prev => prev.filter(q => q.id !== id));
      showToast('Quote deleted');
    }
  };

  const handleStatusChange = (id, status) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    showToast(`Quote marked as ${status}`);
  };

  const handleEdit = (q) => { setEditingQuote(q); setIsCreateOpen(true); };
  const handlePreview = (q) => setPreviewQuote(q);

  const handleDownloadPdf = (q) => {
    // Generate a basic printable HTML and trigger window.print
    const win = window.open('', '_blank');
    const itemsHtml = q.items.map((item, i) =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${i+1}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600">${item.name}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b">${item.description||'—'}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${fmt(item.price)}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${fmt(item.quantity*item.price)}</td></tr>`
    ).join('');
    win.document.write(`
      <html><head><title>Quote ${q.quoteNumber}</title>
      <style>body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse}th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;border-bottom:2px solid #e2e8f0}td{font-size:13px}@media print{body{padding:20px}}</style>
      </head><body>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;border-bottom:3px solid #2563eb;padding-bottom:20px">
        <div><h1 style="margin:0;font-size:24px;color:#1e293b">VIVIFY<span style="color:#2563eb">CRM</span></h1><p style="margin:4px 0 0;color:#64748b;font-size:12px">Professional Quotation</p></div>
        <div style="text-align:right"><div style="font-size:20px;font-weight:800;color:#2563eb">${q.quoteNumber}</div><div style="font-size:12px;color:#64748b;margin-top:4px">Date: ${new Date(q.quoteDate||q.createdAt).toLocaleDateString('en-IN')}</div><div style="font-size:12px;color:#64748b">Valid Until: ${new Date(q.validUntil).toLocaleDateString('en-IN')}</div></div>
      </div>
      <div style="display:flex;gap:30px;margin-bottom:30px">
        <div><h3 style="font-size:12px;text-transform:uppercase;color:#64748b;margin:0 0 6px">Bill To</h3><div style="font-size:15px;font-weight:700">${q.contactName}</div>${q.companyName?`<div style="color:#64748b;font-size:13px">${q.companyName}</div>`:''}</div>
        ${q.relatedDeal?`<div><h3 style="font-size:12px;text-transform:uppercase;color:#64748b;margin:0 0 6px">Related Deal</h3><div style="font-size:14px;font-weight:600;color:#2563eb">${q.relatedDeal}</div></div>`:''}
      </div>
      <table><thead><tr><th>#</th><th>Item</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
      <div style="display:flex;justify-content:flex-end;margin-top:20px"><div style="width:280px">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px"><span style="color:#64748b">Subtotal</span><span style="font-weight:700">${fmt(q.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px"><span style="color:#64748b">Tax (${q.taxPercent}%)</span><span style="font-weight:700;color:#f59e0b">+ ${fmt(q.taxAmount)}</span></div>
        ${q.discountAmount>0?`<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px"><span style="color:#64748b">Discount (${q.discountPercent}%)</span><span style="font-weight:700;color:#ef4444">- ${fmt(q.discountAmount)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #1e293b;font-size:16px;font-weight:900;margin-top:6px"><span>Grand Total</span><span style="color:#10b981">${fmt(q.totalAmount)}</span></div>
      </div></div>
      ${q.terms?`<div style="margin-top:30px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0"><h4 style="font-size:11px;text-transform:uppercase;color:#64748b;margin:0 0 6px">Terms & Conditions</h4><p style="font-size:12px;color:#475569;margin:0;line-height:1.7">${q.terms}</p></div>`:''}
      <div style="display:flex;justify-content:space-between;margin-top:60px;padding-top:12px">
        <div style="border-top:2px solid #e2e8f0;padding-top:8px;width:200px;text-align:center"><span style="font-size:11px;color:#94a3b8">Authorized Signature</span></div>
        <div style="border-top:2px solid #e2e8f0;padding-top:8px;width:200px;text-align:center"><span style="font-size:11px;color:#94a3b8">Client Acceptance</span></div>
      </div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const STAT_CARDS = [
    { label: 'Total Value', value: fmt(stats.total), color: '#6366f1', icon: DollarSign },
    { label: 'Accepted Revenue', value: fmt(stats.accepted), color: '#10b981', icon: CheckCircle2 },
    { label: 'Pending Pipeline', value: fmt(stats.pending), color: '#3b82f6', icon: TrendingUp },
    { label: 'Drafts', value: stats.drafts, color: '#64748b', icon: Clock },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px' }}>Quotes</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>Create, send, and manage customer quotations.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary" onClick={() => handleDownloadPdf(processedQuotes[0])} disabled={processedQuotes.length === 0} style={{ gap: 7 }}>
              <Download size={15} /> Export
            </button>
            <button className="b24-btn b24-btn-primary" onClick={() => { setEditingQuote(null); setIsCreateOpen(true); }} style={{ gap: 7, background: '#10b981' }}>
              <Plus size={15} /> Create Quote
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: '16px 18px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '12px 12px 0 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'grid', placeItems: 'center' }}>
                    <Icon size={15} color={s.color} />
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search by customer, quote number, deal…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="b24-input" style={{ paddingLeft: 38, borderRadius: 8, border: '1px solid var(--card-border)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '0 12px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="b24-select" style={{ border: 'none', padding: '8px 10px 8px 0', background: 'transparent', fontSize: 13, fontWeight: 600 }}>
              <option value="All">All Quotes</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Main Table ── */}
      <div style={{ padding: '0 32px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <QuotesTable
          quotes={processedQuotes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onPreview={handlePreview}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>

      {/* ── Modals ── */}
      <CreateQuoteModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setEditingQuote(null); }} onSave={handleSave} quoteToEdit={editingQuote} />
      <QuotePreviewModal isOpen={!!previewQuote} onClose={() => setPreviewQuote(null)} quote={previewQuote} onDownloadPdf={handleDownloadPdf} onStatusChange={handleStatusChange} />
    </div>
  );
}
