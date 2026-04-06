import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

export default function KPISection({ kpis, delay = 0 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '24px' }}>
      {kpis.map((kpi, i) => {
        const count = useCountUp(kpi.value);
        return (
          <motion.div key={kpi.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '18px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'box-shadow 0.3s, transform 0.3s',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            {/* Gradient orb */}
            <div style={{
              position: 'absolute', top: -24, right: -24, width: 100, height: 100,
              borderRadius: '50%', background: kpi.gradient, opacity: 0.1, filter: 'blur(24px)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '12px', background: kpi.gradient,
                display: 'grid', placeItems: 'center',
                boxShadow: `0 6px 16px ${kpi.gradient.includes('34,197') ? 'rgba(34,197,94,0.25)' : kpi.gradient.includes('99,102') ? 'rgba(99,102,241,0.25)' : kpi.gradient.includes('245,158') ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)'}`,
              }}>
                <kpi.icon size={17} color="white" />
              </div>
              {kpi.trend && (
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  color: kpi.trendUp ? '#10b981' : '#ef4444',
                  background: kpi.trendUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: '3px 8px', borderRadius: '99px',
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}>
                  {kpi.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {kpi.trend}
                </span>
              )}
            </div>

            <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
              {kpi.prefix}{count.toLocaleString()}{kpi.suffix}
            </p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '5px' }}>{kpi.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
