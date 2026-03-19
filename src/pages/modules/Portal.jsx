import React from 'react';
import { Layout, Share, Lock, ExternalLink, Settings, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Portal = () => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        Customer Portal Settings <Layout color="var(--primary)" size={28} />
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Configure the private self-service area for your clients.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline">
                        <Eye size={18} /> Preview Portal
                    </button>
                    <button className="btn-primary">
                        <Share size={18} /> Share Invite Link
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div>
                    <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Settings size={20} color="var(--primary)" /> Portal Customization
                        </h4>
                        
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Portal Name</label>
                                <input type="text" defaultValue="Spark Solutions Client Space" className="glass-card" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0, 0, 0,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Primary Color</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'].map((color, i) => (
                                        <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, cursor: 'pointer', border: i === 0 ? '3px solid white' : 'none' }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Brand Logo</label>
                                <div style={{ border: '2px dashed var(--glass-border)', padding: '40px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer' }}>
                                    <p style={{ color: 'var(--text-secondary)' }}>Drag and drop logo here or click to browse</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                         <h4 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Lock size={20} color="var(--accent)" /> Access Permissions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'View Invoices', desc: 'Allow clients to view and download their invoices.' },
                                { title: 'Submit Support Tickets', desc: 'Clients can raise issues directly from the portal.' },
                                { title: 'Upload Documents', desc: 'Permit secure file sharing between you and clients.' },
                                { title: 'View Project Pipeline', desc: 'Show them current status of their projects.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0, 0, 0,0.02)', borderRadius: '12px' }}>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                    </div>
                                    <div style={{ width: '48px', height: '28px', background: 'var(--primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '4px', top: '4px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="glass-card mockup-preview" style={{ padding: '24px', position: 'sticky', top: '24px', border: '1px solid var(--primary)', background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(0, 0, 0,0.02) 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Preview</span>
                            <ExternalLink size={16} color="var(--primary)" />
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', height: '400px', border: '1px solid var(--glass-border)' }}>
                            {/* Fake Portal Header */}
                            <div style={{ padding: '16px', background: 'rgba(0, 0, 0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ width: '100px', height: '16px', background: 'var(--primary)', borderRadius: '4px' }} />
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0, 0, 0,0.1)' }} />
                            </div>
                            {/* Fake Content */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ width: '60%', height: '24px', background: 'rgba(0, 0, 0,0.1)', borderRadius: '4px', marginBottom: '24px' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ height: '80px', background: 'rgba(0, 0, 0,0.05)', borderRadius: '12px' }} />
                                    <div style={{ height: '80px', background: 'rgba(0, 0, 0,0.05)', borderRadius: '12px' }} />
                                </div>
                                <div style={{ height: '120px', background: 'rgba(0, 0, 0,0.05)', borderRadius: '12px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Portal;
