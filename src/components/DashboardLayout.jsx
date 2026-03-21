import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Search, Bell, Users, TrendingUp, Megaphone, HelpCircle, BarChart2, FileText, Folder, Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  const t = {
    sidebarBg:     isDark ? '#1e293b' : '#ffffff',
    sidebarBorder: isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9',
    sidebarText:   isDark ? '#94a3b8' : '#475569',
    activeBg:      '#4f46e5',
    activeText:    '#ffffff',
    hoverBg:       isDark ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.06)',
    headerBg:      isDark ? '#1e293b' : '#ffffff',
    headerBorder:  isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9',
    headerText:    isDark ? '#f1f5f9' : '#0f172a',
    headerSub:     isDark ? '#64748b' : '#94a3b8',
    mainBg:        isDark ? '#0f172a' : '#f8fafc',
    searchBg:      isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    searchBorder:  isDark ? 'rgba(255,255,255,0.08)' : 'transparent',
  };

  const menuItems = [
    { icon: <Users size={19} />,      label: 'Guest Directory',      path: '/dashboard/contacts'  },
    { icon: <TrendingUp size={19} />, label: 'Event Bookings',       path: '/dashboard/pipeline'  },
    { icon: <Megaphone size={19} />,  label: 'Guest Marketing',      path: '/dashboard/marketing' },
    { icon: <HelpCircle size={19} />, label: 'Maintenance & Service',path: '/dashboard/support'   },
    { icon: <BarChart2 size={19} />,  label: 'Revenue & Occupancy',  path: '/dashboard/analytics' },
    { icon: <FileText size={19} />,   label: 'Invoices & Billing',   path: '/dashboard/quotes'    },
    { icon: <Folder size={19} />,     label: 'Contracts & Folios',   path: '/dashboard/documents' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.mainBg, transition: 'background 0.3s' }}>

      {/* Sidebar */}
      <motion.div animate={{ width: collapsed ? '72px' : '260px' }} transition={{ duration: 0.25 }}
        style={{ background: t.sidebarBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, borderRight: `1px solid ${t.sidebarBorder}`, transition: 'background 0.3s, border-color 0.3s' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${t.sidebarBorder}`, minHeight: 68 }}>
          <div style={{ minWidth: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#ec4899)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <ShieldCheck size={20} color="white" />
          </div>
          {!collapsed && (
            <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 17, letterSpacing: '-0.5px', color: t.headerText, fontWeight: 800, whiteSpace: 'nowrap' }}>
              OMNI<span style={{ background: 'linear-gradient(135deg,#4f46e5,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HOTEL</span>
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
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = isDark ? 'white' : '#4f46e5'; } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.sidebarText; } }}
                title={collapsed ? item.label : ''}>
                {item.icon}
                {!collapsed && <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${t.sidebarBorder}` }}>
          <button onClick={() => navigate('/')}
            style={{ padding: '11px 12px', width: '100%', display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'transparent', color: isDark ? '#fca5a5' : '#ef4444', cursor: 'pointer', borderRadius: 10, justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={18} />
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: '0 32px', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, flexShrink: 0, transition: 'background 0.3s, border-color 0.3s' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCollapsed(c => !c)}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub }}>
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }}><ChevronLeft size={16} /></motion.div>
            </button>
            <div style={{ background: t.searchBg, border: `1px solid ${t.searchBorder}`, padding: '7px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={15} color={t.headerSub} />
              <input type="text" placeholder="Search guests, rooms, bookings..."
                style={{ background: 'transparent', border: 'none', color: t.headerText, outline: 'none', width: 220, fontSize: 13 }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Theme toggle */}
            <button onClick={toggle}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub, transition: 'all 0.2s' }}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color={t.headerSub} />
              <div style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, background: '#ec4899', borderRadius: '50%' }} />
            </div>

            <div style={{ width: 1, height: 28, background: t.headerBorder }} />

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: t.headerText }}>Jane Doe</p>
                <p style={{ fontSize: 11, color: t.headerSub }}>General Manager</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#ec4899)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 13 }}>JD</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
