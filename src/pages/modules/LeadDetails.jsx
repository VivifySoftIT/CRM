import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Briefcase, Globe, MapPin,
  Star, TrendingUp, Edit2, UserCheck, X, Check,
  MessageSquare, PhoneCall, Calendar, FileText,
  Paperclip, Plus, Clock, CheckSquare, Zap,
  AlertCircle, Link, User, ShieldCheck
} from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const LEAD_DATA = {
  1: { id: 1, name: 'Alice Johnson', company: 'Vertex Corp', email: 'alice@vertex.io', phone: '+1-202-555-0101', source: 'Website', status: 'New', assigned: 'John Sales', date: '2026-03-24', score: 82, title: 'VP of Operations', location: 'New York, USA', website: 'vertex.io', notes: 'Very interested in the Pro plan. Wants a demo by next week.' },
  2: { id: 2, name: 'Robert Brown', company: 'BlueSky Ltd', email: 'rob@bluesky.com', phone: '+1-202-555-0132', source: 'Ads', status: 'Contacted', assigned: 'Sarah Doe', date: '2026-03-23', score: 65, title: 'CEO', location: 'London, UK', website: 'bluesky.com', notes: 'Followed up via email. Awaiting response.' },
  3: { id: 3, name: 'Emma Wilson', company: 'Acme Inc.', email: 'emma@acme.com', phone: '+1-202-555-0187', source: 'Referral', status: 'Qualified', assigned: 'Mike Ross', date: '2026-03-22', score: 91, title: 'Director of Sales', location: 'San Francisco, USA', website: 'acme.com', notes: 'High intent. Ready for proposal stage.' },
};

const ACTIVITIES = [
  { id: 1, type: 'email', title: 'Sent welcome email', time: '2026-03-24 09:15', user: 'John Sales', desc: 'Sent the introductory proposal deck and feature overview.' },
  { id: 2, type: 'call', title: 'Discovery call completed', time: '2026-03-23 14:30', user: 'John Sales', desc: '30-minute call. Client showed interest in Team plan. Follow-up scheduled.' },
  { id: 3, type: 'note', title: 'Note added', time: '2026-03-22 11:00', user: 'John Sales', desc: 'Lead was referred by Emma from BlueSky. Strong fit for our enterprise tier.' },
  { id: 4, type: 'meeting', title: 'Meeting scheduled', time: '2026-03-27 10:00', user: 'John Sales', desc: 'Product demo meeting confirmed for Tuesday 10 AM via Zoom.' },
];

const TASKS = [
  { id: 1, title: 'Send proposal document', due: '2026-03-27', done: false },
  { id: 2, title: 'Follow up on pricing query', due: '2026-03-28', done: false },
  { id: 3, title: 'Schedule product demo', due: '2026-03-26', done: true },
];

const STATUS_META = {
  'New':       { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  'Contacted': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'Qualified': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  'Proposal':  { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  'Converted': { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'Lost':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const ACTIVITY_META = {
  email:   { icon: Mail,       color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  call:    { icon: PhoneCall,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  note:    { icon: FileText,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  meeting: { icon: Calendar,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

// ── Convert Modal ─────────────────────────────────────────────────────────────
function ConvertModal({ lead, onClose }) {
  const [step, setStep] = useState(1);
  const [opts, setOpts] = useState({ contact: true, account: true, deal: true });
  const navigate = useNavigate();

  if (step === 2)
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
            <CheckSquare size={36} color="#10b981" />
          </div>
        </motion.div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 8px' }}>Lead Converted!</h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
          {lead.name} has been successfully converted into the selected records.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 260, margin: '0 auto', marginBottom: 28 }}>
          {opts.contact && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}><User size={16} color="#2563eb" /><span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>Contact created</span></div>}
          {opts.account && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}><Briefcase size={16} color="#10b981" /><span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>Account created</span></div>}
          {opts.deal && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}><TrendingUp size={16} color="#8b5cf6" /><span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6' }}>Deal created</span></div>}
        </div>
        <button className="b24-btn b24-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Done</button>
      </div>
    );

  return (
    <div>
      <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Convert Lead</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22} /></button>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Select the CRM records to create from <strong>{lead.name}</strong>:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {[
            { key: 'contact', icon: User, label: 'Create Contact', desc: 'Save personal details for this lead', color: '#2563eb' },
            { key: 'account', icon: Briefcase, label: 'Create Account', desc: `Link to ${lead.company} in Accounts`, color: '#10b981' },
            { key: 'deal',    icon: TrendingUp, label: 'Create Deal', desc: 'Start a new deal in the pipeline', color: '#8b5cf6' },
          ].map(o => (
            <div key={o.key} onClick={() => setOpts(v => ({ ...v, [o.key]: !v[o.key] }))}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${opts[o.key] ? o.color : 'var(--card-border)'}`, background: opts[o.key] ? `${o.color}08` : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${o.color}15`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <o.icon size={20} color={o.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{o.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{o.desc}</p>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${opts[o.key] ? o.color : 'var(--card-border)'}`, background: opts[o.key] ? o.color : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {opts[o.key] && <Check size={13} color="#fff" />}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={() => setStep(2)} className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <ShieldCheck size={16} /> Convert Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444';
  const r = 32, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 80, height: 80 }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 900, color }}>{score}</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = LEAD_DATA[parseInt(id)] || LEAD_DATA[1];
  const [activeTab, setActiveTab] = useState('activity');
  const [showConvert, setShowConvert] = useState(false);
  const [tasks, setTasks] = useState(TASKS);

  const TABS = [
    { key: 'activity',    label: 'Activity' },
    { key: 'tasks',       label: `Tasks (${tasks.filter(t => !t.done).length})` },
    { key: 'deals',       label: 'Deals' },
    { key: 'attachments', label: 'Attachments' },
  ];

  const meta = STATUS_META[lead.status] || STATUS_META.New;

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>

      {/* ── Top Bar ── */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard/leads')} className="b24-btn b24-btn-secondary">
          <ArrowLeft size={16} /> Back to Leads
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="b24-btn b24-btn-secondary"><Edit2 size={15} /> Edit Lead</button>
          <button className="b24-btn b24-btn-primary" onClick={() => setShowConvert(true)}>
            <UserCheck size={15} /> Convert Lead
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, minHeight: 'calc(100vh - 80px)' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)', padding: '28px 24px', overflowY: 'auto' }}>

          {/* Avatar & Name */}
          <div style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${meta.color}30, ${meta.color}80)`, color: meta.color, fontSize: 28, fontWeight: 900, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
              {lead.name.charAt(0)}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px' }}>{lead.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px' }}>{lead.title} · {lead.company}</p>
            <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 900, background: meta.bg, color: meta.color }}>{lead.status}</span>
          </div>

          {/* Lead Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: '16px', borderRadius: 14, background: 'var(--bg-page)', border: '1px solid var(--card-border)' }}>
            <ScoreRing score={lead.score} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Lead Score</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.score >= 80 ? 'Hot' : lead.score >= 55 ? 'Warm' : 'Cold'} lead · {lead.source}</div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 14 }}>Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: Mail, label: lead.email },
                { icon: Phone, label: lead.phone },
                { icon: Briefcase, label: lead.company },
                { icon: MapPin, label: lead.location },
                { icon: Globe, label: lead.website },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-page)', border: '1px solid var(--card-border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <row.icon size={14} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Notes</h4>
            <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg-page)', border: '1px solid var(--card-border)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {lead.notes}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Quick Actions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: PhoneCall, label: 'Call', color: '#10b981' },
                { icon: Mail,      label: 'Email', color: '#2563eb' },
                { icon: Calendar,  label: 'Meeting', color: '#8b5cf6' },
                { icon: FileText,  label: 'Note', color: '#f59e0b' },
              ].map(a => (
                <button key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--bg-page)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.borderColor = a.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-page)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                  <a.icon size={18} color={a.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--card-border)', padding: 4, marginBottom: 28, width: 'fit-content' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: activeTab === t.key ? '#2563eb' : 'transparent', color: activeTab === t.key ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Activity Timeline</h3>
                <button className="b24-btn b24-btn-secondary"><Plus size={15} /> Log Activity</button>
              </div>
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
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Follow-up Tasks</h3>
                <button className="b24-btn b24-btn-secondary"><Plus size={15} /> Add Task</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.map(task => (
                  <motion.div key={task.id} layout
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', opacity: task.done ? 0.55 : 1 }}>
                    <button onClick={() => setTasks(ts => ts.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                      style={{ background: task.done ? '#10b981' : 'transparent', border: `2px solid ${task.done ? '#10b981' : 'var(--card-border)'}`, borderRadius: 6, width: 22, height: 22, display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      {task.done && <Check size={13} color="#fff" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><Calendar size={11} /> Due: {task.due}</p>
                    </div>
                    {!task.done && new Date(task.due) < new Date() && (
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 99 }}>OVERDUE</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Related Deals</h3>
                <button className="b24-btn b24-btn-secondary"><Plus size={15} /> Link Deal</button>
              </div>
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)' }}>
                <Link size={36} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>No deals linked yet. Convert this lead to create one.</p>
                <button className="b24-btn b24-btn-primary" style={{ marginTop: 12 }} onClick={() => setShowConvert(true)}>
                  <UserCheck size={15} /> Convert Lead
                </button>
              </div>
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Attachments</h3>
                <button className="b24-btn b24-btn-secondary"><Plus size={15} /> Upload File</button>
              </div>
              <div style={{ padding: '48px', textAlign: 'center', borderRadius: 14, border: '2px dashed var(--card-border)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}>
                <Paperclip size={36} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>Drag & Drop files or click to upload</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0' }}>PDF, DOCX, PNG up to 25MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Convert Modal ── */}
      <AnimatePresence>
        {showConvert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConvert(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, background: 'var(--card-bg)', borderRadius: 20, border: '1px solid var(--card-border)', zIndex: 301, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
              <ConvertModal lead={lead} onClose={() => setShowConvert(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
