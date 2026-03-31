import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  FileText, Plus, Download, Filter, Search, 
  TrendingUp, Users, DollarSign, PieChart as PieChartIcon, 
  BarChart2, Calendar, Target, ChevronRight, Eye, Trash2, 
  Copy, Mail, MoreHorizontal, Share2, Printer
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getCRMStats, getMonthlyRevenue, getLeadsBySource, getPipelineData } from '../../utils/reportUtils';
import { INITIAL_CAMPAIGNS } from '../../data/mockCampaigns';
import ReportBuilder from '../../components/reports/ReportBuilder';
import ReportView from '../../components/reports/ReportView';

const PREBUILT_REPORTS = [
  { id: 'rep-1', name: 'Annual Sales Pipeline', module: 'Deals', type: 'Funnel', category: 'Sales' },
  { id: 'rep-2', name: 'Revenue by Monthly Target', module: 'Deals', type: 'Line', category: 'Sales' },
  { id: 'rep-3', name: 'Lead Source Distribution', module: 'Leads', type: 'Pie', category: 'Leads' },
  { id: 'rep-4', name: 'Campaign ROI Analysis', module: 'Campaigns', type: 'Bar', category: 'Campaigns' },
  { id: 'rep-5', name: 'Conversion Rate by Owner', module: 'Leads', type: 'Table', category: 'Sales' },
  { id: 'rep-6', name: 'Activity Summary (Calls/Meetings)', module: 'Activities', type: 'Bar', category: 'Activities' },
];

export default function Reports() {
  const { isDark } = useTheme();
  const [activeReport, setActiveReport] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Load Data
  const leads = useMemo(() => {
    // Attempting to replicate INITIAL_LEADS from Leads.jsx if localStorage is empty
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Alice Johnson', status: 'New', source: 'Website', date: '2026-03-24' },
        { id: 2, name: 'Robert Brown', status: 'Contacted', source: 'Ads', date: '2026-03-23' },
        { id: 3, name: 'Emma Wilson', status: 'Qualified', source: 'Referral', date: '2026-03-22' },
        { id: 4, name: 'Sophia Martinez', status: 'Converted', source: 'Event', date: '2026-03-20' },
        { id: 5, name: 'Noah Clark', status: 'Contacted', source: 'Website', date: '2026-03-17' },
    ];
  }, []);

  const deals = useMemo(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Acme Enterprise License', amount: 150000, stage: 'proposal', closeDate: '2026-05-15' },
        { id: 2, name: 'Globex Cloud Platform', amount: 80000, stage: 'qualified', closeDate: '2026-06-01' },
        { id: 3, name: 'Nova CRM Implementation', amount: 65000, stage: 'converted', closeDate: '2026-03-15' },
        { id: 4, name: 'TechCorp Analytics Suite', amount: 220000, stage: 'new', closeDate: '2026-07-10' },
    ];
  }, []);

  const campaigns = useMemo(() => {
    const saved = localStorage.getItem('crm_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  }, []);

  const stats = useMemo(() => getCRMStats(leads, deals, campaigns), [leads, deals, campaigns]);
  const monthlyRevenue = useMemo(() => getMonthlyRevenue(deals), [deals]);
  const leadsBySource = useMemo(() => getLeadsBySource(leads), [leads]);
  const pipelineData = useMemo(() => getPipelineData(deals), [deals]);

  const filteredReports = PREBUILT_REPORTS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const chartColors = ['#2563eb', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#ec4899'];

  const cardStyle = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.5px' }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>Real-time business insights and performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setIsBuilderOpen(true)} className="b24-btn b24-btn-primary" style={{ padding: '10px 20px', borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Create Report
          </button>
          <button className="b24-btn b24-btn-secondary" style={{ padding: '10px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: '#3b82f6', change: '+12.4%' },
          { label: 'Won Deals', value: stats.wonDeals, icon: Target, color: '#10b981', change: '+6.2%' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: '#8b5cf6', change: '+2.1%' },
          { label: 'Avg Deal Size', value: stats.avgDealSize, icon: BarChart2, color: '#f59e0b', change: '-1.5%' }
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}10`, color: s.color, display: 'grid', placeItems: 'center' }}>
                 <s.icon size={22} />
               </div>
               <span style={{ fontSize: 11, fontWeight: 900, color: s.change.startsWith('+') ? '#10b981' : '#ef4444', background: `${s.change.startsWith('+') ? '#10b981' : '#ef4444'}10`, padding: '2px 8px', borderRadius: 20 }}>
                 {s.change}
               </span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>
              {typeof s.value === 'number' && s.label.includes('Revenue') ? '₹'+s.value.toLocaleString() : (typeof s.value === 'number' && s.label.includes('Size') ? '₹'+Math.round(s.value).toLocaleString() : s.value)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 24, marginBottom: 40 }}>
        {/* Sales Pipeline */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Sales Pipeline Breakdown</h2>
            <select className="b24-select" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, width: 120 }}>
              <option>Last 12 Months</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div style={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--input-bg)' }}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Distribution */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Leads by Source</h2>
            <PieChartIcon size={18} color="var(--text-muted)" />
          </div>
          <div style={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={leadsBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={100} paddingAngle={5} stroke="none"
                >
                  {leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports Directory */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Reports Directory</h2>
          <div style={{ display: 'flex', gap: 12, width: 400 }}>
             <div style={{ position: 'relative', flex: 1 }}>
               <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
               <input 
                 value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                 className="b24-input" placeholder="Search reports..." style={{ paddingLeft: 36, borderRadius: 8, fontSize: 12 }} 
               />
             </div>
             <select 
               value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
               className="b24-select" style={{ width: 150, borderRadius: 8, fontSize: 12 }}
             >
                <option value="All">All Categories</option>
                <option value="Sales">Sales</option>
                <option value="Leads">Leads</option>
                <option value="Campaigns">Campaigns</option>
                <option value="Activities">Activities</option>
             </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                   <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Report Name</th>
                   <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Module</th>
                   <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Visibility</th>
                   <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                 {filteredReports.map(report => (
                   <tr key={report.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'}
                     onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                   >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                           <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', display: 'grid', placeItems: 'center', color: '#3b82f6' }}>
                             <FileText size={16} />
                           </div>
                           <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{report.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{report.module}</span>
                      </td>
                      <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                            <Users size={12} /> Standard
                         </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', gap: 8 }}>
                           <button onClick={() => setActiveReport(report)} className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 6 }}><Eye size={14}/></button>
                           <button className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 6 }}><Share2 size={14}/></button>
                           <button className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 6 }}><Download size={14}/></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <AnimatePresence>
        {isBuilderOpen && (
          <ReportBuilder onClose={() => setIsBuilderOpen(false)} onSave={(newRep) => { PREBUILT_REPORTS.push(newRep); setIsBuilderOpen(false); }} />
        )}
        {activeReport && (
          <ReportView report={activeReport} onClose={() => setActiveReport(null)} leads={leads} deals={deals} />
        )}
      </AnimatePresence>

    </div>
  );
}
