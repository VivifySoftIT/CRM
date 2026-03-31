import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Briefcase, Globe, MapPin,
  Star, TrendingUp, Edit2, X, Check,
  MessageSquare, PhoneCall, Calendar, FileText,
  Paperclip, Plus, Clock, CheckSquare, Zap,
  AlertCircle, Link, User, ShieldCheck, Building2,
  MoreHorizontal, Tag, Send, ExternalLink, History
} from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const CONTACT_DATA = {
  1: { id: 1, name: 'Alice Johnson', company: 'Vertex Corp', email: 'alice@vertex.io', phone: '+1-202-555-0101', designation: 'VP Operations', location: 'New York, USA', owner: 'John Sales', date: '2026-03-20', tags: ['VIP', 'Customer'], bio: 'Key decision maker for operations at Vertex. Interested in enterprise-grade analytics.' },
  2: { id: 2, name: 'Robert Brown', company: 'BlueSky Ltd', email: 'rob@bluesky.com', phone: '+1-202-555-0132', designation: 'CEO', location: 'London, UK', owner: 'Sarah Doe', date: '2026-03-21', tags: ['Hot Lead'], bio: 'Robert is exploring expansion into the US market. Needs a scalable CRM.' },
};

const ACTIVITIES = [
  { id: 1, type: 'email', title: 'Proposal Sent', time: '2026-03-24 10:45', user: 'John Sales', desc: 'Sent the personalized enterprise proposal.' },
  { id: 2, type: 'call', title: 'Discovery Call', time: '2026-03-23 15:30', user: 'John Sales', desc: 'Discussed relationship mapping and 360 view requirements.' },
  { id: 3, type: 'note', title: 'Internal Note', time: '2026-03-22 09:00', user: 'Admin', desc: 'Confirmed Alice as the primary stakeholder for Vertex.' },
  { id: 4, type: 'meeting', title: 'Demo Scheduled', time: '2026-03-27 11:00', user: 'John Sales', desc: 'Confirmed Zoom demo for next Tuesday.' },
];

const RELATED_DEALS = [
  { id: 101, title: 'Vertex Enterprise License', value: '$85,000', stage: 'Negotiation', probability: '75%' },
  { id: 102, title: 'Vertex Consulting Services', value: '$12,000', stage: 'Qualified', probability: '90%' },
];

const TASKS = [
  { id: 1, title: 'Follow up on proposal', due: '2026-03-28', done: false },
  { id: 2, title: 'Update contact preferences', due: '2026-03-26', done: true },
];

const ACTIVITY_META = {
  email:   { icon: Mail,       color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  call:    { icon: PhoneCall,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  note:    { icon: FileText,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  meeting: { icon: Calendar,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = CONTACT_DATA[parseInt(id)] || CONTACT_DATA[1];
  const [activeTab, setActiveTab] = useState('360');
  const [tasks, setTasks] = useState(TASKS);

  const TABS = [
    { key: '360',         label: '360° View' },
    { key: 'timeline',    label: 'Timeline' },
    { key: 'deals',       label: `Deals (${RELATED_DEALS.length})` },
    { key: 'tasks',       label: `Tasks (${tasks.filter(t => !t.done).length})` },
    { key: 'attachments', label: 'Attachments' },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>
      {/* Top Bar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard/contacts')} className="b24-btn b24-btn-secondary">
          <ArrowLeft size={16} /> Back to Contacts
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="b24-btn b24-btn-secondary"><Edit2 size={15} /> Edit</button>
          <div style={{ width: 1, background: 'var(--card-border)', height: 32 }} />
          <button className="b24-btn b24-btn-primary"><Plus size={15} /> Add Task</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 0, minHeight: 'calc(100vh - 84px)' }}>
        {/* Sidebar Info */}
        <div style={{ borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)', padding: '32px 28px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #2563eb, #60a5fa)', color: '#fff', fontSize: 32, fontWeight: 900, display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.4)' }}>
              {contact.name.charAt(0)}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>{contact.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 16px' }}>{contact.designation} @ {contact.company}</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
               {contact.tags.map(tag => (
                 <span key={tag} style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99, background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.15)' }}>{tag}</span>
               ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
             <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Contact Information</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
               {[
                 { icon: Mail, label: contact.email, color: '#2563eb' },
                 { icon: Phone, label: contact.phone, color: '#10b981' },
                 { icon: MapPin, label: contact.location, color: '#ef4444' },
                 { icon: Globe, label: contact.company?.toLowerCase().replace(' ','') + '.com', color: '#06b6d4' },
                 { icon: User, label: `Owner: ${contact.owner}`, color: '#8b5cf6' },
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-page)', border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <item.icon size={15} color={item.color} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                 </div>
               ))}
             </div>
          </div>

          <div style={{ padding: '20px', borderRadius: 16, background: 'var(--bg-page)', border: '1px solid var(--card-border)', marginBottom: 32 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Bio / Notes</h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>{contact.bio}</p>
          </div>

          <div>
             <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Quick Connect</h4>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
               {[
                 { icon: PhoneCall, color: '#10b981', title: 'Call' },
                 { icon: Mail,      color: '#2563eb', title: 'Email' },
                 { icon: MessageSquare, color: '#8b5cf6', title: 'Chat' },
                 { icon: History,   color: '#f59e0b', title: 'Log' }
               ].map(btn => (
                 <button key={btn.title} style={{ height: 44, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-page)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = btn.color; e.currentTarget.style.background = `${btn.color}08`; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--bg-page)'; }}>
                    <btn.icon size={18} color={btn.color} />
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Right Content */}
        <div style={{ padding: '32px 40px', overflowY: 'auto' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: 6, borderRadius: 14, width: 'fit-content', marginBottom: 32 }}>
             {TABS.map(t => (
               <button key={t.key} onClick={() => setActiveTab(t.key)}
                 style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: activeTab === t.key ? '#2563eb' : 'transparent', color: activeTab === t.key ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {t.label}
               </button>
             ))}
          </div>

          {/* Tab Content: 360 View */}
          {activeTab === '360' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                {/* Account Info Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24, boxShadow: 'var(--card-shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Organizational Role</h3>
                     <Building2 size={20} color="#2563eb" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(37,99,235,0.08)', display: 'grid', placeItems: 'center' }}>
                      <Building2 size={24} color="#2563eb" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#2563eb' }}>{contact.company}</h4>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Parent Account</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ padding: '14px', borderRadius: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)' }}>
                       <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>TEAM SIZE</p>
                       <p style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>500-1000</p>
                    </div>
                    <div style={{ padding: '14px', borderRadius: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)' }}>
                       <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>INDUSTRY</p>
                       <p style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Technology</p>
                    </div>
                  </div>
                </div>

                {/* Deals Summary Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24, boxShadow: 'var(--card-shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Revenue Pipeline</h3>
                     <TrendingUp size={20} color="#10b981" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>$97,000</div>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{RELATED_DEALS.length} active deals linked</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <button className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>View All Deals</button>
                  </div>
                </div>
              </div>

              {/* Interaction Breakdown */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>Interaction Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Emails', val: 24, icon: Mail, color: '#2563eb' },
                    { label: 'Calls',  val: 8,  icon: PhoneCall, color: '#10b981' },
                    { label: 'Meetings', val: 3, icon: Calendar, color: '#8b5cf6' },
                    { label: 'Last Met', val: '2d ago', icon: Clock, color: '#f59e0b' },
                  ].map(stat => (
                    <div key={stat.label} style={{ padding: '18px', borderRadius: 16, background: 'var(--bg-page)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                       <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}15`, display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                          <stat.icon size={16} color={stat.color} />
                       </div>
                       <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{stat.val}</p>
                       <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
             <div style={{ paddingLeft: 16, borderLeft: '2px solid var(--card-border)' }}>
                {ACTIVITIES.map((act, i) => {
                  const am = ACTIVITY_META[act.type];
                  return (
                    <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ position: 'relative', marginBottom: 28 }}>
                      <div style={{ position: 'absolute', left: -27, top: 4, width: 22, height: 22, borderRadius: '50%', background: am.bg, border: `2px solid var(--card-bg)`, display: 'grid', placeItems: 'center' }}>
                        <am.icon size={12} color={am.color} />
                      </div>
                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', boxShadow: 'var(--card-shadow)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{act.title}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{act.time}</span>
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{act.desc}</p>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>by {act.user}</span>
                      </div>
                    </motion.div>
                  );
                })}
             </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div style={{ display: 'grid', gap: 16 }}>
              {RELATED_DEALS.map(deal => (
                <div key={deal.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{deal.title}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{deal.stage} · {deal.probability} probability</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{deal.value}</div>
                    <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                       View Deal <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="b24-btn-dashed" style={{ height: 60, border: '2px dashed var(--card-border)', borderRadius: 16, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontWeight: 800, fontSize: 14, background: 'transparent', cursor: 'pointer' }}>
                 + Link New Deal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
