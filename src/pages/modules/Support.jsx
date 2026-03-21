import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Clock, Filter, Key, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Support = () => {
    const [filter, setFilter] = useState('All');

    const tickets = [
        { id: "#T-2041", title: "Broken Air Conditioning", room: "304", reporter: "Alice Johnson", priority: "High", status: "Open", assignee: "Maintenance", time: "25m ago" },
        { id: "#T-2040", title: "Extra Pillows Request", room: "112", reporter: "Bob Smith", priority: "Low", status: "Closed", assignee: "Housekeeping", time: "2h ago" },
        { id: "#T-2039", title: "TV Remote Dead Batteries", room: "405", reporter: "Charlie Brown", priority: "Medium", status: "Open", assignee: "Housekeeping", time: "1h ago" },
        { id: "#T-2038", title: "Late Checkout Request", room: "501", reporter: "Eva Garcia", priority: "Low", status: "In Progress", assignee: "Front Desk", time: "4h ago" }
    ];

    const getPriColor = (pri) => {
        if(pri === 'High') return 'var(--danger)';
        if(pri === 'Medium') return 'var(--warning)';
        return 'var(--success)';
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Maintenance & Concierge <HelpCircle color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Log complaints, track repairs, and manage room service.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Filter size={18} /> View by Staff
                    </button>
                    <button className="btn-primary">
                        <Key size={18} /> New Request
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ flex: 1, padding: '24px', borderLeft: '4px solid var(--danger)', background: 'var(--card-bg)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} color="var(--danger)" /> Unresolved Critical</p>
                    <h3 style={{ fontSize: '32px' }}>3</h3>
                </div>
                <div className="glass-card" style={{ flex: 1, padding: '24px', borderLeft: '4px solid var(--warning)', background: 'var(--card-bg)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="var(--warning)" /> Pending Requests</p>
                    <h3 style={{ fontSize: '32px' }}>12</h3>
                </div>
                <div className="glass-card" style={{ flex: 1, padding: '24px', borderLeft: '4px solid var(--success)', background: 'var(--card-bg)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} color="var(--success)" /> Resolved Today</p>
                    <h3 style={{ fontSize: '32px' }}>45</h3>
                </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden', background: 'var(--card-bg)' }}>
                 <div style={{ display: 'flex', gap: '24px', padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                    {['All', 'Open', 'In Progress', 'Closed'].map(f => (
                        <span 
                            key={f} 
                            onClick={() => setFilter(f)}
                            style={{ 
                                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
                            }}
                        >
                            {f}
                        </span>
                    ))}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '20px', fontWeight: '500' }}>ID & Title</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Room / Guest</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Assignee</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Time</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.filter(t => filter === 'All' || t.status === filter).map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '20px' }}>
                                    <p style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>{t.title}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.id}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: getPriColor(t.priority) }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPriColor(t.priority) }} />
                                            {t.priority}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Room {t.room}</h4>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.reporter}</span>
                                </td>
                                <td style={{ padding: '20px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                    {t.assignee}
                                </td>
                                <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    {t.time}
                                </td>
                                <td style={{ padding: '20px' }}>
                                     <span style={{ 
                                        padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                        background: t.status === 'Open' ? 'rgba(239, 68, 68, 0.1)' : (t.status === 'In Progress' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                        color: t.status === 'Open' ? 'var(--danger)' : (t.status === 'In Progress' ? 'var(--warning)' : 'var(--success)')
                                    }}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Support;

