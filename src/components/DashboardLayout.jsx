import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users, UserPlus, Building2, Briefcase,
  CheckSquare, CalendarDays, Phone,
  FileText, ShoppingBag, Receipt,
  BarChart3, Megaphone, Settings,
  LogOut, ShieldCheck, ChevronDown, ChevronLeft, Search, Sun, Moon, Bell,
  LifeBuoy, BookOpen, Mail, Share2, Globe, MessageSquare
} from 'lucide-react';

// ── Zoho-style CRM Nav Groups ──
const NAV_GROUPS = [
  {
    section: 'MAIN', icon: LayoutDashboard,
    items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }]
  },
  {
    section: 'CRM', icon: Users,
    items: [
      { icon: UserPlus,      label: 'Leads',    path: '/dashboard/leads'    },
      { icon: Users,         label: 'Contacts', path: '/dashboard/contacts' },
      { icon: Building2,     label: 'Accounts', path: '/dashboard/accounts' },
      { icon: Briefcase,     label: 'Deals',    path: '/dashboard/deals'    },
      { icon: MessageSquare, label: 'Feedbacks',path: '/dashboard/feedback' },
    ]
  },
  {
    section: 'ACTIVITIES', icon: CheckSquare,
    items: [
      { icon: CheckSquare,   label: 'Tasks',    path: '/dashboard/tasks'    },
      { icon: CalendarDays,  label: 'Meetings', path: '/dashboard/meetings' },
      { icon: Phone,         label: 'Calls',    path: '/dashboard/calls'    },
      { icon: Mail,          label: 'Messages', path: '/dashboard/messaging' },
    ]
  },
  {
    section: 'SALES', icon: Receipt,
    items: [
      { icon: FileText,    label: 'Quotes',   path: '/dashboard/quotes'   },
      { icon: Receipt,     label: 'Invoices', path: '/dashboard/invoices' },
    ]
  },
  {
    section: 'SUPPORT', icon: LifeBuoy,
    items: [
      { icon: LifeBuoy, label: 'Cases',     path: '/dashboard/cases'     },
      { icon: BookOpen, label: 'Solutions', path: '/dashboard/solutions' },
    ]
  },
  {
    section: 'INTEGRATIONS', icon: Globe,
    items: [
      { icon: Mail,   label: 'Sales Inbox', path: '/dashboard/sales-inbox' },
      { icon: Share2, label: 'Social',     path: '/dashboard/social'      },
      { icon: Globe,  label: 'Visits',     path: '/dashboard/visits'      },
    ]
  },
  {
    section: 'MARKETING', icon: Megaphone,
    items: [
      { icon: Megaphone, label: 'Campaigns', path: '/dashboard/campaigns' },
    ]
  },
  {
    section: 'ANALYTICS', icon: BarChart3,
    items: [
      { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    ]
  },
  {
    section: 'SYSTEM', icon: Settings,
    items: [
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ]
  },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isDark, toggle } = useTheme();

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  const activeGroupSection = NAV_GROUPS.find(g => g.items.some(i => isActive(i.path)))?.section || 'MAIN';

  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    NAV_GROUPS.forEach(g => { init[g.section] = g.section === activeGroupSection; });
    return init;
  });

  useEffect(() => {
    setOpenGroups(prev => ({ ...prev, [activeGroupSection]: true }));
  }, [activeGroupSection]);

  const toggleGroup = (section) =>
    setOpenGroups(prev => ({ ...prev, [section]: !prev[section] }));

  const hdrBg  = isDark ? '#131d2b' : '#ffffff';
  const hdrBdr = isDark ? 'rgba(255,255,255,0.07)' : '#e8edf3';
  const hdrTxt = isDark ? '#f1f5f9' : '#1a2332';
  const hdrSub = isDark ? '#4a5e72' : '#94a3b8';
  const mainBg = isDark ? '#0b1320' : '#f0f4f8';

  return (
    <div style={{ display:'flex', height:'100vh', background:mainBg, fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>

      {/* ── Sidebar ── */}
      <motion.div
        animate={{ width: collapsed ? 60 : 256 }}
        transition={{ duration:0.2, ease:'easeInOut' }}
        style={{ background:'#1a1f3c', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden', zIndex:20, boxShadow:'4px 0 24px rgba(0,0,0,0.25)' }}>

        {/* Logo Section */}
        <div style={{ height:64, display:'flex', alignItems:'center', padding:collapsed?'0 14px':'0 20px', gap:12, borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#3b82f6)', display:'grid', placeItems:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(37,99,235,0.4)' }}>
            <ShieldCheck size={18} color='#fff'/>
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.05 }}>
              <div style={{ fontSize:17, fontWeight:900, color:'#fff', letterSpacing:'-0.4px', whiteSpace:'nowrap' }}>
                VIVIFY<span style={{ color:'#60a5fa' }}>CRM</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Sales Professional</div>
            </motion.div>
          )}
        </div>

        {/* Navigation Core */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:collapsed?'8px 6px':'10px 0 12px', scrollbarWidth:'none' }}>
          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.section];
            const groupHasActive = group.items.some(i => isActive(i.path));

            return (
              <div key={group.section} style={{ marginBottom: 4 }}>

                {/* Group Header Toggle */}
                <button
                  onClick={() => toggleGroup(group.section)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: collapsed ? 0 : 10,
                    padding: collapsed ? '11px 0' : '9px 20px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: groupHasActive ? 'rgba(37,99,235,0.12)' : isOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
                    color: groupHasActive ? '#60a5fa' : isOpen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
                    border: 'none',
                    borderLeft: !collapsed ? (groupHasActive ? '3px solid #3b82f6' : '3px solid transparent') : 'none',
                    cursor: 'pointer', transition: 'all 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!groupHasActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}}
                  onMouseLeave={e => { if (!groupHasActive) { e.currentTarget.style.background = isOpen ? 'rgba(255,255,255,0.03)' : 'transparent'; e.currentTarget.style.color = isOpen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'; }}}>

                  <GroupIcon size={18} style={{ flexShrink: 0, opacity: groupHasActive ? 1 : 0.7 }} />

                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {group.section}
                      </span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={14} style={{ opacity: 0.5 }} />
                      </motion.div>
                    </>
                  )}
                </button>

                {/* Sub-items Container */}
                <AnimatePresence initial={false}>
                  {isOpen && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}>

                      {group.items.map((item, idx) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <button key={idx} onClick={() => navigate(item.path)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center',
                              gap: 12,
                              padding: '8px 20px 8px 36px',
                              background: active ? 'rgba(37,99,235,0.2)' : 'transparent',
                              color: active ? '#93c5fd' : 'rgba(255,255,255,0.5)',
                              border: 'none',
                              cursor: 'pointer', transition: 'all 0.1s',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}>

                            <Icon size={16} />
                            <span style={{ fontSize: 14.5, fontWeight: active ? 700 : 500 }}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0, padding: 12 }}>
          <button onClick={() => navigate('/')}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:collapsed?0:12, padding:collapsed?'12px 0':'10px 16px', justifyContent:collapsed?'center':'flex-start', border:'none', background:'rgba(248,113,113,0.05)', borderRadius: 10, color:'#f87171', cursor:'pointer', fontSize:14, fontWeight:700, transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(248,113,113,0.15)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(248,113,113,0.05)'}>
            <LogOut size={18}/>{!collapsed&&'Sign Out'}
          </button>
        </div>
      </motion.div>

      {/* ── Main Content Area ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Global Toolbar */}
        <div style={{ height:64, padding:'0 28px', display:'flex', justifyContent:'space-between', alignItems:'center', background:hdrBg, borderBottom:`1px solid ${hdrBdr}`, flexShrink:0, boxShadow:isDark?'none':'0 1px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={()=>setCollapsed(c=>!c)}
              style={{ width:36, height:36, borderRadius:10, border:`1px solid ${hdrBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub, transition: 'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.02)'}>
              <motion.div animate={{ rotate:collapsed?180:0 }} transition={{ duration:0.2 }}><ChevronLeft size={18}/></motion.div>
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:12, background:isDark?'rgba(255,255,255,0.04)':'#f1f5f9', border:`1px solid ${hdrBdr}`, padding:'8px 16px', borderRadius:11, minWidth:320 }}>
              <Search size={16} color={hdrSub}/>
              <input placeholder="Search Leads, Contacts, Deals..." style={{ background:'transparent', border:'none', color:hdrTxt, outline:'none', fontSize:14, width:'100%' }}/>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={toggle} style={{ width:40, height:40, borderRadius:11, border:`1px solid ${hdrBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub }} title="Toggle Theme">
              {isDark?<Sun size={18}/>:<Moon size={18}/>}
            </button>
            <div style={{ position:'relative', width:40, height:40, borderRadius:11, border:`1px solid ${hdrBdr}`, display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub }} title="Notifications">
              <Bell size={18}/>
              <div style={{ position:'absolute', top:10, right:10, width:7, height:7, background:'#ef4444', borderRadius:'50%', border:`2px solid ${hdrBg}` }}/>
            </div>
            <div style={{ width:1, height:24, background:hdrBdr, margin: '0 4px' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 14px', borderRadius:12, border:`1px solid ${hdrBdr}`, cursor:'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background=isDark?'rgba(255,255,255,0.04)':'#f8fafc'}>
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#60a5fa)', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:12 }}>JS</div>
              <div style={{ display: collapsed ? 'none' : 'block' }}>
                <div style={{ fontSize:13, fontWeight:800, color:hdrTxt, lineHeight:1.2 }}>John Sales</div>
                <div style={{ fontSize:11, color:hdrSub, fontWeight: 500 }}>Lead Executive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <div style={{ flex:1, overflowY:'auto', background: isDark ? '#0b1320' : '#f8fafc' }}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
}
