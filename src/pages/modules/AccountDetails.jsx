import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Globe, MapPin, Building2,
  TrendingUp, Edit2, Plus, Clock, Users,
  MessageSquare, PhoneCall, Calendar, FileText,
  History, ArrowUpRight, DollarSign, CheckCircle2
} from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ACCOUNT_DATA = {
  id: 1, 
  name: 'Acme Corporation',
  industry: 'Technology',
  website: 'www.acme.com',
  phone: '+1 (555) 123-4567',
  location: '123 Tech Lane, Silicon Valley, CA 94025, USA',
  revenue: 5000000,
  employees: 250,
  owner: 'John Doe',
  tags: ['Enterprise', 'VIP'],
  bio: 'Acme Corporation is a leading technology company specializing in cloud infrastructure and enterprise software solutions. They have been a key strategic partner since 2024.'
};

const CONTACTS = [
  { id: 1, name: 'Alice Smith', position: 'CEO', email: 'alice@acme.com', phone: '+1 555-0101' },
  { id: 2, name: 'Bob Jones', position: 'CTO', email: 'bob@acme.com', phone: '+1 555-0102' }
];

const DEALS = [
  { id: 101, title: 'Q3 Enterprise License', value: '$150,000', stage: 'Negotiation', probability: '75%' },
  { id: 102, title: 'Cloud Migration', value: '$80,000', stage: 'Qualified', probability: '90%' },
];

const ACTIVITIES = [
  { id: 1, type: 'call', title: 'Follow-up Call', time: 'Today, 10:30 AM', user: 'John Doe', desc: 'Discussed Q3 requirements with Alice.' },
  { id: 2, type: 'email', title: 'Proposal Sent', time: 'Yesterday, 3:15 PM', user: 'John Doe', desc: 'Sent the updated pricing proposal to the technical team.' },
  { id: 3, type: 'meeting', title: 'Product Demo', time: 'Mar 24, 11:00 AM', user: 'Sarah Smith', desc: 'Showcased the new features. They were impressed with the analytics.' },
];

const TASKS = [
  { id: 1, title: 'Send revised contract', due: 'Tomorrow', done: false },
  { id: 2, title: 'Update account preferences', due: 'Completed', done: true },
];

const ACTIVITY_META = {
  email:   { icon: Mail,       color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  call:    { icon: PhoneCall,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  note:    { icon: FileText,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  meeting: { icon: Calendar,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

export default function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const account = ACCOUNT_DATA;
  const [activeTab, setActiveTab] = useState('360');

  const TABS = [
    { key: '360',         label: '360° View' },
    { key: 'timeline',    label: 'Timeline' },
    { key: 'contacts',    label: `Contacts (${CONTACTS.length})` },
    { key: 'deals',       label: `Deals (${DEALS.length})` },
    { key: 'tasks',       label: `Tasks (${TASKS.filter(t => !t.done).length})` },
    { key: 'attachments', label: 'Attachments' },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>
      {/* Top Bar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard/accounts')} className="b24-btn b24-btn-secondary">
          <ArrowLeft size={16} /> Back to Accounts
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="b24-btn b24-btn-secondary"><Edit2 size={15} /> Edit</button>
          <div style={{ width: 1, background: 'var(--card-border)', height: 32 }} />
          <button className="b24-btn b24-btn-primary"><Plus size={15} /> Add Contact</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 0, minHeight: 'calc(100vh - 84px)' }}>
        {/* Sidebar Info */}
        <div style={{ borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)', padding: '32px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, background: 'linear-gradient(135deg, #2563eb, #60a5fa)', color: '#fff', fontSize: 36, fontWeight: 900, display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.4)' }}>
              {account.name.charAt(0)}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>{account.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 16px' }}>{account.industry} · {account.employees} Employees</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
               {account.tags.map(tag => (
                 <span key={tag} style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 99, background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.15)' }}>{tag}</span>
               ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
             <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Account Information</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
               {[
                 { icon: Globe, label: account.website, color: '#2563eb' },
                 { icon: Phone, label: account.phone, color: '#10b981' },
                 { icon: MapPin, label: account.location, color: '#ef4444' },
                 { icon: DollarSign, label: `Revenue: $${account.revenue.toLocaleString()}`, color: '#06b6d4' },
                 { icon: Users, label: `Owner: ${account.owner}`, color: '#8b5cf6' },
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
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>About / Notes</h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>{account.bio}</p>
          </div>

          <div>
             <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Quick Connect</h4>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
               {[
                 { icon: PhoneCall, color: '#10b981', title: 'Call' },
                 { icon: Mail,      color: '#2563eb', title: 'Email' },
                 { icon: Calendar,  color: '#8b5cf6', title: 'Meeting' },
                 { icon: CheckCircle2, color: '#f59e0b', title: 'Task' }
               ].map(btn => (
                 <button key={btn.title} style={{ height: 44, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-page)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)' }}
                   title={btn.title}
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
                
                {/* Contacts Preview */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24, boxShadow: 'var(--card-shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Key Contacts</h3>
                     <Users size={20} color="#2563eb" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {CONTACTS.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--card-border)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="b24-btn b24-btn-secondary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} onClick={() => setActiveTab('contacts')}>View All</button>
                </div>

                {/* Deals Summary Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24, boxShadow: 'var(--card-shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Revenue Pipeline</h3>
                     <TrendingUp size={20} color="#10b981" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>$230,000</div>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{DEALS.length} active deals linked to {account.name}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <button className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setActiveTab('deals')}>View All Deals</button>
                  </div>
                </div>
              </div>

              {/* Interaction Breakdown */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>Interaction Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Emails', val: 42, icon: Mail, color: '#2563eb' },
                    { label: 'Calls',  val: 15,  icon: PhoneCall, color: '#10b981' },
                    { label: 'Meetings', val: 7, icon: Calendar, color: '#8b5cf6' },
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
                  const am = ACTIVITY_META[act.type] || ACTIVITY_META.note;
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

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {CONTACTS.map(c => (
                <div key={c.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 900 }}>{c.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{c.position}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} /> {c.email}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> {c.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="b24-btn-dashed" style={{ border: '2px dashed var(--card-border)', borderRadius: 16, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontWeight: 800, fontSize: 14, background: 'transparent', cursor: 'pointer', height: '100%', minHeight: 120 }}>
                 + Link New Contact
              </button>
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div style={{ display: 'grid', gap: 16 }}>
              {DEALS.map(deal => (
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
