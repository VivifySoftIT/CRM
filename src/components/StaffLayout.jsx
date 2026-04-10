import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Building2, Briefcase, CheckSquare, CalendarDays, Phone, LifeBuoy, FileText, MessageSquare, LogOut, Bell, ChevronDown, Search, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useStaffTheme } from '../context/useStaffTheme';

const NAV = [
  { section:'MAIN', items:[{ icon:LayoutDashboard, label:'Dashboard', path:'/staff/dashboard' }]},
  { section:'SALES & CRM', items:[
    { icon:UserPlus, label:'Leads', path:'/staff/leads' },
    { icon:Users, label:'Contacts', path:'/staff/contacts' },
    { icon:Building2, label:'Organizations', path:'/staff/accounts' },
    { icon:Briefcase, label:'Deals', path:'/staff/deals' },
  ]},
  { section:'ACTIVITIES', items:[
    { icon:CheckSquare, label:'Tasks', path:'/staff/tasks' },
    { icon:CalendarDays, label:'Meetings', path:'/staff/meetings' },
    { icon:Phone, label:'Calls', path:'/staff/calls' },
  ]},
  { section:'SUPPORT', items:[{ icon:LifeBuoy, label:'My Tickets', path:'/staff/cases' }]},
  { section:'TOOLS', items:[
    { icon:FileText, label:'Documents', path:'/staff/documents' },
    { icon:MessageSquare, label:'Messages', path:'/staff/messaging' },
  ]},
];

function Sidebar({ mobile, onClose, navigate, isActive }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', width:'256px', background:'linear-gradient(180deg,#0f172a 0%,#020617 100%)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'grid', placeItems:'center', flexShrink:0 }}>
          <LayoutDashboard size={18} color="white" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:'white', fontWeight:900, fontSize:'15px' }}>VIVIFY<span style={{ color:'#60a5fa' }}>CRM</span></div>
          <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', fontWeight:600 }}>Staff Portal</div>
        </div>
        {mobile && <button onClick={onClose} style={{ color:'rgba(255,255,255,0.4)', background:'none', border:'none', cursor:'pointer', padding:0 }}><X size={20} /></button>}
      </div>
      <nav style={{ flex:1, overflowY:'auto', padding:'16px 12px', scrollbarWidth:'none' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom:'20px' }}>
            <p style={{ color:'rgba(255,255,255,0.22)', fontSize:'10px', fontWeight:900, letterSpacing:'0.1em', padding:'0 12px', marginBottom:'6px' }}>{group.section}</p>
            {group.items.map(({ icon:Icon, label, path }) => {
              const active = isActive(path);
              return (
                <button key={path} onClick={() => { navigate(path); if (mobile) onClose(); }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', borderRadius:'12px', border:'none', cursor:'pointer', marginBottom:'2px', fontSize:'14px', fontWeight:600, transition:'all 0.15s', background:active?'linear-gradient(135deg,#3b82f6,#2563eb)':'transparent', color:active?'white':'rgba(255,255,255,0.5)', boxShadow:active?'0 4px 14px rgba(59,130,246,0.35)':'none' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='white'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}}>
                  <Icon size={17} />
                  <span style={{ flex:1, textAlign:'left' }}>{label}</span>
                  {active && <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'rgba(255,255,255,0.7)' }} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', borderRadius:'12px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#10b981,#059669)', display:'grid', placeItems:'center', color:'white', fontWeight:900, fontSize:'11px', flexShrink:0 }}>ES</div>
          <div>
            <div style={{ color:'white', fontSize:'13px', fontWeight:700 }}>Emma Staff</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>Support and Sales</div>
          </div>
        </div>
        <button onClick={() => navigate('/login')}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', borderRadius:'12px', border:'none', cursor:'pointer', color:'#f87171', background:'transparent', fontSize:'14px', fontWeight:600 }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(248,113,113,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isDark, toggle } = useStaffTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isActive = p => p === '/staff/dashboard' ? location.pathname === '/staff/dashboard' : location.pathname.startsWith(p);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:t.bg, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:'background 0.2s' }}>
      <aside style={{ flexShrink:0, boxShadow:'4px 0 24px rgba(0,0,0,0.2)', display:'flex', flexDirection:'column' }} className="staff-sidebar">
        <Sidebar navigate={navigate} isActive={isActive} />
      </aside>
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position:'relative', zIndex:10 }}>
            <Sidebar mobile onClose={() => setMobileOpen(false)} navigate={navigate} isActive={isActive} />
          </div>
        </div>
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <header style={{ height:'64px', background:t.navbarBg, borderBottom:'1px solid '+t.navbarBorder, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0, zIndex:10, transition:'background 0.2s' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <button onClick={() => setMobileOpen(true)} className="staff-menu-btn" style={{ padding:'8px', borderRadius:'8px', border:'none', background:'transparent', cursor:'pointer', color:t.textMuted, display:'none' }}><Menu size={20} /></button>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:t.input, border:'1px solid '+t.inputBorder, borderRadius:'12px', padding:'8px 14px', width:'220px' }}>
              <Search size={15} color={t.textMuted} />
              <input placeholder="Search..." style={{ background:'transparent', border:'none', outline:'none', fontSize:'14px', color:t.text, width:'100%' }} />
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <button onClick={toggle} title={isDark?'Light mode':'Dark mode'}
              style={{ width:'40px', height:'40px', borderRadius:'12px', border:'1px solid '+t.navbarBorder, background:t.input, display:'grid', placeItems:'center', cursor:'pointer', transition:'all 0.2s' }}>
              {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
            </button>
            <div style={{ position:'relative' }}>
              <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                style={{ position:'relative', width:'40px', height:'40px', borderRadius:'12px', border:'1px solid '+t.navbarBorder, background:t.input, display:'grid', placeItems:'center', cursor:'pointer', color:t.textSecondary }}>
                <Bell size={18} />
                <span style={{ position:'absolute', top:'9px', right:'9px', width:'8px', height:'8px', background:'#3b82f6', borderRadius:'50%', border:'2px solid '+t.navbarBg }} />
              </button>
              {notifOpen && (
                <div style={{ position:'absolute', right:0, top:'52px', width:'300px', background:t.card, borderRadius:'16px', boxShadow:'0 8px 40px rgba(0,0,0,0.2)', border:'1px solid '+t.cardBorder, zIndex:50, overflow:'hidden' }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid '+t.divider, display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:'14px', color:t.text }}>Notifications</span>
                    <span style={{ fontSize:'12px', color:'#3b82f6', cursor:'pointer' }}>Mark all read</span>
                  </div>
                  {[
                    { title:'New ticket assigned', sub:'TKT-1042 from Acme Corp', time:'2m ago', dot:'#3b82f6' },
                    { title:'Task overdue', sub:'Follow up with David', time:'1h ago', dot:'#ef4444' },
                    { title:'Deal updated', sub:'Vertex Corp - Proposal', time:'3h ago', dot:'#10b981' },
                  ].map((n, i) => (
                    <div key={i} style={{ display:'flex', gap:'12px', padding:'12px 16px', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background=t.hover}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <span style={{ marginTop:'6px', width:'8px', height:'8px', borderRadius:'50%', background:n.dot, flexShrink:0 }} />
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:600, color:t.text, margin:0 }}>{n.title}</p>
                        <p style={{ fontSize:'12px', color:t.textSecondary, margin:'2px 0 0' }}>{n.sub}</p>
                        <p style={{ fontSize:'11px', color:t.textMuted, margin:'2px 0 0' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position:'relative' }}>
              <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:'4px 12px 4px 4px', borderRadius:'12px', border:'1px solid '+t.navbarBorder, background:t.input, cursor:'pointer' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#10b981,#059669)', display:'grid', placeItems:'center', color:'white', fontWeight:900, fontSize:'11px' }}>ES</div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:t.text, lineHeight:1 }}>Emma Staff</div>
                  <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'2px' }}>Support and Sales</div>
                </div>
                <ChevronDown size={14} color={t.textMuted} />
              </button>
              {profileOpen && (
                <div style={{ position:'absolute', right:0, top:'52px', width:'200px', background:t.card, borderRadius:'16px', boxShadow:'0 8px 40px rgba(0,0,0,0.2)', border:'1px solid '+t.cardBorder, zIndex:200, overflow:'hidden' }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid '+t.divider }}>
                    <p style={{ fontWeight:700, fontSize:'13px', color:t.text, margin:0 }}>Emma Staff</p>
                    <p style={{ fontSize:'12px', color:t.textMuted, margin:'2px 0 0' }}>emma@vivifycrm.com</p>
                  </div>
                  <div style={{ padding:'4px 0' }}>
                    <button style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', border:'none', background:'transparent', fontSize:'13px', color:t.textSecondary, cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background=t.hover}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <User size={14} /> Profile Settings
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setProfileOpen(false); navigate('/login'); }}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', border:'none', background:'transparent', fontSize:'13px', color:'#ef4444', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background=isDark?'rgba(239,68,68,0.1)':'#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {(notifOpen || profileOpen) && (
          <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
        )}
        <main style={{ flex:1, overflowY:'auto', background:t.bg, transition:'background 0.2s' }}>
          <Outlet />
        </main>
      </div>
      <style>{`.staff-sidebar{display:flex!important;flex-direction:column}.staff-menu-btn{display:none!important}@media(max-width:1023px){.staff-sidebar{display:none!important}.staff-menu-btn{display:grid!important;place-items:center}}`}</style>
    </div>
  );
}
