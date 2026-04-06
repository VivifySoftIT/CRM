import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Activity, DollarSign, UserPlus, TrendingUp,
  Download, Filter, AlertTriangle, XCircle, ShieldAlert, Server,
  CheckCircle, Eye, ChevronDown
} from 'lucide-react';
import KPISection       from '../../components/superadmin/analytics/KPISection';
import UserChart        from '../../components/superadmin/analytics/UserChart';
import RevenueAnalytics from '../../components/superadmin/analytics/RevenueAnalytics';
import FunnelChart      from '../../components/superadmin/analytics/FunnelChart';
import ActivityPanel    from '../../components/superadmin/analytics/ActivityPanel';

// ─── Data ─────────────────────────────────────────────────────────────────────
const KPI_DATA = [
  { icon: Building2,  gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', label: 'Total Organizations', value: 142,    trend: '+8%',  trendUp: true  },
  { icon: Activity,   gradient: 'linear-gradient(135deg,#10b981,#34d399)', label: 'Active Users (DAU)',  value: 2740,   trend: '+5%',  trendUp: true  },
  { icon: DollarSign, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', label: 'Monthly Revenue',     value: 142500, prefix: '$',   trend: '+18%', trendUp: true  },
  { icon: UserPlus,   gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)', label: 'New Signups',         value: 384,    trend: '+22%', trendUp: true  },
  { icon: TrendingUp, gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)', label: 'Conversion Rate',     value: 14,     suffix: '%',   trend: '+2%',  trendUp: true  },
];

const ORG_PERF = [
  { name:'Nexus Corp',        users:248, plan:'Enterprise', revenue:'$2,450', status:'Active',    contribution: 18 },
  { name:'Apex Dynamics',     users:312, plan:'Enterprise', revenue:'$2,450', status:'Active',    contribution: 18 },
  { name:'Meridian Group',    users:420, plan:'Enterprise', revenue:'$2,450', status:'Active',    contribution: 18 },
  { name:'Pinnacle Systems',  users:190, plan:'Enterprise', revenue:'$2,450', status:'Active',    contribution: 18 },
  { name:'Velocity Labs',     users:84,  plan:'Pro',        revenue:'$299',   status:'Active',    contribution: 6  },
  { name:'Zephyr Cloud',      users:73,  plan:'Pro',        revenue:'$299',   status:'Active',    contribution: 6  },
  { name:'Orbit Solutions',   users:61,  plan:'Pro',        revenue:'$299',   status:'Suspended', contribution: 0  },
  { name:'Bloom Digital',     users:22,  plan:'Starter',    revenue:'$99',    status:'Trial',     contribution: 2  },
];

const FEATURE_USAGE = [
  { name: 'Leads Management', usage: 94, color: '#6366f1' },
  { name: 'Contacts',         usage: 88, color: '#3b82f6' },
  { name: 'Deals & Pipeline', usage: 76, color: '#10b981' },
  { name: 'Reports',          usage: 62, color: '#f59e0b' },
  { name: 'Automation',       usage: 48, color: '#8b5cf6' },
  { name: 'API Access',       usage: 34, color: '#ec4899' },
  { name: 'AI Assistant',     usage: 28, color: '#ef4444' },
  { name: 'Campaigns',        usage: 55, color: '#06b6d4' },
];

const ALERTS = [
  { id:1, type:'danger',  icon: XCircle,      msg: 'Payment failed — Dune Ventures ($999)',       time: '10m ago' },
  { id:2, type:'warning', icon: AlertTriangle, msg: 'Orbit Solutions subscription expires in 3d',  time: '1h ago'  },
  { id:3, type:'danger',  icon: ShieldAlert,   msg: 'Suspicious login detected — Crest Analytics', time: '2h ago'  },
  { id:4, type:'warning', icon: Server,        msg: 'API latency spike — avg 840ms',               time: '3h ago'  },
];

const ALERT_COLORS = { danger: '#ef4444', warning: '#f59e0b' };

const PLAN_BADGE = {
  Enterprise: { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
  Pro:        { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6' },
  Starter:    { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  Free:       { bg: 'rgba(148,163,184,0.1)', color: '#64748b' },
};

const STATUS_BADGE = {
  Active:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  Suspended: { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  Trial:     { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ title, sub, children, delay = 0, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</h3>
          {sub && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function DropBtn({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
        {label}: {value} <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', zIndex: 50, minWidth: '130px', overflow: 'hidden' }}>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: value === o ? 'rgba(99,102,241,0.06)' : 'transparent', color: value === o ? '#6366f1' : 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {o}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsAdmin() {
  const [range, setRange]       = useState('30d');
  const [planFilter, setPlan]   = useState('All');
  const [alerts, setAlerts]     = useState(ALERTS);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Platform insights & performance overview</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <DropBtn label="Range" options={['7d','30d','90d']} value={range} onChange={setRange} />
          <DropBtn label="Plan"  options={['All','Free','Starter','Pro','Enterprise']} value={planFilter} onChange={setPlan} />
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <KPISection kpis={KPI_DATA} />

      {/* ── Main grid: charts + activity panel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '18px', alignItems: 'start' }}>
        <div>
          {/* User Charts */}
          <UserChart range={range} />

          {/* Revenue Charts */}
          <RevenueAnalytics />

          {/* Funnel */}
          <FunnelChart />

          {/* Org Performance Table */}
          <SectionCard title="Organization Performance" sub="Revenue contribution by organization" delay={0.35}
            action={
              <button style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                View all
              </button>
            }>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    {['Organization','Users','Plan','Revenue','Contribution','Status'].map(h => (
                      <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em', background: 'var(--bg-darker)' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORG_PERF.map((org, i) => {
                    const plan   = PLAN_BADGE[org.plan]   || PLAN_BADGE.Free;
                    const status = STATUS_BADGE[org.status] || STATUS_BADGE.Active;
                    return (
                      <tr key={org.name}
                        style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '11px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>{org.name[0]}</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{org.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.users}</td>
                        <td style={{ padding: '11px 12px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '99px', background: plan.bg, color: plan.color }}>{org.plan}</span>
                        </td>
                        <td style={{ padding: '11px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{org.revenue}<span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>/mo</span></td>
                        <td style={{ padding: '11px 12px', minWidth: '100px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '5px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${org.contribution}%` }} transition={{ delay: 0.5 + i * 0.04, duration: 0.6 }}
                                style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '99px' }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', flexShrink: 0 }}>{org.contribution}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 12px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '99px', background: status.bg, color: status.color, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.color }} />
                            {org.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Feature Usage */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)', marginTop: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Feature Usage</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '18px' }}>Module adoption across all organizations</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FEATURE_USAGE.map((f, i) => (
                <div key={f.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{f.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: f.color }}>{f.usage}%</span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--card-border)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.usage}%` }}
                      transition={{ delay: 0.45 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', background: `linear-gradient(90deg,${f.color},${f.color}99)`, borderRadius: '99px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)', marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Active Alerts</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Issues requiring attention</p>
              </div>
              {alerts.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 9px', borderRadius: '99px' }}>
                  {alerts.length} active
                </span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                <CheckCircle size={28} color="#10b981" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: '13px', fontWeight: '600' }}>All clear — no active alerts</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {alerts.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: ALERT_COLORS[a.type] + '08', borderLeft: `3px solid ${ALERT_COLORS[a.type]}` }}>
                    <a.icon size={15} color={ALERT_COLORS[a.type]} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.msg}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{a.time}</p>
                    </div>
                    <button onClick={() => setAlerts(prev => prev.filter(x => x.id !== a.id))}
                      style={{ width: 24, height: 24, borderRadius: '6px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <XCircle size={12} color="var(--text-muted)" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right: Activity Panel ── */}
        <ActivityPanel />
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1100px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
