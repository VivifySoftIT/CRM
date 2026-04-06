import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const REV_DATA = {
  '7d':  [{ d:'Mon',rev:4200 },{ d:'Tue',rev:5100 },{ d:'Wed',rev:4800 },{ d:'Thu',rev:6200 },{ d:'Fri',rev:7100 },{ d:'Sat',rev:5500 },{ d:'Sun',rev:6400 }],
  '30d': [{ d:'W1',rev:28000 },{ d:'W2',rev:34000 },{ d:'W3',rev:31000 },{ d:'W4',rev:42000 }],
  '90d': [{ d:'Jan',rev:98000 },{ d:'Feb',rev:112000 },{ d:'Mar',rev:108000 },{ d:'Apr',rev:128000 },{ d:'May',rev:142000 },{ d:'Jun',rev:158000 }],
};

const PLAN_DIST = [
  { name:'Enterprise', value:42, color:'#f59e0b' },
  { name:'Pro',        value:35, color:'#8b5cf6' },
  { name:'Starter',    value:16, color:'#3b82f6' },
  { name:'Free',       value:7,  color:'#e2e8f0' },
];

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-darker)', borderRadius: '9px', padding: '3px', gap: '2px' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', transition: 'all 0.2s', background: value === o ? 'var(--card-bg)' : 'transparent', color: value === o ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: value === o ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px' }}>
      <p style={{ fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: '700' }}>Revenue: ${p.value?.toLocaleString()}</p>)}
    </div>
  );
}

export default function RevenueAnalytics() {
  const [range, setRange] = useState('90d');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '18px', marginBottom: '18px' }}>
      {/* Revenue Bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Revenue Trend</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Monthly subscription income</p>
          </div>
          <Toggle options={['7d','30d','90d']} value={range} onChange={setRange} />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REV_DATA[range]} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rev" name="Revenue" radius={[6,6,0,0]}>
              {REV_DATA[range].map((_, i) => (
                <Cell key={i} fill={`url(#revGrad${i})`} />
              ))}
            </Bar>
            <defs>
              {REV_DATA[range].map((_, i) => (
                <linearGradient key={i} id={`revGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revenue by Plan Donut */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Revenue by Plan</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>Contribution per tier</p>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
              {PLAN_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v}%`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
          {PLAN_DIST.map(p => (
            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: 9, height: 9, borderRadius: '3px', background: p.color }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{p.name}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{p.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
