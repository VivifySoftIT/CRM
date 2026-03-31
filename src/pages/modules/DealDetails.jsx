import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, Building2, User, Calendar, Clock,
  Mail, Phone, PhoneCall, MessageSquare, FileText, CheckCircle2,
  Plus, Edit2, ArrowUpRight, TrendingUp, Target, Paperclip, Check
} from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const DEAL_DATA = {
  id: 1,
  name: 'Acme Enterprise License',
  account: 'Acme Corp',
  contact: 'Alice Smith',
  email: 'alice@acme.com',
  phone: '+1 (555) 123-4567',
  amount: 150000,
  stage: 'Negotiation',
  stageColor: '#8b5cf6',
  probability: 75,
  closeDate: '2026-05-15',
  owner: 'John Sales',
  notes: 'High-priority deal. Alice has final sign-off authority. Budget confirmed. Awaiting legal review.',
  score: 82,
};

const ACTIVITIES = [
  { id: 1, type: 'call',    title: 'Discovery Call',   time: '2026-03-24 10:30', user: 'John Sales', desc: 'Discussed scope and Q2 rollout timeline with Alice.' },
  { id: 2, type: 'email',   title: 'Proposal Emailed', time: '2026-03-23 15:00', user: 'John Sales', desc: 'Sent the updated enterprise proposal. Awaiting response.' },
  { id: 3, type: 'meeting', title: 'Legal Review Mtg', time: '2026-03-22 11:00', user: 'Sarah Doe',  desc: 'Legal team reviewed contract terms. Minor amendments requested.' },
];

const TASKS = [
  { id: 1, title: 'Follow up on contract amendments', due: '2026-03-28', done: false },
  { id: 2, title: 'Confirm Q2 rollout date', due: '2026-04-01', done: false },
  { id: 3, title: 'Send license key post-signing', due: 'On close', done: false },
  { id: 4, title: 'Initial discovery sent', due: 'Completed', done: true },
];

const ACTIVITY_META = {
  email:   { icon: Mail,       color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  call:    { icon: PhoneCall,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  note:    { icon: FileText,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  meeting: { icon: Calendar,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

export default function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = DEAL_DATA;
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState(TASKS);

  const toggleTask = tid => setTasks(prev => prev.map(t => t.id === tid ? { ...t, done: !t.done } : t));

  const TABS = [
    { key: 'overview',     label: 'Overview' },
    { key: 'timeline',     label: 'Timeline' },
    { key: 'tasks',        label: `Tasks (${tasks.filter(t => !t.done).length})` },
    { key: 'attachments',  label: 'Attachments' },
  ];

  const expectedRev = Math.round(deal.amount * deal.probability / 100);

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>
      {/* Top Bar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard/deals')} className="b24-btn b24-btn-secondary">
          <ArrowLeft size={16} /> Back to Deals
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="b24-btn b24-btn-secondary"><Edit2 size={15} /> Edit Deal</button>
          <div style={{ width: 1, background: 'var(--card-border)', height: 32 }} />
          <button className="b24-btn b24-btn-primary"><Plus size={15} /> Add Task</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 0, minHeight: 'calc(100vh - 84px)' }}>

        {/* ── Left Sidebar ── */}
        <div style={{ borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)', padding: '32px', overflowY: 'auto' }}>
          {/* Deal Avatar + Name */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: 32, fontWeight: 900, display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 10px 25px -5px rgba(139,92,246,0.4)' }}>
              ₹
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 8px' }}>{deal.name}</h2>
            <span style={{ background: `${deal.stageColor}20`, color: deal.stageColor, padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>
              {deal.stage}
            </span>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Deal Value', val: `₹${deal.amount.toLocaleString()}`, icon: DollarSign, color: '#10b981' },
              { label: 'Probability', val: `${deal.probability}%`, icon: Target, color: '#8b5cf6' },
              { label: 'Expected Rev.', val: `₹${expectedRev.toLocaleString()}`, icon: TrendingUp, color: '#2563eb' },
              { label: 'Close Date', val: deal.closeDate, icon: Calendar, color: '#f59e0b' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <m.icon size={13} color={m.color} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{m.val}</div>
              </div>
            ))}
          </div>

          {/* Probability Bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Probability</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: deal.stageColor }}>{deal.probability}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'var(--card-border)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${deal.probability}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${deal.stageColor}, #2563eb)`, borderRadius: 99 }} />
            </div>
          </div>

          {/* Deal Score */}
          <div style={{ padding: '16px 20px', borderRadius: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 900 }}>{deal.score}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>Deal Score</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Based on interactions & pipeline</div>
            </div>
          </div>

          {/* Account & Contact Info */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Account & Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: Building2, label: deal.account, color: '#2563eb' },
                { icon: User, label: deal.contact, color: '#10b981' },
                { icon: Mail, label: deal.email, color: '#6366f1' },
                { icon: Phone, label: deal.phone, color: '#f59e0b' },
                { icon: User, label: `Owner: ${deal.owner}`, color: '#8b5cf6' },
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

          {/* Notes */}
          <div style={{ padding: '16px', borderRadius: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)', marginBottom: 28 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Notes</h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>{deal.notes}</p>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Quick Connect</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { icon: PhoneCall, color: '#10b981', title: 'Call' },
                { icon: Mail, color: '#2563eb', title: 'Email' },
                { icon: Calendar, color: '#8b5cf6', title: 'Meeting' },
                { icon: CheckCircle2, color: '#f59e0b', title: 'Task' },
              ].map(btn => (
                <button key={btn.title} title={btn.title}
                  style={{ height: 44, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-page)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = btn.color; e.currentTarget.style.background = `${btn.color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--bg-page)'; }}>
                  <btn.icon size={18} color={btn.color} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Content ── */}
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Pipeline Stage Progress */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>Pipeline Progress</h3>
                <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                  {['New', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'].map((s, i, arr) => {
                    const current = deal.stage;
                    const stages = arr;
                    const currentIdx = stages.indexOf(current);
                    const isActive = i <= currentIdx;
                    return (
                      <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 80 }}>
                        <div style={{ height: 4, background: isActive ? '#2563eb' : 'var(--card-border)', marginBottom: 8, borderRadius: i === 0 ? '99px 0 0 99px' : i === arr.length - 1 ? '0 99px 99px 0' : 0 }} />
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: isActive ? '#2563eb' : 'var(--card-border)', color: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto 6px', fontSize: 10, fontWeight: 900 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? '#2563eb' : 'var(--text-muted)' }}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Emails', val: 14, icon: Mail, color: '#2563eb' },
                  { label: 'Calls', val: 6, icon: PhoneCall, color: '#10b981' },
                  { label: 'Meetings', val: 3, icon: Calendar, color: '#8b5cf6' },
                  { label: 'Days Open', val: 42, icon: Clock, color: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '18px', textAlign: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}15`, display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                      <stat.icon size={16} color={stat.color} />
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{stat.val}</p>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity Preview */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Recent Activity</h3>
                  <button onClick={() => setActiveTab('timeline')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>View All</button>
                </div>
                {ACTIVITIES.slice(0, 2).map((act, i) => {
                  const am = ACTIVITY_META[act.type] || ACTIVITY_META.note;
                  return (
                    <div key={act.id} style={{ display: 'flex', gap: 14, marginBottom: 14, padding: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: am.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <am.icon size={16} color={am.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{act.title}</div>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{act.desc}</p>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{act.time} · {act.user}</span>
                      </div>
                    </div>
                  );
                })}
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

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'grid', gap: 12 }}>
              <button className="b24-btn b24-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Plus size={16} /> Add Task</button>
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, opacity: task.done ? 0.6 : 1 }}>
                  <button onClick={() => toggleTask(task.id)}
                    style={{ width: 22, height: 22, borderRadius: 6, border: task.done ? 'none' : '2px solid var(--card-border)', background: task.done ? '#10b981' : 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                    {task.done && <Check size={12} color="#fff" />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {task.due}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div>
              <button className="b24-btn b24-btn-secondary" style={{ marginBottom: 20 }}><Plus size={16} /> Upload File</button>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { name: 'Enterprise_Proposal_v3.pdf', size: '3.2 MB', date: '2026-03-23' },
                  { name: 'Contract_Draft_Acme.docx', size: '1.8 MB', date: '2026-03-22' },
                  { name: 'Product_Demo_Recording.mp4', size: '45.6 MB', date: '2026-03-21' },
                ].map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Paperclip size={18} color="#2563eb" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{file.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{file.size} · {file.date}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
