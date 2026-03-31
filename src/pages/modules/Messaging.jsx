import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Video, User, Smile, Mic, MicOff, PhoneOff, Search, Paperclip } from 'lucide-react';

const CONTACTS = [
  { id:'c1', name:'Alice Johnson',  role:'Guest',      time:'10:45 AM', unread:2, msgs:[
    { from:'them', text:'Hi, I have a question about my booking.', time:'10:40 AM' },
    { from:'me',   text:'Sure! How can I help you?',               time:'10:42 AM' },
    { from:'them', text:'Can I get an early check-in?',            time:'10:45 AM' },
  ]},
  { id:'c2', name:'Bob Smith',      role:'Guest',      time:'Yesterday', unread:0, msgs:[
    { from:'them', text:'When can we schedule a site tour?', time:'Yesterday' },
    { from:'me',   text:'How about Thursday at 2pm?',        time:'Yesterday' },
  ]},
  { id:'c3', name:'Maintenance Team',role:'Staff',     time:'9:30 AM',  unread:1, msgs:[
    { from:'them', text:'Room 304 AC repair completed.', time:'9:30 AM' },
  ]},
  { id:'c4', name:'Housekeeping',   role:'Staff',      time:'8:00 AM',  unread:0, msgs:[
    { from:'me',   text:'Please prioritize floors 3 and 4 today.', time:'8:00 AM' },
    { from:'them', text:'Understood, will do!',                     time:'8:05 AM' },
  ]},
];

export default function Messaging() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeId, setActiveId] = useState('c1');
  const [text, setText]         = useState('');
  const [calling, setCalling]   = useState(false);
  const [muted, setMuted]       = useState(false);
  const [search, setSearch]     = useState('');
  const bottomRef = useRef(null);

  const active = contacts.find(c => c.id === activeId);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [active?.msgs?.length]);

  const send = () => {
    if (!text.trim()) return;
    setContacts(cs => cs.map(c => c.id === activeId
      ? { ...c, msgs:[...c.msgs,{ from:'me', text:text.trim(), time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }] }
      : c
    ));
    setText('');
  };

  const selectContact = (id) => {
    setActiveId(id);
    setContacts(cs => cs.map(c => c.id===id ? {...c,unread:0} : c));
  };

  const filteredContacts = contacts.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight:'100%', background:'var(--bg-page)', display:'flex', flexDirection:'column' }}>

      {/* ── Header ── */}
      <div style={{ padding:'28px 32px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:900, color:'var(--text-primary)', margin:0, letterSpacing:'-0.6px' }}>Messages</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'3px 0 0' }}>Chat with contacts, guests, and team members.</p>
          </div>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div style={{ padding:'0 32px 32px', flex:1, display:'flex', gap:16, overflow:'hidden', minHeight:0 }}>

        {/* Contact list */}
        <div style={{ width:300, background:'var(--card-bg)', borderRadius:12, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'8px 12px' }}>
              <Search size={14} color='var(--text-muted)'/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:'100%' }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filteredContacts.map(c => (
              <div key={c.id} onClick={() => selectContact(c.id)}
                style={{ padding:'14px 16px', borderBottom:'1px solid var(--card-border)', cursor:'pointer', background:activeId===c.id?'rgba(37,99,235,0.06)':'transparent', borderLeft:activeId===c.id?'3px solid #2563eb':'3px solid transparent', transition:'all 0.12s' }}
                onMouseEnter={e => { if(activeId!==c.id) e.currentTarget.style.background='rgba(0,0,0,0.015)'; }}
                onMouseLeave={e => { if(activeId!==c.id) e.currentTarget.style.background='transparent'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{c.name}</span>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10, background:c.role==='Guest'?'#dbeafe':'#d1fae5', color:c.role==='Guest'?'#2563eb':'#059669' }}>{c.role}</span>
                  </div>
                  <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{c.time}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:190 }}>{c.msgs[c.msgs.length-1]?.text}</span>
                  {c.unread > 0 && <span style={{ background:'#2563eb', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, flexShrink:0 }}>{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex:1, background:'var(--card-bg)', borderRadius:12, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)', display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
          {/* Chat Header */}
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'grid', placeItems:'center' }}>
                <User size={18} color='#fff'/>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)' }}>{active?.name}</div>
                <div style={{ fontSize:11, color:'#10b981', fontWeight:600 }}>● Online</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setCalling(true)} style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--card-border)'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--input-bg)'}><Phone size={15}/></button>
              <button onClick={()=>setCalling(true)} style={{ width:36, height:36, borderRadius:10, border:'none', background:'#2563eb', display:'grid', placeItems:'center', cursor:'pointer', color:'#fff' }}
                onMouseEnter={e=>e.currentTarget.style.background='#1d4ed8'}
                onMouseLeave={e=>e.currentTarget.style.background='#2563eb'}><Video size={15}/></button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, padding:'20px', overflowY:'auto', display:'flex', flexDirection:'column', gap:12 }}>
            {active?.msgs.map((msg,i) => (
              <motion.div key={i} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', justifyContent:msg.from==='me'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'65%', padding:'10px 14px', borderRadius:msg.from==='me'?'14px 14px 4px 14px':'14px 14px 14px 4px',
                  background:msg.from==='me'?'#2563eb':'var(--input-bg)',
                  border:msg.from==='me'?'none':'1px solid var(--card-border)',
                  boxShadow:msg.from==='me'?'0 2px 8px rgba(37,99,235,0.2)':'none' }}>
                  <p style={{ fontSize:13, color:msg.from==='me'?'#fff':'var(--text-primary)', margin:0, lineHeight:1.5 }}>{msg.text}</p>
                  <span style={{ fontSize:10, color:msg.from==='me'?'rgba(255,255,255,0.65)':'var(--text-muted)', display:'block', textAlign:'right', marginTop:4 }}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
            <button style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}><Smile size={20}/></button>
            <button style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}><Paperclip size={20}/></button>
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Type a message..." className="b24-input" style={{ flex:1, borderRadius:10, padding:'10px 16px' }}/>
            <button onClick={send} style={{ width:40, height:40, borderRadius:10, border:'none', background:'#2563eb', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0 }}
              onMouseEnter={e=>e.currentTarget.style.background='#1d4ed8'}
              onMouseLeave={e=>e.currentTarget.style.background='#2563eb'}>
              <Send size={16} color='#fff'/>
            </button>
          </div>
        </div>
      </div>

      {/* Call overlay */}
      {calling && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(12px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
          <div style={{ width:100, height:100, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'grid', placeItems:'center', boxShadow:'0 0 40px rgba(37,99,235,0.4)' }}>
            <User size={44} color='#fff'/>
          </div>
          <div style={{ textAlign:'center', color:'#fff' }}>
            <h2 style={{ fontSize:26, fontWeight:800, margin:0 }}>{active?.name}</h2>
            <p style={{ opacity:0.6, marginTop:6 }}>Calling...</p>
          </div>
          <div style={{ display:'flex', gap:20 }}>
            <button onClick={()=>setMuted(m=>!m)} style={{ width:52, height:52, borderRadius:'50%', background:muted?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.1)', border:'none', color:muted?'#ef4444':'#fff', cursor:'pointer', display:'grid', placeItems:'center' }}>
              {muted?<MicOff size={22}/>:<Mic size={22}/>}
            </button>
            <button onClick={()=>setCalling(false)} style={{ width:52, height:52, borderRadius:'50%', background:'#ef4444', border:'none', color:'#fff', cursor:'pointer', display:'grid', placeItems:'center', boxShadow:'0 8px 24px rgba(239,68,68,0.4)' }}>
              <PhoneOff size={22}/>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
