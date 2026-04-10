import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, MoreVertical, Search, Phone, Video } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Did we get the signed contract from Apex yet?", sender: 'other', time: '10:30 AM', user: 'Sarah Doe' },
    { id: 2, text: "Not yet, they said they'll send it by EOD.", sender: 'me', time: '10:32 AM' },
    { id: 3, text: "Okay, perfect. I'll prep the onboarding docs.", sender: 'other', time: '10:35 AM', user: 'Sarah Doe' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', background: 'var(--bg-page)' }}>
      
      {/* Sidebar Channels/Users */}
      <div style={{ width: 320, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', background: 'var(--card-bg)' }}>
         <div style={{ padding: 24, borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare size={18} color="#10b981" /> Internal Chat
            </h2>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input placeholder="Search colleagues..." style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--input-bg)', outline: 'none', color: 'var(--text-primary)' }} />
            </div>
         </div>
         <div style={{ flex: 1, overflowY: 'auto' }}>
            {[
              { name: 'Sarah Doe', role: 'Sales Team', active: true, unread: 0 },
              { name: 'Sales Hub General', role: 'Group Channel', active: false, unread: 3 },
              { name: 'Mike Ross', role: 'Legal', active: false, unread: 0 },
              { name: 'Emma Wilson', role: 'Support', active: false, unread: 0 },
            ].map((contact, i) => (
              <div key={i} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: contact.active ? 'rgba(16,185,129,0.1)' : 'transparent', borderLeft: contact.active ? '3px solid #10b981' : '3px solid transparent', transition: 'background 0.2s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 14 }}>
                  {contact.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{contact.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{contact.role}</div>
                </div>
                {contact.unread > 0 && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{contact.unread}</div>
                )}
              </div>
            ))}
         </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Chat Header */}
        <div style={{ height: 72, padding: '0 32px', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 }}>S</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>Sarah Doe</div>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Online
                </div>
              </div>
           </div>
           <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)' }}>
             <Phone size={20} style={{ cursor: 'pointer' }} />
             <Video size={20} style={{ cursor: 'pointer' }} />
             <MoreVertical size={20} style={{ cursor: 'pointer' }} />
           </div>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
           <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, margin: '10px 0' }}>Today</div>
           
           {messages.map((msg) => (
             <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '70%' }}>
                  {msg.sender === 'other' && <div style={{ width: 28, height: 28, borderRadius: 8, background: '#10b981', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900, flexShrink: 0 }}>S</div>}
                  <div style={{ 
                    padding: '12px 16px', 
                    background: msg.sender === 'me' ? '#2563eb' : 'var(--card-bg)', 
                    color: msg.sender === 'me' ? '#fff' : 'var(--text-primary)',
                    borderRadius: msg.sender === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    border: msg.sender === 'me' ? 'none' : '1px solid var(--card-border)',
                    fontSize: 14, lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, margin: msg.sender === 'me' ? '0 4px 0 0' : '0 0 0 40px' }}>
                  {msg.time} {msg.sender === 'me' && '· Read'}
                </div>
             </div>
           ))}
        </div>

        {/* Message Input */}
        <div style={{ padding: 24, borderTop: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
             <button type="button" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
               <Paperclip size={18} />
             </button>
             <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1, height: 44, borderRadius: 22, border: '1px solid var(--card-border)', background: 'var(--input-bg)', padding: '0 20px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }} />
             <button type="submit" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#10b981', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
               <Send size={18} style={{ position: 'relative', left: -1, top: 1 }} />
             </button>
          </form>
        </div>

      </div>
    </div>
  );
}
