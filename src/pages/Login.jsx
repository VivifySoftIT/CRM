import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Building2, User, Globe, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            // Role Based Routing Logic
            if (email === 'admin@omnihotel.com') {
                localStorage.setItem('userType', 'super_admin');
                navigate('/super-admin/dashboard');
            } else {
                localStorage.setItem('userType', 'hotel_staff');
                navigate('/dashboard/contacts');
            }
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden', background: '#f8fafc' }}>
            {/* Left Side: Universal SaaS Branding */}
            <div style={{ flex: 1.2, background: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', position: 'relative', overflow: 'hidden' }}>
                {/* Modern subtle patterns */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: '#4f46e5', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2 }} />
                
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', width: '48px', height: '48px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                            <ShieldCheck size={28} color="white" />
                        </div>
                        <span style={{ color: 'white', fontSize: '24px', fontWeight: '800', letterSpacing: '-1px' }}>OMNI<span style={{ color: '#818cf8' }}>OS</span></span>
                    </div>
                    
                    <h1 style={{ color: 'white', fontSize: '64px', fontWeight: '800', lineHeight: 1, marginBottom: '24px', letterSpacing: '-3px' }}>
                        The Future of <br/> Enterprise is <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unified.</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '500px', lineHeight: 1.6, marginBottom: '48px' }}>
                        A modular, multi-tenant ecosystem built for scale. Manage your entire global business infrastructure from a single, AI-integrated control plane.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '500px' }}>
                        {[
                            { icon: <Globe size={20} />, title: "Global Scale", desc: "Multi-region tenant management." },
                            { icon: <Cpu size={20} />, title: "AI Core", desc: "Automated business insights." },
                            { icon: <Zap size={20} />, title: "Real-time", desc: "Live monitoring & analytics." },
                            { icon: <ShieldCheck size={20} />, title: "Security", desc: "Enterprise-grade protection." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: '#818cf8', marginBottom: '12px' }}>{item.icon}</div>
                                <h4 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h4>
                                <p style={{ color: '#64748b', fontSize: '13px' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Login Form */}
            <div style={{ flex: 1, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px', position: 'relative' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', letterSpacing: '-1.5px' }}>Welcome back.</h2>
                        <p style={{ color: '#64748b', fontSize: '16px' }}>Sign in to manage your organization.</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                <input 
                                    type="email" required
                                    placeholder="name@company.com"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                <input 
                                    type="password" required
                                    placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: '#6366f1', width: '18px', height: '18px' }} /> Keep me signed in
                            </label>
                            <span style={{ fontSize: '14px', color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}>Reset Password</span>
                        </div>

                        <button 
                            type="submit" disabled={isLoading}
                            className="btn-primary" 
                            style={{ height: '56px', borderRadius: '14px', fontSize: '16px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', background: '#0f172a', color: 'white' }}
                        >
                            {isLoading ? "Authenticating..." : (
                                <>Sign in to Portal <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    {/* Developer Console (Mock) */}
                    <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.08em' }}>Instant Access Mode (Demo)</p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div onClick={() => setEmail('admin@omnihotel.com')} style={{ flex: 1, cursor: 'pointer', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', textAlign: 'center' }}>
                                <b>Super Admin</b>
                            </div>
                            <div onClick={() => setEmail('manager@grandomni.com')} style={{ flex: 1, cursor: 'pointer', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', textAlign: 'center' }}>
                                <b>Hotel Manager</b>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer copyright */}
                <div style={{ position: 'absolute', bottom: '40px', left: '100px', fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '24px' }}>
                    <span>© 2026 OmniOS Platform</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
