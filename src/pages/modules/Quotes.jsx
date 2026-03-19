import React from 'react';
import { FileText, Plus, Download, Send, Search, Filter, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Quotes = () => {
    const quotes = [
        { id: "QT-2026-001", client: "Spark Solutions", date: "Mar 19, 2026", amount: "$4,500.00", status: "Sent" },
        { id: "QT-2026-002", client: "Vertex Corp", date: "Mar 18, 2026", amount: "$12,800.00", status: "Accepted" },
        { id: "QT-2026-003", client: "Lumina", date: "Mar 15, 2026", amount: "$35,000.00", status: "Draft" },
        { id: "QT-2026-004", client: "NexGen", date: "Mar 10, 2026", amount: "$1,200.00", status: "Invoiced" }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' };
            case 'Sent': return { bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' };
            case 'Invoiced': return { bg: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)' };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)' };
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Search quotes..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }} />
                    </div>
                    <button className="btn-outline">
                        <Filter size={18} /> Filter Status
                    </button>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Create Quote
                </button>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Quote ID</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Client</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Date</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Amount</th>
                            <th style={{ padding: '20px', fontWeight: '500' }}>Status</th>
                            <th style={{ padding: '20px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote, idx) => {
                            const statusStyle = getStatusStyle(quote.status);
                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }} className="table-row-hover">
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{quote.id}</td>
                                    <td style={{ padding: '20px' }}>{quote.client}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{quote.date}</td>
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{quote.amount}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: statusStyle.bg,
                                            color: statusStyle.color
                                        }}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }} title="Send"><Send size={16} /></button>
                                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }} title="Download"><Download size={16} /></button>
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

export default Quotes;
