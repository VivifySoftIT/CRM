import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, FileText, User, Calendar, Package, DollarSign, StickyNote, UserCheck } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/mockProducts';

const CONTACTS = ['Jane Smith', 'Acme Corp', 'John Doe', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt', 'Fiona Green'];
const DEALS = ['Q4 Enterprise Deal', 'Website Redesign', 'Annual Maintenance', 'Cloud Migration', 'Marketing Campaign'];
const OWNERS = ['John Sales', 'Alice Admin', 'Bob Manager', 'Sarah Executive'];

const emptyItem = () => ({ id: Date.now() + Math.random(), name: '', description: '', quantity: 1, price: 0 });

export default function CreateQuoteModal({ isOpen, onClose, onSave, quoteToEdit }) {
  const availableProducts = useMemo(() => {
    const saved = localStorage.getItem('crm_products');
    return saved ? JSON.parse(saved).filter(p => p.status === 'Active') : INITIAL_PRODUCTS.filter(p => p.status === 'Active');
  }, [isOpen]);

  const [form, setForm] = useState({
    contactName: '',
    companyName: '',
    relatedDeal: '',
    quoteNumber: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    items: [emptyItem()],
    taxPercent: 18,
    discountPercent: 0,
    terms: 'Payment due within 30 days of invoice date. All prices are in INR.',
    notes: '',
    owner: 'John Sales',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (quoteToEdit) {
        setForm({ ...quoteToEdit, items: quoteToEdit.items.map(i => ({ ...i })) });
      } else {
        const qNum = `QT-${Date.now().toString().slice(-6)}`;
        const validDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
        setForm(f => ({ ...f, quoteNumber: qNum, validUntil: validDate, quoteDate: new Date().toISOString().split('T')[0], items: [emptyItem()], contactName: '', companyName: '', relatedDeal: '', taxPercent: 18, discountPercent: 0, terms: 'Payment due within 30 days of invoice date. All prices are in INR.', notes: '', owner: 'John Sales' }));
      }
      setErrors({});
    }
  }, [isOpen, quoteToEdit]);

  const subtotal = useMemo(() => form.items.reduce((s, i) => s + (i.quantity * i.price), 0), [form.items]);
  const taxAmount = useMemo(() => subtotal * (form.taxPercent / 100), [subtotal, form.taxPercent]);
  const discountAmount = useMemo(() => subtotal * (form.discountPercent / 100), [subtotal, form.discountPercent]);
  const grandTotal = useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount]);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

  const updateField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateItem = (id, key, val) => setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }));
  const removeItem = (id) => setForm(f => ({ ...f, items: f.items.length > 1 ? f.items.filter(i => i.id !== id) : f.items }));

  const validate = () => {
    const e = {};
    if (!form.contactName) e.contactName = 'Contact is required';
    if (!form.validUntil) e.validUntil = 'Expiry date is required';
    if (form.items.some(i => !i.name)) e.items = 'All items need a name';
    if (form.items.some(i => i.quantity <= 0 || i.price <= 0)) e.itemsPrice = 'Quantity and price must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: form.id || `q-${Date.now()}`,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount: grandTotal,
      status: form.status || 'Draft',
      createdAt: form.createdAt || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  if (!isOpen) return null;

  const sectionTitle = (icon, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--card-border)' }}>
      {icon} {text}
    </div>
  );

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
          style={{ background: 'var(--card-bg)', borderRadius: 14, width: '100%', maxWidth: 820, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.12)', display: 'grid', placeItems: 'center' }}>
                <FileText size={18} color="#2563eb" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{quoteToEdit ? 'Edit Quote' : 'Create New Quote'}</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{form.quoteNumber}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><X size={18} /></button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Section 1: Customer Info */}
            {sectionTitle(<User size={15} color="#6366f1" />, 'Customer Information')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Contact Name <span className="required">*</span></label>
                <select className={`b24-select ${errors.contactName ? 'error' : ''}`} value={form.contactName} onChange={e => updateField('contactName', e.target.value)}>
                  <option value="">Select Contact</option>
                  {CONTACTS.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.contactName && <span className="b24-error">{errors.contactName}</span>}
              </div>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Company Name</label>
                <input className="b24-input" value={form.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="Company name" />
              </div>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Related Deal</label>
                <select className="b24-select" value={form.relatedDeal} onChange={e => updateField('relatedDeal', e.target.value)}>
                  <option value="">None</option>
                  {DEALS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Section 2: Quote Details */}
            {sectionTitle(<Calendar size={15} color="#10b981" />, 'Quote Details')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Quote Number</label>
                <input className="b24-input" value={form.quoteNumber} readOnly style={{ background: 'var(--input-bg)', opacity: 0.7 }} />
              </div>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Quote Date</label>
                <input type="date" className="b24-input" value={form.quoteDate} onChange={e => updateField('quoteDate', e.target.value)} />
              </div>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Valid Until <span className="required">*</span></label>
                <input type="date" className={`b24-input ${errors.validUntil ? 'error' : ''}`} value={form.validUntil} onChange={e => updateField('validUntil', e.target.value)} />
                {errors.validUntil && <span className="b24-error">{errors.validUntil}</span>}
              </div>
            </div>

            {/* Section 3: Line Items */}
            {sectionTitle(<Package size={15} color="#f59e0b" />, 'Products / Services')}
            <div style={{ background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)' }}>
                    {['Item Name *', 'Description', 'Qty', 'Price (₹)', 'Total (₹)', ''].map((h, i) => (
                      <th key={i} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i >= 2 ? 'right' : 'left', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '8px 12px', width: '28%' }}>
                        <input 
                          list={`products-${item.id}`}
                          className={`b24-input ${errors.items ? 'error' : ''}`} 
                          value={item.name} 
                          onChange={e => {
                            const val = e.target.value;
                            const prod = availableProducts.find(p => p.name === val);
                            if (prod) {
                              setForm(f => ({ ...f, items: f.items.map(i => i.id === item.id ? { ...i, name: val, price: prod.price, description: prod.description || '' } : i) }));
                            } else {
                              updateItem(item.id, 'name', val);
                            }
                          }} 
                          placeholder="Product or service" 
                          style={{ fontSize: 12 }} 
                        />
                        <datalist id={`products-${item.id}`}>
                          {availableProducts.map(p => <option key={p.id} value={p.name} />)}
                        </datalist>
                      </td>
                      <td style={{ padding: '8px 12px', width: '28%' }}>
                        <input className="b24-input" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Brief description" style={{ fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '8px 12px', width: '10%' }}>
                        <input type="number" min="1" className="b24-input" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))} style={{ textAlign: 'right', fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '8px 12px', width: '14%' }}>
                        <input type="number" min="0" className="b24-input" value={item.price} onChange={e => updateItem(item.id, 'price', Math.max(0, Number(e.target.value)))} style={{ textAlign: 'right', fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '8px 12px', width: '14%', textAlign: 'right', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {fmt(item.quantity * item.price)}
                      </td>
                      <td style={{ padding: '8px 12px', width: '6%', textAlign: 'center' }}>
                        <button onClick={() => removeItem(item.id)} disabled={form.items.length <= 1}
                          style={{ background: 'transparent', border: 'none', cursor: form.items.length <= 1 ? 'not-allowed' : 'pointer', color: form.items.length <= 1 ? 'var(--text-muted)' : '#ef4444', padding: 4, opacity: form.items.length <= 1 ? 0.3 : 1 }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 12px' }}>
                <button onClick={addItem} className="b24-btn b24-btn-ghost" style={{ fontSize: 12 }}>
                  <Plus size={14} /> Add Line Item
                </button>
              </div>
              {(errors.items || errors.itemsPrice) && <div className="b24-error" style={{ padding: '0 12px 10px' }}>{errors.items || errors.itemsPrice}</div>}
            </div>

            {/* Pricing Summary */}
            {sectionTitle(<DollarSign size={15} color="#10b981" />, 'Pricing Summary')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="b24-field" style={{ marginBottom: 0 }}>
                  <label className="b24-label">Tax (%)</label>
                  <input type="number" min="0" max="100" className="b24-input" value={form.taxPercent} onChange={e => updateField('taxPercent', Math.max(0, Number(e.target.value)))} />
                </div>
                <div className="b24-field" style={{ marginBottom: 0 }}>
                  <label className="b24-label">Discount (%)</label>
                  <input type="number" min="0" max="100" className="b24-input" value={form.discountPercent} onChange={e => updateField('discountPercent', Math.max(0, Number(e.target.value)))} />
                </div>
              </div>
              <div style={{ background: 'var(--input-bg)', borderRadius: 10, border: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Subtotal', value: fmt(subtotal), color: 'var(--text-primary)' },
                  { label: `Tax (${form.taxPercent}%)`, value: `+ ${fmt(taxAmount)}`, color: '#f59e0b' },
                  { label: `Discount (${form.discountPercent}%)`, value: `- ${fmt(discountAmount)}`, color: '#ef4444' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>{r.label}</span>
                    <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                  <span style={{ color: '#10b981' }}>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sectionTitle(<StickyNote size={15} color="#8b5cf6" />, 'Terms & Notes')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Terms & Conditions</label>
                <textarea className="b24-textarea" value={form.terms} onChange={e => updateField('terms', e.target.value)} rows={3} />
              </div>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Additional Notes</label>
                <textarea className="b24-textarea" value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Any internal notes..." rows={3} />
              </div>
            </div>

            {/* Owner */}
            {sectionTitle(<UserCheck size={15} color="#3b82f6" />, 'Ownership')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="b24-field" style={{ marginBottom: 0 }}>
                <label className="b24-label">Quote Owner</label>
                <select className="b24-select" value={form.owner} onChange={e => updateField('owner', e.target.value)}>
                  {OWNERS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'var(--input-bg)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>
              Total: {fmt(grandTotal)}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="b24-btn b24-btn-secondary" onClick={onClose}>Cancel</button>
              <button className="b24-btn b24-btn-primary" onClick={handleSave}>
                <FileText size={14} /> {quoteToEdit ? 'Update Quote' : 'Create Quote'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
