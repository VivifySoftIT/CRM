import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import AIChatBot from '../components/AIChatBot';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', background: 'white', minHeight: '100vh', paddingBottom: '80px' }}>
            <nav style={{ padding: '24px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div className="gradient-bg" style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                        <Star fill="white" color="white" size={20} />
                    </div>
                    <h2 style={{ fontSize: '24px', letterSpacing: '-1px', color: 'var(--text-primary)', fontWeight: '800' }}>THE GRAND <span className="gradient-text">OMNI</span></h2>
                </div>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', fontWeight: '500', color: 'var(--text-primary)' }}>
                    <span style={{ cursor: 'pointer' }}>Rooms & Suites</span>
                    <span style={{ cursor: 'pointer' }}>Dining</span>
                    <span style={{ cursor: 'pointer' }}>Weddings</span>
                    <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '30px' }} onClick={() => alert("This would send booking data right to your CRM Backend!")}>
                        Book a Room
                    </button>
                    {/* Secret back door for Hotel Staff to enter their CRM */}
                    <span style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)' }} onClick={() => navigate('/dashboard')}>
                        Staff Login
                    </span>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                {/* The Public Hero Section */}
                <section style={{ position: 'relative', height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&q=80") center/cover' }}>
                    
                    <div style={{ textAlign: 'center', color: 'white', zIndex: 10, padding: '20px' }}>
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ fontSize: '72px', letterSpacing: '-2px', marginBottom: '24px', fontWeight: '600', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            Escape to Endless Luxury.
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} style={{ fontSize: '24px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            Experience a five-star stay on the pristine shores of the Riviera.
                        </motion.p>
                    </div>

                    {/* The Booking Engine Widget (Data Collection Form) */}
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card" style={{ position: 'absolute', bottom: '-40px', background: 'white', padding: '16px 32px', borderRadius: '50px', display: 'flex', gap: '32px', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '8px', cursor: 'pointer' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Check In</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '600' }}><Calendar size={18} color="var(--primary)" /> Add Date</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }} />
                        <div style={{ padding: '8px', cursor: 'pointer' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Check Out</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '600' }}><Calendar size={18} color="var(--primary)" /> Add Date</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }} />
                        <div style={{ padding: '8px', cursor: 'pointer' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Guests</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '600' }}><Users size={18} color="var(--primary)" /> 2 Adults, 0 Children</div>
                        </div>
                        <button className="btn-primary" style={{ padding: '18px 40px', borderRadius: '30px', fontSize: '16px', marginLeft: '16px' }} onClick={() => navigate('/dashboard')}>
                            Check Availability
                        </button>
                    </motion.div>
                </section>

                <section style={{ padding: '120px 80px 0 80px', marginTop: '60px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '48px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-1px' }}>Curated Experiences</h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Whether you're booking an oceanview suite or sending an inquiry for your dream wedding, everything is perfectly tailored just for you.</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                        {/* Box 1 */}
                        <div className="glass-card" style={{ overflow: 'hidden', background: 'white' }}>
                            <div style={{ height: '250px', background: 'url("https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80") center/cover' }} />
                            <div style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Presidential Suites</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>Wake up to panoramic ocean views with 24/7 dedicated concierge service included.</p>
                                <button className="btn-outline" style={{ width: '100%' }}>View Rooms</button>
                            </div>
                        </div>
                        {/* Box 2 - Event Lead Capture */}
                        <div className="glass-card" style={{ overflow: 'hidden', background: 'var(--bg-darker)' }}>
                            <div style={{ height: '250px', background: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80") center/cover' }} />
                            <div style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--primary)' }}>Weddings & Events</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>Host your unforgettable ceremony or corporate retreat in our grand 5,000 sq ft ballroom.</p>
                                <button className="btn-primary" onClick={() => alert("This Inquiry Form drops straight into your CRM's Event Bookings Pipeline!")} style={{ width: '100%' }}>
                                    Request Event Quote
                                </button>
                            </div>
                        </div>
                        {/* Box 3 */}
                        <div className="glass-card" style={{ overflow: 'hidden', background: 'white' }}>
                            <div style={{ height: '250px', background: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80") center/cover' }} />
                            <div style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Holistic Wellness Spa</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>Rejuvenate your body and mind with our award-winning deep tissue massage therapies.</p>
                                <button className="btn-outline" style={{ width: '100%' }}>Book Massage</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <AIChatBot />
        </div>
    );
};

export default LandingPage;
