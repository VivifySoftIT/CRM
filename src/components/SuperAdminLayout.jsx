import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Shield, Settings, LogOut, Bell, Package, BarChart2, Sun, Moon, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  const t = {
    sidebarBg:     isDark ? '#0f172a' : '#1e1b4b',
    sidebarBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)',
    sidebarText:   isDark ? '#94a3b8' : '#c7d2fe',
    activeText:    '#ffffff',
    activeBg:      isDark ? '#1e293b' : 'rgba(255,255,255,0.15)',
    hoverBg:       isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
    headerBg:      isDark ? '#0f172a' : '#ffffff',
    headerBorder:  isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    headerText:    isDark ? '#f1f5f9' : '#0f172a',
    headerSub:     isDark ? '#64748b' : '#94a3b8',
    mainBg:        isDark ? '#0b1120' : '#f1f5f9',
    pillBg:        isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    pillText:      isDark ? '#64748b' : '#64748b',
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Platform Overview',  path: '/super-admin/dashboard' },
    { icon: <Building2 size={20} />,      label: 'Company Management', path: '/super-admin/companies' },
    { icon: <Package size={20} />,        label: 'Subscription Plans', path: '/super-admin/plans'     },
    { icon: <BarChart2 size={20} />,      label: 'Analytics',          path: '/super-admin/analytics' },
    { icon: <Settings size={20} />,       label: 'Global Settings',    path: '/super-admin/settings'  },
  ];

  const handleLogout = () => { localStorage.removeItem('userType'); navigate('/'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.mainBg, transition: 'background 0.3s' }}>

      {/* Sidebar */}
      <motion.div animate={{ width: collapsed ? '72px' : '260px' }} transition={{ duration: 0.25 }}
        style={{ background: t.sidebarBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, transition: 'background 0.3s' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${t.sidebarBorder}`, minHeight: 68 }}>
          <div style={{ minWidth: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Shield size={20} color="white" />
          </div>
          {!collapsed && (
            <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 17, letterSpacing: '-0.5px', color: 'white', fontWeight: 800, whiteSpace: 'nowrap' }}>
              OMNI<span style={{ color: '#818cf8' }}>SUPER</span>
            </motion.h3>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button key={idx} onClick={() => navigate(item.path)}
                style={{
                  padding: '11px 12px', width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  background: isActive ? t.activeBg : 'transparent',
                  color: isActive ? t.activeText : t.sidebarText,
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = 'white'; } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.sidebarText; } }}
                title={collapsed ? item.label : ''}>
                {item.icon}
                {!collapsed && <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${t.sidebarBorder}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={handleLogout}
            style={{ padding: '11px 12px', width: '100%', display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'transparent', color: '#fca5a5', cursor: 'pointer', borderRadius: 10, justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={18} />
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{ padding: '0 32px', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, flexShrink: 0, transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCollapsed(c => !c)}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub }}>
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }}><ChevronLeft size={16} /></motion.div>
            </button>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: t.headerText }}>OmniPlatform Control Center</h2>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* System status */}
            <div style={{ background: t.pillBg, padding: '6px 14px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: t.pillText }}>System: Online</span>
            </div>

            {/* Theme toggle */}
            <button onClick={toggle}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub, transition: 'all 0.2s' }}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color={t.headerSub} />
              <div style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }} />
            </div>

            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 13 }}>AD</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
