import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Calendar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <h4 style={{ fontSize: '24px', fontWeight: '600' }}>March 2026</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}><ChevronLeft size={20} /></button>
                        <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}><ChevronRight size={20} /></button>
                    </div>
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>Today</button>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
                        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }}>Week</button>
                        <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '14px' }}>Month</button>
                    </div>
                    <button className="btn-primary">
                        <Plus size={18} /> New Event
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden' }}>
                {/* Calendar Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0, 0, 0,0.02)' }}>
                    <div style={{ padding: '16px', borderRight: '1px solid var(--glass-border)' }}></div>
                    {days.map((day, i) => (
                        <div key={i} style={{ padding: '16px', textAlign: 'center', borderRight: i !== 6 ? '1px solid var(--glass-border)' : 'none' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{day}</p>
                            <h4 style={{ fontSize: '20px', color: i === 2 ? 'var(--primary)' : 'inherit' }}>{i + 15}</h4>
                        </div>
                    ))}
                </div>

                {/* Calendar Body */}
                <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    {timeSlots.map((time, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid rgba(0, 0, 0,0.05)', minHeight: '80px' }}>
                            <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)', textAlign: 'right' }}>
                                {time}
                            </div>
                            {days.map((_, col) => (
                                <div key={col} style={{ borderRight: col !== 6 ? '1px solid rgba(0, 0, 0,0.05)' : 'none', position: 'relative', padding: '4px' }}>
                                    {i === 2 && col === 1 && (
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', background: 'rgba(99, 102, 241, 0.2)', borderLeft: '4px solid var(--primary)', borderRadius: '4px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                                            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Client Demo</p>
                                            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> 11:00 AM - 12:00 PM</p>
                                        </div>
                                    )}
                                    {i === 5 && col === 3 && (
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', background: 'rgba(16, 185, 129, 0.2)', borderLeft: '4px solid var(--success)', borderRadius: '4px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                                            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Team Sync</p>
                                            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={10} /> 02:00 PM - 03:00 PM</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Calendar;
