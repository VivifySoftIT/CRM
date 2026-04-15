import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, CheckCircle, AlertTriangle, Users,
  Bell, Clock, XCircle, ArrowUpDown, RefreshCw, Check
} from 'lucide-react';
import PlanCard          from '../../components/superadmin/PlanCard';
import PlanFormModal     from '../../components/superadmin/PlanFormModal';
import SubscriptionTable from '../../components/superadmin/SubscriptionTable';
import RevenueChart      from '../../components/superadmin/RevenueChart';

// ─── Seed Plans ───────────────────────────────────────────────────────────────
const SEED_PLANS = [
  {
    id: 1, name: 'Free', color: '#64748b', popular: false, active: true,
    description: 'Get started with core CRM features',
    priceMonthly: 0, priceYearly: 0,
    maxUsers: 3, maxLeads: 50, storage: '1GB', support: 'Email',
    features: ['Leads Management', 'Contacts', 'Tasks & Activities'],
    orgsCount: 24,
  },
  {
    id: 2, name: 'Starter', color: '#3b82f6', popular: false, active: true,
    description: 'Perfect for small growing teams',
    priceMonthly: 49, priceYearly: 470,
    maxUsers: 10, maxLeads: 500, storage: '5GB', support: 'Email',
    features: ['Leads Management', 'Contacts', 'Deals & Pipeline', 'Tasks & Activities', 'Email Integration', 'Reports & Analytics'],
    orgsCount: 38,
  },
  {
    id: 3, name: 'Pro', color: '#8b5cf6', popular: true, active: true,
    description: 'Full CRM power for scaling businesses',
    priceMonthly: 149, priceYearly: 1430,
    maxUsers: 50, maxLeads: 999999, storage: '25GB', support: 'Chat',
    features: ['Leads Management', 'Contacts', 'Deals & Pipeline', 'Tasks & Activities', 'Email Integration', 'Reports & Analytics', 'Automation', 'API Access', 'Custom Fields', 'Document Management', 'Invoicing', 'Campaigns'],
    orgsCount: 61,
  },
  {
    id: 4, name: 'Enterprise', color: '#f59e0b', popular: false, active: true,
    description: 'Unlimited everything + dedicated support',
    priceMonthly: 399, priceYearly: 3830,
    maxUsers: 999, maxLeads: 999999, storage: 'Unlimited', support: 'Dedicated',
    features: ['Leads Management', 'Contacts', 'Deals & Pipeline', 'Tasks & Activities', 'Email Integration', 'Reports & Analytics', 'Automation', 'API Access', 'Custom Fields', 'Document Management', 'Invoicing', 'Campaigns', 'AI Assistant', 'Priority Support', 'White Labeling', 'Multi-Branch'],
    orgsCount: 19,
  },
];

// ─── Seed Subscriptions ───────────────────────────────────────────────────────
const SEED_SUBS = [
  { id:1,  orgName:'Nexus Corp',        adminEmail:'sarah@nexus.io',       plan:'Enterprise', billing:'Yearly',  expiryDate:'2026-12-31', status:'Active'    },
  { id:2,  orgName:'Velocity Labs',     adminEmail:'marcus@velocity.dev',  plan:'Pro',        billing:'Monthly', expiryDate:'2026-05-08', status:'Active'    },
  { id:3,  orgName:'Orbit Solutions',   adminEmail:'priya@orbit.in',       plan:'Pro',        billing:'Monthly', expiryDate:'2026-04-22', status:'Suspended' },
  { id:4,  orgName:'Apex Dynamics',     adminEmail:'tom@apexdyn.com',      plan:'Enterprise', billing:'Yearly',  expiryDate:'2026-11-03', status:'Active'    },
  { id:5,  orgName:'Bloom Digital',     adminEmail:'lena@bloomdigital.de', plan:'Starter',    billing:'Monthly', expiryDate:'2026-04-10', status:'Trial'     },
  { id:6,  orgName:'Crest Analytics',   adminEmail:'james@crest.ng',       plan:'Free',       billing:'—',       expiryDate:'—',          status:'Active'    },
  { id:7,  orgName:'Pinnacle Systems',  adminEmail:'yuki@pinnacle.jp',     plan:'Enterprise', billing:'Yearly',  expiryDate:'2026-12-12', status:'Active'    },
  { id:8,  orgName:'Dune Ventures',     adminEmail:'aisha@dune.ae',        plan:'Pro',        billing:'Monthly', expiryDate:'2025-12-18', status:'Expired'   },
  { id:9,  orgName:'Solaris Tech',      adminEmail:'carlos@solaris.mx',    plan:'Starter',    billing:'Monthly', expiryDate:'2026-07-02', status:'Active'    },
  { id:10, orgName:'Meridian Group',    adminEmail:'alice@meridian.fr',    plan:'Enterprise', billing:'Yearly',  expiryDate:'2026-10-28', status:'Active'    },
  { id:11, orgName:'Zephyr Cloud',      adminEmail:'noah@zephyr.kr',       plan:'Pro',        billing:'Monthly', expiryDate:'2026-08-14', status:'Active'    },
  { id:12, orgName:'Ironclad Security', adminEmail:'fatima@ironclad.sa',   plan:'Enterprise', billing:'Yearly',  expiryDate:'2026-09-09', status:'Active'    },
];

const ALERTS = [
  { id:1, type:'warning', icon: Clock,         msg: 'Bloom Digital trial ends in 3 days',          action: 'Extend' },
  { id:2, type:'danger',  icon: XCircle,        msg: 'Dune Ventures subscription expired',           action: 'Renew'  },
  { id:3, type:'warning', icon: AlertTriangle,  msg: 'Orbit Solutions payment failed — retry',       action: 'Retry'  },
  { id:4, type:'info',    icon: Bell,           msg: '4 subscriptions expiring this month',          action: 'View'   },
];

const ALERT_COLORS = { warning: '#f59e0b', danger: '#ef4444', info: '#6366f1' };

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, gradient, label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -3 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '20px', boxShadow: 'var(--card-shadow)', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'transform 0.3s' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: gradient, opacity: 0.1, filter: 'blur(20px)', pointerEvents: 'none' }} />
      <div style={{ width: 38, height: 38, borderRadius: '11px', background: gradient, display: 'grid', placeItems: 'center', marginBottom: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Icon size={17} color="white" />
      </div>
      <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '5px' }}>{label}</p>
      {sub && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>}
    </motion.div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ config, onConfirm, onCancel }) {
  if (!config) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'grid', placeItems: 'center', padding: '20px' }}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}
          style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.25)', textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: config.iconBg, display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <config.icon size={22} color={config.iconColor} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{config.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>{config.message}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: '11px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: '11px', border: 'none', background: config.confirmBg, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>{config.confirmLabel}</button>
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
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={15} /> {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TABS = ['Plans', 'Subscriptions', 'Revenue', 'Alerts'];

export default function SubscriptionPlansAdmin() {
  const [plans, setPlans]         = useState(SEED_PLANS);
  const [subs, setSubs]           = useState(SEED_SUBS);
  const [tab, setTab]             = useState('Plans');
  const [billing, setBilling]     = useState('monthly');
  const [planModal, setPlanModal] = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [toast, setToast]         = useState(null);
  const [alerts, setAlerts]       = useState(ALERTS);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── KPI stats ──
  const totalRevenue = useMemo(() => subs.filter(s => s.status === 'Active').reduce((acc, s) => {
    const p = plans.find(pl => pl.name === s.plan);
    return acc + (p ? (s.billing === 'Yearly' ? Math.round(p.priceYearly / 12) : p.priceMonthly) : 0);
  }, 0), [subs, plans]);

  const activeSubs   = subs.filter(s => s.status === 'Active').length;
  const expiredSubs  = subs.filter(s => s.status === 'Expired').length;
  const freeOrgs     = subs.filter(s => s.plan === 'Free').length;

  const planDistribution = useMemo(() => {
    const total = plans.reduce((a, p) => a + p.orgsCount, 0);
    return plans.map(p => ({ name: p.name, value: p.orgsCount, color: p.color, pct: total ? Math.round((p.orgsCount / total) * 100) : 0 }));
  }, [plans]);

  // ── Plan actions ──
  const handleSavePlan = (form) => {
    if (form.id) {
      setPlans(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p));
      showToast('Plan updated');
    } else {
      setPlans(prev => [...prev, { ...form, id: Date.now(), orgsCount: 0 }]);
      showToast('Plan created');
    }
    setPlanModal(null);
  };

  const handleDeletePlan = (plan) => {
    setConfirm({
      icon: XCircle, iconBg: 'rgba(239,68,68,0.1)', iconColor: '#ef4444',
      title: `Delete "${plan.name}" plan?`,
      message: 'Organizations on this plan will be moved to Free. This cannot be undone.',
      confirmLabel: 'Delete', confirmBg: '#ef4444',
      onConfirm: () => {
        setPlans(prev => prev.filter(p => p.id !== plan.id));
        setConfirm(null); showToast('Plan deleted', 'error');
      },
    });
  };

  const handleTogglePlan = (plan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: !p.active } : p));
    showToast(`Plan ${plan.active ? 'disabled' : 'activated'}`);
  };

  // ── Subscription actions ──
  const handleChangePlan = (sub) => {
    const next = plans.find(p => p.name !== sub.plan && p.active);
    if (next) {
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, plan: next.name } : s));
      showToast(`${sub.orgName} moved to ${next.name}`);
    }
  };

  const handleExtend = (sub) => {
    const d = new Date(sub.expiryDate);
    d.setMonth(d.getMonth() + 1);
    setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, expiryDate: d.toISOString().split('T')[0], status: 'Active' } : s));
    showToast(`${sub.orgName} extended by 30 days`);
  };

  const handleCancel = (sub) => {
    setConfirm({
      icon: XCircle, iconBg: 'rgba(239,68,68,0.1)', iconColor: '#ef4444',
      title: `Cancel subscription?`,
      message: `This will cancel ${sub.orgName}'s subscription immediately.`,
      confirmLabel: 'Cancel Subscription', confirmBg: '#ef4444',
      onConfirm: () => {
        setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Suspended' } : s));
        setConfirm(null); showToast('Subscription cancelled', 'error');
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%', padding: '28px' }}>
      <Toast toast={toast} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '4px' }}>Subscription Plans</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Manage pricing, features, and organization subscriptions</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Billing toggle */}
          <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '4px', gap: '2px' }}>
            {['monthly','yearly'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s', background: billing === b ? '#6366f1' : 'transparent', color: billing === b ? 'white' : 'var(--text-muted)' }}>
                {b === 'monthly' ? 'Monthly' : 'Yearly'}{b === 'yearly' && <span style={{ fontSize: '10px', marginLeft: '4px', color: billing === 'yearly' ? '#a5f3fc' : '#10b981' }}>-20%</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setPlanModal({})}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            + Create Plan
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        <KPICard icon={DollarSign}   gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" label="Monthly Revenue"       value={`$${totalRevenue.toLocaleString()}`} sub="From active subscriptions" delay={0}    />
        <KPICard icon={CheckCircle}  gradient="linear-gradient(135deg,#10b981,#34d399)" label="Active Subscriptions"  value={activeSubs}  sub={`${subs.length} total`}          delay={0.07} />
        <KPICard icon={AlertTriangle}gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" label="Expired Plans"         value={expiredSubs} sub="Need renewal"                    delay={0.14} />
        <KPICard icon={Users}        gradient="linear-gradient(135deg,#64748b,#94a3b8)" label="Free Tier Orgs"        value={freeOrgs}    sub="No revenue"                      delay={0.21} />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '4px', gap: '3px', width: 'fit-content', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.18s', background: tab === t ? '#6366f1' : 'transparent', color: tab === t ? 'white' : 'var(--text-muted)' }}>
            {t}
            {t === 'Alerts' && alerts.length > 0 && (
              <span style={{ marginLeft: '6px', background: tab === t ? 'rgba(255,255,255,0.25)' : '#ef4444', color: 'white', fontSize: '10px', fontWeight: '800', padding: '1px 6px', borderRadius: '99px' }}>{alerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Plans Tab ── */}
      <AnimatePresence mode="wait">
        {tab === 'Plans' && (
          <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
              {plans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} billing={billing} index={i}
                  onEdit={() => setPlanModal(plan)}
                  onDelete={() => handleDeletePlan(plan)}
                  onToggle={() => handleTogglePlan(plan)} />
              ))}
            </div>

            {/* Feature Matrix */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--card-shadow)', marginTop: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Feature Matrix</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Compare features across all plans</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', width: '200px' }}>FEATURE</th>
                    {plans.map(p => (
                      <th key={p.id} style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: p.color }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Leads Management','Contacts','Deals & Pipeline','Tasks & Activities','Email Integration','Reports & Analytics','Automation','API Access','Custom Fields','AI Assistant','White Labeling','Dedicated Support'].map((feat, fi) => (
                    <tr key={feat} style={{ borderBottom: '1px solid var(--card-border)', background: fi % 2 === 0 ? 'transparent' : 'var(--bg-darker)' }}>
                      <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{feat}</td>
                      {plans.map(p => (
                        <td key={p.id} style={{ padding: '10px 14px', textAlign: 'center' }}>
                          {p.features.includes(feat)
                            ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: p.color + '18', display: 'grid', placeItems: 'center', margin: '0 auto' }}><CheckCircle size={12} color={p.color} /></div>
                            : <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--card-border)', display: 'grid', placeItems: 'center', margin: '0 auto' }}><XCircle size={12} color="var(--text-muted)" /></div>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}

        {tab === 'Subscriptions' && (
          <motion.div key="subs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SubscriptionTable subscriptions={subs} onChangePlan={handleChangePlan} onExtend={handleExtend} onCancel={handleCancel} />
          </motion.div>
        )}

        {tab === 'Revenue' && (
          <motion.div key="rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RevenueChart planDistribution={planDistribution} />
          </motion.div>
        )}

        {tab === 'Alerts' && (
          <motion.div key="alerts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 12px', display: 'block' }} />
                All clear — no active alerts
              </div>
            )}
            {alerts.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `4px solid ${ALERT_COLORS[a.type]}`, borderRadius: '14px', boxShadow: 'var(--card-shadow)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: ALERT_COLORS[a.type] + '15', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <a.icon size={16} color={ALERT_COLORS[a.type]} />
                </div>
                <p style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{a.msg}</p>
                <button onClick={() => setAlerts(prev => prev.filter(x => x.id !== a.id))}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${ALERT_COLORS[a.type]}40`, background: ALERT_COLORS[a.type] + '10', color: ALERT_COLORS[a.type], fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  {a.action}
                </button>
                <button onClick={() => setAlerts(prev => prev.filter(x => x.id !== a.id))}
                  style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <XCircle size={13} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {planModal !== null && (
          <PlanFormModal plan={planModal?.id ? planModal : null} onSave={handleSavePlan} onClose={() => setPlanModal(null)} />
        )}
      </AnimatePresence>

      <ConfirmModal config={confirm} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} />

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 1100px) {
          .plans-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
