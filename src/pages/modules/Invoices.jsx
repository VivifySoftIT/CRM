import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, RefreshCw, Download, FileText,
  DollarSign, Clock, CheckCircle2, TrendingUp, AlertTriangle,
  Send, ArrowDownToLine
} from 'lucide-react';
import InvoicesTable from '../../components/invoices/InvoicesTable';
import CreateInvoiceModal from '../../components/invoices/CreateInvoiceModal';
import InvoicePreviewModal from '../../components/invoices/InvoicePreviewModal';

// ── Mock Data ──
const MOCK_INVOICES = [
  {
    id: 'inv-1', invoiceNumber: 'INV-240301', contactName: 'Jane Smith', companyName: 'TechNova Inc.',
    billingAddress: '42 Silicon Valley, Bengaluru, KA 560001', relatedDeal: 'Q4 Enterprise Deal', relatedQuote: 'QT-100201',
    items: [
      { id: 1, name: 'CRM Pro License', description: '12-month enterprise license', quantity: 5, price: 24000 },
      { id: 2, name: 'Implementation Setup', description: 'Full configuration & deployment', quantity: 1, price: 45000 },
      { id: 3, name: 'Training Sessions', description: '4 sessions x 2 hours', quantity: 4, price: 8000 },
    ],
    subtotal: 197000, taxPercent: 18, taxAmount: 35460, discountPercent: 5, discountAmount: 9850,
    totalAmount: 222610, amountPaid: 222610, balance: 0,
    paymentMethod: 'Bank Transfer', status: 'Paid',
    invoiceDate: '2026-03-01', dueDate: '2026-03-31', createdAt: '2026-03-01',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur a 2% monthly fee.',
    remarks: 'Priority client — expedited delivery.', owner: 'John Sales',
  },
  {
    id: 'inv-2', invoiceNumber: 'INV-240302', contactName: 'Acme Corp', companyName: 'Acme Industries',
    billingAddress: 'Plot 15, HITEC City, Hyderabad, TS 500081', relatedDeal: 'Website Redesign', relatedQuote: 'QT-100202',
    items: [
      { id: 1, name: 'Website Redesign', description: 'Complete responsive redesign', quantity: 1, price: 150000 },
      { id: 2, name: 'SEO Package', description: '6-month search optimization', quantity: 1, price: 60000 },
    ],
    subtotal: 210000, taxPercent: 18, taxAmount: 37800, discountPercent: 0, discountAmount: 0,
    totalAmount: 247800, amountPaid: 100000, balance: 147800,
    paymentMethod: 'UPI', status: 'Sent',
    invoiceDate: '2026-03-15', dueDate: '2026-04-15', createdAt: '2026-03-15',
    terms: 'Payment is due within 30 days of invoice date.', remarks: '', owner: 'Alice Admin',
  },
  {
    id: 'inv-3', invoiceNumber: 'INV-240303', contactName: 'Charlie Brown', companyName: '',
    billingAddress: '', relatedDeal: 'Annual Maintenance', relatedQuote: 'QT-100203',
    items: [
      { id: 1, name: 'Annual Maintenance Contract', description: 'Includes 24/7 support & updates', quantity: 1, price: 120000 },
    ],
    subtotal: 120000, taxPercent: 18, taxAmount: 21600, discountPercent: 10, discountAmount: 12000,
    totalAmount: 129600, amountPaid: 0, balance: 129600,
    paymentMethod: '', status: 'Draft',
    invoiceDate: '2026-03-22', dueDate: '2026-04-22', createdAt: '2026-03-22',
    terms: 'Payment is due within 30 days of invoice date.', remarks: 'Awaiting internal approval.', owner: 'John Sales',
  },
  {
    id: 'inv-4', invoiceNumber: 'INV-240304', contactName: 'Diana Prince', companyName: 'Themyscira Ltd.',
    billingAddress: '99 Amazonia Blvd, Mumbai, MH 400001', relatedDeal: 'Cloud Migration', relatedQuote: '',
    items: [
      { id: 1, name: 'Cloud Migration', description: 'AWS infrastructure setup', quantity: 1, price: 300000 },
      { id: 2, name: 'Data Transfer', description: '500GB data migration', quantity: 1, price: 50000 },
    ],
    subtotal: 350000, taxPercent: 18, taxAmount: 63000, discountPercent: 0, discountAmount: 0,
    totalAmount: 413000, amountPaid: 200000, balance: 213000,
    paymentMethod: 'Credit Card', status: 'Overdue',
    invoiceDate: '2026-02-05', dueDate: '2026-03-05', createdAt: '2026-02-05',
    terms: 'Payment due within 30 days.', remarks: 'Follow up required.', owner: 'Bob Manager',
  },
  {
    id: 'inv-5', invoiceNumber: 'INV-240305', contactName: 'Ethan Hunt', companyName: 'IMF Solutions',
    billingAddress: 'Sector 5, Noida, UP 201301', relatedDeal: '', relatedQuote: 'QT-100205',
    items: [
      { id: 1, name: 'Security Audit', description: 'Comprehensive penetration testing', quantity: 1, price: 85000 },
      { id: 2, name: 'Compliance Report', description: 'GDPR & SOC2 compliance report', quantity: 1, price: 35000 },
    ],
    subtotal: 120000, taxPercent: 18, taxAmount: 21600, discountPercent: 0, discountAmount: 0,
    totalAmount: 141600, amountPaid: 141600, balance: 0,
    paymentMethod: 'Bank Transfer', status: 'Paid',
    invoiceDate: '2026-03-10', dueDate: '2026-04-10', createdAt: '2026-03-10',
    terms: 'Payment due within 30 days.', remarks: '', owner: 'Sarah Executive',
  },
  {
    id: 'inv-6', invoiceNumber: 'INV-240306', contactName: 'Fiona Green', companyName: 'GreenTech Pvt.',
    billingAddress: 'HSR Layout, Bengaluru, KA 560102', relatedDeal: 'Marketing Campaign', relatedQuote: '',
    items: [
      { id: 1, name: 'Digital Marketing Package', description: 'Social media + Google Ads (3 months)', quantity: 3, price: 45000 },
      { id: 2, name: 'Content Creation', description: '10 blog posts + 5 videos', quantity: 1, price: 30000 },
    ],
    subtotal: 165000, taxPercent: 18, taxAmount: 29700, discountPercent: 5, discountAmount: 8250,
    totalAmount: 186450, amountPaid: 0, balance: 186450,
    paymentMethod: '', status: 'Sent',
    invoiceDate: '2026-03-25', dueDate: '2026-04-25', createdAt: '2026-03-25',
    terms: 'Payment is due within 30 days.', remarks: 'New client — first project.', owner: 'Alice Admin',
  },
  {
    id: 'inv-7', invoiceNumber: 'INV-240307', contactName: 'John Doe', companyName: 'Doe Enterprises',
    billingAddress: 'MG Road, Pune, MH 411001', relatedDeal: '', relatedQuote: '',
    items: [
      { id: 1, name: 'Custom CRM Development', description: 'Tailored CRM solution', quantity: 1, price: 500000 },
    ],
    subtotal: 500000, taxPercent: 18, taxAmount: 90000, discountPercent: 8, discountAmount: 40000,
    totalAmount: 550000, amountPaid: 275000, balance: 275000,
    paymentMethod: 'Bank Transfer', status: 'Overdue',
    invoiceDate: '2026-01-15', dueDate: '2026-02-15', createdAt: '2026-01-15',
    terms: 'Net 30. Late fee of 1.5% per month.', remarks: 'Multiple follow-ups sent.', owner: 'Bob Manager',
  },
];

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function Invoices() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // ── Stats ──
  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
    const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.totalAmount, 0);
    const outstanding = invoices.reduce((s, i) => s + i.balance, 0);
    const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.balance, 0);
    const drafts = invoices.filter(i => i.status === 'Draft').length;
    return { totalRevenue, paidAmount, outstanding, overdueCount, overdueAmount, drafts };
  }, [invoices]);

  // ── Filtered ──
  const processedInvoices = useMemo(() => {
    return invoices.filter(inv =>
      (statusFilter === 'All' || inv.status === statusFilter) &&
      (!searchTerm ||
        inv.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.relatedDeal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.relatedQuote?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [invoices, searchTerm, statusFilter]);

  // ── Status counts for filter tabs ──
  const statusCounts = useMemo(() => {
    const counts = { All: invoices.length, Draft: 0, Sent: 0, Paid: 0, Overdue: 0 };
    invoices.forEach(inv => { counts[inv.status] = (counts[inv.status] || 0) + 1; });
    return counts;
  }, [invoices]);

  // ── Toast ──
  const showToast = (message, type = 'success') => {
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed', bottom: '24px', right: '24px', backgroundColor: colors[type] || colors.success,
      color: '#fff', padding: '14px 28px', borderRadius: '14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '10px',
      fontWeight: '700', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
      animation: 'slideInRight 0.3s ease',
    });
    box.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> ${message}`;
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = '0'; box.style.transition = 'opacity 0.3s'; }, 2500);
    setTimeout(() => box.remove(), 3000);
  };

  // ── Handlers ──
  const handleSave = (invoice) => {
    setInvoices(prev => {
      const exists = prev.find(i => i.id === invoice.id);
      if (exists) return prev.map(i => i.id === invoice.id ? invoice : i);
      return [invoice, ...prev];
    });
    showToast(editingInvoice ? 'Invoice Updated Successfully' : 'Invoice Created Successfully');
    setEditingInvoice(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(i => i.id !== id));
      showToast('Invoice deleted');
    }
  };

  const handleStatusChange = (id, status) => {
    setInvoices(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, status };
      if (status === 'Paid') { updated.amountPaid = updated.totalAmount; updated.balance = 0; }
      return updated;
    }));
    showToast(`Invoice marked as ${status}`);
  };

  const handleEdit = (inv) => { setEditingInvoice(inv); setIsCreateOpen(true); };
  const handlePreview = (inv) => setPreviewInvoice(inv);

  // ── PDF Generation ──
  const handleDownloadPdf = (inv) => {
    const win = window.open('', '_blank');
    const itemsHtml = inv.items.map((item, i) =>
      `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#94a3b8;font-weight:600">${i + 1}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:13px">${item.name}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px">${item.description || '—'}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px">${item.quantity}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px">${fmt(item.price)}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;font-size:13px">${fmt(item.quantity * item.price)}</td></tr>`
    ).join('');

    win.document.write(`
      <html><head><title>Invoice ${inv.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', -apple-system, sans-serif; padding: 48px; color: #1e293b; max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 0.08em; font-weight: 800; border-bottom: 2px solid #e2e8f0; }
        @media print { body { padding: 24px; } }
      </style>
      </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:3px solid #2563eb">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px">VIVIFY<span style="color:#2563eb">CRM</span></h1>
              <p style="font-size:11px;color:#64748b;font-weight:500">VivifySoft IT Solutions</p>
            </div>
          </div>
          <p style="font-size:11px;color:#94a3b8;margin-top:8px;line-height:1.7">Hyderabad, Telangana, India<br/>GST: 36AABCV1234Z1Z5</p>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:300;color:#cbd5e0;text-transform:uppercase;letter-spacing:5px;margin-bottom:8px">INVOICE</div>
          <div style="font-size:16px;font-weight:800;color:#2563eb">${inv.invoiceNumber}</div>
          <div style="font-size:12px;color:#64748b;margin-top:6px">Date: ${new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div style="font-size:12px;color:${new Date(inv.dueDate) < new Date() && inv.status !== 'Paid' ? '#ef4444' : '#64748b'};font-weight:600">Due: ${new Date(inv.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="display:flex;gap:40px;margin-bottom:32px">
        <div style="flex:1">
          <h3 style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:800;letter-spacing:0.08em;margin-bottom:8px">Bill To</h3>
          <div style="font-size:16px;font-weight:700">${inv.contactName}</div>
          ${inv.companyName ? `<div style="color:#64748b;font-size:13px;margin-top:2px">${inv.companyName}</div>` : ''}
          ${inv.billingAddress ? `<div style="color:#94a3b8;font-size:12px;margin-top:4px;line-height:1.5">${inv.billingAddress}</div>` : ''}
        </div>
        <div>
          <h3 style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:800;letter-spacing:0.08em;margin-bottom:8px">Payment Info</h3>
          <div style="font-size:14px;font-weight:700;color:${inv.status === 'Paid' ? '#10b981' : inv.status === 'Overdue' ? '#ef4444' : '#3b82f6'}">${inv.status}</div>
          ${inv.paymentMethod ? `<div style="font-size:12px;color:#64748b;margin-top:3px">Method: ${inv.paymentMethod}</div>` : ''}
          ${inv.relatedDeal ? `<div style="font-size:12px;color:#2563eb;font-weight:600;margin-top:4px">Deal: ${inv.relatedDeal}</div>` : ''}
          ${inv.relatedQuote ? `<div style="font-size:11px;color:#94a3b8;font-family:monospace;margin-top:2px">Quote: ${inv.relatedQuote}</div>` : ''}
        </div>
      </div>

      <table><thead><tr><th style="text-align:left">#</th><th style="text-align:left">Item</th><th style="text-align:left">Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>

      <div style="display:flex;justify-content:flex-end;margin-top:24px"><div style="width:280px">
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:#64748b">Subtotal</span><span style="font-weight:700">${fmt(inv.subtotal)}</span></div>
        ${inv.taxAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:#64748b">Tax (${inv.taxPercent}%)</span><span style="font-weight:700;color:#f59e0b">+ ${fmt(inv.taxAmount)}</span></div>` : ''}
        ${inv.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:#64748b">Discount (${inv.discountPercent}%)</span><span style="font-weight:700;color:#ef4444">- ${fmt(inv.discountAmount)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #1e293b;margin-top:8px;font-size:17px;font-weight:900"><span>Grand Total</span><span style="color:#2563eb">${fmt(inv.totalAmount)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#059669;margin-top:8px"><span style="font-weight:700">Amount Paid</span><span style="font-weight:900">- ${fmt(inv.amountPaid)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid #edf2f7;margin-top:8px"><span style="font-weight:800;font-size:14px">Balance Due</span><span style="font-weight:900;font-size:18px;color:${inv.balance > 0 ? '#ef4444' : '#10b981'}">${fmt(inv.balance)}</span></div>
      </div></div>

      ${inv.terms ? `<div style="margin-top:32px;padding:16px 20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0"><h4 style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:800;letter-spacing:0.06em;margin-bottom:6px">Terms & Conditions</h4><p style="font-size:11px;color:#475569;line-height:1.7">${inv.terms}</p></div>` : ''}

      <div style="display:flex;justify-content:space-between;margin-top:60px;padding-top:12px">
        <div style="border-top:2px solid #e2e8f0;padding-top:10px;width:200px;text-align:center"><span style="font-size:10px;color:#94a3b8;font-weight:600">Authorized Signature</span></div>
        <div style="border-top:2px solid #e2e8f0;padding-top:10px;width:200px;text-align:center"><span style="font-size:10px;color:#94a3b8;font-weight:600">Client Acceptance</span></div>
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:11px;font-style:italic;margin-top:40px">Thank you for your business — VivifyCRM</p>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  // ── Export CSV ──
  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Customer', 'Company', 'Deal', 'Quote', 'Total', 'Paid', 'Balance', 'Status', 'Due Date', 'Created', 'Owner'];
    const rows = processedInvoices.map(i => [
      i.invoiceNumber, i.contactName, i.companyName || '', i.relatedDeal || '', i.relatedQuote || '',
      i.totalAmount, i.amountPaid, i.balance, i.status, i.dueDate, i.createdAt, i.owner,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('CSV exported successfully');
  };

  // ── Stat Cards ──
  const STAT_CARDS = [
    { label: 'Total Revenue', value: fmt(stats.totalRevenue), color: '#6366f1', icon: DollarSign, sub: `${invoices.length} invoices` },
    { label: 'Paid', value: fmt(stats.paidAmount), color: '#10b981', icon: CheckCircle2, sub: `${invoices.filter(i => i.status === 'Paid').length} invoices` },
    { label: 'Outstanding', value: fmt(stats.outstanding), color: '#f59e0b', icon: TrendingUp, sub: `Pending collection` },
    { label: 'Overdue', value: fmt(stats.overdueAmount), color: '#ef4444', icon: AlertTriangle, sub: `${stats.overdueCount} invoice${stats.overdueCount !== 1 ? 's' : ''} overdue` },
  ];

  // ── Status Filter Tabs ──
  const STATUS_TABS = [
    { key: 'All', label: 'All', color: '#64748b' },
    { key: 'Draft', label: 'Draft', color: '#64748b' },
    { key: 'Sent', label: 'Sent', color: '#3b82f6' },
    { key: 'Paid', label: 'Paid', color: '#10b981' },
    { key: 'Overdue', label: 'Overdue', color: '#ef4444' },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px' }}>
              Invoices
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>
              Create, manage, and track customer invoices & payments.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <button className="b24-btn b24-btn-secondary" style={{ gap: 7 }} onClick={handleExportCSV}>
                <ArrowDownToLine size={15} /> Export
              </button>
            </div>
            <button
              className="b24-btn b24-btn-primary"
              onClick={() => { setEditingInvoice(null); setIsCreateOpen(true); }}
              style={{ gap: 7, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
            >
              <Plus size={15} /> Create Invoice
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: 'var(--card-bg)', borderRadius: 14,
                  border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)',
                  padding: '18px 20px', position: 'relative', overflow: 'hidden',
                  cursor: 'default', transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, borderRadius: '14px 14px 0 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}12`, display: 'grid', placeItems: 'center' }}>
                    <Icon size={16} color={s.color} />
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4, letterSpacing: '-0.3px' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Status Filter Tabs ── */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 16,
          background: 'var(--card-bg)', borderRadius: 10, padding: 4,
          border: '1px solid var(--card-border)', width: 'fit-content',
        }}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                background: statusFilter === tab.key ? `${tab.color}14` : 'transparent',
                color: statusFilter === tab.key ? tab.color : 'var(--text-muted)',
                boxShadow: statusFilter === tab.key ? `0 1px 4px ${tab.color}20` : 'none',
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6, padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                background: statusFilter === tab.key ? `${tab.color}18` : 'rgba(0,0,0,0.04)',
                color: statusFilter === tab.key ? tab.color : 'var(--text-muted)',
              }}>
                {statusCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Search Toolbar ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search by customer, invoice number, deal, quote…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="b24-input"
              style={{
                paddingLeft: 40, borderRadius: 10,
                border: '1px solid var(--card-border)',
                fontSize: 13, fontWeight: 500,
              }}
            />
          </div>
          {(searchTerm || statusFilter !== 'All') && (
            <button
              className="b24-btn b24-btn-secondary"
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              style={{ gap: 6 }}
            >
              <RefreshCw size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ padding: '0 32px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <InvoicesTable
          invoices={processedInvoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onPreview={handlePreview}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>

      {/* ── Modals ── */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setEditingInvoice(null); }}
        onSave={handleSave}
        invoiceToEdit={editingInvoice}
      />
      <InvoicePreviewModal
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        invoice={previewInvoice}
        onDownloadPdf={handleDownloadPdf}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
