import { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { useStaffTheme } from '../../context/useStaffTheme';

const CONTACTS = [
  { id:1, name:'Alice Johnson',  role:'Acme Corp',      av:'AJ', bg:'linear-gradient(135deg,#3b82f6,#1d4ed8)', unread:2, last:'Can you check the ticket?',  time:'2m'  },
  { id:2, name:'Bob Smith',      role:'Urban Stay',     av:'BS', bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)', unread:0, last:'Thanks for the update!',      time:'1h'  },
  { id:3, name:'Sarah Connor',   role:'Riviera Resort', av:'SC', bg:'linear-gradient(135deg,#f43f5e,#be123c)', unread:1, last:'Invoice is ready for review.', time:'3h'  },
  { id:4, name:'Mike Ross',      role:'Nexus Group',    av:'MR', bg:'linear-gradient(135deg,#10b981,#059669)', unread:0, last:'Deal closed successfully.',   time:'1d'  },
  { id:5, name:'Emma Wilson',    role:'Pinnacle Co',    av:'EW', bg:'linear-gradient(135deg,#f59e0b,#d97706)', unread:0, last:'Please send the contract.',   time:'2d'  },
];
const INIT_MSGS = {
  1: [
    { from:'them', text:'Hi Emma, can you check ticket TKT-1042?',       time:'10:02 AM' },
    { from:'me',   text:'Sure! Looking into it right now.',               time:'10:05 AM' },
    { from:'them', text:'The login issue is still happening on our end.', time:'10:06 AM' },
    { from:'me',   text:'Escalated to tech team. ETA 2 hours.',           time:'10:10 AM' },
    { from:'them', text:'Can you check the ticket?',                      time:'10:12 AM' },
  ],
  2: [{ from:'them', text:'Thanks for the update!', time:'9:00 AM' }],
  3: [{ from:'them', text:'Invoice is ready for review.', time:'8:30 AM' }],
  4: [{ from:'them', text:'Deal closed successfully.', time:'Yesterday' }],
  5: [{ from:'them', text:'Please send the contract.', time:'2 days ago' }],
};

export default function StaffMessages() {
  const { t } = useStaffTheme();
  const [active, setActive] = useState(1);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, active]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => ({ ...m, [active]: [...(m[active]||[]), { from:'me', text:input.trim(), time:'Now' }] }));
    setInput('');
  };

  const contact = CONTACTS.find(c => c.id === active);
  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:'28px', height:'calc(100vh - 64px)', boxSizing:'border-box', background: t.bg, transition:'background 0.2s' }}>
      <div style={{ display:'flex', height:'100%', background: t.card, borderRadius:'20px', border:`1px solid ${t.cardBorder}`, boxShadow: t.cardShadow, overflow:'hidden' }}>

        {/* Contact List */}
        <div style={{ width:'280px', flexShrink:0, borderRight:`1px solid ${t.divider}`, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'16px', borderBottom:`1px solid ${t.divider}` }}>
            <h3 style={{ fontSize:'16px', fontWeight:800, color: t.text, margin:'0 0 12px' }}>Messages</h3>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background: t.input, border:`1px solid ${t.inputBorder}`, borderRadius:'10px', padding:'8px 12px' }}>
              <Search size={14} color={t.textMuted}/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
                style={{ background:'transparent', border:'none', outline:'none', fontSize:'13px', color: t.text, width:'100%' }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filtered.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', border:'none', cursor:'pointer', textAlign:'left', background: active===c.id ? (t.tableHover) : 'transparent', borderBottom:`1px solid ${t.divider}`, transition:'background 0.1s' }}
                onMouseEnter={e => { if (active!==c.id) e.currentTarget.style.background = t.hover; }}
                onMouseLeave={e => { if (active!==c.id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:c.bg, display:'grid', placeItems:'center', color:'white', fontWeight:900, fontSize:'12px', flexShrink:0 }}>{c.av}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'13px', fontWeight:700, color: t.text }}>{c.name}</span>
                    <span style={{ fontSize:'11px', color: t.textMuted }}>{c.time}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2px' }}>
                    <span style={{ fontSize:'12px', color: t.textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'140px' }}>{c.last}</span>
                    {c.unread > 0 && <span style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#2563eb', color:'white', fontSize:'10px', fontWeight:900, display:'grid', placeItems:'center', flexShrink:0 }}>{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${t.divider}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:contact?.bg, display:'grid', placeItems:'center', color:'white', fontWeight:900, fontSize:'12px' }}>{contact?.av}</div>
              <div>
                <p style={{ fontSize:'14px', fontWeight:700, color: t.text, margin:0 }}>{contact?.name}</p>
                <p style={{ fontSize:'12px', color: t.textSecondary, margin:'1px 0 0' }}>{contact?.role}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              {[Phone, Video, MoreVertical].map((Icon, i) => (
                <button key={i} style={{ width:'36px', height:'36px', borderRadius:'10px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, display:'grid', placeItems:'center', cursor:'pointer', color: t.textSecondary }}><Icon size={16}/></button>
              ))}
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'12px', background: t.bgSecondary }}>
            {(msgs[active]||[]).map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.from==='me'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'65%', padding:'10px 14px', borderRadius: m.from==='me'?'16px 16px 4px 16px':'16px 16px 16px 4px', background: m.from==='me'?'#2563eb': t.card, color: m.from==='me'?'white': t.text, boxShadow: m.from==='me'?'0 2px 8px rgba(37,99,235,0.3)': t.cardShadow, border: m.from==='me'?'none':`1px solid ${t.cardBorder}` }}>
                  <p style={{ fontSize:'14px', margin:0, lineHeight:1.5 }}>{m.text}</p>
                  <p style={{ fontSize:'11px', margin:'4px 0 0', opacity:0.6 }}>{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          <div style={{ padding:'16px 20px', borderTop:`1px solid ${t.divider}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', background: t.input, border:`1px solid ${t.inputBorder}`, borderRadius:'14px', padding:'10px 14px' }}>
              <button style={{ background:'none', border:'none', cursor:'pointer', color: t.textMuted, display:'grid', placeItems:'center', flexShrink:0 }}><Paperclip size={18}/></button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} placeholder="Type a message..."
                style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:'14px', color: t.text }}/>
              <button onClick={send} style={{ width:'34px', height:'34px', borderRadius:'10px', background:'#2563eb', border:'none', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0 }}>
                <Send size={15} color="white"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
