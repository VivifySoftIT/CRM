import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Building2, Users, CreditCard, LayoutDashboard, Settings, CheckCircle2, Search, Filter, MoreVertical, ToggleLeft, ToggleRight, Plus, MapPin, Globe, Mail, Activity, Package, Server, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdmin = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Form State
    const [newHotel, setNewHotel] = useState({ name: '', location: '', admin: '', email: '', plan: 'Pro' });

    const [companies, setCompanies] = useState([
        { id: 1, name: "Grand Omni Hotel", admin: "Harish M.", plan: "Enterprise", status: "Active", revenue: "$2,450/mo", location: "New York, USA", email: "harish@omnihotel.com", activeModules: ["Guest Directory", "Event Bookings", "Marketing", "Maintenance", "Analytics"] },
        { id: 2, name: "Riviera Resort & Spa", admin: "Alice Johnson", plan: "Pro", status: "Active", revenue: "$999/mo", location: "Nice, France", email: "alice@rivieraresort.com", activeModules: ["Guest Directory", "Marketing", "Analytics"] },
        { id: 3, name: "Urban Boutique Stay", admin: "Bob Smith", plan: "Basic", status: "Past Due", revenue: "$299/mo", location: "London, UK", email: "bob@urbanstay.co", activeModules: ["Guest Directory", "Support"] }
    ]);

    const allModules = ["Guest Directory", "Event Bookings", "Marketing", "Maintenance", "Analytics", "Invoices", "Contracts"];

    const handleAddHotel = (e) => {
        e.preventDefault();
        const hotel = {
            ...newHotel,
            id: companies.length + 1,
            status: 'Active',
            revenue: newHotel.plan === 'Pro' ? '$999/mo' : (newHotel.plan === 'Enterprise' ? '$2,450/mo' : '$299/mo'),
            activeModules: ["Guest Directory"]
        };
        setCompanies([...companies, hotel]);
        setShowAddForm(false);
        setNewHotel({ name: '', location: '', admin: '', email: '', plan: 'Pro' });
    };

    const toggleModule = (moduleName) => {
        if (!selectedCompany) return;
        const updatedModules = selectedCompany.activeModules.includes(moduleName)
            ? selectedCompany.activeModules.filter(m => m !== moduleName)
            : [...selectedCompany.activeModules, moduleName];
        
        setCompanies(companies.map(c => c.id === selectedCompany.id ? {...c, activeModules: updatedModules} : c));
        setSelectedCompany({...selectedCompany, activeModules: updatedModules});
    };

    // View Switcher based on Route
    const renderContent = () => {
        if (location.pathname.includes('/super-admin/dashboard')) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Platform Dashboard</h1>
                            <p style={{ color: '#64748b' }}>OmniPlatform Global performance and statistics.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-outline">Download Report</button>
                            <button onClick={() => setShowAddForm(true)} className="btn-primary"><Plus size={18} /> Add Hotel</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                        {[
                            { label: "Total Revenue", val: "$142,500", sub: "+12% vs last month", color: "#6366f1", icon: <CreditCard /> },
                            { label: "Active Hotels", val: "14", sub: "2 pending onboarding", color: "#10b981", icon: <Building2 /> },
                            { label: "Active Guests", val: "8,250", sub: "Currently Checked-in", color: "#f59e0b", icon: <Users /> },
                            { label: "Platform Health", val: "99.9%", sub: "4 clusters operational", color: "#8b5cf6", icon: <Activity /> }
                        ].map((s, i) => (
                            <div key={i} className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                                <div style={{ color: s.color, marginBottom: '16px' }}>{s.icon}</div>
                                <h3 style={{ fontSize: '32px', marginBottom: '8px' }}>{s.val}</h3>
                                <p style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{s.label}</p>
                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Revenue Sources</h3>
                        <div style={{ height: '300px', width: '100%', background: '#f8fafc', borderRadius: '16px', display: 'grid', placeItems: 'center', color: '#94a3b8' }}>
                            <p>Global Revenue Map Visualization Loading...</p>
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (location.pathname.includes('/super-admin/companies')) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Hotel Network</h1>
                            <p style={{ color: '#64748b' }}>Provision and manage modules for your hotel clients.</p>
                        </div>
                        <button onClick={() => setShowAddForm(true)} className="btn-primary"><Plus size={18} /> Register New Hotel</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: selectedCompany ? '1fr 380px' : '1fr', gap: '24px', transition: '0.3s' }}>
                        <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '800', color: '#64748b' }}>HOTEL IDENTITY</th>
                                        <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '800', color: '#64748b' }}>PLAN</th>
                                        <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '800', color: '#64748b' }}>STATUS</th>
                                        <th style={{ textAlign: 'right', padding: '16px', fontSize: '12px', fontWeight: '800', color: '#64748b' }}>REVENUE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map(c => (
                                        <tr key={c.id} onClick={() => setSelectedCompany(c)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedCompany?.id === c.id ? '#f5f3ff' : 'transparent' }}>
                                            <td style={{ padding: '20px 16px' }}>
                                                <p style={{ fontWeight: '700', fontSize: '15px' }}>{c.name}</p>
                                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{c.location}</p>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', background: '#f1f5f9' }}>{c.plan}</span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <p style={{ color: '#10b981', fontWeight: '700', fontSize: '13px' }}>{c.status}</p>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700' }}>{c.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {selectedCompany && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '32px', background: 'white' }}>
                                <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Plugin Overrides</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {allModules.map(mod => (
                                        <div key={mod} onClick={() => toggleModule(mod)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{mod}</span>
                                            {selectedCompany.activeModules.includes(mod) ? <ToggleRight color="#6366f1" size={36} /> : <ToggleLeft color="#cbd5e1" size={36} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            );
        }

        if (location.pathname.includes('/super-admin/plans')) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Subscription Tiers</h1>
                        <p style={{ color: '#64748b' }}>Configure pricing and module limits for your SaaS offerings.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {[
                            { name: "Starter", price: "$299/mo", features: ["1 Hotel Location", "Guest Directory", "Maintenance Support"] },
                            { name: "Pro", price: "$999/mo", features: ["3 Hotel Locations", "Full Marketing Suite", "Advanced Analytics", "Custom Subdomains"] },
                            { name: "Enterprise", price: "$2,450/mo", features: ["Unlimited Locations", "Whitelabeling", "Dedicated Account Manager", "Custom Integrations"] }
                        ].map((plan, i) => (
                            <div key={i} className="glass-card" style={{ padding: '32px', background: 'white', border: i === 1 ? '2px solid #6366f1' : 'none' }}>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{plan.name}</h3>
                                <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>{plan.price}</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {plan.features.map((f, fi) => (
                                        <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                                            <CheckCircle2 size={16} color="#10b981" /> {f}
                                        </div>
                                    ))}
                                </div>
                                <button className={i === 1 ? "btn-primary" : "btn-outline"} style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }}>Edit Plan</button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            );
        }

        if (location.pathname.includes('/super-admin/status')) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>System Health Monitor</h1>
                        <p style={{ color: '#64748b' }}>Real-time infrastructure and service status.</p>
                    </div>

                    <div className="glass-card" style={{ padding: '32px', background: '#0f172a', color: 'white' }}>
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>MAINTENANCE MODE</p>
                                <p style={{ fontWeight: '700', color: '#ef4444' }}>OFF</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>ACTIVE SERVERS</p>
                                <p style={{ fontWeight: '700', color: '#4ade80' }}>14/14</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {["Database Cluster (Primary)", "ElasticSearch Instance", "Redis Caching Layer", "Email Relay Service", "Frontend CDN"].map(s => (
                                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Server size={18} color="#818cf8" /> {s}</div>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>OPERATIONAL</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (location.pathname.includes('/super-admin/settings')) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Global Platform Settings</h1>
                        <p style={{ color: '#64748b' }}>Whitelabeling, domain management, and security policies.</p>
                    </div>

                    <div className="glass-card" style={{ padding: '32px', background: 'white', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>Platform Name</label>
                                <input type="text" defaultValue="OmniHotel SaaS" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>Support Email</label>
                                <input type="email" defaultValue="support@omnihotel.io" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div style={{ padding: '20px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                <h4 style={{ color: '#c2410c', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><ShieldAlert size={18} /> Maintenance Mode</h4>
                                <p style={{ fontSize: '13px', color: '#9a3412', marginBottom: '16px' }}>Enabling this will block all hotel staff from accessing their dashboards.</p>
                                <button className="btn-primary" style={{ background: '#ea580c' }}>Activate Global Lockdown</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <div style={{ position: 'relative', minHeight: '100%' }}>
            {renderContent()}

            {/* Add Hotel Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ background: 'white', width: '500px', borderRadius: '24px', padding: '40px', boxShadow: '0 50px 100px rgba(0,0,0,0.2)' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Onboard New Hotel</h2>
                             <p style={{ color: '#64748b', marginBottom: '32px' }}>Provision a new tenant on the platform.</p>
                            
                            <form onSubmit={handleAddHotel} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#64748b' }}>HOTEL NAME</label>
                                        <input required type="text" placeholder="Grand Royal..." value={newHotel.name} onChange={e => setNewHotel({...newHotel, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#64748b' }}>LOCATION</label>
                                        <input required type="text" placeholder="Dubai, UAE" value={newHotel.location} onChange={e => setNewHotel({...newHotel, location: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'transparent', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700' }}>Confirm Provisioning</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuperAdmin;
