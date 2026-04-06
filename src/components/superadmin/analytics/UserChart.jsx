import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const USER_GROWTH = {
  '7d':  [{ d:'Mon',users:3820 },{ d:'Tue',users:3940 },{ d:'Wed',users:3880 },{ d:'Thu',users:4120 },{ d:'Fri',users:4380 },{ d:'Sat',users:4210 },{ d:'Sun',users:4520 }],
  '30d': [{ d:'W1',users:3200 },{ d:'W2',users:3600 },{ d:'W3',users:3900 },{ d:'W4',users:4520 }],
  '90d': [{ d:'Jan',users:2800 },{ d:'Feb',users:3100 },{ d:'Mar',users:3400 },{ d:'Apr',users:3800 },{ d:'May',users:4200 },{ d:'Jun',users:4520 }],
};

const ACTIVE_DATA = {
  '7d':  [{ d:'Mon',active:2100,inactive:1720 },{ d:'Tue',active:2280,inactive:1660 },{ d:'Wed',active:2050,inactive:1830 },{ d:'Thu',active:2400,inactive:1720 },{ d:'Fri',active:2600,inactive:1780 },{ d:'Sat',active:2200,inactive:2010 },{ d:'Sun',active:2700,inactive:1820 }],
  '30d': [{ d:'W1',active:1800,inactive:1400 },{ d:'W2',active:2100,inactive:1500 },{ d:'W3',active:2300,inactive:1600 },{ d:'W4',active:2700,inactive:1820 }],
  '90d': [{ d:'Jan',active:1500,inactive:1300 },{ d:'Feb',active:1700,inactive:1400 },{ d:'Mar',active:1900,inactive:1500 },{ d:'Apr',active:2200,inactive:1600 },{ d:'May',active:2500,inactive:1700 },{ d:'Jun',active:2700,inactive:1820 }],
};

function ChartToggle({ options, value, onChange }) {
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
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: '700' }}>{p.name}: {p.value?.toLocaleString()}</p>)}
    </div>
  );
}

export default function UserChart({ range }) {
  const [growthRange, setGrowthRange] = useState(range || '90d');
  const [activeRange, setActiveRange] = useState(range || '90d');

  const OPTS = ['7d', '30d', '90d'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
      {/* User Growth Line */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>User Growth</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Total registered users over time</p>
          </div>
          <ChartToggle options={OPTS} value={growthRange} onChange={setGrowthRange} />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={USER_GROWTH[growthRange]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="users" name="Users" stroke="#6366f1" strokeWidth={2.5}
              dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Active vs Inactive Bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Active vs Inactive</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>User engagement comparison</p>
          </div>
          <ChartToggle options={OPTS} value={activeRange} onChange={setActiveRange} />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ACTIVE_DATA[activeRange]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="active"   name="Active"   fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="inactive" name="Inactive" fill="#e2e8f0" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
