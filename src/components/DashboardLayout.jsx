import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, UserPlus, Building2, Briefcase,
  CheckSquare, CalendarDays, Phone, FileText, Receipt,
  BarChart3, TrendingUp, Target, Megaphone, Settings, Zap,
  LogOut, ShieldCheck, ChevronDown, Search, Sun, Moon, Bell,
  LifeBuoy, BookOpen, Mail, Share2, Globe, MessageSquare,
  Plus, UserCircle, X, ChevronRight, PanelLeftClose,
  PanelLeftOpen, Sparkles, Activity, Hash
} from 'lucide-react';

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: 'MAIN', icon: LayoutDashboard,
    items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }]
  },
  {
    section: 'CRM', icon: Users,
    items: [
      { icon: UserPlus,      label: 'Leads',          path: '/dashboard/leads'    },
      { icon: Users,         label: 'Contacts',       path: '/dashboard/contacts' },
      { icon: Building2,     label: 'Organizations',       path: '/dashboard/accounts' },
      { icon: Briefcase,     label: 'Opportunities',  path: '/dashboard/deals'    },
      { icon: MessageSquare, label: 'Feedbacks',      path: '/dashboard/feedback' },
    ]
  },
  {
    section: 'ACTIVITIES', icon: CheckSquare,
    items: [
      { icon: CheckSquare,  label: 'Tasks',    path: '/dashboard/tasks'    },
      { icon: CalendarDays, label: 'Meetings', path: '/dashboard/meetings' },
      { icon: Phone,        label: 'Calls',    path: '/dashboard/calls'    },
      { icon: Mail,         label: 'Messages', path: '/dashboard/messaging'},
    ]
  },
  {
    section: 'SALES', icon: Receipt,
    items: [
      { icon: FileText, label: 'Quotes',   path: '/dashboard/quotes'   },
      { icon: Receipt,  label: 'Invoices', path: '/dashboard/invoices' },
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
      { icon: Mail,   label: 'Inbox Hub', path: '/dashboard/sales-inbox' },
      { icon: Share2, label: 'Social',    path: '/dashboard/social'      },
      { icon: Globe,  label: 'Visits',    path: '/dashboard/visits'      },
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
      { icon: BarChart3,  label: 'Reports',     path: '/dashboard/reports'     },
      { icon: TrendingUp, label: 'Forecasting', path: '/dashboard/forecasting' },
      { icon: Target,     label: 'Goals',       path: '/dashboard/goals'       },
    ]
  },
  {
    section: 'SYSTEM', icon: Settings,
    items: [
      { icon: Zap,      label: 'Automation', path: '/dashboard/automation' },
      { icon: Settings, label: 'Settings',   path: '/dashboard/settings'  },
    ]
  },
];

const QUICK_ACTIONS = [
  { label: 'Add Lead',     icon: UserPlus,  path: '/dashboard/leads',    color: '#2563eb' },
  { label: 'Create Deal',  icon: Briefcase, path: '/dashboard/deals',    color: '#8b5cf6' },
  { label: 'Add Task',     icon: CheckSquare,path:'/dashboard/tasks',    color: '#10b981' },
  { label: 'New Meeting',  icon: CalendarDays,path:'/dashboard/meetings',color: '#f59e0b' },
];

const MOCK_NOTIFS = [
  { id:1, icon: UserPlus,   color:'#2563eb', title:'New lead assigned',       sub:'Alice Johnson from Vertex Corp', time:'2m ago',  read:false },
  { id:2, icon: Briefcase,  color:'#8b5cf6', title:'Deal stage updated',      sub:'Acme License → Proposal',        time:'15m ago', read:false },
  { id:3, icon: CheckSquare,color:'#ef4444', title:'Task overdue',            sub:'Follow up with David',           time:'1h ago',  read:false },
  { id:4, icon: Receipt,    color:'#10b981', title:'Invoice paid',            sub:'INV-240301 · ₹2,22,610',         time:'3h ago',  read:true  },
  { id:5, icon: Activity,   color:'#f59e0b', title:'Workflow executed',       sub:'New Lead Auto-Assign ran',       time:'5h ago',  read:true  },
];

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position:'relative', display:'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity:0, x:-4 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
            style={{ position:'absolute', left:'calc(100% + 10px)', top:'50%', transform:'translateY(-50%)', background:'#0f172a', color:'#fff', fontSize:12, fontWeight:700, padding:'5px 10px', borderRadius:7, whiteSpace:'nowrap', zIndex:999, pointerEvents:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
            {label}
            <div style={{ position:'absolute', left:-4, top:'50%', transform:'translateY(-50%)', width:8, height:8, background:'#0f172a', rotate:'45deg' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Notification Dropdown ─────────────────────────────────────────────────────
function NotifDropdown({ onClose, isDark }) {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const unread = notifs.filter(n => !n.read).length;
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read:true })));

  return (
    <motion.div initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:0.96 }}
      transition={{ duration:0.18 }}
      style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:360, background: isDark?'#131b2e':'#fff', border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'#e2e8f0'}`, borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', zIndex:200, overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.06)':'#f1f5f9'}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:14, fontWeight:800, color: isDark?'#f1f5f9':'#0f172a' }}>Notifications</span>
          {unread > 0 && <span style={{ fontSize:10, fontWeight:900, background:'#ef4444', color:'#fff', padding:'2px 7px', borderRadius:99 }}>{unread}</span>}
        </div>
        {unread > 0 && <button onClick={markAll} style={{ fontSize:11, fontWeight:700, color:'#2563eb', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Mark all read</button>}
      </div>
      <div style={{ maxHeight:340, overflowY:'auto' }}>
        {notifs.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id?{...x,read:true}:x))}
              style={{ padding:'12px 18px', display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer', background: n.read ? 'transparent' : isDark?'rgba(37,99,235,0.06)':'rgba(37,99,235,0.03)', borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.04)':'#f8fafc'}`, transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = isDark?'rgba(255,255,255,0.03)':'#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = n.read?'transparent':isDark?'rgba(37,99,235,0.06)':'rgba(37,99,235,0.03)'}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${n.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}>
                <Icon size={16} color={n.color} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight: n.read?600:800, color: isDark?'#f1f5f9':'#0f172a', marginBottom:2 }}>{n.title}</div>
                <div style={{ fontSize:12, color: isDark?'#64748b':'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.sub}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                <span style={{ fontSize:10, color: isDark?'#475569':'#94a3b8', fontWeight:600 }}>{n.time}</span>
                {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#2563eb' }} />}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:'10px 18px', borderTop:`1px solid ${isDark?'rgba(255,255,255,0.06)':'#f1f5f9'}`, textAlign:'center' }}>
        <button style={{ fontSize:12, fontWeight:700, color:'#2563eb', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>View all notifications</button>
      </div>
    </motion.div>
  );
}

// ── Quick Create Dropdown ─────────────────────────────────────────────────────
function QuickCreateDropdown({ onClose, navigate, isDark }) {
  return (
    <motion.div initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:0.96 }}
      transition={{ duration:0.18 }}
      style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:220, background: isDark?'#131b2e':'#fff', border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'#e2e8f0'}`, borderRadius:14, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', zIndex:200, overflow:'hidden', padding:6 }}>
      {QUICK_ACTIONS.map(a => {
        const Icon = a.icon;
        return (
          <button key={a.label} onClick={() => { navigate(a.path); onClose(); }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color: isDark?'#e2e8f0':'#1e293b', textAlign:'left', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = isDark?'rgba(255,255,255,0.05)':'#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${a.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}>
              <Icon size={14} color={a.color} />
            </div>
            {a.label}
          </button>
        );
      })}
    </motion.div>
  );
}

// ── User Menu Dropdown ────────────────────────────────────────────────────────
function UserMenuDropdown({ onClose, navigate, isDark }) {
  const items = [
    { icon: UserCircle, label:'My Profile',  action: () => navigate('/profile') },
    { icon: Settings,   label:'Settings',    action: () => navigate('/dashboard/settings') },
    { icon: Hash,       label:'Keyboard Shortcuts', action: () => {} },
  ];
  return (
    <motion.div initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:0.96 }}
      transition={{ duration:0.18 }}
      style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:220, background: isDark?'#131b2e':'#fff', border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'#e2e8f0'}`, borderRadius:14, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', zIndex:200, overflow:'hidden' }}>
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.06)':'#f1f5f9'}`, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2563eb,#60a5fa)', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:14, flexShrink:0 }}>JS</div>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color: isDark?'#f1f5f9':'#0f172a' }}>John Sales</div>
          <div style={{ fontSize:11, color: isDark?'#64748b':'#94a3b8' }}>Lead Executive</div>
        </div>
      </div>
      <div style={{ padding:6 }}>
        {items.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => { item.action(); onClose(); }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color: isDark?'#cbd5e1':'#374151', textAlign:'left', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = isDark?'rgba(255,255,255,0.05)':'#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Icon size={15} color={isDark?'#64748b':'#94a3b8'} /> {item.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding:'6px 6px 8px', borderTop:`1px solid ${isDark?'rgba(255,255,255,0.06)':'#f1f5f9'}` }}>
        <button onClick={() => { navigate('/'); onClose(); }}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:'#ef4444', textAlign:'left', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={15} color="#ef4444" /> Sign Out
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [searchVal, setSearchVal]   = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isDark, toggle } = useTheme();
  const notifRef  = useRef(null);
  const createRef = useRef(null);
  const userRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current  && !notifRef.current.contains(e.target))  setNotifOpen(false);
      if (createRef.current && !createRef.current.contains(e.target)) setCreateOpen(false);
      if (userRef.current   && !userRef.current.contains(e.target))   setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  const activeSection = NAV_GROUPS.find(g => g.items.some(i => isActive(i.path)))?.section || 'MAIN';

  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    NAV_GROUPS.forEach(g => { init[g.section] = g.section === activeSection || g.section === 'ANALYTICS'; });
    return init;
  });

  useEffect(() => {
    setOpenGroups(prev => ({ ...prev, [activeSection]: true }));
  }, [activeSection]);

  const toggleGroup = s => setOpenGroups(prev => ({ ...prev, [s]: !prev[s] }));

  const unreadCount = MOCK_NOTIFS.filter(n => !n.read).length;

  // Theme-aware colors
  const bg      = isDark ? '#0b1121' : '#f1f5f9';
  const sideBar = isDark ? '#060d1a' : '#0f172a';
  const topBar  = isDark ? 'rgba(11,17,33,0.95)' : '#ffffff';
  const topBdr  = isDark ? 'rgba(255,255,255,0.06)' : '#e8edf3';
  const topTxt  = isDark ? '#f1f5f9' : '#0f172a';
  const topMut  = isDark ? '#475569' : '#94a3b8';
  const topSub  = isDark ? '#334155' : '#f1f5f9';

  return (
    <div style={{ display:'flex', height:'100vh', background:bg, fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 248 }}
        transition={{ duration:0.22, ease:[0.4,0,0.2,1] }}
        style={{ background:sideBar, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden', zIndex:30, position:'relative' }}>

        {/* Subtle gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(37,99,235,0.04) 0%,transparent 40%)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ height:60, display:'flex', alignItems:'center', padding: collapsed?'0 16px':'0 18px', gap:10, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0, position:'relative' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#2563eb,#3b82f6)', display:'grid', placeItems:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(37,99,235,0.45)' }}>
            <ShieldCheck size={16} color='#fff' strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }} transition={{ duration:0.18 }}>
                <div style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'-0.3px', lineHeight:1.1 }}>
                  VIVIFY<span style={{ color:'#60a5fa' }}>CRM</span>
                </div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, letterSpacing:'0.04em' }}>SALES PROFESSIONAL</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: collapsed?'8px 8px':'8px 0 12px', scrollbarWidth:'none' }}>
          {NAV_GROUPS.map(group => {
            const GIcon = group.icon;
            const isOpen = openGroups[group.section];
            const hasActive = group.items.some(i => isActive(i.path));

            return (
              <div key={group.section} style={{ marginBottom:2 }}>
                {/* Section header */}
                {collapsed ? (
                  <Tooltip label={group.section}>
                    <button onClick={() => toggleGroup(group.section)}
                      style={{ width:'100%', height:40, display:'flex', alignItems:'center', justifyContent:'center', border:'none', background: hasActive?'rgba(37,99,235,0.15)':'transparent', borderRadius:10, cursor:'pointer', color: hasActive?'#60a5fa':'rgba(255,255,255,0.4)', margin:'1px 0', transition:'all 0.15s' }}
                      onMouseEnter={e => { if(!hasActive) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { if(!hasActive) e.currentTarget.style.background='transparent'; }}>
                      <GIcon size={17} />
                    </button>
                  </Tooltip>
                ) : (
                  <button onClick={() => toggleGroup(group.section)}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'7px 14px', border:'none', background: hasActive?'rgba(37,99,235,0.1)':'transparent', cursor:'pointer', transition:'all 0.15s',
                      color: hasActive?'#60a5fa':isOpen?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.35)',
                      borderLeft: hasActive?'2px solid #3b82f6':'2px solid transparent' }}
                    onMouseEnter={e => { if(!hasActive){ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; }}}
                    onMouseLeave={e => { if(!hasActive){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=isOpen?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.35)'; }}}>
                    <GIcon size={14} style={{ flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:10, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', textAlign:'left' }}>{group.section}</span>
                    <motion.div animate={{ rotate: isOpen?180:0 }} transition={{ duration:0.2 }}>
                      <ChevronDown size={12} style={{ opacity:0.5 }} />
                    </motion.div>
                  </button>
                )}

                {/* Sub-items */}
                <AnimatePresence initial={false}>
                  {isOpen && !collapsed && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }} style={{ overflow:'hidden' }}>
                      {group.items.map((item, idx) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <button key={idx} onClick={() => navigate(item.path)}
                            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 14px 8px 30px', border:'none', cursor:'pointer', transition:'all 0.12s', borderRadius:0,
                              background: active?'rgba(37,99,235,0.18)':'transparent',
                              color: active?'#93c5fd':'rgba(255,255,255,0.45)',
                              borderLeft: active?'2px solid #3b82f6':'2px solid transparent' }}
                            onMouseEnter={e => { if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}}
                            onMouseLeave={e => { if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}}>
                            <Icon size={15} style={{ flexShrink:0 }} />
                            <span style={{ fontSize:13.5, fontWeight: active?700:500, letterSpacing:'-0.1px' }}>{item.label}</span>
                            {active && <ChevronRight size={12} style={{ marginLeft:'auto', opacity:0.6 }} />}
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

        {/* Sidebar footer */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding: collapsed?'10px 8px':'10px 12px', flexShrink:0 }}>
          {collapsed ? (
            <Tooltip label="Sign Out">
              <button onClick={() => navigate('/')}
                style={{ width:'100%', height:38, display:'flex', alignItems:'center', justifyContent:'center', border:'none', background:'rgba(239,68,68,0.08)', borderRadius:9, cursor:'pointer', color:'#f87171', transition:'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>
                <LogOut size={16} />
              </button>
            </Tooltip>
          ) : (
            <button onClick={() => navigate('/')}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', border:'none', background:'rgba(239,68,68,0.06)', borderRadius:10, cursor:'pointer', color:'#f87171', fontSize:13, fontWeight:700, transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.06)'}>
              <LogOut size={15} /> Sign Out
            </button>
          )}
        </div>
      </motion.aside>

      {/* ══ MAIN AREA ════════════════════════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* ── TOP NAVBAR ── */}
        <header style={{ height:60, padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', background:topBar, borderBottom:`1px solid ${topBdr}`, flexShrink:0, backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', position:'relative', zIndex:20 }}>

          {/* Left: collapse + search */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setCollapsed(c => !c)}
              style={{ width:34, height:34, borderRadius:9, border:`1px solid ${topBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:topMut, transition:'all 0.2s', flexShrink:0 }}
              onMouseEnter={e => { e.currentTarget.style.background=topSub; e.currentTarget.style.color=topTxt; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=topMut; }}>
              {collapsed ? <PanelLeftOpen size={16}/> : <PanelLeftClose size={16}/>}
            </button>

            {/* Search */}
            <div style={{ display:'flex', alignItems:'center', gap:10, background: isDark?'rgba(255,255,255,0.04)':topSub, border:`1px solid ${topBdr}`, padding:'0 14px', borderRadius:10, height:36, minWidth:280, transition:'all 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor='#2563eb'}
              onBlur={e => e.currentTarget.style.borderColor=topBdr}>
              <Search size={14} color={topMut} style={{ flexShrink:0 }} />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search leads, contacts, deals..."
                style={{ background:'transparent', border:'none', color:topTxt, outline:'none', fontSize:13, width:'100%', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
              {searchVal && (
                <button onClick={() => setSearchVal('')} style={{ background:'transparent', border:'none', padding:0, cursor:'pointer', color:topMut, display:'flex' }}><X size={13}/></button>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>

            {/* Quick Create */}
            <div ref={createRef} style={{ position:'relative' }}>
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                onClick={() => { setCreateOpen(v=>!v); setNotifOpen(false); setUserOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'0 14px', height:34, borderRadius:9, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 10px rgba(37,99,235,0.35)', whiteSpace:'nowrap' }}>
                <Plus size={15} strokeWidth={2.5} /> Create
              </motion.button>
              <AnimatePresence>
                {createOpen && <QuickCreateDropdown onClose={() => setCreateOpen(false)} navigate={navigate} isDark={isDark} />}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div style={{ width:1, height:22, background:topBdr }} />

            {/* Theme toggle */}
            <button onClick={toggle}
              style={{ width:34, height:34, borderRadius:9, border:`1px solid ${topBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:topMut, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=topSub; e.currentTarget.style.color=topTxt; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=topMut; }}>
              {isDark ? <Sun size={15}/> : <Moon size={15}/>}
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position:'relative' }}>
              <button onClick={() => { setNotifOpen(v=>!v); setCreateOpen(false); setUserOpen(false); }}
                style={{ width:34, height:34, borderRadius:9, border:`1px solid ${topBdr}`, background: notifOpen?topSub:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:topMut, transition:'all 0.2s', position:'relative' }}
                onMouseEnter={e => { if(!notifOpen){ e.currentTarget.style.background=topSub; e.currentTarget.style.color=topTxt; }}}
                onMouseLeave={e => { if(!notifOpen){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=topMut; }}}>
                <Bell size={15}/>
                {unreadCount > 0 && (
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                    style={{ position:'absolute', top:6, right:6, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:`2px solid ${topBar}` }} />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} isDark={isDark} />}
              </AnimatePresence>
            </div>

            {/* User avatar */}
            <div ref={userRef} style={{ position:'relative' }}>
              <button onClick={() => { setUserOpen(v=>!v); setNotifOpen(false); setCreateOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px 4px 4px', borderRadius:10, border:`1px solid ${topBdr}`, background: userOpen?topSub:'transparent', cursor:'pointer', transition:'all 0.2s' }}
                onMouseEnter={e => { if(!userOpen) e.currentTarget.style.background=topSub; }}
                onMouseLeave={e => { if(!userOpen) e.currentTarget.style.background='transparent'; }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#2563eb,#60a5fa)', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:11, flexShrink:0 }}>JS</div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:12, fontWeight:800, color:topTxt, lineHeight:1.2 }}>John Sales</div>
                  <div style={{ fontSize:10, color:topMut, fontWeight:500 }}>Lead Executive</div>
                </div>
                <ChevronDown size={12} color={topMut} style={{ transform: userOpen?'rotate(180deg)':'none', transition:'transform 0.2s' }} />
              </button>
              <AnimatePresence>
                {userOpen && <UserMenuDropdown onClose={() => setUserOpen(false)} navigate={navigate} isDark={isDark} />}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main style={{ flex:1, overflowY:'auto', background:bg, scrollbarWidth:'thin', scrollbarColor: isDark?'#1e293b transparent':'#e2e8f0 transparent' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
