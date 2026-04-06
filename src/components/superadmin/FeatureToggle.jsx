import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureToggle({ label, checked, onChange, color = '#6366f1', disabled = false }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 12px', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer',
        border: `1.5px solid ${checked ? color + '40' : 'var(--card-border)'}`,
        background: checked ? color + '08' : 'var(--bg-darker)',
        transition: 'all 0.18s', opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.borderColor = color + '60'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = checked ? color + '40' : 'var(--card-border)'; }}
    >
      <span style={{ fontSize: '12px', fontWeight: '600', color: checked ? color : 'var(--text-secondary)' }}>{label}</span>
      {/* Toggle pill */}
      <div style={{
        width: 36, height: 20, borderRadius: '99px', flexShrink: 0,
        background: checked ? color : 'var(--card-border)',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <motion.div
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        />
      </div>
    </div>
  );
}
