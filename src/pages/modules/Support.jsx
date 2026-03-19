import React from 'react';
import { HelpCircle, Tag, Search, Filter, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Support = () => {
    const tickets = [
        { id: "T-1042", subject: "Server performance issue", client: "Spark Solutions", status: "Open", priority: "High", time: "2h ago" },
        { id: "T-1041", subject: "How to export reports?", client: "Lumina", status: "In Progress", priority: "Low", time: "5h ago" },
        { id: "T-1040", subject: "Billing discrepancy", client: "Vertex Corp", status: "Closed", priority: "Medium", time: "1d ago" },
        { id: "T-1039", subject: "Feature request: Custom Fields", client: "NexGen", status: "Open", priority: "Low", time: "2d ago" }
    ];

    const getPriorityColor = (priority) => {
        if (priority === 'High') return 'var(--danger)';
        if (priority === 'Medium') return 'var(--warning)';
        return 'var(--success)';
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Search tickets..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }} />
                    </div>
                    <button className="btn-outline">
                        <Filter size={18} /> All Tickets
                    </button>
                </div>
                <button className="btn-primary">
                    <HelpCircle size={18} /> New Ticket
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid var(--danger)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Unresolved Tickets</p>
                    <h3 style={{ fontSize: '32px' }}>12</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid var(--warning)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Avg. Response Time</p>
                    <h3 style={{ fontSize: '32px' }}>1h 45m</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid var(--success)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Customer Satisfaction</p>
                    <h3 style={{ fontSize: '32px' }}>4.8/5</h3>
                </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(0, 0, 0,0.02)' }}>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Ticket</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Subject</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Client</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Priority</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Status</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Last Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }} className="table-row-hover">
                                <td style={{ padding: '20px', fontWeight: '600', color: 'var(--primary)' }}>{ticket.id}</td>
                                <td style={{ padding: '20px', fontWeight: '500' }}>{ticket.subject}</td>
                                <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{ticket.client}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: getPriorityColor(ticket.priority) }}>
                                        <Tag size={12} fill="currentColor" /> {ticket.priority}
                                    </span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                        background: ticket.status === 'Open' ? 'rgba(239, 68, 68, 0.1)' : ticket.status === 'Closed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: ticket.status === 'Open' ? 'var(--danger)' : ticket.status === 'Closed' ? 'var(--success)' : 'var(--warning)',
                                    }}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={14} /> {ticket.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>{`
                .table-row-hover:hover {
                    background: rgba(0, 0, 0,0.02);
                }
            `}</style>
        </motion.div>
    );
};

export default Support;
