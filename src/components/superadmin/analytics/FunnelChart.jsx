import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FUNNEL_STEPS = [
  { label: 'Leads',     value: 12400, color: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { label: 'Contacts',  value: 8200,  color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { label: 'Deals',     value: 4100,  color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
  { label: 'Customers', value: 1840,  color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
];

export default function FunnelChart() {
  const max = FUNNEL_STEPS[0].value;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)', marginBottom: '18px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Lead Conversion Funnel</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Lead → Contact → Deal → Customer</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', alignItems: 'end' }}>
        {FUNNEL_STEPS.map((step, i) => {
          const pct = Math.round((step.value / max) * 100);
          const conv = i > 0 ? Math.round((step.value / FUNNEL_STEPS[i-1].value) * 100) : 100;
          return (
            <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {/* Conversion rate badge */}
              {i > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '99px', background: 'var(--bg-darker)', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  <ArrowRight size={10} /> {conv}%
                </div>
              )}
              {i === 0 && <div style={{ height: '24px' }} />}

              {/* Bar */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{step.value.toLocaleString()}</p>
                <div style={{ width: '100%', height: '120px', background: 'var(--bg-darker)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', background: step.gradient, borderRadius: '10px 10px 0 0' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: step.color }}>{step.label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{pct}% of total</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
        {[
          { label: 'Lead → Contact', value: `${Math.round((8200/12400)*100)}%`, color: '#3b82f6' },
          { label: 'Contact → Deal', value: `${Math.round((4100/8200)*100)}%`,  color: '#10b981' },
          { label: 'Deal → Customer',value: `${Math.round((1840/4100)*100)}%`,  color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-darker)', borderRadius: '10px' }}>
            <p style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
