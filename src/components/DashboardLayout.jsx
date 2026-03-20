import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Search, Bell, Settings, Users, TrendingUp, Megaphone, HelpCircle, BarChart2, FileText, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Users size={20} />, label: "Guest Directory", path: "/dashboard/contacts" },
    { icon: <TrendingUp size={20} />, label: "Event Bookings", path: "/dashboard/pipeline" },
    { icon: <Megaphone size={20} />, label: "Guest Marketing", path: "/dashboard/marketing" },
    { icon: <HelpCircle size={20} />, label: "Maintenance & Service", path: "/dashboard/support" },
    { icon: <BarChart2 size={20} />, label: 'Revenue & Occupancy', path: '/dashboard/analytics' },
    { icon: <FileText size={20} />, label: 'Invoices & Billing', path: '/dashboard/quotes' },
    { icon: <Folder size={20} />, label: 'Contracts & Folios', path: '/dashboard/documents' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-darker)' }}>
      {/* Sidebar */}
      <motion.div 
        animate={{ width: collapsed ? '80px' : '280px' }}
        className="glass-card"
        style={{ margin: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="gradient-bg" style={{ minWidth: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <ShieldCheck size={22} color="white" />
          </div>
          {!collapsed && <h3 style={{ fontSize: '18px', letterSpacing: '-1px', color: 'var(--text-primary)' }}>OMNI<span className="gradient-text">HOTEL</span></h3>}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
          <div style={{ padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item, idx) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  style={{
                    padding: '12px', width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    borderRadius: '12px', transition: 'all 0.2s', border: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start'
                  }}
                  onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                  onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  title={collapsed ? item.label : ''}
                >
                  {item.icon}
                  {!collapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="btn-outline"
          style={{ position: 'absolute', bottom: '24px', right: '24px', padding: '8px', zIndex: 10 }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}><ChevronLeft size={20} color="var(--text-primary)" /></motion.div>
        </button>
      </motion.div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="glass-card" style={{ background: 'rgba(0,0,0,0.03)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', marginLeft: '20px' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search guests, rooms, bookings..." 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '250px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }} />
            </div>
            <Settings size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Jane Doe</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>General Manager</p>
              </div>
              <div className="gradient-bg" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 40px 40px 40px' }} className="custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
