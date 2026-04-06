import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MONTHLY_DATA = {
  Monthly: [
    { m: 'Jan', revenue: 18400, subs: 62 },
    { m: 'Feb', revenue: 22100, subs: 71 },
    { m: 'Mar', revenue: 19800, subs: 68 },
    { m: 'Apr', revenue: 26500, subs: 84 },
    { m: 'May', revenue: 31200, subs: 96 },
    { m: 'Jun', revenue: 28900, subs: 91 },
    { m: 'Jul', revenue: 34600, subs: 108 },
    { m: 'Aug', revenue: 38100, subs: 118 },
    { m: 'Sep', revenue: 42500, subs: 130 },
    { m: 'Oct', revenue: 39800, subs: 124 },
    { m: 'Nov', revenue: 45200, subs: 138 },
    { m: 'Dec', revenue: 51000, subs: 152 },
  ],
  Quarterly: [
    { m: 'Q1', revenue: 60300, subs: 71 },
    { m: 'Q2', revenue: 86600, subs: 96 },
    { m: 'Q3', revenue: 115200, subs: 130 },
    { m: 'Q4', revenue: 136000, subs: 152 },
  ],
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '13px' }}>
      <p style={{ fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: '700' }}>
          {p.name}: {p.name === 'Revenue' ? `$${p.value?.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

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

export default function RevenueChart({ planDistribution }) {
  const [period, setPeriod] = useState('Monthly');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
      {/* Revenue Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Revenue Overview</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Subscription revenue over time</p>
          </div>
          <Toggle options={['Monthly','Quarterly']} value={period} onChange={setPeriod} />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_DATA[period]} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Plan Distribution Donut */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Plan Distribution</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Organizations per plan</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
              {planDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v} orgs`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
          {planDistribution.map(p => (
            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: 9, height: 9, borderRadius: '3px', background: p.color }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{p.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{p.value}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
