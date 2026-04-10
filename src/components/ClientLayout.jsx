import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Ticket, CreditCard, Folder,
  MessageSquare, User, Bell, ChevronDown, LogOut, X,
  Menu, Search, Check, Sun, Moon, ShieldCheck, ChevronLeft, HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',                path: '/client/dashboard'  },
  { icon: Ticket,          label: 'My Tickets',               path: '/client/tickets'    },
  { icon: CreditCard,      label: 'Billing & Payments',       path: '/client/billing'    },
  { icon: Folder,          label: 'Documents',                path: '/client/documents'  },
  { icon: MessageSquare,   label: 'Messages / Communication', path: '/client/messages'   },
  { icon: HelpCircle,      label: 'Help Center',              path: '/client/help'       },
  { icon: User,            label: 'Profile Settings',         path: '/client/profile'    },
];

const NOTIFS = [
  { id:1, text:'Your invoice #INV-2401 is due in 3 days', time:'2h ago', read:false, color:'#f59e0b' },
  { id:2, text:'Ticket #TK-005 has been resolved',        time:'5h ago', read:false, color:'#10b981' },
];

export default function ClientLayout() {
  const [collapsed, setCollapsed]     = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs]           = useState(NOTIFS);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isDark, toggle } = useTheme();

  const unread = notifs.filter(n => !n.read).length;
  const isActive = (path) => location.pathname.startsWith(path);

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  const hdrBg  = isDark ? '#131d2b' : '#ffffff';
  const hdrBdr = isDark ? 'rgba(255,255,255,0.07)' : '#e8edf3';
  const hdrTxt = isDark ? '#f1f5f9' : '#1a2332';
  const hdrSub = isDark ? '#4a5e72' : '#94a3b8';
  const mainBg = isDark ? '#0b1320' : '#f0f4f8';

  return (
    <div style={{ display:'flex', height:'100vh', background:mainBg, fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>

      {/* ── Sidebar ── */}
      <motion.div animate={{ width: collapsed ? 60 : 256 }} transition={{ duration:0.2, ease:'easeInOut' }}
        style={{ background:'#1a1f3c', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden', boxShadow:'4px 0 24px rgba(0,0,0,0.25)', zIndex:50 }}>

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
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Client Portal</div>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:collapsed?'8px 6px':'10px 0 12px', scrollbarWidth:'none' }}>
          <div style={{ marginBottom: 4 }}>
          {NAV.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button key={idx} onClick={() => navigate(item.path)} title={collapsed ? item.label : ''}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 12,
                  padding: collapsed ? '11px 0' : '9px 20px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'rgba(37,99,235,0.12)' : 'transparent',
                  color: active ? '#60a5fa' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  borderLeft: !collapsed ? (active ? '3px solid #3b82f6' : '3px solid transparent') : 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}>
                <Icon size={18} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                {!collapsed && (
                  <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 800 : 500, letterSpacing: active ? '0.02em' : 'normal', textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0, padding: 12 }}>
          <button onClick={() => navigate('/login')}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:collapsed?0:12, padding:collapsed?'12px 0':'10px 16px', justifyContent:collapsed?'center':'flex-start', border:'none', background:'rgba(248,113,113,0.05)', borderRadius: 10, color:'#f87171', cursor:'pointer', fontSize:14, fontWeight:700, transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(248,113,113,0.15)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(248,113,113,0.05)'}>
            <LogOut size={18}/>{!collapsed&&'Sign Out'}
          </button>
        </div>
      </motion.div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Global Toolbar */}
        <div style={{ height:64, padding:'0 28px', display:'flex', justifyContent:'space-between', alignItems:'center', background:hdrBg, borderBottom:`1px solid ${hdrBdr}`, flexShrink:0, boxShadow:isDark?'none':'0 1px 10px rgba(0,0,0,0.03)', zIndex:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={() => setCollapsed(c => !c)}
              style={{ width:36, height:36, borderRadius:10, border:`1px solid ${hdrBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub, transition: 'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.02)'}>
              <motion.div animate={{ rotate:collapsed?180:0 }} transition={{ duration:0.2 }}><Menu size={18}/></motion.div>
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:12, background:isDark?'rgba(255,255,255,0.04)':'#f1f5f9', border:`1px solid ${hdrBdr}`, padding:'8px 16px', borderRadius:11, minWidth:320 }}>
              <Search size={16} color={hdrSub}/>
              <input placeholder="Search requests, tickets, invoices..." style={{ background:'transparent', border:'none', color:hdrTxt, outline:'none', fontSize:14, width:'100%' }}/>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Theme Toggle */}
            <button onClick={toggle}
              style={{ width:40, height:40, borderRadius:11, border:`1px solid ${hdrBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub }} title="Toggle Theme">
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            {/* Notifications */}
            <div style={{ position:'relative' }}>
              <div onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                style={{ width:40, height:40, borderRadius:11, border:`1px solid ${hdrBdr}`, background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:hdrSub, position:'relative' }}>
                <Bell size={18}/>
                {unread > 0 && <div style={{ position:'absolute', top:10, right:10, width:7, height:7, background:'#ef4444', borderRadius:'50%', border:`2px solid ${hdrBg}` }}/>}
              </div>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity:0, y:8, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8 }}
                    style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:320, background:'var(--card-bg)', borderRadius:12, border:'1px solid var(--card-border)', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>Notifications {unread>0&&<span style={{ marginLeft:6, padding:'1px 7px', borderRadius:10, background:'var(--input-bg)', color:'var(--danger)', fontSize:11, fontWeight:700 }}>{unread}</span>}</span>
                      {unread > 0 && <button onClick={markAllRead} style={{ fontSize:11, color:'var(--primary)', fontWeight:600, background:'transparent', border:'none', cursor:'pointer' }}>Mark all read</button>}
                    </div>
                    {notifs.map(n => (
                      <div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--card-border)', background:n.read?'transparent':'var(--input-bg)', display:'flex', gap:10, alignItems:'flex-start' }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:n.read?'var(--card-border)':n.color, flexShrink:0, marginTop:4 }}/>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:12, color:'var(--text-primary)', margin:0, lineHeight:1.5 }}>{n.text}</p>
                          <span style={{ fontSize:11, color:'var(--text-muted)' }}>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width:1, height:24, background:hdrBdr, margin: '0 4px' }}/>

            {/* Profile */}
            <div style={{ position:'relative' }}>
              <div onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 14px', borderRadius:12, border:`1px solid ${hdrBdr}`, cursor:'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background=isDark?'rgba(255,255,255,0.04)':'#f8fafc'}>
                <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:12 }}>AM</div>
                <div style={{ display: collapsed ? 'none' : 'block' }}>
                  <div style={{ fontSize:13, fontWeight:800, color:hdrTxt, lineHeight:1.2 }}>Alex Morgan</div>
                  <div style={{ fontSize:11, color:hdrSub, fontWeight: 500 }}>Client</div>
                </div>
              </div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    style={{ position:'absolute', right:0, top:'calc(100% + 6px)', background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', minWidth:160, zIndex:200, overflow:'hidden' }}>
                    {[{ label:'My Profile', path:'/client/profile' },{ label:'Billing', path:'/client/billing' }].map(item => (
                      <button key={item.path} onClick={() => { navigate(item.path); setProfileOpen(false); }}
                        style={{ width:'100%', padding:'10px 16px', border:'none', background:'transparent', textAlign:'left', fontSize:13, color:'var(--text-primary)', cursor:'pointer', fontWeight:500 }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--input-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ height:1, background:'var(--card-border)' }}/>
                    <button onClick={(e) => { e.stopPropagation(); setProfileOpen(false); navigate('/login'); }} style={{ width:'100%', padding:'10px 16px', border:'none', background:'transparent', textAlign:'left', fontSize:13, color:'var(--danger)', cursor:'pointer', fontWeight:600 }}>Sign Out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', background: isDark ? '#0b1320' : '#f8fafc' }}>
          <div style={{ padding: '28px' }}>
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}
