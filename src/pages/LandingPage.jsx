import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Megaphone, HelpCircle, BarChart3, 
  FileText, FolderOpen, CheckSquare, Calendar, Bot, 
  Layout, ShoppingBag, MessageSquare, ShieldCheck, 
  CreditCard, Smile, Share2, ChevronRight, Activity, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        { title: "Contact Management", desc: "A central database of every person and company.", icon: <Users className="text-blue-400" /> },
        { title: "Pipeline Tracking", desc: "A visual map of your sales journey.", icon: <TrendingUp className="text-emerald-400" /> },
        { title: "Marketing Tool", desc: "Automate your loudspeaker to reach thousands.", icon: <Megaphone className="text-pink-400" /> },
        { title: "Helpdesk", desc: "Handle issues smoothly after the sale.", icon: <HelpCircle className="text-purple-400" /> },
        { title: "Analytics", desc: "Deep data visualization for informed decisions.", icon: <BarChart3 className="text-orange-400" /> },
        { title: "Quotes & Invoices", desc: "Create professional bills and track payments.", icon: <FileText className="text-yellow-400" /> },
    ];

    const benefits = [
        { title: "Enhanced Efficiency", text: "Automate repetitive tasks and focus on closing deals." },
        { title: "Better Collaboration", text: "Shared data ensures everyone is on the same page." },
        { title: "Data-Driven Growth", text: "Real-time insights help identify high-value opportunities." },
        { title: "Customer Satisfaction", text: "Personalized experiences lead to higher retention rates." }
    ];

    return (
        <div className="landing-container" style={{ background: 'var(--bg-darker)', color: 'var(--text-primary)', minHeight: '100vh', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow" style={{ left: '60%', top: '20%', background: 'var(--secondary)' }} />

            {/* Navbar */}
            <nav style={{ padding: '24px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="gradient-bg" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                        <ShieldCheck size={24} color="var(--text-primary)" />
                    </div>
                    <h2 style={{ fontSize: '24px', letterSpacing: '-1px' }}>VIVIFY<span className="gradient-text">CRM</span></h2>
                </div>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ cursor: 'pointer' }}>Features</span>
                    <span style={{ cursor: 'pointer' }}>About</span>
                    <span style={{ cursor: 'pointer' }}>Pricing</span>
                    <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Get Started <ChevronRight size={18} />
                    </Link>
                </div>
            </nav>

            <main style={{ padding: '80px 80px' }}>
                {/* Hero Section */}
                <section style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px', display: 'block' }}>REVOLUTIONIZE YOUR BUSINESS</span>
                        <h1 style={{ fontSize: '72px', lineHeight: '1.1', marginBottom: '24px', maxWidth: '800px', margin: '24px auto' }}>
                            The Complete <span className="gradient-text">CRM Ecosystem</span> for Modern Enterprises
                        </h1>
                        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 48px' }}>
                            Streamline leads, automate workflows, and accelerate growth with our all-in-one platform designed to put your customers at the heart of everything you do.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/dashboard" className="btn-primary" style={{ padding: '18px 36px', fontSize: '18px', textDecoration: 'none' }}>Start Free Trial</Link>
                            <button className="btn-outline" style={{ padding: '18px 36px', fontSize: '18px' }}>Watch Demo</button>
                        </div>
                    </motion.div>
                </section>

                <br /><br /><br /><br />

                {/* What is CRM? */}
                <section style={{ marginTop: '140px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>What is <span className="gradient-text">CRM?</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '20px' }}>
                            At its core, CRM (Customer Relationship Management) is a strategy for managing your organization's relationships and interactions with customers and potential customers. 
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px' }}>
                            Vivify CRM is more than just a tool. It's your digital filing cabinet, your personal assistant, and your crystal ball—all rolled into one professional software suite.
                        </p>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {['Lead & Contact Management', 'Sales Automation', 'Customer Support', 'Reporting & Analysis'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: '500' }}>
                                    <div style={{ color: 'var(--success)' }}><ShieldCheck size={20} /></div> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card" style={{ padding: '40px', height: '450px', position: 'relative', overflow: 'hidden' }}>
                        <div className="hero-glow" style={{ width: '200px', height: '200px', opacity: '0.4' }} />
                        <div style={{ position: 'relative', zIndex: '1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                                <h3>Enterprise Dashboard</h3>
                                <Activity className="text-primary" />
                            </div>
                            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', background: 'rgba(0, 0, 0,0.05)' }}>
                                <div style={{ height: '8px', width: '60%', background: 'var(--primary)', borderRadius: '4px', marginBottom: '12px' }} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ height: '30px', width: '30px', borderRadius: '50%', background: 'var(--secondary)' }} />
                                    <div style={{ height: '30px', width: '30px', borderRadius: '50%', background: 'var(--accent)' }} />
                                    <div style={{ height: '30px', width: '30px', borderRadius: '50%', background: 'var(--primary)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="glass-card" style={{ padding: '20px', background: 'rgba(0, 0, 0,0.05)' }}>
                                    <p style={{ opacity: '0.6', fontSize: '12px' }}>REVENUE GROWTH</p>
                                    <h4 style={{ fontSize: '24px' }}>+24.8%</h4>
                                </div>
                                <div className="glass-card" style={{ padding: '20px', background: 'rgba(0, 0, 0,0.05)' }}>
                                    <p style={{ opacity: '0.6', fontSize: '12px' }}>NEW LEADS</p>
                                    <h4 style={{ fontSize: '24px' }}>1,280</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <br /><br /><br /><br />

                {/* Key Features */}
                <section style={{ marginTop: '140px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>Exhaustive <span className="gradient-text">Feature Set</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>From 'Hello' to 'Paid', we cover every step of the customer lifecycle with specialized modules.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {features.map((f, i) => (
                            <motion.div 
                                whileHover={{ scale: 1.05, translateY: -10 }}
                                key={i} className="glass-card" 
                                style={{ padding: '32px', cursor: 'default' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 0, 0,0.05)', display: 'grid', placeItems: 'center', marginBottom: '24px' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <br /><br /><br /><br />

                {/* Why CRM Section */}
                <section style={{ padding: '100px 0' }}>
                    <div className="glass-card" style={{ padding: '80px', background: 'linear-gradient(135deg, rgba(0, 0, 0,0.02), rgba(0, 0, 0,0.01))', borderRadius: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px' }}>
                            <div>
                                <h2 style={{ fontSize: '40px', marginBottom: '32px' }}>Why does your business <span className="gradient-text">NEED</span> a CRM?</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px' }}>
                                    Without a central system, files are lost in email attachments, salespeople forget to follow up, and customer frustration grows. A CRM ensures nothing falls through the cracks.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    {benefits.map((b, i) => (
                                        <div key={i}>
                                            <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>{b.title}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{b.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
                                <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,100,100,0.05)', borderColor: 'rgba(255,100,100,0.2)' }}>
                                    <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><ArrowRight size={18} /> Manual Work Kills Productivity</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Stop spending hours on spreadsheets and manual follow-ups. Let our robots handle the repetitive tasks.</p>
                                </div>
                                <div className="glass-card" style={{ padding: '24px', background: 'rgba(100,255,100,0.05)', borderColor: 'rgba(100,255,100,0.2)' }}>
                                    <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><ArrowRight size={18} /> Happy Customers = Steady Cash Flow</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Provide a professional customer portal and instant feedback loops to ensure high retention.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer / CTA */}
                <section style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2 style={{ fontSize: '48px', marginBottom: '32px' }}>Ready to <span className="gradient-text">scale</span> your business?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '20px', marginBottom: '48px' }}>Join 5,000+ businesses growing faster with Vivify CRM.</p>
                    <Link to="/dashboard" className="btn-primary" style={{ padding: '20px 48px', fontSize: '20px', margin: '0 auto', textDecoration: 'none' }}>
                        Go to Dashboard <ChevronRight />
                    </Link>
                </section>
            </main>

            <footer style={{ padding: '48px 80px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>© 2026 Vivify Soft IT Solutions. All rights reserved.</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <span>Facebook</span>
                    <span>Twitter</span>
                    <span>LinkedIn</span>
                    <span>WhatsApp</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
