import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, Eye, Edit2, ToggleLeft, ToggleRight, X, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Phone, Mail, User, HardDrive, Calendar, Activity, Users, CreditCard, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = ['Basic', 'Pro', 'Enterprise'];
const STORAGE_OPTIONS = ['5GB', '10GB', '20GB', '50GB', '100GB'];

const initialCompanies = [
    { id: 1, name: 'Grand Omni Hotel', owner: 'Harish M.', email: 'harish@omnihotel.com', phone: '+1 212-555-0101', plan: 'Enterprise', status: 'Active', storageUsed: 6.2, storageLimit: 10, created: '2024-01-15', users: 24, revenue: '$2,450/mo', recentActivity: ['New booking: Suite 401', 'Invoice #1042 paid', 'Guest checked out: Room 210'] },
    { id: 2, name: 'Riviera Resort & Spa', owner: 'Alice Johnson', email: 'alice@rivieraresort.com', phone: '+33 4-555-0192', plan: 'Pro', status: 'Active', storageUsed: 3.1, storageLimit: 10, created: '2024-03-08', users: 11, revenue: '$999/mo', recentActivity: ['Marketing campaign sent', 'New contact added', 'Support ticket resolved'] },
    { id: 3, name: 'Urban Boutique Stay', owner: 'Bob Smith', email: 'bob@urbanstay.co', phone: '+44 20-555-0134', plan: 'Basic', status: 'Suspended', storageUsed: 4.8, storageLimit: 5, created: '2024-05-22', users: 4, revenue: '$299/mo', recentActivity: ['Account suspended', 'Payment failed', 'Support ticket opened'] },
    { id: 4, name: 'Azure Sky Resorts', owner: 'Priya Nair', email: 'priya@azuresky.in', phone: '+91 98-555-0177', plan: 'Pro', status: 'Active', storageUsed: 1.4, storageLimit: 10, created: '2025-01-10', users: 9, revenue: '$999/mo', recentActivity: ['New user invited', 'Pipeline updated', 'Analytics report generated'] },
    { id: 5, name: 'The Pinnacle Suites', owner: 'Carlos Ruiz', email: 'carlos@pinnaclesuites.mx', phone: '+52 55-555-0188', plan: 'Enterprise', status: 'Active', storageUsed: 18.3, storageLimit: 50, created: '2023-11-03', users: 38, revenue: '$2,450/mo', recentActivity: ['Contract signed', 'Bulk import completed', 'New module enabled'] },
];

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' };

const planColor = { Basic: '#64748b', Pro: '#6366f1', Enterprise: '#f59e0b' };
const planBg = { Basic: '#f1f5f9', Pro: '#eef2ff', Enterprise: '#fffbeb' };

function StorageBar({ used, limit }) {
    const pct = Math.min((used / limit) * 100, 100);
    const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{used}GB / {limit}GB used</span>
                <span style={{ fontWeight: '700', color }}>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.4s' }} />
            </div>
            {pct >= 90 && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={11} /> Storage limit nearly reached</p>}
        </div>
    );
}

const PAGE_SIZE = 5;

export default function Companies() {
    const [companies, setCompanies] = useState(initialCompanies);
    const [search, setSearch] = useState('');
    const [filterPlan, setFilterPlan] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [viewCompany, setViewCompany] = useState(null);
    const [editCompany, setEditCompany] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // { company, action }
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({ name: '', owner: '', email: '', phone: '', plan: 'Basic', storageLimit: '5GB', password: '' });
    const [formErrors, setFormErrors] = useState({});

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = companies.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        const matchPlan = filterPlan === 'All' || c.plan === filterPlan;
        const matchStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchSearch && matchPlan && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const validate = (f) => {
        const errs = {};
        if (!f.name.trim()) errs.name = 'Required';
        if (!f.owner.trim()) errs.owner = 'Required';
        if (!f.email.trim() || !/\S+@\S+\.\S+/.test(f.email)) errs.email = 'Valid email required';
        if (!f.phone.trim()) errs.phone = 'Required';
        if (!f.password.trim() || f.password.length < 6) errs.password = 'Min 6 characters';
        return errs;
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setFormErrors(errs); return; }
        const limitNum = parseInt(form.storageLimit);
        setCompanies([...companies, {
            id: Date.now(), name: form.name, owner: form.owner, email: form.email, phone: form.phone,
            plan: form.plan, status: 'Active', storageUsed: 0, storageLimit: limitNum,
            created: new Date().toISOString().split('T')[0], users: 1, revenue: form.plan === 'Enterprise' ? '$2,450/mo' : form.plan === 'Pro' ? '$999/mo' : '$299/mo',
            recentActivity: ['Account created']
        }]);
        setShowCreate(false);
        setForm({ name: '', owner: '', email: '', phone: '', plan: 'Basic', storageLimit: '5GB', password: '' });
        setFormErrors({});
        showToast('Company created successfully');
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setCompanies(companies.map(c => c.id === editCompany.id ? { ...c, name: editCompany.name, plan: editCompany.plan, storageLimit: editCompany.storageLimit, status: editCompany.status } : c));
        setEditCompany(null);
        showToast('Company updated');
    };

    const handleStatusToggle = () => {
        const { company, action } = confirmAction;
        setCompanies(companies.map(c => c.id === company.id ? { ...c, status: action } : c));
        if (viewCompany?.id === company.id) setViewCompany({ ...viewCompany, status: action });
        setConfirmAction(null);
        showToast(`Company ${action === 'Active' ? 'activated' : 'suspended'}`);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: toast.type === 'success' ? '#10b981' : '#ef4444', color: 'white', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} /> {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '4px', letterSpacing: '-1px' }}>Company Management</h1>
                    <p style={{ color: '#64748b', fontSize: '15px' }}>Manage tenants, subscriptions, and storage across the platform.</p>
                </div>
                <button onClick={() => { setShowCreate(true); setFormErrors({}); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                    <Plus size={18} /> Create Company
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by company name or email..." style={{ ...inputStyle, paddingLeft: '40px' }} />
                </div>
                <select value={filterPlan} onChange={e => { setFilterPlan(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', paddingRight: '32px', cursor: 'pointer' }}>
                    <option value="All">All Plans</option>
                    {PLANS.map(p => <option key={p}>{p}</option>)}
                </select>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', paddingRight: '32px', cursor: 'pointer' }}>
                    <option value="All">All Statuses</option>
                    <option>Active</option>
                    <option>Suspended</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
                            {['Company Name', 'Owner', 'Email', 'Plan', 'Status', 'Created', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No companies found.</td></tr>
                        )}
                        {paginated.map((c, i) => (
                            <tr key={c.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--card-border)' : 'none', transition: 'background 0.15s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eef2ff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                            <Building2 size={18} color="#6366f1" />
                                        </div>
                                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>{c.owner}</td>
                                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{c.email}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', background: planBg[c.plan], color: planColor[c.plan] }}>{c.plan}</span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: c.status === 'Active' ? '#f0fdf4' : '#fef2f2', color: c.status === 'Active' ? '#16a34a' : '#dc2626' }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c.created}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => setViewCompany(c)} title="View" style={{ padding: '7px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Eye size={15} color="#6366f1" /></button>
                                        <button onClick={() => setEditCompany({ ...c })} title="Edit" style={{ padding: '7px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Edit2 size={15} color="var(--text-secondary)" /></button>
                                        <button onClick={() => setConfirmAction({ company: c, action: c.status === 'Active' ? 'Suspended' : 'Active' })} title={c.status === 'Active' ? 'Suspend' : 'Activate'}
                                            style={{ padding: '7px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                            {c.status === 'Active' ? <ToggleRight size={15} color="#10b981" /> : <ToggleLeft size={15} color="#ef4444" />}
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
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} companies</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                        <ChevronLeft size={15} /> Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button key={n} onClick={() => setPage(n)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: page === n ? '#6366f1' : 'var(--card-bg)', color: page === n ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>{n}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                        Next <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* ── CREATE COMPANY MODAL ── */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '560px', borderRadius: '20px', padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                <div>
                                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Create New Company</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Provision a new tenant on the platform.</p>
                                </div>
                                <button onClick={() => setShowCreate(false)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>COMPANY NAME</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Grand Royal Hotel" style={{ ...inputStyle, borderColor: formErrors.name ? '#ef4444' : '#e2e8f0' }} />
                                        {formErrors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>OWNER NAME</label>
                                        <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="John Smith" style={{ ...inputStyle, borderColor: formErrors.owner ? '#ef4444' : '#e2e8f0' }} />
                                        {formErrors.owner && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.owner}</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>EMAIL</label>
                                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="owner@company.com" style={{ ...inputStyle, borderColor: formErrors.email ? '#ef4444' : '#e2e8f0' }} />
                                        {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.email}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>PHONE NUMBER</label>
                                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0100" style={{ ...inputStyle, borderColor: formErrors.phone ? '#ef4444' : '#e2e8f0' }} />
                                        {formErrors.phone && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.phone}</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>SUBSCRIPTION PLAN</label>
                                        <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {PLANS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                    </div>

                                </div>
                                <div>
                                    <label style={labelStyle}>PASSWORD</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" style={{ ...inputStyle, borderColor: formErrors.password ? '#ef4444' : '#e2e8f0' }} />
                                        <button type="button" onClick={() => setForm({ ...form, password: Math.random().toString(36).slice(-10) })}
                                            style={{ padding: '11px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', color: '#6366f1' }}>
                                            Auto-generate
                                        </button>
                                    </div>
                                    {formErrors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.password}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                                    <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Create Company</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── EDIT COMPANY MODAL ── */}
            <AnimatePresence>
                {editCompany && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '480px', borderRadius: '20px', padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Edit Company</h2>
                                <button onClick={() => setEditCompany(null)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div>
                                    <label style={labelStyle}>COMPANY NAME</label>
                                    <input value={editCompany.name} onChange={e => setEditCompany({ ...editCompany, name: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>SUBSCRIPTION PLAN</label>
                                        <select value={editCompany.plan} onChange={e => setEditCompany({ ...editCompany, plan: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {PLANS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                        <div style={{ marginTop: '8px', padding: '10px', background: 'var(--bg-darker)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {editCompany.plan === 'Basic' && '1 location · $299/mo · 5GB storage'}
                                            {editCompany.plan === 'Pro' && '3 locations · $999/mo · 10GB storage'}
                                            {editCompany.plan === 'Enterprise' && 'Unlimited · $2,450/mo · 50GB storage'}
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <label style={labelStyle}>STATUS</label>
                                    <select value={editCompany.status} onChange={e => setEditCompany({ ...editCompany, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        <option>Active</option>
                                        <option>Suspended</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setEditCompany(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                                    <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CONFIRM STATUS MODAL ── */}
            <AnimatePresence>
                {confirmAction && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: confirmAction.action === 'Suspended' ? '#fef2f2' : '#f0fdf4', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                                <AlertTriangle size={26} color={confirmAction.action === 'Suspended' ? '#ef4444' : '#16a34a'} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                                {confirmAction.action === 'Suspended' ? 'Suspend Company?' : 'Activate Company?'}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
                                {confirmAction.action === 'Suspended'
                                    ? `This will block all staff at "${confirmAction.company.name}" from accessing their dashboard.`
                                    : `This will restore full access for "${confirmAction.company.name}".`}
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setConfirmAction(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                                <button onClick={handleStatusToggle} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: 'none', background: confirmAction.action === 'Suspended' ? '#ef4444' : '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                                    {confirmAction.action === 'Suspended' ? 'Yes, Suspend' : 'Yes, Activate'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── COMPANY DETAILS DRAWER ── */}
            <AnimatePresence>
                {viewCompany && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
                        onClick={e => { if (e.target === e.currentTarget) setViewCompany(null); }}>
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            style={{ width: '480px', height: '100%', background: 'var(--card-bg)', overflowY: 'auto', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)' }}>
                            {/* Drawer Header */}
                            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef2ff', display: 'grid', placeItems: 'center' }}>
                                        <Building2 size={22} color="#6366f1" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{viewCompany.name}</h3>
                                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: viewCompany.status === 'Active' ? '#f0fdf4' : '#fef2f2', color: viewCompany.status === 'Active' ? '#16a34a' : '#dc2626' }}>{viewCompany.status}</span>
                                    </div>
                                </div>
                                <button onClick={() => setViewCompany(null)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={18} /></button>
                            </div>

                            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                {/* Company Info */}
                                <section>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>COMPANY INFO</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { icon: <User size={15} />, label: 'Owner', val: viewCompany.owner },
                                            { icon: <Mail size={15} />, label: 'Email', val: viewCompany.email },
                                            { icon: <Phone size={15} />, label: 'Phone', val: viewCompany.phone },
                                            { icon: <Calendar size={15} />, label: 'Created', val: viewCompany.created },
                                        ].map(row => (
                                            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ color: '#94a3b8', width: '20px' }}>{row.icon}</div>
                                                <span style={{ fontSize: '13px', color: '#64748b', width: '60px', flexShrink: 0 }}>{row.label}</span>
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Subscription */}
                                <section style={{ padding: '20px', background: 'var(--bg-darker)', borderRadius: '14px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>SUBSCRIPTION</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{viewCompany.plan} Plan</span>
                                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#6366f1' }}>{viewCompany.revenue}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                                        {viewCompany.plan === 'Basic' && '1 location · Core modules only'}
                                        {viewCompany.plan === 'Pro' && '3 locations · Full marketing suite'}
                                        {viewCompany.plan === 'Enterprise' && 'Unlimited locations · Whitelabeling + custom integrations'}
                                    </p>
                                </section>

                                {/* Usage Stats */}
                                <section>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>USAGE STATS</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ padding: '16px', background: 'var(--bg-darker)', borderRadius: '12px', textAlign: 'center' }}>
                                            <Users size={20} color="#6366f1" style={{ margin: '0 auto 8px' }} />
                                            <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{viewCompany.users}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Users</p>
                                        </div>
                                        <div style={{ padding: '16px', background: 'var(--bg-darker)', borderRadius: '12px', textAlign: 'center' }}>
                                            <HardDrive size={20} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                                            <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{viewCompany.storageUsed}GB</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Storage Used</p>
                                        </div>
                                    </div>
                                    <StorageBar used={viewCompany.storageUsed} limit={viewCompany.storageLimit} />
                                </section>

                                {/* Recent Activity */}
                                <section>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>RECENT ACTIVITY</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {viewCompany.recentActivity.map((a, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg-darker)', borderRadius: '10px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{a}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => { setEditCompany({ ...viewCompany }); setViewCompany(null); }}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <Edit2 size={15} /> Edit
                                    </button>
                                    <button onClick={() => { setConfirmAction({ company: viewCompany, action: viewCompany.status === 'Active' ? 'Suspended' : 'Active' }); setViewCompany(null); }}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: viewCompany.status === 'Active' ? '#fef2f2' : '#f0fdf4', color: viewCompany.status === 'Active' ? '#dc2626' : '#16a34a', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        {viewCompany.status === 'Active' ? <><ToggleLeft size={15} /> Suspend</> : <><ToggleRight size={15} /> Activate</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
