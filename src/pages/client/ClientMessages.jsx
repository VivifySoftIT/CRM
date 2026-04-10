import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, User, Search, Paperclip, Smile, Phone, Video,
  MoreVertical, Check, CheckCheck, Clock, X, Plus, Image,
  File, RefreshCw, MessageSquare, Wifi, WifiOff
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* ── Data ─────────────────────────────────────────────────────────────────── */
const CONTACTS = [
  {
    id: 'c1',
    name: 'Support Team',
    role: 'Technical Support',
    avatar: 'ST',
    color: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    online: true,
    unread: 2,
    lastSeen: 'Online',
    msgs: [
      { id:1, from:'them', text:'Hello! 👋 Welcome to VivifyCRM Support. How can we help you today?', time:'9:00 AM', status:'read' },
      { id:2, from:'me',   text:'Hi, I need help setting up the API integration with our existing system.', time:'9:05 AM', status:'read' },
      { id:3, from:'them', text:'Of course! We can help with that. Could you tell me which system you\'re trying to integrate with?', time:'9:07 AM', status:'read' },
      { id:4, from:'me',   text:'It\'s Salesforce. We need to sync contacts and deals bidirectionally.', time:'9:10 AM', status:'read' },
      { id:5, from:'them', text:'Great! We have a native Salesforce connector. I\'ll pull up the documentation and step you through it. Give me just a moment...', time:'9:12 AM', status:'read' },
      { id:6, from:'them', text:'I\'ve shared the API Integration Spec PDF in your Documents section. It covers the Salesforce connector setup in detail. Would you like me to schedule a screen-share session to walk you through it?', time:'10:22 AM', status:'read' },
      { id:7, from:'me',   text:'Yes, a screen share would be really helpful. When are you available?', time:'10:25 AM', status:'delivered' },
      { id:8, from:'them', text:'I can do tomorrow at 2 PM or 4 PM IST. Which works better for you?', time:'10:30 AM', status:'read' },
    ],
  },
  {
    id: 'c2',
    name: 'Account Manager',
    role: 'Sales & Accounts',
    avatar: 'AM',
    color: 'linear-gradient(135deg,#10b981,#059669)',
    online: false,
    unread: 0,
    lastSeen: 'Yesterday at 6:30 PM',
    msgs: [
      { id:1, from:'me',   text:'Hi Sarah, can we schedule a call to review the Q2 service roadmap?', time:'Yesterday', status:'read' },
      { id:2, from:'them', text:'Hi! Absolutely. Does Tuesday at 2 PM work for you? I\'ll send a calendar invite.', time:'Yesterday', status:'read' },
      { id:3, from:'me',   text:'Tuesday 2 PM works perfectly for me. Thanks!', time:'Yesterday', status:'read' },
      { id:4, from:'them', text:'Great! I\'ll also prepare a Q2 overview deck so we can discuss the subscription upgrade options. Looking forward to it! 😊', time:'Yesterday', status:'read' },
    ],
  },
  {
    id: 'c3',
    name: 'Billing Department',
    role: 'Finance & Billing',
    avatar: 'BD',
    color: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    online: false,
    unread: 0,
    lastSeen: '2 days ago',
    msgs: [
      { id:1, from:'me',   text:'Hello, I have a question about invoice INV-2401. It seems to have incorrect line items.', time:'Mar 28', status:'read' },
      { id:2, from:'them', text:'Hi there! I apologize for the confusion. Let me pull up invoice INV-2401 right away.', time:'Mar 28', status:'read' },
      { id:3, from:'them', text:'I can see the discrepancy — the user count was updated from 10 to 15 on March 1st. Could you confirm if you intended to downgrade back to 10?', time:'Mar 28', status:'read' },
      { id:4, from:'me',   text:'Yes, we submitted a downgrade request on Feb 28th. The change shouldn\'t have been applied differently.', time:'Mar 28', status:'read' },
      { id:5, from:'them', text:'I\'ve escalated this to our billing corrections team. We\'ll issue a revised invoice within 24 hours. You\'ll receive a notification by email.', time:'Mar 28', status:'read' },
    ],
  },
];

const QUICK_REPLIES = [
  'Yes, that works for me!',
  'Thank you for the update.',
  'Could you provide more details?',
  'I\'ll check and get back to you.',
];

/* ── Message Status Icon ──────────────────────────────────────────────────── */
function StatusIcon({ status }) {
  if (status === 'sending') return <Clock size={10} color='rgba(255,255,255,0.6)' />;
  if (status === 'delivered') return <Check size={10} color='rgba(255,255,255,0.7)' />;
  if (status === 'read') return <CheckCheck size={10} color='#60a5fa' />;
  return null;
}

/* ── Typing Indicator ─────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 24px 8px' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--input-bg)', border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <User size={14} color='var(--text-muted)' />
      </div>
      <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'block' }} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function ClientMessages() {
  const { isDark } = useTheme();
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeId, setActiveId] = useState('c1');
  const [text, setText]         = useState('');
  const [search, setSearch]     = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  let typingTimer = useRef(null);

  const active = contacts.find(c => c.id === activeId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.msgs?.length, isTyping]);

  const simulateReply = (contactId) => {
    const replies = [
      'Thanks for reaching out! Let me look into that.',
      'I understand. Could you provide a bit more context?',
      'Got it! We\'re on it and will keep you updated.',
      'Noted! I\'ll escalate this to the relevant team.',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setContacts(cs => cs.map(c => c.id === contactId ? {
        ...c,
        msgs: [...c.msgs, { id: Date.now(), from: 'them', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' }]
      } : c));
    }, 2000);
  };

  const send = (msgText) => {
    const t = (msgText || text).trim();
    if (!t) return;
    setContacts(cs => cs.map(c => c.id === activeId ? {
      ...c,
      msgs: [...c.msgs, { id: Date.now(), from: 'me', text: t, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'delivered' }]
    } : c));
    setText('');
    setTimeout(() => simulateReply(activeId), 500);
  };

  const selectContact = (id) => {
    setActiveId(id);
    setContacts(cs => cs.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowInfo(false);
  };

  const filteredContacts = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = contacts.reduce((a, c) => a + c.unread, 0);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Messages</h1>
          {totalUnread > 0 && (
            <span style={{ padding: '2px 8px', borderRadius: 20, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 800 }}>{totalUnread}</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Communicate directly with your support team and account manager</p>
      </div>

      {/* Chat Interface */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 18, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', height: 'calc(100vh - 230px)', display: 'flex', overflow: 'hidden', minHeight: 500 }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 280, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--bg-darker)' }}>
          {/* Search */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 10, padding: '8px 12px' }}>
              <Search size={13} color='var(--text-muted)' />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 12, width: '100%' }} />
            </div>
          </div>

          {/* Contact List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => {
              const isActive = c.id === activeId;
              const lastMsg = c.msgs[c.msgs.length - 1];
              return (
                <div key={c.id} onClick={() => selectContact(c.id)}
                  style={{ padding: '14px 16px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent', borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`, transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--input-bg)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  {/* Avatar + Name Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>{c.avatar}</div>
                      <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: c.online ? '#10b981' : 'var(--text-muted)', border: `2px solid ${isDark ? '#1a2332' : '#f8fafc'}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: isActive ? 'var(--primary)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{lastMsg?.time}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{lastMsg?.text}</span>
                        {c.unread > 0 && (
                          <span style={{ minWidth: 18, height: 18, borderRadius: 20, background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', flexShrink: 0 }}>{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={28} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                <span style={{ fontSize: 12 }}>No conversations found</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        {active ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            {/* Chat Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-darker)', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: active.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>{active.avatar}</div>
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: active.online ? '#10b981' : '#94a3b8', border: `2px solid ${isDark ? '#1a2332' : '#f8fafc'}` }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{active.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: active.online ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {active.online ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Online</> : `Last seen: ${active.lastSeen}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--card-border)', background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }} title='Voice Call'>
                  <Phone size={16} />
                </button>
                <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--card-border)', background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }} title='Video Call'>
                  <Video size={16} />
                </button>
                <button onClick={() => setShowInfo(s => !s)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${showInfo ? 'var(--primary)' : 'var(--card-border)'}`, background: showInfo ? 'rgba(99,102,241,0.1)' : 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: showInfo ? 'var(--primary)' : 'var(--text-secondary)', transition: 'all 0.15s' }} title='Info'>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 4, background: isDark ? '#0b1320' : '#f8fafc' }}>

              {/* Date Separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px 12px', position: 'sticky', top: 0, zIndex: 1 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', background: isDark ? '#0b1320' : '#f8fafc', padding: '2px 10px', borderRadius: 20, border: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>Today</span>
                <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
              </div>

              {active.msgs.map((msg, i) => {
                const isMe = msg.from === 'me';
                const showAvatar = !isMe && (i === 0 || active.msgs[i - 1].from !== 'them');
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                    style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end', padding: '2px 24px' }}>

                    {/* Avatar (staff only) */}
                    {!isMe ? (
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: showAvatar ? active.color : 'transparent', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                        {showAvatar ? active.avatar[0] : ''}
                      </div>
                    ) : <div style={{ width: 30, flexShrink: 0 }} />}

                    {/* Bubble */}
                    <div style={{ maxWidth: '68%' }}>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe ? 'var(--primary)' : 'var(--card-bg)',
                        color: isMe ? '#fff' : 'var(--text-primary)',
                        border: isMe ? 'none' : '1px solid var(--card-border)',
                        boxShadow: isMe ? '0 4px 12px rgba(99,102,241,0.25)' : '0 1px 4px rgba(0,0,0,0.05)',
                        fontSize: 13,
                        lineHeight: 1.55,
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.time}</span>
                        {isMe && <StatusIcon status={msg.status} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            <div style={{ padding: '8px 20px 0', borderTop: '1px solid var(--card-border)', overflowX: 'auto', display: 'flex', gap: 8, background: 'var(--card-bg)', flexShrink: 0 }}>
              {QUICK_REPLIES.map((r, i) => (
                <button key={i} onClick={() => send(r)}
                  style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  {r}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{ padding: '12px 20px 16px', background: 'var(--card-bg)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 14, padding: '10px 12px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }} title='Attach file'>
                  <Paperclip size={17} />
                </button>
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={`Message ${active.name}…`}
                  rows={1}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none', maxHeight: 120, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }} title='Emoji'>
                  <Smile size={17} />
                </button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => send()}
                  disabled={!text.trim()}
                  style={{ width: 38, height: 38, borderRadius: 11, border: 'none', background: text.trim() ? 'var(--primary)' : 'var(--card-border)', display: 'grid', placeItems: 'center', cursor: text.trim() ? 'pointer' : 'default', flexShrink: 0, boxShadow: text.trim() ? '0 4px 12px rgba(99,102,241,0.3)' : 'none', transition: 'all 0.2s' }}>
                  <Send size={16} color={text.trim() ? '#fff' : 'var(--text-muted)'} style={{ marginLeft: 2 }} />
                </motion.button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>Press Enter to send · Shift+Enter for new line</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--card-border)', display: 'grid', placeItems: 'center' }}>
              <MessageSquare size={28} color='var(--text-muted)' />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>Select a conversation</div>
          </div>
        )}

        {/* ── Info Sidebar ── */}
        <AnimatePresence>
          {showInfo && active && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ borderLeft: '1px solid var(--card-border)', background: 'var(--bg-darker)', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ padding: 20, minWidth: 260 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: active.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 auto 10px' }}>{active.avatar}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>{active.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{active.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: active.online ? '#10b981' : '#94a3b8' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: active.online ? '#10b981' : 'var(--text-muted)' }}>{active.online ? 'Online now' : active.lastSeen}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Conversation Info</div>
                  {[
                    { label: 'Messages', val: active.msgs.length },
                    { label: 'Started', val: 'Mar 28, 2026' },
                    { label: 'Response Time', val: '~15 min avg' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>{r.label}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button style={{ padding: '9px', borderRadius: 9, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Phone size={13} /> Voice Call
                  </button>
                  <button style={{ padding: '9px', borderRadius: 9, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Video size={13} /> Video Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
