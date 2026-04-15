import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, CheckCircle, Ban, Package,
  Plus, Search, Filter, X, AlertTriangle, Trash2,
  Download, RefreshCw
} from 'lucide-react';
import OrganizationTable          from '../../components/superadmin/OrganizationTable';
import OrganizationCard           from '../../components/superadmin/OrganizationCard';
import OrganizationForm           from '../../components/superadmin/OrganizationForm';
import OrganizationDetailsDrawer  from '../../components/superadmin/OrganizationDetailsDrawer';
import StatusBadge                from '../../components/superadmin/StatusBadge';

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED = [
  { id:1,  name:'Nexus Corp',        adminName:'Sarah Chen',    email:'sarah@nexus.io',       phone:'+1 212-555-0101', plan:'Enterprise', status:'Active',    users:248, maxUsers:500, revenue:'$2,450', createdDate:'Jan 15, 2024', storageUsed:18.4, storageLimit:50 },
  { id:2,  name:'Velocity Labs',     adminName:'Marcus Reid',   email:'marcus@velocity.dev',  phone:'+1 415-555-0192', plan:'Pro',        status:'Active',    users:84,  maxUsers:50,  revenue:'$299',   createdDate:'Mar 8, 2024',  storageUsed:3.1,  storageLimit:10 },
  { id:3,  name:'Orbit Solutions',   adminName:'Priya Nair',    email:'priya@orbit.in',       phone:'+91 98-555-0177', plan:'Pro',        status:'Suspended', users:61,  maxUsers:50,  revenue:'$299',   createdDate:'Feb 22, 2024', storageUsed:4.8,  storageLimit:10 },
  { id:4,  name:'Apex Dynamics',     adminName:'Tom Walker',    email:'tom@apexdyn.com',      phone:'+44 20-555-0134', plan:'Enterprise', status:'Active',    users:312, maxUsers:500, revenue:'$2,450', createdDate:'Nov 3, 2023',  storageUsed:22.1, storageLimit:50 },
  { id:5,  name:'Bloom Digital',     adminName:'Lena Müller',   email:'lena@bloomdigital.de', phone:'+49 30-555-0188', plan:'Starter',    status:'Active',    users:22,  maxUsers:10,  revenue:'$99',    createdDate:'Apr 10, 2024', storageUsed:1.2,  storageLimit:5  },
  { id:6,  name:'Crest Analytics',   adminName:'James Okafor',  email:'james@crest.ng',       phone:'+234 80-555-0155',plan:'Free',       status:'Active',    users:8,   maxUsers:5,   revenue:'$0',     createdDate:'May 5, 2024',  storageUsed:0.4,  storageLimit:2  },
  { id:7,  name:'Pinnacle Systems',  adminName:'Yuki Tanaka',   email:'yuki@pinnacle.jp',     phone:'+81 3-555-0166',  plan:'Enterprise', status:'Active',    users:190, maxUsers:500, revenue:'$2,450', createdDate:'Dec 12, 2023', storageUsed:14.6, storageLimit:50 },
  { id:8,  name:'Dune Ventures',     adminName:'Aisha Patel',   email:'aisha@dune.ae',        phone:'+971 4-555-0199', plan:'Pro',        status:'Suspended', users:45,  maxUsers:50,  revenue:'$299',   createdDate:'Jun 18, 2024', storageUsed:2.9,  storageLimit:10 },
  { id:9,  name:'Solaris Tech',      adminName:'Carlos Ruiz',   email:'carlos@solaris.mx',    phone:'+52 55-555-0122', plan:'Starter',    status:'Active',    users:17,  maxUsers:10,  revenue:'$99',    createdDate:'Jul 2, 2024',  storageUsed:0.8,  storageLimit:5  },
  { id:10, name:'Meridian Group',    adminName:'Alice Johnson',  email:'alice@meridian.fr',   phone:'+33 1-555-0133',  plan:'Enterprise', status:'Active',    users:420, maxUsers:500, revenue:'$2,450', createdDate:'Oct 28, 2023', storageUsed:31.2, storageLimit:50 },
  { id:11, name:'Zephyr Cloud',      adminName:'Noah Kim',       email:'noah@zephyr.kr',      phone:'+82 2-555-0144',  plan:'Pro',        status:'Active',    users:73,  maxUsers:50,  revenue:'$299',   createdDate:'Aug 14, 2024', storageUsed:5.6,  storageLimit:10 },
  { id:12, name:'Ironclad Security', adminName:'Fatima Al-Sayed',email:'fatima@ironclad.sa',  phone:'+966 5-555-0177', plan:'Enterprise', status:'Active',    users:156, maxUsers:500, revenue:'$2,450', createdDate:'Sep 9, 2024',  storageUsed:9.8,  storageLimit:50 },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, gradient, label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '20px', boxShadow: 'var(--card-shadow)', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'box-shadow 0.3s, transform 0.3s' }}>
      <div style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: gradient, opacity: 0.1, filter: 'blur(24px)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '12px', background: gradient, display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '5px' }}>{label}</p>
      {sub && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</p>}
    </motion.div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ config, onConfirm, onCancel }) {
  if (!config) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'grid', placeItems: 'center', padding: '20px' }}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}
          style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.25)', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: config.iconBg, display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <config.icon size={22} color={config.iconColor} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{config.title}</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{config.message}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: config.confirmBg, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: `0 4px 14px ${config.confirmBg}55` }}>
              {config.confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Organizations() {
  const [orgs, setOrgs]               = useState([]);
  const [search, setSearch]           = useState('');
  const [filterPlan, setFilterPlan]   = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(10);
  const [viewOrg, setViewOrg]         = useState(null);
  const [editOrg, setEditOrg]         = useState(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [confirm, setConfirm]         = useState(null);
  const [toast, setToast]             = useState(null);
  const [isLoading, setIsLoading]     = useState(true);

  React.useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const { superAdminApi } = await import('../../utils/api');
        const response = await superAdminApi.getOrganizations();
        if (response && response.success && response.data) {
          setOrgs(response.data);
        } else {
          setOrgs(SEED);
        }
      } catch (err) {
        console.error('Failed to fetch orgs:', err);
        setOrgs(SEED);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Derived stats ──
  const stats = useMemo(() => ({
    total:     orgs.length,
    active:    orgs.filter(o => o.status === 'Active').length,
    suspended: orgs.filter(o => o.status === 'Suspended').length,
    free:      orgs.filter(o => o.plan === 'Free' || o.plan === 'Starter').length,
  }), [orgs]);

  // ── Filtered + paginated ──
  const filtered = useMemo(() => orgs.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.adminName.toLowerCase().includes(q))
      && (filterPlan === 'All' || o.plan === filterPlan)
      && (filterStatus === 'All' || o.status === filterStatus);
  }), [orgs, search, filterPlan, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged      = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetPage = () => setPage(1);

  // ── Actions ──
  const handleSave = (form) => {
    if (editOrg) {
      setOrgs(prev => prev.map(o => o.id === editOrg.id ? { ...o, ...form } : o));
      if (viewOrg?.id === editOrg.id) setViewOrg(v => ({ ...v, ...form }));
      showToast('Organization updated');
    } else {
      const newOrg = { ...form, id: Date.now(), users: 1, storageUsed: 0, storageLimit: 10, revenue: form.plan === 'Enterprise' ? '$2,450' : form.plan === 'Pro' ? '$299' : form.plan === 'Starter' ? '$99' : '$0', createdDate: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) };
      setOrgs(prev => [newOrg, ...prev]);
      showToast('Organization created');
    }
    setEditOrg(null);
    setShowCreate(false);
  };

  const handleToggleStatus = (org) => {
    const next = org.status === 'Active' ? 'Suspended' : 'Active';
    setConfirm({
      icon: next === 'Suspended' ? Ban : CheckCircle,
      iconBg: next === 'Suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
      iconColor: next === 'Suspended' ? '#ef4444' : '#10b981',
      title: next === 'Suspended' ? `Suspend ${org.name}?` : `Activate ${org.name}?`,
      message: next === 'Suspended' ? 'This will revoke access for all users in this organization.' : 'This will restore access for all users in this organization.',
      confirmLabel: next === 'Suspended' ? 'Suspend' : 'Activate',
      confirmBg: next === 'Suspended' ? '#ef4444' : '#10b981',
      onConfirm: () => {
        setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, status: next } : o));
        if (viewOrg?.id === org.id) setViewOrg(v => ({ ...v, status: next }));
        setConfirm(null);
        showToast(`Organization ${next === 'Active' ? 'activated' : 'suspended'}`);
      },
    });
  };

  const handleDelete = (org) => {
    setConfirm({
      icon: Trash2,
      iconBg: 'rgba(239,68,68,0.1)',
      iconColor: '#ef4444',
      title: `Delete ${org.name}?`,
      message: 'This action is permanent and cannot be undone. All data will be lost.',
      confirmLabel: 'Delete',
      confirmBg: '#ef4444',
      onConfirm: () => {
        setOrgs(prev => prev.filter(o => o.id !== org.id));
        if (viewOrg?.id === org.id) setViewOrg(null);
        setConfirm(null);
        showToast('Organization deleted', 'error');
      },
    });
  };

  const handleChangePlan = (org) => setEditOrg(org);

  const activeFilters = [filterPlan !== 'All' && filterPlan, filterStatus !== 'All' && filterStatus].filter(Boolean);

  return (
    <div style={{ position: 'relative', padding: '28px' }}>
      <Toast toast={toast} />

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '4px' }}>Organizations</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Manage all registered companies and their subscriptions</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <Download size={14} /> Export
          </button>
          <button onClick={() => { setShowCreate(true); setEditOrg(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            <Plus size={15} /> Add Organization
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <KPICard icon={Building2} gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" label="Total Organizations" value={stats.total}     sub="All registered tenants"    delay={0}    />
        <KPICard icon={CheckCircle} gradient="linear-gradient(135deg,#10b981,#34d399)" label="Active"            value={stats.active}    sub="Currently operational"     delay={0.07} />
        <KPICard icon={Ban}         gradient="linear-gradient(135deg,#ef4444,#f87171)" label="Suspended"         value={stats.suspended} sub="Access revoked"            delay={0.14} />
        <KPICard icon={Package}     gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" label="Free / Starter"   value={stats.free}      sub="Low-tier plans"            delay={0.21} />
      </div>

      {/* ── Search & Filters ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
              placeholder="Search by name, email, or admin..."
              style={{ width: '100%', paddingLeft: '34px', paddingRight: search ? '32px' : '12px', paddingTop: '9px', paddingBottom: '9px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            {search && (
              <button onClick={() => { setSearch(''); resetPage(); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Plan filter */}
          <select value={filterPlan} onChange={e => { setFilterPlan(e.target.value); resetPage(); }}
            style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {['All', 'Free', 'Starter', 'Pro', 'Enterprise'].map(p => <option key={p} value={p}>{p === 'All' ? 'All Plans' : p}</option>)}
          </select>

          {/* Status filter */}
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }}
            style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {['All', 'Active', 'Suspended'].map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>

          {/* Clear filters */}
          {activeFilters.length > 0 && (
            <button onClick={() => { setFilterPlan('All'); setFilterStatus('All'); resetPage(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <X size={12} /> Clear filters
            </button>
          )}

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{filtered.length}</span> results
          </p>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            {activeFilters.map(f => (
              <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontSize: '12px', fontWeight: '700' }}>
                {f}
                <button onClick={() => { if (['Free','Starter','Pro','Enterprise'].includes(f)) setFilterPlan('All'); else setFilterStatus('All'); resetPage(); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'grid', placeItems: 'center', padding: 0 }}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Table (desktop) ── */}
      <div className="org-table-view">
        <OrganizationTable
          orgs={paged}
          page={page}
          totalPages={totalPages}
          totalCount={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={n => { setPageSize(n); resetPage(); }}
          onView={setViewOrg}
          onEdit={setEditOrg}
          onToggleStatus={handleToggleStatus}
          onChangePlan={handleChangePlan}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Card view (mobile) ── */}
      <div className="org-card-view" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {paged.map((org, i) => (
          <OrganizationCard key={org.id} org={org} index={i}
            onView={() => setViewOrg(org)}
            onEdit={() => setEditOrg(org)}
            onToggleStatus={() => handleToggleStatus(org)}
            onDelete={() => handleDelete(org)}
          />
        ))}
        {paged.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>No organizations found.</div>
        )}
      </div>

      {/* ── Modals & Drawers ── */}
      <AnimatePresence>
        {(showCreate || editOrg) && (
          <OrganizationForm
            org={editOrg || null}
            onSave={handleSave}
            onClose={() => { setShowCreate(false); setEditOrg(null); }}
          />
        )}
      </AnimatePresence>

      <OrganizationDetailsDrawer
        org={viewOrg}
        onClose={() => setViewOrg(null)}
        onEdit={() => { setEditOrg(viewOrg); setViewOrg(null); }}
        onToggleStatus={() => { handleToggleStatus(viewOrg); setViewOrg(null); }}
        onDelete={() => { handleDelete(viewOrg); setViewOrg(null); }}
      />

      <ConfirmModal
        config={confirm}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .org-table-view { display: none !important; }
          .org-card-view  { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
