import React from 'react';
import { ShieldCheck, Calendar, AlertCircle, FileText, Download, MoreHorizontal, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Contracts = () => {
    const contracts = [
        { id: "C-2026-001", client: "Spark Solutions", type: "Service Agreement", value: "$4,500/yr", startDate: "Jan 01, 2026", endDate: "Dec 31, 2026", status: "Active" },
        { id: "C-2026-002", client: "Vertex Corp", type: "NDA", value: "N/A", startDate: "Feb 15, 2026", endDate: "Feb 14, 2027", status: "Active" },
        { id: "C-2025-089", client: "NexGen", type: "Maintenance", value: "$1,200/mo", startDate: "Apr 01, 2025", endDate: "Mar 31, 2026", status: "Expiring Soon" },
        { id: "C-2024-045", client: "Lumina", type: "Licensing", value: "$10,000/yr", startDate: "Jul 01, 2024", endDate: "Jun 30, 2025", status: "Expired" }
    ];

    const getStatusTheme = (status) => {
        switch(status) {
            case 'Active': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', icon: <ShieldCheck size={14} /> };
            case 'Expiring Soon': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', icon: <AlertCircle size={14} /> };
            case 'Expired': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', icon: <AlertCircle size={14} /> };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)', icon: <FileText size={14} /> };
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Contract Management <ShieldCheck color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Track agreements, renewals, and legal documents.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> New Contract
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Active</p>
                    <h3 style={{ fontSize: '32px' }}>42</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--warning)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Expiring in 30 Days</p>
                    <h3 style={{ fontSize: '32px' }}>5</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Renewed This Month</p>
                    <h3 style={{ fontSize: '32px' }}>8</h3>
                </div>
                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--danger)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Expired</p>
                    <h3 style={{ fontSize: '32px' }}>2</h3>
                </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(0, 0, 0,0.02)' }}>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Contract ID</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Client & Type</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Value</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Timeline</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Status</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract, idx) => {
                            const theme = getStatusTheme(contract.status);
                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }} className="table-row-hover">
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{contract.id}</td>
                                    <td style={{ padding: '20px' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{contract.client}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{contract.type}</p>
                                    </td>
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{contract.value}</td>
                                    <td style={{ padding: '20px' }}>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Calendar size={12} /> Start: {contract.startDate}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> End: {contract.endDate}</p>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                            background: theme.bg, color: theme.color, display: 'inline-flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            {theme.icon} {contract.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }} title="Download PDF"><Download size={16} /></button>
                                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}><MoreHorizontal size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
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

export default Contracts;
