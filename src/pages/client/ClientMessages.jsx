import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, User, Smile, Search } from 'lucide-react';

const CONTACTS = [
  { id:'c1', name:'Support Team',    role:'Technical Support', time:'10:45 AM', unread:1, msgs:[
    { from:'them', text:'Good morning! How can we assist you today?', time:'10:40 AM' },
    { from:'me',   text:'Hi, I need help with the API integration.',      time:'10:42 AM' },
    { from:'them', text:'Of course! Let me pull up your account documentation.', time:'10:45 AM' },
  ]},
  { id:'c2', name:'Account Manager', role:'Sales & Accounts', time:'Yesterday', unread:0, msgs:[
    { from:'me',   text:'Can we schedule a call to review the Q2 strategy?', time:'Yesterday' },
    { from:'them', text:'Absolutely! Does next Tuesday at 2 PM work for you?', time:'Yesterday' },
  ]},
  { id:'c3', name:'Billing Dept',    role:'Finance & Billing', time:'Mar 22', unread:0, msgs:[
    { from:'me',   text:'I have a question regarding invoice INV-2390.',  time:'Mar 22' },
    { from:'them', text:'I can help with that. What is your question?', time:'Mar 22' },
  ]},
];

export default function ClientMessages() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeId, setActiveId] = useState('c1');
  const [text, setText]         = useState('');
  const bottomRef = useRef(null);

  const active = contacts.find(c => c.id === activeId);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [active?.msgs?.length]);

  const send = () => {
    if (!text.trim()) return;
    setContacts(cs => cs.map(c => c.id===activeId ? { ...c, msgs:[...c.msgs,{ from:'me', text:text.trim(), time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }] } : c));
    setText('');
  };

  const selectContact = (id) => {
    setActiveId(id);
    setContacts(cs => cs.map(c => c.id===id ? {...c,unread:0} : c));
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Messages</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Chat with our support team</p>
      </div>

      <div style={{ background:'var(--card-bg)', borderRadius:18, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)', height:'calc(100vh - 220px)', display:'flex', overflow:'hidden' }}>

        {/* Contact list */}
        <div style={{ width:280, borderRight:'1px solid var(--card-border)', display:'flex', flexDirection:'column', flexShrink:0, background: 'var(--bg-darker)' }}>
          <div style={{ padding:'20px 16px', borderBottom:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:10, padding:'8px 12px' }}>
              <Search size={14} color='var(--text-muted)'/>
              <input placeholder="Search chats..." style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:'100%' }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {contacts.map(c => (
              <div key={c.id} onClick={() => selectContact(c.id)}
                style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', cursor:'pointer', background:activeId===c.id?'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)':'transparent', borderLeft:activeId===c.id?'4px solid var(--primary)':'4px solid transparent', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:14, fontWeight:800, color:activeId===c.id?'var(--primary)':'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)' }}>{c.time}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{c.msgs[c.msgs.length-1]?.text}</span>
                  {c.unread > 0 && <span style={{ background:'var(--primary)', color:'var(--card-bg)', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10 }}>{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', background:'var(--card-bg)' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--card-border)', display:'flex', alignItems:'center', gap:14, background:'var(--bg-darker)' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary), #818cf8)', display:'grid', placeItems:'center', boxShadow:'0 0 15px rgba(99, 102, 241, 0.3)' }}>
              <User size={18} color='#fff'/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>{active?.name}</div>
              <div style={{ fontSize:12, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981' }}/> Online
              </div>
            </div>
          </div>

          <div style={{ flex:1, padding:'24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:16, background: 'linear-gradient(180deg, var(--bg-darker) 0%, var(--card-bg) 100%)' }}>
            {active?.msgs.map((msg,i) => (
              <div key={i} style={{ display:'flex', justifyContent:msg.from==='me'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'72%', padding:'12px 16px', borderRadius:msg.from==='me'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                  background:msg.from==='me'?'var(--primary)':'var(--bg-darker)',
                  border:msg.from==='me'?'none':'1px solid var(--card-border)',
                  boxShadow: msg.from==='me' ? '0 8px 16px rgba(99, 102, 241, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <p style={{ fontSize:13, color:msg.from==='me'?'#fff':'var(--text-primary)', margin:0 }}>{msg.text}</p>
                  <span style={{ fontSize:10, color:msg.from==='me'?'rgba(255,255,255,0.7)':'var(--text-muted)', display:'block', textAlign:'right', marginTop:4 }}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          <div style={{ padding:'20px 24px', borderTop:'1px solid var(--card-border)', display:'flex', gap:12, alignItems:'center', background:'var(--bg-darker)' }}>
            <button style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Smile size={20}/></button>
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Write a message..." style={{ flex:1, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:12, padding:'11px 16px', color:'var(--text-primary)', fontSize:14, outline:'none' }}/>
            <button onClick={send} style={{ width:44, height:44, borderRadius:12, border:'none', background:'var(--primary)', display:'grid', placeItems:'center', cursor:'pointer', boxShadow:'0 0 15px rgba(99, 102, 241, 0.3)' }}>
              <Send size={18} color='#fff'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
