import React from 'react';
import { Share2, Gift, Users, Copy, Check, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Referrals = () => {
    const topReferrers = [
        { name: "Alice Johnson", company: "Spark Solutions", referrals: 15, converted: 8, rewards: "$4,000", rank: 1 },
        { name: "Bob Smith", company: "Vertex Corp", referrals: 8, converted: 3, rewards: "$1,500", rank: 2 },
        { name: "Charlie Brown", company: "NexGen", referrals: 5, converted: 2, rewards: "$1,000", rank: 3 }
    ];

    const recentReferrals = [
        { referrer: "Alice Johnson", referred: "Jane Doe (TechFlow)", status: "Converted", date: "Mar 18, 2026", reward: "+$500" },
        { referrer: "Bob Smith", referred: "Mark Otto (Bootstrap Inc)", status: "In Pipeline", date: "Mar 15, 2026", reward: "Pending" },
        { referrer: "David Wilson", referred: "Sarah Connor (SkyNet)", status: "Lost", date: "Mar 10, 2026", reward: "$0" }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Referral Program <Share2 color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Track word-of-mouth growth and reward loyal customers.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Gift size={18} /> Manage Rewards
                    </button>
                    <button className="btn-primary">
                        <Share2 size={18} /> Generate Link
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Referrals</p>
                    <h3 style={{ fontSize: '32px' }}>142</h3>
                    <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><TrendingUp size={14} /> +12 this month</p>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Conversion Rate</p>
                    <h3 style={{ fontSize: '32px' }}>34%</h3>
                    <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><TrendingUp size={14} /> +2.4% vs last Q</p>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Active Advocates</p>
                    <h3 style={{ fontSize: '32px' }}>45</h3>
                    <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><Users size={14} /> out of 510 clients</p>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <p style={{ color: 'var(--success)', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Rewards Paid (YTD)</p>
                    <h3 style={{ fontSize: '32px', color: 'var(--text-primary)' }}>$12,450</h3>
                    <button className="btn-outline" style={{ marginTop: '12px', padding: '6px 12px', fontSize: '12px', borderColor: 'var(--success)', color: 'var(--success)' }}>View Payouts</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Award size={20} color="var(--primary)" /> Top Advocates
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {topReferrers.map((ref, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: idx === 0 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0,0.02)', border: idx === 0 ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: idx === 0 ? 'var(--warning)' : idx === 1 ? '#94a3b8' : '#cd7f32', display: 'grid', placeItems: 'center', fontSize: '16px', fontWeight: '800', color: idx === 0 ? '#000' : '#fff' }}>
                                    {ref.rank}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '16px', marginBottom: '2px' }}>{ref.name}</h5>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ref.company}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{ref.rewards}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ref.converted}/{ref.referrals} won</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                     <h4 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Share2 size={20} color="var(--accent)" /> Recent Referrals
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentReferrals.map((item, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 80px', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: idx !== recentReferrals.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                                <div>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Referrer</p>
                                    <h5 style={{ fontSize: '14px' }}>{item.referrer}</h5>
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Referred lead</p>
                                    <h5 style={{ fontSize: '14px' }}>{item.referred}</h5>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                                        background: item.status === 'Converted' ? 'rgba(16, 185, 129, 0.1)' : item.status === 'Lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: item.status === 'Converted' ? 'var(--success)' : item.status === 'Lost' ? 'var(--danger)' : 'var(--warning)',
                                    }}>
                                        {item.status}
                                    </span>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>{item.reward}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Referrals;
