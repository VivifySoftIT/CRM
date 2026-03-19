import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Users, TrendingUp, Megaphone, HelpCircle, BarChart3, 
  FileText, FolderOpen, CheckSquare, Calendar, Bot, 
  Layout, ShoppingBag, MessageSquare, ShieldCheck, 
  CreditCard, Smile, Share2, LogOut, ChevronLeft, Menu, Bell, Search, Settings
} from 'lucide-react';

const SidebarItem = ({ to, icon, label, collapsed }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '12px', color: 'var(--text-secondary)', marginBottom: '4px', transition: 'all 0.2s' }}
  >
    <div style={{ minWidth: '24px' }}>{icon}</div>
    {!collapsed && <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>{label}</span>}
  </NavLink>
);

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  const menuItems = [
    { to: 'contacts', icon: <Users size={20} />, label: 'Contacts & Leads' },
    { to: 'pipeline', icon: <TrendingUp size={20} />, label: 'Pipeline & Deals' },
    { to: 'marketing', icon: <Megaphone size={20} />, label: 'Marketing' },
    { to: 'support', icon: <HelpCircle size={20} />, label: 'Tickets & Support' },
    { to: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: 'quotes', icon: <FileText size={20} />, label: 'Quotes & Invoices' },
    { to: 'documents', icon: <FolderOpen size={20} />, label: 'Documents' },
    { to: 'tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { to: 'calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { to: 'automation', icon: <Bot size={20} />, label: 'Workflow' },
    { to: 'portal', icon: <Layout size={20} />, label: 'Customer Portal' },
    { to: 'products', icon: <ShoppingBag size={20} />, label: 'Products' },
    { to: 'messaging', icon: <MessageSquare size={20} />, label: 'SMS & WhatsApp' },
    { to: 'contracts', icon: <ShieldCheck size={20} />, label: 'Contracts' },
    { to: 'subscriptions', icon: <CreditCard size={20} />, label: 'Subscriptions' },
    { to: 'feedback', icon: <Smile size={20} />, label: 'Feedback' },
    { to: 'referrals', icon: <Share2 size={20} />, label: 'Referrals' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-darker)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="glass-card" style={{ 
        width: collapsed ? '80px' : '280px', 
        height: 'calc(100vh - 40px)', 
        margin: '20px', 
        padding: '24px 12px',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
        position: 'relative',
        zIndex: '10',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 32px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px' }}>
          <div className="gradient-bg" style={{ minWidth: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <ShieldCheck size={22} color="var(--text-primary)" />
          </div>
          {!collapsed && <h3 style={{ fontSize: '18px', letterSpacing: '-1px' }}>VIVIFY<span className="gradient-text">CRM</span></h3>}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
          {menuItems.map((item, idx) => (
            <SidebarItem key={idx} {...item} collapsed={collapsed} />
          ))}
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="btn-outline" 
          style={{ width: '40px', height: '40px', padding: '0', display: 'grid', placeItems: 'center', position: 'absolute', bottom: '24px', right: '12px', borderRadius: '10px' }}
        >
          <ChevronLeft style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)' }} />
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 20px 0', overflow: 'hidden' }}>
        {/* Topbar */}
        <header className="glass-card" style={{ 
          height: '70px', 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Menu size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
            <h2 style={{ fontSize: '20px', textTransform: 'capitalize' }}>{currentPath.replace(/-/g, ' ')}</h2>
            <div className="glass-card" style={{ background: 'rgba(0, 0, 0,0.05)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', marginLeft: '40px' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input type="text" placeholder="Search anything..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', width: '200px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }} />
            </div>
            <Settings size={20} color="var(--text-secondary)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>John Doe</p>
                <p style={{ fontSize: '12px', opacity: '0.6' }}>Super Admin</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))' }} />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
          <Outlet />
        </div>
      </main>

      <style>{`
        .sidebar-item:hover {
          background: rgba(0, 0, 0,0.05);
          color: white !important;
        }
        .sidebar-item.active {
          background: var(--primary);
          color: white !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
