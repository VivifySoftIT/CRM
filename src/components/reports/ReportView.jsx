import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Download, Printer, Share2, Filter, 
  BarChart3, PieChart, LineChart, Table as TableIcon, 
  ChevronDown, Calendar, Search, MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart as ReLineChart, Line, 
  PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { getPipelineData, getMonthlyRevenue, getLeadsBySource } from '../../utils/reportUtils';

export default function ReportView({ report, onClose, leads, deals }) {
  const { isDark } = useTheme();

  const reportData = useMemo(() => {
    if (report.module === 'Deals') return getPipelineData(deals);
    if (report.module === 'Leads') return getLeadsBySource(leads);
    if (report.module === 'Campaigns') return [{ name: 'Email', value: 45000 }, { name: 'SMS', value: 12000 }, { name: 'Social', value: 28000 }];
    return getMonthlyRevenue(deals);
  }, [report, leads, deals]);

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#ec4899'];

  const renderChart = () => {
    if (report.type === 'Pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RePieChart>
            <Pie data={reportData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
              {reportData.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }} />
            <Legend verticalAlign="bottom" height={36} />
          </RePieChart>
        </ResponsiveContainer>
      );
    }
    
    if (report.type === 'Line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ReLineChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'var(--input-bg)' }} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }} />
          <Bar dataKey={reportData[0]?.amount ? 'amount' : 'value'} fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 110, backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ background: modalBg, width: '100%', maxWidth: 1000, height: '90vh', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ChevronDown size={24} style={{ transform: 'rotate(90deg)' }} /></button>
             <div>
               <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{report.name}</h2>
               <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                 <Calendar size={12} /> Last run: Just now · Module: {report.module}
               </div>
             </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary" style={{ padding: '8px 16px', borderRadius: 8 }}><Share2 size={16} /> Share</button>
            <button className="b24-btn b24-btn-secondary" style={{ padding: '8px 16px', borderRadius: 8 }}><Download size={16} /> Export</button>
            <button className="b24-btn b24-btn-primary" style={{ padding: '8px 24px', borderRadius: 8, background: '#10b981' }}><Printer size={16} /> Print</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
           {/* Summary Ribbon */}
           <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '20px 24px', borderRadius: 16, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${border}` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Report Type</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}><BarChart3 size={14} color="#3b82f6" /> {report.type} Visualization</div>
              </div>
              <div style={{ width: 1, background: border }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Aggregation</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>Count of Records</div>
              </div>
              <div style={{ width: 1, background: border }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Data Scope</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>All Time</div>
              </div>
           </div>

           {/* Chart */}
           <div style={{ marginBottom: 40, padding: 24, borderRadius: 20, border: `1px solid ${border}`, background: 'var(--card-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                 <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Visual Summary</h3>
                 <div style={{ display: 'flex', gap: 8 }}>
                    <button className="b24-btn b24-btn-secondary" style={{ padding: 6 }}><Filter size={14}/></button>
                    <button className="b24-btn b24-btn-secondary" style={{ padding: 6 }}><MoreHorizontal size={14}/></button>
                 </div>
              </div>
              {renderChart()}
           </div>

           {/* Data Table */}
           <div style={{ borderRadius: 20, border: `1px solid ${border}`, background: 'var(--card-bg)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Data Feed</h3>
                 <div style={{ position: 'relative' }}>
                    <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                    <input className="b24-input" placeholder="Search rows..." style={{ paddingLeft: 30, borderRadius: 6, fontSize: 11, height: 32 }} />
                 </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb' }}>
                    <tr>
                       <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: `1px solid ${border}` }}>Category</th>
                       <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: `1px solid ${border}` }}>Count</th>
                       <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: `1px solid ${border}` }}>% of Total</th>
                    </tr>
                 </thead>
                 <tbody>
                    {reportData.map((row, i) => {
                       const total = reportData.reduce((s, r) => s + (r.value || 0), 0) || 1;
                       const pct = (((row.value || 0) / total) * 100).toFixed(1);
                       return (
                        <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                           <td style={{ padding: '14px 24px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</td>
                           <td style={{ padding: '14px 24px', fontSize: 13, fontWeight: 800, color: '#3b82f6' }}>{row.value || '₹' + row.amount.toLocaleString()}</td>
                           <td style={{ padding: '14px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                 <div style={{ flex: 1, height: 6, borderRadius: 10, background: 'var(--input-bg)', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: chartColors[i % chartColors.length] }} />
                                 </div>
                                 <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', minWidth: 40 }}>{pct}%</span>
                              </div>
                           </td>
                        </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
