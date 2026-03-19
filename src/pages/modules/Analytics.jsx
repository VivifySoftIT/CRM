import React from 'react';
import { 
  BarChart3, TrendingUp,
  Award, Target, Info, RefreshCw,
  Filter, Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const stats = [
        { title: "Total Revenue", value: "$45,280", trend: "+12.5%", color: "var(--success)" },
        { title: "Avg Deal Size", value: "$3,200", trend: "-2.4%", color: "var(--danger)" },
        { title: "Win Rate", value: "68%", trend: "+5.1%", color: "var(--primary)" },
        { title: "New Deals", value: "24", trend: "+18.2%", color: "var(--accent)" }
    ];

    const pipelineStats = [
        { label: "New Leads", count: 120, pct: "40%" },
        { label: "In Discussions", count: 85, pct: "30%" },
        { label: "Contract Sent", count: 45, pct: "15%" },
        { label: "Closed Won", count: 30, pct: "10%" },
        { label: "Closed Lost", count: 15, pct: "5%" }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Analytics Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Enterprise Analytics Dashboard <BarChart3 size={20} className="text-primary" />
                    </h4>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Filter size={18} /> Time: Last 30 Days
                    </button>
                    <button className="btn-primary">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {stats.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        key={i} className="glass-card" 
                        style={{ padding: '24px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                            {stat.title} <TrendingUp size={16} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                            <h3 style={{ fontSize: '28px' }}>{stat.value}</h3>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: stat.color }}>{stat.trend}</span>
                        </div>
                        <div style={{ marginTop: '20px', height: '4px', width: '100%', background: 'rgba(0, 0, 0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: stat.trend.includes('+') ? '70%' : '30%', background: stat.color }}></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* Visual Report */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            Revenue Projections <Award size={20} color="var(--primary)" />
                        </h4>
                        <RefreshCw size={18} color="var(--text-secondary)" cursor="pointer" />
                    </div>
                    
                    {/* Mock Graph */}
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px' }}>
                        {[40, 65, 55, 80, 70, 95, 85].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                                <motion.div 
                                    initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                    style={{ 
                                        width: '100%', 
                                        background: i === 5 ? 'linear-gradient(180deg, var(--primary), var(--accent))' : 'rgba(99, 102, 241, 0.2)', 
                                        borderRadius: '12px 12px 4px 4px' 
                                    }} 
                                />
                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>M {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel Widget */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Sales Funnel <Target size={20} color="var(--secondary)" />
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {pipelineStats.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    {item.label} <span>{item.count} ({item.pct})</span>
                                </div>
                                <div style={{ height: '6px', width: '100%', background: 'rgba(0, 0, 0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: item.pct, background: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card" style={{ marginTop: '32px', background: 'rgba(0, 0, 0,0.05)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: 'none' }}>
                        <div style={{ color: 'var(--accent)' }}><Info size={18} /></div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current win rate is 5% higher than last quarter. Keep it up!</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
