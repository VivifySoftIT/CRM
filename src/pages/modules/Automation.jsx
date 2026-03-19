import React from 'react';
import { Bot, Zap, Plus, Settings, Play, Pause, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Automation = () => {
    const workflows = [
        { name: "Welcome Email Sequence", trigger: "New Lead Created", actions: "Send Email, Wait 2 Days, Send Email", status: "Active", runs: 450 },
        { name: "Invoice Reminder", trigger: "Invoice Unpaid > 7 Days", actions: "Send Follow-up, Create Task", status: "Active", runs: 120 },
        { name: "Deal Won Celebration", trigger: "Stage -> Closed Won", actions: "Notify Team Slack, Change Status", status: "Paused", runs: 0 },
        { name: "Re-engage Cold Leads", trigger: "Inactive > 60 Days", actions: "Add to Marketing List", status: "Active", runs: 85 }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Workflows <Bot color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Automate repetitive tasks and save manual effort.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Create Workflow
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {workflows.map((flow, idx) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={idx} className="glass-card workflow-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.1)', display: 'grid', placeItems: 'center' }}>
                                    <Zap size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{flow.name}</h4>
                                    <span style={{ 
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                                        background: flow.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: flow.status === 'Active' ? 'var(--success)' : 'var(--warning)'
                                    }}>
                                        {flow.status}
                                    </span>
                                </div>
                            </div>
                            <button className="btn-outline" style={{ padding: '8px', border: 'none' }}><Settings size={20} /></button>
                        </div>
                        
                        <div style={{ background: 'rgba(0, 0, 0,0.02)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-secondary)', width: '60px' }}>WHEN</span>
                                <b>{flow.trigger}</b>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-secondary)', width: '60px' }}>THEN</span>
                                <b>{flow.actions}</b>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Executed <b>{flow.runs}</b> times</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {flow.status === 'Active' ? (
                                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderColor: 'transparent' }}><Pause size={14} /> Pause</button>
                                ) : (
                                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'transparent' }}><Play size={14} /> Resume</button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                .workflow-card:hover {
                    border-color: var(--primary);
                    background: rgba(0, 0, 0,0.06);
                }
            `}</style>
        </motion.div>
    );
};

export default Automation;
