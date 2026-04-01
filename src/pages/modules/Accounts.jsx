import React, { useState } from 'react';
import { Building2, Plus, Search, Eye, Edit2, X, CheckCircle2, ChevronLeft, ChevronRight, Phone, Mail, Globe, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Hospitality', 'Education', 'Other'];

const initialAccounts = [
  { id: 1, name: 'Acme Corporation', industry: 'Technology', website: 'www.acme.com', phone: '+1 555-123-4567', email: 'contact@acme.com', location: 'Silicon Valley, CA', owner: 'John Doe', employees: 250, revenue: '$5M', status: 'Active' },
  { id: 2, name: 'Globex Industries', industry: 'Manufacturing', website: 'www.globex.com', phone: '+1 555-234-5678', email: 'info@globex.com', location: 'Springfield, IL', owner: 'Jane Smith', employees: 1200, revenue: '$22M', status: 'Active' },
  { id: 3, name: 'Initech Solutions', industry: 'Finance', website: 'www.initech.io', phone: '+1 555-345-6789', email: 'hello@initech.io', location: 'Austin, TX', owner: 'Bob Johnson', employees: 85, revenue: '$3.2M', status: 'Active' },
  { id: 4, name: 'Umbrella Corp', industry: 'Healthcare', website: 'www.umbrella.com', phone: '+1 555-456-7890', email: 'contact@umbrella.com', location: 'Raccoon City, MO', owner: 'Alice Brown', employees: 5000, revenue: '$120M', status: 'Inactive' },
  { id: 5, name: 'Stark Enterprises', industry: 'Technology', website: 'www.stark.com', phone: '+1 555-567-8901', email: 'info@stark.com', location: 'New York, NY', owner: 'Tony Stark', employees: 3200, revenue: '$80M', status: 'Active' },
  { id: 6, name: 'Wayne Industries', industry: 'Finance', website: 'www.wayne.com', phone: '+1 555-678-9012', email: 'contact@wayne.com', location: 'Gotham, NJ', owner: 'Bruce Wayne', employees: 4100, revenue: '$95M', status: 'Active' },
];

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' };

const PAGE_SIZE = 8;

export default function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', industry: 'Technology', website: '', phone: '', email: '', location: '', owner: '', employees: '', revenue: '' });
  const [formErrors, setFormErrors] = useState({});

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = accounts.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q);
    const matchIndustry = filterIndustry === 'All' || a.industry === filterIndustry;
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchIndustry && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const validate = (f) => {
    const errs = {};
    if (!f.name.trim()) errs.name = 'Required';
    if (!f.email.trim() || !/\S+@\S+\.\S+/.test(f.email)) errs.email = 'Valid email required';
    if (!f.owner.trim()) errs.owner = 'Required';
    return errs;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setAccounts([...accounts, { id: Date.now(), ...form, employees: Number(form.employees) || 0, status: 'Active' }]);
    setShowCreate(false);
    setForm({ name: '', industry: 'Technology', website: '', phone: '', email: '', location: '', owner: '', employees: '', revenue: '' });
    setFormErrors({});
    showToast('Account created successfully');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setAccounts(accounts.map(a => a.id === editAccount.id ? { ...a, ...editAccount } : a));
    setEditAccount(null);
    showToast('Account updated');
  };

  const resetFilters = () => { setSearch(''); setFilterIndustry('All'); setFilterStatus('All'); setPage(1); };

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-1px' }}>Accounts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage your business accounts and organizations.</p>
        </div>
        <button onClick={() => { setShowCreate(true); setFormErrors({}); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          <Plus size={18} /> Add Account
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, or owner..."
            style={{ ...inputStyle, paddingLeft: '40px' }} />
        </div>
        <select value={filterIndustry} onChange={e => { setFilterIndustry(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="All">All Industries</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="All">All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        {(search || filterIndustry !== 'All' || filterStatus !== 'All') && (
          <button onClick={resetFilters} style={{ padding: '11px 16px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', overflow: 'hidden', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
              {['Account Name', 'Industry', 'Contact', 'Location', 'Owner', 'Employees', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No accounts found.</td></tr>
            )}
            {paginated.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--card-border)' : 'none', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eef2ff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Building2 size={18} color="#6366f1" />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{a.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{a.industry}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12} color="var(--text-secondary)" />{a.email}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={12} />{a.phone}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} />{a.location}</span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>{a.owner}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={12} />{a.employees?.toLocaleString()}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: a.status === 'Active' ? '#f0fdf4' : '#f1f5f9', color: a.status === 'Active' ? '#16a34a' : '#64748b' }}>
                    {a.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => navigate(`/dashboard/accounts/${a.id}`)} title="View" style={{ padding: '7px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <Eye size={15} color="#6366f1" />
                    </button>
                    <button onClick={() => setEditAccount({ ...a })} title="Edit" style={{ padding: '7px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <Edit2 size={15} color="var(--text-secondary)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} accounts
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
            <ChevronLeft size={15} /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: page === n ? '#6366f1' : 'var(--card-bg)', color: page === n ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>{n}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '580px', borderRadius: '20px', padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Add Account</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Create a new business account.</p>
                </div>
                <button onClick={() => setShowCreate(false)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>ACCOUNT NAME *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp" style={{ ...inputStyle, borderColor: formErrors.name ? '#ef4444' : undefined }} />
                    {formErrors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>INDUSTRY</label>
                    <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>EMAIL *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@company.com" style={{ ...inputStyle, borderColor: formErrors.email ? '#ef4444' : undefined }} />
                    {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.email}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>PHONE</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-000-0000" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>WEBSITE</label>
                    <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="www.company.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>LOCATION</label>
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>OWNER *</label>
                    <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="John Doe" style={{ ...inputStyle, borderColor: formErrors.owner ? '#ef4444' : undefined }} />
                    {formErrors.owner && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.owner}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>EMPLOYEES</label>
                    <input type="number" value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })} placeholder="100" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>REVENUE</label>
                    <input value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })} placeholder="$1M" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Create Account</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editAccount && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '480px', borderRadius: '20px', padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Edit Account</h2>
                <button onClick={() => setEditAccount(null)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={labelStyle}>ACCOUNT NAME</label>
                  <input value={editAccount.name} onChange={e => setEditAccount({ ...editAccount, name: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>INDUSTRY</label>
                    <select value={editAccount.industry} onChange={e => setEditAccount({ ...editAccount, industry: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>STATUS</label>
                    <select value={editAccount.status} onChange={e => setEditAccount({ ...editAccount, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>OWNER</label>
                  <input value={editAccount.owner} onChange={e => setEditAccount({ ...editAccount, owner: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setEditAccount(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
