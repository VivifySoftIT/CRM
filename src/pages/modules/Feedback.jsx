import React from 'react';
import { Smile, Frown, Meh, Star, Send, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Feedback = () => {
    const feedbackList = [
        { id: 1, user: "Alice Johnson", company: "Spark Solutions", rating: 5, comment: "Excellent onboarding experience! The team was very helpful.", date: "2 days ago", sentiment: "positive" },
        { id: 2, user: "Bob Smith", company: "Vertex Corp", rating: 3, comment: "Product is good, but the reporting tool is a bit confusing to use.", date: "4 days ago", sentiment: "neutral" },
        { id: 3, user: "Charlie Brown", company: "NexGen", rating: 1, comment: "Constant server downtime. We are losing money because of this.", date: "1 week ago", sentiment: "negative" }
    ];

    const getSentimentIcon = (sentiment) => {
        if (sentiment === 'positive') return <Smile color="var(--success)" size={24} />;
        if (sentiment === 'neutral') return <Meh color="var(--warning)" size={24} />;
        return <Frown color="var(--danger)" size={24} />;
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Customer Feedback <Smile color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitor customer satisfaction and collect reviews.</p>
                </div>
                <button className="btn-primary">
                    <Send size={18} /> Send Survey
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '32px' }}>
                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Average Rating</h4>
                        <div style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1', marginBottom: '8px' }}>4.6</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', color: 'var(--warning)', marginBottom: '16px' }}>
                            {[1,2,3,4,5].map(i => <Star key={i} fill={i <= 4 ? "currentColor" : "none"} size={24} />)}
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Based on 128 reviews</p>
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={18} /> Sentiment Analysis</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: "Positive", pct: "75%", color: "var(--success)" },
                                { label: "Neutral", pct: "15%", color: "var(--warning)" },
                                { label: "Negative", pct: "10%", color: "var(--danger)" }
                            ].map((s, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                        <span>{s.label}</span>
                                        <span>{s.pct}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(0, 0, 0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: s.pct, background: s.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Responses</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {feedbackList.map((item) => (
                            <motion.div whileHover={{ scale: 1.01 }} key={item.id} style={{ padding: '20px', background: 'rgba(0, 0, 0,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 0, 0,0.05)', display: 'grid', placeItems: 'center' }}>
                                            {getSentimentIcon(item.sentiment)}
                                        </div>
                                        <div>
                                            <h5 style={{ fontSize: '16px', marginBottom: '2px' }}>{item.user}</h5>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.company} • {item.date}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                                        {[1,2,3,4,5].map(i => <Star key={i} fill={i <= item.rating ? "currentColor" : "none"} size={16} />)}
                                    </div>
                                </div>
                                <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-primary)' }}>"{item.comment}"</p>
                                {item.sentiment === 'negative' && (
                                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', background: 'var(--danger)' }}>Create Support Ticket</button>
                                        <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Reply to Customer</button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Feedback;
