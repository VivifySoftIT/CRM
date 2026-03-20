import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, CreditCard, Shield, Settings, LogOut, ChevronLeft, Search, Bell, Activity, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const SuperAdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Platform Overview", path: "/super-admin/dashboard" },
        { icon: <Building2 size={20} />, label: "Company Management", path: "/super-admin/companies" },
        { icon: <Package size={20} />, label: "Subscription Plans", path: "/super-admin/plans" },
        { icon: <Activity size={20} />, label: "System Health", path: "/super-admin/status" },
        { icon: <Settings size={20} />, label: "Global Settings", path: "/super-admin/settings" },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userType');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9' }}>
            {/* Super Admin Sidebar - Distinct Dark Mode Style */}
            <motion.div 
                animate={{ width: collapsed ? '80px' : '280px' }}
                style={{ background: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="gradient-bg" style={{ minWidth: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                        <Shield size={22} color="white" />
                    </div>
                    {!collapsed && <h3 style={{ fontSize: '18px', letterSpacing: '-1px', color: 'white' }}>OMNI<span style={{ color: '#818cf8' }}>SUPER</span></h3>}
                </div>

                <div style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                style={{
                                    padding: '14px', width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                                    background: isActive ? '#1e293b' : 'transparent',
                                    color: isActive ? 'white' : '#94a3b8',
                                    borderRadius: '12px', transition: 'all 0.2s', border: 'none',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = 'white'; }}
                                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = '#94a3b8'; }}
                            >
                                {item.icon}
                                {!collapsed && <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.label}</span>}
                            </button>
                        );
                    })}
                </div>

                <div style={{ padding: '24px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={handleLogout}
                        style={{ padding: '14px', width: '100%', display: 'flex', alignItems: 'center', gap: '16px', border: 'none', background: 'transparent', color: '#fca5a5', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span style={{ fontSize: '14px', fontWeight: '600' }}>Logout Control</span>}
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700' }}>OmniPlatform Control Center</h2>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }} />
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>System: Online</span>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold' }}>AD</div>
                    </div>
                </header>

                <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }} className="custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
