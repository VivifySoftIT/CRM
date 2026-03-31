import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, MessageCircle, 
  Share2, Reply, UserPlus, MoreVertical, Search, 
  Filter, Heart, MessageSquare, ExternalLink, 
  CheckCircle2, Clock, Send, Shield
} from 'lucide-react';

const SOCIAL_MESSAGES = [
  { id: 1, platform: 'Facebook',  user: 'Emma Watson',  avatar: 'EW', text: 'I love the new room decor! Looking forward to my stay next week.', time: '12 min ago', likes: 12, comments: 2, status: 'Pending' },
  { id: 2, platform: 'Instagram', user: 'Traveler_Joe', avatar: 'TJ', text: 'Where can I find the spa menu? Trying to book a session.',       time: '28 min ago', likes: 45, comments: 8, status: 'Replied' },
  { id: 3, platform: 'Twitter',   user: 'TechGuru',     avatar: 'TG', text: 'Mention: @OmniHotel your new check-in system is super fast! 🚀', time: '1 hour ago', likes: 8,  comments: 1, status: 'Pending' },
  { id: 4, platform: 'Instagram', user: 'Foodie_Mia',   avatar: 'FM', text: 'Is the rooftop restaurant open on Sundays? #HotelDining',        time: '2 hours ago',likes: 32, comments: 5, status: 'Pending' },
  { id: 5, platform: 'Facebook',  user: 'Robert Brown', avatar: 'RB', text: 'Had a minor issue with the AC in Room 204, but staff fixed it fast.', time: '4 hours ago',likes: 5,  comments: 3, status: 'Replied' },
];

const PLATFORMS = [
  { name: 'All',       icon: Share2,    color: '#64748b' },
  { name: 'Facebook',  icon: Facebook,  color: '#1877f2' },
  { name: 'Instagram', icon: Instagram, color: '#e4405f' },
  { name: 'Twitter',   icon: Twitter,   color: '#1da1f2' },
];

export default function Social() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredMessages = SOCIAL_MESSAGES.filter(m => 
    (activeTab === 'All' || m.platform === activeTab) &&
    (m.user.toLowerCase().includes(search.toLowerCase()) || m.text.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '32px', minHeight: '100%', background: 'var(--bg-page)' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.8px' }}>
            Social Interactions
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Monitor and respond to messages across all social media channels.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div style={{ textAlign: 'right', paddingRight: 16, borderRight: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>128</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Mentions</div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>8</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Replies</div>
           </div>
        </div>
      </div>

      {/* ── Tabs & Search ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{ display: 'flex', background: 'var(--card-bg)', padding: 4, borderRadius: 12, border: '1px solid var(--card-border)' }}>
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            const active = activeTab === p.name;
            return (
              <button key={p.name} onClick={() => setActiveTab(p.name)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 9, border: 'none', 
                  background: active ? `${p.color}15` : 'transparent', color: active ? p.color : 'var(--text-secondary)', 
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: 14, fontWeight: 800 
                }}
              >
                <Icon size={16} /> {p.name}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, maxWidth: 300, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search social feed..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 42px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 14 }}
          />
        </div>
      </div>

      {/* ── Feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
        {filteredMessages.map((m, i) => (
          <motion.div 
            key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ 
              background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column' 
            }}
          >
            {/* Post Header */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
               <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', display: 'grid', placeItems: 'center', color: '#1e293b', fontWeight: 900, fontSize: 15 }}>
                 {m.avatar}
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{m.user}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>via</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: PLATFORMS.find(p=>p.name===m.platform).color }}>{m.platform}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {m.time}
                  </div>
               </div>
               <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, background: m.status === 'Pending' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: m.status === 'Pending' ? '#ef4444' : '#10b981', textTransform: 'uppercase' }}>
                  {m.status}
               </div>
            </div>

            {/* Post Content */}
            <div style={{ padding: '20px', flex: 1 }}>
               <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)', fontWeight: 500 }}>{m.text}</p>
               <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <Heart size={16} /> {m.likes}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <MessageCircle size={16} /> {m.comments}
                  </div>
               </div>
            </div>

            {/* Actions Footer */}
            <div style={{ padding: '14px 20px', background: 'var(--bg-page)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)' }}>
               <div style={{ display: 'flex', gap: 4 }}>
                  <button className="b24-btn b24-btn-secondary" style={{ height: 36, padding: '0 12px', fontSize: 12 }}><Reply size={14}/> Reply</button>
                  <button className="b24-btn b24-btn-secondary" style={{ height: 36, padding: '0 12px', fontSize: 12 }}><UserPlus size={14}/> Assign</button>
               </div>
               <button style={{ height: 36, width: 36, borderRadius: 8, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                 <MoreVertical size={16} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
