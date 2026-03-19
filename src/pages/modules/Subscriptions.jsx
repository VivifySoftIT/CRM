import React from 'react';
import { CreditCard, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Subscriptions = () => {
    const plans = [
        { name: "Basic", price: "$29/mo", users: 145, revenue: "$4,205", growth: "+12%" },
        { name: "Pro", price: "$99/mo", users: 320, revenue: "$31,680", growth: "+24%" },
        { name: "Enterprise", price: "$299/mo", users: 45, revenue: "$13,455", growth: "+5%" }
    ];

    const recentActivity = [
        { user: "Alice Johnson", action: "Upgraded to Pro", time: "2 hours ago", color: "var(--success)" },
        { user: "Bob Smith", action: "Payment Failed", time: "5 hours ago", color: "var(--danger)" },
        { user: "Charlie Brown", action: "New Subscription (Basic)", time: "Yesterday", color: "var(--primary)" },
        { user: "David Wilson", action: "Cancelled Subscription", time: "2 days ago", color: "var(--warning)" }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Subscription Management <CreditCard color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Track recurring revenue, plans, and subscriber health.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <RefreshCw size={18} /> Sync Stripe
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} /> Create Plan
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(2ec, 72, 153, 0.1))' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>Monthly Recurring Revenue (MRR)</p>
                            <h2 style={{ fontSize: '40px', marginBottom: '8px' }}>$49,340</h2>
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}><ArrowUpRight size={16} /> 15.4% from last month</span>
                        </div>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>Active Subscribers</p>
                            <h2 style={{ fontSize: '40px', marginBottom: '8px' }}>510</h2>
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}><ArrowUpRight size={16} /> 42 new this month</span>
                        </div>
                    </div>

                    <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Active Plans Overview</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {plans.map((plan, idx) => (
                            <motion.div whileHover={{ scale: 1.02 }} key={idx} className="glass-card" style={{ padding: '24px', borderTop: `4px solid ${idx === 1 ? 'var(--primary)' : 'var(--glass-border)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h4 style={{ fontSize: '18px' }}>{plan.name}</h4>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>{plan.price}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Subscribers</span>
                                        <span style={{ fontWeight: '600' }}>{plan.users}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14} /> Revenue</span>
                                        <span style={{ fontWeight: '600' }}>{plan.revenue}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> Growth</span>
                                        <span style={{ fontWeight: '600', color: 'var(--success)' }}>{plan.growth}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Activity</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    {idx !== recentActivity.length - 1 && <div style={{ position: 'absolute', top: '24px', left: '11px', bottom: '-24px', width: '2px', background: 'var(--glass-border)' }} />}
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: activity.color, display: 'grid', placeItems: 'center', alignSelf: 'flex-start', zIndex: 1 }}>
                                        <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', marginBottom: '4px' }}><b>{activity.user}</b> {activity.action}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-outline" style={{ width: '100%', marginTop: '32px', padding: '12px', fontSize: '13px' }}>View All Logs</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Subscriptions;
