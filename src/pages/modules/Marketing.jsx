import React, { useState } from 'react';
import { Megaphone, Send, Clock, Eye, MousePointerClick, Filter, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Marketing = () => {
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const campaigns = [
        { id: 1, name: "Summer Poolside Promo", type: "Email Newsletter", status: "COMPLETED", sent: "12,500", open: "42%", click: "15%", date: "Jun 01", recipients: [
            { id: 101, name: "Alice Johnson", email: "alice@gmail.com", status: "Clicked", time: "2h ago" },
            { id: 102, name: "Bob Smith", email: "bob@vertex.io", status: "Opened", time: "5h ago" },
            { id: 103, name: "Charlie Brown", email: "charlie@zgroup.com", status: "Sent", time: "1d ago" },
            { id: 104, name: "David Wilson", email: "david@nexgen.co", status: "Opened", time: "3h ago" },
            { id: 105, name: "Eva Garcia", email: "eva@lumina.io", status: "Clicked", time: "10m ago" }
        ]},
        { id: 2, name: "Post-Stay TripAdvisor Request", type: "Automated Robot", status: "RUNNING", sent: "340/week", open: "68%", click: "22%", date: "Always On", recipients: [
            { id: 201, name: "Frank Miller", email: "frank@swift.com", status: "Clicked", time: "1h ago" },
            { id: 202, name: "Grace Lee", email: "grace@tech.io", status: "Opened", time: "30m ago" }
        ]},
        { id: 3, name: "Valentine's Couples Discount", type: "Email Promo", status: "SCHEDULED", sent: "0", open: "-", click: "-", date: "Feb 05", recipients: [] },
        { id: 4, name: "VIP Member Check-in Instructions", type: "Automated Robot", status: "RUNNING", sent: "85/week", open: "91%", click: "50%", date: "Always On", recipients: [
            { id: 401, name: "Henry Adams", email: "henry@corp.com", status: "Opened", time: "15m ago" }
        ]}
    ];

    const renderMainView = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Guest Marketing <Megaphone color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Reach thousands of guests at once and track engagement.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Filter size={18} /> Guest Lists
                    </button>
                    <button className="btn-primary">
                        + New Campaign
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.1))' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Send size={16} /> Total Subscribers</p>
                    <h3 style={{ fontSize: '32px' }}>18,450</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={16} color="var(--success)" /> Avg Open Rate</p>
                    <h3 style={{ fontSize: '32px' }}>41.2%</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><MousePointerClick size={16} color="var(--warning)" /> Avg Click Rate</p>
                    <h3 style={{ fontSize: '32px' }}>12.4%</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="var(--primary)" /> Campaigns Sent</p>
                    <h3 style={{ fontSize: '32px' }}>24</h3>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Campaigns</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {campaigns.map(camp => (
                        <div 
                            key={camp.id} 
                            onClick={() => setSelectedCampaign(camp)}
                            style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', 
                                border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(0,0,0,0.01)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h5 style={{ fontSize: '16px', fontWeight: '600' }}>{camp.name}</h5>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                        background: camp.status === 'RUNNING' ? 'rgba(16, 185, 129, 0.1)' : (camp.status === 'COMPLETED' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.05)'),
                                        color: camp.status === 'RUNNING' ? 'var(--success)' : (camp.status === 'COMPLETED' ? 'var(--primary)' : 'var(--text-secondary)')
                                    }}>
                                        {camp.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{camp.type} • Sent to {camp.sent} guests</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--success)' }}>{camp.open}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Opened</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--warning)' }}>{camp.click}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Clicked</p>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>
                                    View Recipients →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderRecipientView = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button 
                onClick={() => setSelectedCampaign(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginBottom: '24px' }}
            >
                <ArrowLeft size={18} /> Back to Campaigns
            </button>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{selectedCampaign.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Recipients and individual delivery tracking.</p>
            </div>

            <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>GUEST NAME</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMAIL ADDRESS</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>STATUS</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>ACTIVITY TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCampaign.recipients.length > 0 ? selectedCampaign.recipients.map((guest) => (
                            <tr key={guest.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-primary)' }}>{guest.name}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{guest.email}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ 
                                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        background: guest.status === 'Clicked' ? 'rgba(245, 158, 11, 0.1)' : (guest.status === 'Opened' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)'),
                                        color: guest.status === 'Clicked' ? 'var(--warning)' : (guest.status === 'Opened' ? 'var(--success)' : 'var(--primary)')
                                    }}>
                                        {guest.status === 'Clicked' && <MousePointerClick size={14} />}
                                        {guest.status === 'Opened' && <Eye size={14} />}
                                        {guest.status === 'Sent' && <Mail size={14} />}
                                        {guest.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{guest.time}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No data available for this campaign yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    return (
        <div style={{ minHeight: '100%' }}>
            {selectedCampaign ? renderRecipientView() : renderMainView()}
        </div>
    );
};

export default Marketing;
