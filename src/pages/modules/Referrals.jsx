import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, BedDouble, CreditCard, Wrench, Star, X, CheckCircle2 } from 'lucide-react';

const INIT_NOTIFS = [
  { id:1, type:'booking',     icon: BedDouble,    color:'#2563eb', bg:'#dbeafe', title:'New Booking Created',          desc:'Alice Johnson booked Suite 301 for Mar 22–26',    time:'5 min ago',  read:false, urgent:false },
  { id:2, type:'payment',     icon: CreditCard,   color:'#dc2626', bg:'#fee2e2', title:'Payment Pending',               desc:'Invoice #INV-2401 for $2,400 is overdue',         time:'12 min ago', read:false, urgent:true  },
  { id:3, type:'maintenance', icon: Wrench,       color:'#d97706', bg:'#fef3c7', title:'Maintenance Request',           desc:'Room 304 — AC not working. Reported by guest.',   time:'28 min ago', read:false, urgent:true  },
  { id:4, type:'feedback',    icon: Star,         color:'#059669', bg:'#d1fae5', title:'New 5-Star Review',             desc:'George Clooney left a 5-star review for Suite 302',time:'1 hour ago', read:true,  urgent:false },
  { id:5, type:'booking',     icon: BedDouble,    color:'#2563eb', bg:'#dbeafe', title:'Check-in Reminder',             desc:'Bob Smith arriving today at 2:00 PM — Room 205',  time:'2 hours ago',read:true,  urgent:false },
  { id:6, type:'payment',     icon: CreditCard,   color:'#059669', bg:'#d1fae5', title:'Payment Received',              desc:'$996 received from Alice Johnson via Credit Card', time:'3 hours ago',read:true,  urgent:false },
  { id:7, type:'maintenance', icon: Wrench,       color:'#059669', bg:'#d1fae5', title:'Maintenance Resolved',          desc:'Room 405 TV remote issue resolved by Housekeeping',time:'4 hours ago',read:true,  urgent:false },
  { id:8, type:'booking',     icon: BedDouble,    color:'#7c3aed', bg:'#ede9fe', title:'Upcoming Check-out',            desc:'Ethan Hunt checking out today from Deluxe 208',   time:'5 hours ago',read:true,  urgent:false },
  { id:9, type:'feedback',    icon: Star,         color:'#dc2626', bg:'#fee2e2', title:'Negative Review Alert',         desc:'1-star review from Ethan Hunt — needs attention', time:'Yesterday',  read:false, urgent:true  },
  { id:10,type:'payment',     icon: CreditCard,   color:'#d97706', bg:'#fef3c7', title:'Partial Payment Received',      desc:'$149 partial payment from Bob Smith — $298 pending',time:'Yesterday', read:true,  urgent:false },
];

const TYPE_FILTERS = ['All','booking','payment','maintenance','feedback'];

export default function Referrals() {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [filter, setFilter] = useState('All');

  const markRead    = (id) => setNotifs(ns => ns.map(n => n.id===id ? {...n,read:true} : n));
  const markAllRead = ()   => setNotifs(ns => ns.map(n => ({...n,read:true})));
  const dismiss     = (id) => setNotifs(ns => ns.filter(n => n.id!==id));

  const filtered = notifs.filter(n => filter==='All' || n.type===filter);
  const unreadCount = notifs.filter(n=>!n.read).length;

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0, display:'flex', alignItems:'center', gap:10 }}>
            Notifications
            {unreadCount > 0 && <span style={{ fontSize:13, fontWeight:700, padding:'2px 10px', borderRadius:20, background:'#fee2e2', color:'#dc2626' }}>{unreadCount} unread</span>}
          </h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Hotel alerts and activity updates</p>
        </div>
        {unreadCount > 0 && (
          <button className="b24-btn b24-btn-secondary" onClick={markAllRead}><CheckCircle2 size={13}/> Mark All Read</button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {TYPE_FILTERS.map(f => (
          <button key={f} onClick={()=>setFilter(f)} className={`b24-btn ${filter===f?'b24-btn-primary':'b24-btn-secondary'}`} style={{ fontSize:12, textTransform:'capitalize' }}>
            {f === 'All' ? 'All' : f.charAt(0).toUpperCase()+f.slice(1)+'s'}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 ? (
          <div style={{ ...card, padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>
            <Bell size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/>
            <p>No notifications</p>
          </div>
        ) : filtered.map((n,i) => {
          const Icon = n.icon;
          return (
            <motion.div key={n.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
              onClick={() => markRead(n.id)}
              style={{ ...card, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:14, cursor:'pointer', opacity: n.read ? 0.75 : 1, borderLeft:`3px solid ${n.read?'var(--card-border)':n.color}`, transition:'all 0.12s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(37,99,235,0.02)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--card-bg)'}>
              <div style={{ width:40, height:40, borderRadius:10, background:n.bg, display:'grid', placeItems:'center', flexShrink:0 }}>
                <Icon size={18} color={n.color}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight: n.read?600:800, color:'var(--text-primary)' }}>{n.title}</span>
                  {n.urgent && <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:10, background:'#fee2e2', color:'#dc2626' }}>URGENT</span>}
                  {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:n.color, flexShrink:0 }}/>}
                </div>
                <p style={{ fontSize:12, color:'var(--text-secondary)', margin:0, lineHeight:1.5 }}>{n.desc}</p>
                <span style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, display:'block' }}>{n.time}</span>
              </div>
              <button onClick={e=>{e.stopPropagation();dismiss(n.id);}} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4, flexShrink:0 }}><X size={14}/></button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
