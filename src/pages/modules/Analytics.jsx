import React from 'react';
import { Activity, TrendingUp, TrendingDown, Users, Bed, CreditCard, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'RevPAR', data: [120, 140, 135, 160, 185, 205], borderColor: 'rgba(79, 70, 229, 1)', backgroundColor: 'rgba(79, 70, 229, 0.2)', tension: 0.4 }]
    };

    const dData = {
        labels: ['Direct Booking', 'OTA (Expedia)', 'OTA (Booking.com)', 'Corporate'],
        datasets: [{ data: [45, 20, 25, 10], backgroundColor: ['#4f46e5', '#ec4899', '#8b5cf6', '#10b981'], borderWidth: 0 }]
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Revenue & Occupancy <Activity color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Live performance metrics for property management.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> Occupancy Rate</p>
                    <h3 style={{ fontSize: '32px' }}>85%</h3>
                    <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><TrendingUp size={14} /> +12% from last wk</p>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={16} /> ADR (Avg Daily Rate)</p>
                    <h3 style={{ fontSize: '32px' }}>$195.00</h3>
                    <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><TrendingUp size={14} /> +$15 on weekends</p>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.1))' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Bed size={16} /> RevPAR</p>
                    <h3 style={{ fontSize: '32px', color: 'var(--text-primary)' }}>$165.75</h3>
                    <p style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}>Revenue Per Available Room</p>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Check-ins Today</p>
                    <h3 style={{ fontSize: '32px' }}>42</h3>
                    <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' }}><Clock size={14} /> 12 pending arrival</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>RevPAR Projection (30 Days)</h4>
                    <div style={{ height: '300px' }}>
                        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Booking Channels</h4>
                    <div style={{ height: '200px' }}>
                        <Doughnut data={dData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-secondary)' } } } }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
