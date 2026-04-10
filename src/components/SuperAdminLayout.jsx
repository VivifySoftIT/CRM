import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Shield, Settings, LogOut, Bell,
  Package, BarChart2, Sun, Moon, ChevronLeft, Search, X,
  CheckCircle, AlertTriangle, XCircle, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NOTIFICATIONS = [
  { id:1, icon: UserPlus,      color:'#10b981', title:'New org registered',      sub:'Bloom Digital joined',          time:'2m ago',  unread:true  },
  { id:2, icon: XCircle,       color:'#ef4444', title:'Payment failed',           sub:'Dune Ventures — $999',          time:'1h ago',  unread:true  },
  { id:3, icon: AlertTriangle, color:'#f59e0b', title:'Suspicious login',         sub:'Orbit Solutions',               time:'3h ago',  unread:true  },
  { id:4, icon: CheckCircle,   color:'#6366f1', title:'Subscription upgraded',    sub:'Nexus Corp → Enterprise',       time:'5h ago',  unread:false },
];

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed]       = useState(false);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [searchVal, setSearchVal]       = useState('');
  const [notifs, setNotifs]             = useState(NOTIFICATIONS);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isDark, toggle } = useTheme();
  const notifRef  = useRef(null);

  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const t = {
    sidebarBg:     isDark ? '#0a0f1e' : '#1e1b4b',
    sidebarBorder: 'rgba(255,255,255,0.07)',
    sidebarText:   'rgba(255,255,255,0.45)',
    activeText:    '#ffffff',
    activeBg:      'rgba(99,102,241,0.2)',
    hoverBg:       'rgba(255,255,255,0.06)',
    headerBg:      isDark ? 'rgba(10,15,30,0.85)' : 'rgba(255,255,255,0.85)',
    headerBorder:  isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    headerText:    isDark ? '#f1f5f9' : '#0f172a',
    headerSub:     isDark ? '#64748b' : '#94a3b8',
    mainBg:        isDark ? '#060d1a' : '#f1f5f9',
  };

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Platform Overview',  path: '/super-admin/dashboard' },
    { icon: <Building2 size={18} />,       label: 'Organizations',       path: '/super-admin/companies' },
    { icon: <Package size={18} />,         label: 'Subscription Plans', path: '/super-admin/plans'     },
    { icon: <BarChart2 size={18} />,       label: 'Analytics',          path: '/super-admin/analytics' },
    { icon: <Settings size={18} />,        label: 'Global Settings',    path: '/super-admin/settings'  },
  ];

  const handleLogout = () => { localStorage.removeItem('userType'); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.mainBg, transition: 'background 0.3s' }}>

      {/* ── Sidebar ── */}
      <motion.div animate={{ width: collapsed ? '68px' : '240px' }} transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
        style={{ background: t.sidebarBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, borderRight: `1px solid ${t.sidebarBorder}` }}>

        {/* Logo */}
        <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${t.sidebarBorder}`, minHeight: 64 }}>
          <div style={{ minWidth: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            <Shield size={18} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                style={{ fontSize: 16, fontWeight: 800, color: 'white', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
                OMNI<span style={{ color: '#818cf8' }}>SUPER</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button key={idx} onClick={() => navigate(item.path)} title={collapsed ? item.label : ''}
                style={{
                  padding: '10px 10px', width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  background: isActive ? t.activeBg : 'transparent',
                  color: isActive ? '#fff' : t.sidebarText,
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '2px solid #6366f1' : '2px solid transparent',
                  position: 'relative',
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = 'white'; } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.sidebarText; } }}>
                {item.icon}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${t.sidebarBorder}` }}>
          <button onClick={handleLogout} title={collapsed ? 'Logout' : ''}
            style={{ padding: '10px 10px', width: '100%', display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', color: '#fca5a5', cursor: 'pointer', borderRadius: 10, justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={18} />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 13, fontWeight: 600 }}>Logout</motion.span>}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* ── Glassmorphism Header ── */}
        <header style={{
          padding: '0 24px', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          flexShrink: 0, transition: 'background 0.3s', position: 'sticky', top: 0, zIndex: 40,
        }}>
          {/* Left: collapse + search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <button onClick={() => setCollapsed(c => !c)}
              style={{ width: 32, height: 32, borderRadius: '8px', border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub, flexShrink: 0 }}>
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronLeft size={15} />
              </motion.div>
            </button>

            {/* Global Search */}
            <div style={{ position: 'relative', maxWidth: 360, flex: 1 }}>
              <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.headerSub, pointerEvents: 'none' }} />
              <input
                value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search organizations, users, plans..."
                style={{
                  width: '100%', paddingLeft: '34px', paddingRight: searchVal ? '32px' : '12px',
                  paddingTop: '8px', paddingBottom: '8px',
                  borderRadius: '99px', border: `1px solid ${t.headerBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: t.headerText, fontSize: '13px', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = t.headerBorder; e.target.style.boxShadow = 'none'; }}
              />
              {searchVal && (
                <button onClick={() => setSearchVal('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.headerSub, display: 'grid', placeItems: 'center' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Right: status + theme + notifs + avatar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* System status pill */}
            <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', padding: '5px 12px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: 7, border: `1px solid ${t.headerBorder}` }}>
              <div style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.headerSub }}>All Systems Online</span>
            </div>

            {/* Theme toggle */}
            <button onClick={toggle}
              style={{ width: 34, height: 34, borderRadius: '10px', border: `1px solid ${t.headerBorder}`, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub, transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifs(v => !v)}
                style={{ width: 34, height: 34, borderRadius: '10px', border: `1px solid ${t.headerBorder}`, background: showNotifs ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: t.headerSub, position: 'relative', transition: 'all 0.2s' }}>
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: `2px solid ${t.headerBg}` }} />
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320,
                      background: isDark ? '#0d1526' : '#ffffff',
                      border: `1px solid ${t.headerBorder}`, borderRadius: '16px',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.18)', zIndex: 100, overflow: 'hidden',
                    }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.headerBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: t.headerText }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                          style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifs.map(n => (
                      <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                        style={{ display: 'flex', gap: '12px', padding: '12px 16px', cursor: 'pointer', background: n.unread ? (isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)') : 'transparent', borderBottom: `1px solid ${t.headerBorder}`, transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
                        onMouseOut={e => e.currentTarget.style.background = n.unread ? (isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)') : 'transparent'}>
                        <div style={{ width: 32, height: 32, borderRadius: '9px', background: n.color + '18', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <n.icon size={14} color={n.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: t.headerText }}>{n.title}</p>
                          <p style={{ fontSize: '11px', color: t.headerSub, marginTop: '1px' }}>{n.sub}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                          <span style={{ fontSize: '10px', color: t.headerSub }}>{n.time}</span>
                          {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />}
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <button style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', borderRadius: '99px', border: `1px solid ${t.headerBorder}`, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 11 }}>SA</div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: t.headerText, lineHeight: 1.2 }}>Super Admin</p>
                <p style={{ fontSize: '10px', color: '#6366f1', fontWeight: '700', lineHeight: 1.2 }}>● Platform Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }} className="custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
