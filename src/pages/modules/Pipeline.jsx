import React, { useState } from 'react';
import { Settings, Users, Calendar, MoreHorizontal, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Pipeline = () => {
    const defaultStages = [
        { id: 's1', name: 'Inquiry', color: 'var(--text-secondary)' },
        { id: 's2', name: 'Site Tour Given', color: 'var(--warning)' },
        { id: 's3', name: 'Proposal Sent', color: 'var(--primary)' },
        { id: 's4', name: 'Contract Signed', color: 'var(--success)' }
    ];

    const [deals, setDeals] = useState([
        { id: 1, title: 'Summer Corporate Retreat', amount: '$24,500', company: 'TechFlow Inc.', date: 'Jun 15', stage: 's1', guests: 50 },
        { id: 2, title: 'Johnson Wedding Reception', amount: '$45,000', company: 'Private Event', date: 'Aug 22', stage: 's2', guests: 200 },
        { id: 3, title: 'Annual Medical Conference', amount: '$110,000', company: 'Global Health', date: 'Sep 10', stage: 's3', guests: 350 },
        { id: 4, title: 'Product Launch Party', amount: '$18,200', company: 'Lumina', date: 'Jul 04', stage: 's4', guests: 80 }
    ]);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Event & Banquet Bookings <Settings color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Track large group reservations and catering contracts.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> New Event
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '24px' }} className="custom-scrollbar">
                {defaultStages.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage.id);
                    return (
                        <div key={stage.id} style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: `2px solid ${stage.color}`, paddingBottom: '12px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{stage.name}</h4>
                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                    {stageDeals.length}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '500px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '12px' }}>
                                <AnimatePresence>
                                    {stageDeals.map(deal => (
                                        <motion.div 
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}
                                            key={deal.id} 
                                            className="glass-card" 
                                            style={{ padding: '20px', cursor: 'grab', background: 'white' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <h5 style={{ fontSize: '16px', fontWeight: '600' }}>{deal.title}</h5>
                                                <MoreHorizontal size={18} color="var(--text-secondary)" />
                                            </div>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{deal.company}</p>
                                            
                                            <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '16px' }}>{deal.amount}</h3>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {deal.date}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {deal.guests} guests</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {stageDeals.length === 0 && (
                                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px', fontSize: '14px', border: '2px dashed var(--glass-border)', borderRadius: '12px' }}>
                                        Drag events here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Pipeline;
