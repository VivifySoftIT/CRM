import React from 'react';
import { Megaphone, Mail, MousePointerClick, Eye, Filter, Plus, PieChart, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Marketing = () => {
    const campaigns = [
        { id: "C-1", name: "Q1 Product Update", type: "Email Newsletter", sent: 1250, openRate: "42%", clickRate: "12%", status: "Completed" },
        { id: "C-2", name: "Webinar Invite: Enterprise CRM", type: "Email Invite", sent: 4500, openRate: "28%", clickRate: "5%", status: "Active" },
        { id: "C-3", name: "Cold Lead Reactivation", type: "Automated Sequence", sent: 320, openRate: "15%", clickRate: "2%", status: "Active" },
        { id: "C-4", name: "Holiday Discount Offer", type: "Promo Blast", sent: 8000, openRate: "55%", clickRate: "25%", status: "Draft" }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Marketing Automation <Megaphone color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Reach thousands at once and track engagement.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Filter size={18} /> Audience Lists
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} /> New Campaign
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.02))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Subscribers</p>
                        <Mail size={18} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '32px' }}>12,840</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                         <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Avg Open Rate</p>
                         <Eye size={18} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '32px' }}>35.2%</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Avg Click Rate</p>
                        <MousePointerClick size={18} color="var(--warning)" />
                    </div>
                    <h3 style={{ fontSize: '32px' }}>8.4%</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Unsubscribe Rate</p>
                        <PieChart size={18} color="var(--danger)" />
                    </div>
                    <h3 style={{ fontSize: '32px' }}>0.8%</h3>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Campaigns</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {campaigns.map((camp, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', background: 'rgba(0, 0, 0,0.02)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h5 style={{ fontSize: '16px' }}>{camp.name}</h5>
                                    <span style={{ 
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                                        background: camp.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : camp.status === 'Completed' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                        color: camp.status === 'Active' ? 'var(--success)' : camp.status === 'Completed' ? 'var(--primary)' : 'var(--text-secondary)',
                                    }}>
                                        {camp.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{camp.type} • Sent to {camp.sent.toLocaleString()} recipients</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '32px', marginRight: '32px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)' }}>{camp.openRate}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Opened</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--warning)' }}>{camp.clickRate}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Clicked</p>
                                </div>
                            </div>

                            <button className="btn-outline" style={{ padding: '10px' }} title="View Report">
                                <PieChart size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Marketing;
