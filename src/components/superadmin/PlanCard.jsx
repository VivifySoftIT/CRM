import React from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Trash2, Power, Star, Users, Database, Zap } from 'lucide-react';

const PLAN_META = {
  Free:       { gradient: 'linear-gradient(135deg,#64748b,#94a3b8)', glow: 'rgba(100,116,139,0.2)' },
  Starter:    { gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)', glow: 'rgba(59,130,246,0.2)'  },
  Pro:        { gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)', glow: 'rgba(139,92,246,0.25)' },
  Enterprise: { gradient: 'linear-gradient(135deg,#f59e0b,#f97316)', glow: 'rgba(245,158,11,0.2)'  },
};

export default function PlanCard({ plan, billing, onEdit, onDelete, onToggle, index }) {
  const meta   = PLAN_META[plan.name] || PLAN_META.Starter;
  const price  = billing === 'yearly' ? Math.round(plan.priceMonthly * 10) : plan.priceMonthly;
  const period = billing === 'yearly' ? '/yr' : '/mo';
  const saving = billing === 'yearly' ? Math.round(plan.priceMonthly * 2) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, boxShadow: `0 28px 60px ${meta.glow}` }}
      style={{
        background: 'var(--card-bg)',
        border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--card-border)',
        borderRadius: '22px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        opacity: plan.active ? 1 : 0.6,
        transition: 'box-shadow 0.3s, transform 0.3s',
        boxShadow: plan.popular ? `0 8px 32px ${meta.glow}` : 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Background orb */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: meta.gradient, opacity: 0.08, filter: 'blur(30px)', pointerEvents: 'none' }} />

      {/* Popular badge */}
      {plan.popular && (
        <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '99px', background: meta.gradient, fontSize: '10px', fontWeight: '800', color: 'white', letterSpacing: '0.04em' }}>
          <Star size={9} fill="white" /> POPULAR
        </div>
      )}

      {/* Status dot */}
      {!plan.active && (
        <div style={{ position: 'absolute', top: 18, right: 18, padding: '3px 10px', borderRadius: '99px', background: 'rgba(239,68,68,0.1)', fontSize: '10px', fontWeight: '800', color: '#ef4444' }}>
          DISABLED
        </div>
      )}

      {/* Icon + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: meta.gradient, display: 'grid', placeItems: 'center', boxShadow: `0 6px 18px ${meta.glow}`, flexShrink: 0 }}>
          <Zap size={20} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>{plan.name}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{plan.description}</p>
        </div>
      </div>

      {/* Price */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>$</span>
          <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-2px', lineHeight: 1 }}>
            {price === 0 ? '0' : price.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{period}</span>
        </div>
        {saving > 0 && (
          <p style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>Save ${saving}/yr vs monthly</p>
        )}
        {price === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Free forever</p>}
      </div>

      {/* Limits */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { icon: Users,    label: `${plan.maxUsers === 999 ? 'Unlimited' : plan.maxUsers} users` },
          { icon: Database, label: `${plan.storage} storage` },
          { icon: Zap,      label: `${plan.maxLeads === 999999 ? 'Unlimited' : plan.maxLeads.toLocaleString()} leads` },
        ].map(({ icon: Ic, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ic size={13} color={plan.color} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--card-border)' }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
        {plan.features.slice(0, 6).map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: plan.color + '18', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Check size={9} color={plan.color} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{f}</span>
          </div>
        ))}
        {plan.features.length > 6 && (
          <p style={{ fontSize: '11px', color: plan.color, fontWeight: '700', marginTop: '2px' }}>+{plan.features.length - 6} more features</p>
        )}
      </div>

      {/* Orgs using */}
      <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Organizations</span>
        <span style={{ fontSize: '14px', fontWeight: '800', color: plan.color }}>{plan.orgsCount}</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onEdit}
          style={{ flex: 1, padding: '9px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', transition: 'all 0.15s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#f59e0b18'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = '#f59e0b40'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
          <Edit2 size={13} /> Edit
        </button>
        <button onClick={onToggle}
          style={{ flex: 1, padding: '9px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: plan.active ? '#10b981' : '#ef4444', transition: 'all 0.15s' }}
          onMouseOver={e => { const c = plan.active ? '#10b981' : '#ef4444'; e.currentTarget.style.background = c + '18'; e.currentTarget.style.borderColor = c + '40'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
          <Power size={13} /> {plan.active ? 'Active' : 'Disabled'}
        </button>
        <button onClick={onDelete}
          style={{ width: 36, height: 36, borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseOver={e => { e.currentTarget.style.background = '#ef444418'; e.currentTarget.style.borderColor = '#ef444440'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-darker)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
          <Trash2 size={13} color="#ef4444" />
        </button>
      </div>
    </motion.div>
  );
}
