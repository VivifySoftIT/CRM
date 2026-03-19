import React, { useState } from 'react';
import { 
  TrendingUp, Plus, MoreVertical, 
  Calendar, CreditCard, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Pipeline = () => {
    const [stages, setStages] = useState([
        { id: 1, title: "Just Said Hello", color: "var(--primary)", deals: [
            { id: 101, title: "Spark Solutions - CRM Upgrade", value: "$4,500", date: "Mar 20", company: "Spark Solutions" },
            { id: 102, title: "Vertex Corp - Cloud Migration", value: "$12,800", date: "Mar 22", company: "Vertex Corp" }
        ]},
        { id: 2, title: "Sent Quotation", color: "var(--accent)", deals: [
            { id: 103, title: "Lumina - ERP Implementation", value: "$35,000", date: "Mar 18", company: "Lumina" }
        ]},
        { id: 3, title: "Negotiating Price", color: "var(--secondary)", deals: [
            { id: 104, title: "NexGen - Maintenance", value: "$1,200/mo", date: "Mar 15", company: "NexGen" }
        ]},
        { id: 4, title: "Deal Won", color: "var(--success)", deals: [
            { id: 105, title: "Swift Logic - Web App", value: "$8,500", date: "Mar 10", company: "Swift Logic" }
        ]}
    ]);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Pipeline Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Active Pipeline <TrendingUp size={20} className="text-primary" />
                    </h4>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Value: <b>$62,000</b></span>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Deal
                </button>
            </div>

            {/* Kanban Board */}
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px' }} className="custom-scrollbar">
                {stages.map(stage => (
                    <div key={stage.id} style={{ minWidth: '320px', flex: 1 }}>
                        {/* Stage Title */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderLeft: `4px solid ${stage.color}`, paddingLeft: '12px' }}>
                            <div>
                                <h4 style={{ fontSize: '16px' }}>{stage.title}</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stage.deals.length} deals</p>
                            </div>
                            <MoreVertical size={16} color="var(--text-secondary)" cursor="pointer" />
                        </div>

                        {/* Deals List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stage.deals.map((deal, idx) => (
                                <motion.div 
                                    whileHover={{ scale: 1.02, translateX: 5 }}
                                    key={deal.id} 
                                    className="glass-card deal-card" 
                                    style={{ padding: '20px', borderLeft: `1px solid ${stage.color}` }}
                                >
                                    <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{deal.title}</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{deal.company}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700' }}>
                                            <CreditCard size={14} color="var(--primary)" /> {deal.value}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            <Calendar size={14} /> {deal.date}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <button className="btn-outline" style={{ border: '1px dashed var(--glass-border)', padding: '12px', width: '100%', fontSize: '13px', background: 'none' }}>
                                + Create New
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .deal-card:hover {
                    border-color: var(--primary);
                    background: rgba(0, 0, 0,0.06);
                }
            `}</style>
        </motion.div>
    );
};

export default Pipeline;
