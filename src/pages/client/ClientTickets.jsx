import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Eye, X, Check, RefreshCw, LifeBuoy, AlertCircle, AlertTriangle, MessageCircle, FileText,
  ChevronDown, Calendar, Clock, ArrowUpDown, Paperclip, Send, Download, Upload, Trash2,
  CheckCircle2, ArrowRight, XCircle, User, Image, File, Info, Star, ShieldAlert
} from 'lucide-react';

/* ── Mock Data ──────────────────────────────────────────────────────────────── */
const INIT_TICKETS = [
  { id: 'TCK-2045', subject: 'Login issue on mobile app', category: 'Technical', status: 'In Progress', priority: 'High', date: 'Mar 28, 2026', updated: 'Today, 10:15 AM', assignee: 'Dev Support',
    desc: 'I am unable to log into the iOS application since the latest update. It keeps giving me a "Network Error" despite my internet working fine.',
    messages: [
      { id: 1, sender: 'Alex Morgan', role: 'Client', text: 'I am unable to log into the iOS application since the latest update. It keeps giving me a "Network Error".', time: 'Mar 28, 09:00 AM', isStaff: false },
      { id: 2, sender: 'Dev Support', role: 'Support Agent', text: 'Hi Alex, sorry to hear this. Could you please let us know which version of iOS you are running?', time: 'Mar 28, 09:30 AM', isStaff: true },
      { id: 3, sender: 'Alex Morgan', role: 'Client', text: 'I am on iOS 17.4. iPhone 15 Pro.', time: 'Mar 28, 09:45 AM', isStaff: false },
      { id: 4, sender: 'Dev Support', role: 'Support Agent', text: 'Thanks. We have identified the issue with our auth service on 17.4 and are rolling out a hotfix shortly.', time: 'Today, 10:15 AM', isStaff: true },
    ],
    files: [{ name: 'error_screenshot.png', size: '1.2 MB' }], progress: 1 },
  { id: 'TCK-2044', subject: 'Invoice #INV-2993 incorrect amount', category: 'Billing', status: 'Open', priority: 'Urgent', date: 'Mar 27, 2026', updated: 'Mar 27, 2026', assignee: 'Unassigned',
    desc: 'My latest invoice is charging me for 15 users, but we downgraded to 10 users last month. Please fix this immediately.',
    messages: [
      { id: 1, sender: 'Alex Morgan', role: 'Client', text: 'My latest invoice is charging me for 15 users, but we downgraded to 10 users last month. Please fix this immediately before the auto-charge runs.', time: 'Mar 27, 02:20 PM', isStaff: false }
    ],
    files: [{ name: 'invoice_2993.pdf', size: '450 KB' }], progress: 0 },
  { id: 'TCK-2043', subject: 'How to setup custom dashboards', category: 'General', status: 'Resolved', priority: 'Low', date: 'Mar 26, 2026', updated: 'Mar 26, 2026', assignee: 'Emma Wilson',
    desc: 'Could you provide some documentation on how to build custom dashboard widgets for my team?',
    messages: [
      { id: 1, sender: 'Alex Morgan', role: 'Client', text: 'Could you provide some documentation on how to build custom dashboard widgets for my team?', time: 'Mar 26, 11:00 AM', isStaff: false },
      { id: 2, sender: 'Emma Wilson', role: 'Support Agent', text: 'Hello! You can find our comprehensive guide on custom widgets here: https://docs.vivifycrm.com/dashboards. Let me know if you need specific help!', time: 'Mar 26, 01:15 PM', isStaff: true },
    ],
    files: [], progress: 2 },
  { id: 'TCK-2042', subject: 'Data export failed', category: 'Technical', status: 'Closed', priority: 'Medium', date: 'Mar 20, 2026', updated: 'Mar 21, 2026', assignee: 'System',
    desc: 'Trying to export my lead list to CSV but the file is timing out.',
    messages: [
      { id: 1, sender: 'Alex Morgan', role: 'Client', text: 'Trying to export my lead list to CSV but the file is timing out.', time: 'Mar 20, 04:00 PM', isStaff: false },
      { id: 2, sender: 'System', role: 'Automated', text: 'We detected a massive export (~150,000 rows). This was processed in the background and the file is now available.', time: 'Mar 21, 08:00 AM', isStaff: true },
    ],
    files: [{ name: 'leads_export_large.csv', size: '12 MB' }], progress: 3 },
];

const CATEGORIES = ['All', 'Technical', 'Billing', 'General', 'Feature Request'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Urgent'];
const PROGRESS_STEPS = ['Open', 'In Progress', 'Resolved', 'Closed'];

const STATUS_STYLE = {
  'Open':        { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', dot: 'var(--warning)', border: 'rgba(245, 158, 11, 0.2)' },
  'In Progress': { color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.15)', dot: 'var(--primary)', border: 'rgba(59, 130, 246, 0.3)' },
  'Resolved':    { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', dot: 'var(--success)', border: 'rgba(16, 185, 129, 0.3)' },
  'Closed':      { color: 'var(--text-secondary)', bg: 'var(--card-border)', dot: 'var(--text-muted)', border: 'var(--card-border)' },
};
const PRIO_STYLE = {
  Urgent: { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', icon: ShieldAlert },
  High:   { color: 'var(--warning)', bg: 'rgba(234, 88, 12, 0.1)', icon: AlertTriangle },
  Medium: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', icon: AlertCircle },
  Low:    { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', icon: Info },
};

function Badge({ status }) {
  const s = STATUS_STYLE[status] || { color: 'var(--text-secondary)', bg: 'var(--card-border)', dot: 'var(--text-muted)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {status}
    </span>
  );
}

function PrioBadge({ priority }) {
  const p = PRIO_STYLE[priority] || { color: 'var(--text-secondary)', bg: 'var(--card-border)', icon: Info };
  const Icon = p.icon;
  return (
    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.bg, color: p.color, display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      <Icon size={10} />
      {priority}
    </span>
  );
}

/* ── Progress Tracker ───────────────────────────────────────────────────────── */
function ProgressTracker({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
      {PROGRESS_STEPS.map((label, i) => {
        const done = i <= step;
        const active = i === step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: active ? 'var(--primary)' : (done ? 'rgba(16, 185, 129, 0.15)' : 'var(--card-border)'),
                  border: active ? '2px solid #2563eb' : (done ? '2px solid #10b981' : '2px solid #e2e8f0'),
                  boxShadow: active ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none', color: active ? 'var(--card-bg)' : (done ? 'var(--success)' : 'var(--text-muted)') }}>
                {done && !active ? <Check size={14} /> : <span style={{ fontSize: 12, fontWeight: 800 }}>{i + 1}</span>}
              </motion.div>
              <span style={{ fontSize: 10, fontWeight: 700, color: done ? 'var(--text-primary)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div style={{ height: 2, flex: 0.6, background: i < step ? 'var(--success)' : 'var(--card-border)', borderRadius: 2, marginTop: -18 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function ClientTickets() {
  const [tickets, setTickets]   = useState(INIT_TICKETS);
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState('All');
  const [prioF, setPrioF]       = useState('All');
  const [sort, setSort]         = useState('newest');
  const [detail, setDetail]     = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [form, setForm]         = useState({ subject: '', category: 'Technical', priority: 'Medium', desc: '' });
  const [replyText, setReplyText] = useState('');

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    return (!q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      && (statusF === 'All' || t.status === statusF)
      && (prioF === 'All' || t.priority === prioF);
  }).sort((a,b) => sort === 'newest' ? -1 : 1);

  const submitNewTicket = () => {
    if (!form.subject.trim() || !form.desc.trim()) return;
    const nt = {
      id: 'TCK-' + Date.now().toString().slice(-4),
      ...form, status: 'Open', date: 'Just now', updated: 'Just now', assignee: 'Unassigned', progress: 0, files: [],
      messages: [{ id: Date.now(), sender: 'Alex Morgan', role: 'Client', text: form.desc, time: 'Just now', isStaff: false }]
    };
    setTickets(ts => [nt, ...ts]);
    setShowNew(false);
    setForm({ subject: '', category: 'Technical', priority: 'Medium', desc: '' });
  };

  const addReply = () => {
    if (!replyText.trim() || !detail) return;
    const nm = { id: Date.now(), sender: 'Alex Morgan', role: 'Client', text: replyText, time: 'Just now', isStaff: false };
    
    // Auto-reopen ticket if client replies to a resolved one
    const newStatus = detail.status === 'Resolved' || detail.status === 'Closed' ? 'Open' : detail.status;
    const newProgress = newStatus === 'Open' ? 0 : detail.progress;

    setDetail(d => ({ ...d, status: newStatus, progress: newProgress, messages: [...d.messages, nm] }));
    setTickets(ts => ts.map(t => t.id === detail.id ? { ...t, status: newStatus, progress: newProgress, messages: [...t.messages, nm], updated: 'Just now' } : t));
    setReplyText('');
  };

  const updateStatus = (id, newStatus, newProgress) => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status: newStatus, progress: newProgress, updated: 'Just now' } : t));
    if (detail?.id === id) setDetail(d => ({ ...d, status: newStatus, progress: newProgress, updated: 'Just now' }));
  };

  const setRating = (id, newRating) => {
    // Mock save rating
    setTickets(ts => ts.map(t => t.id === id ? { ...t, rating: newRating } : t));
    if (detail?.id === id) setDetail(d => ({ ...d, rating: newRating }));
  };

  const card = { 
    background: 'var(--card-bg)', 
    borderRadius: 18, 
    border: '1px solid var(--card-border)', 
    boxShadow: 'var(--card-shadow)', 
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };
  const counts = { all: tickets.length, open: tickets.filter(t=>t.status==='Open').length, progress: tickets.filter(t=>t.status==='In Progress').length, resolved: tickets.filter(t=>t.status==='Resolved').length };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>My Tickets</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Track your support requests and task progression</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowNew(true)}
          style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--text-primary)', color: 'var(--card-bg)', border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
          <Plus size={15} /> Raise Ticket
        </motion.button>
      </div>

        {/* ── Summary Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Tickets', val: counts.all, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', icon: LifeBuoy },
          { label: 'Open', val: counts.open, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: AlertCircle },
          { label: 'In Progress', val: counts.progress, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: Clock },
          { label: 'Resolved/Closed', val: counts.resolved + (counts.all - counts.open - counts.progress - counts.resolved), color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: CheckCircle2 },
        ].map((s,i) => (
          <motion.div key={i} whileHover={{ y: -4, borderColor: s.color }} 
            style={{ 
              ...card, 
              padding: '18px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 14, 
              cursor: 'pointer',
              borderLeft: `4px solid ${s.color}`,
              background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg-darker) 100%)'
            }}
            onClick={() => setStatusF(s.label === 'Total Tickets' ? 'All' : s.label.split('/')[0])}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'grid', placeItems: 'center', boxShadow: `0 0 10px ${s.color}15` }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ ...card, padding: '12px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-darker)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 200 }}>
          <Search size={15} color='var(--text-muted)'/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID or subject..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 13, width: '100%' }}/>
        </div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--input-border)', background: 'var(--input-bg)', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
        <select value={prioF} onChange={e=>setPrioF(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--input-border)', background: 'var(--input-bg)', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priority' : p}</option>)}
        </select>
        <button onClick={()=>setSort(s=>s==='newest'?'oldest':'newest')}
          style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'var(--input-bg)', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          <ArrowUpDown size={12}/> {sort === 'newest' ? 'Newest' : 'Oldest'}
        </button>
        {(search || statusF !== 'All' || prioF !== 'All') && (
          <button onClick={()=>{setSearch('');setStatusF('All');setPrioF('All');}}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'var(--card-bg)', fontSize: 12, color: 'var(--danger)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11}/> Clear
          </button>
        )}
      </div>

      {/* ── Ticket List ── */}
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--card-border)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <LifeBuoy size={28} color="var(--text-muted)"/>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-secondary)', margin: '0 0 8px' }}>No tickets found</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px' }}>You have no support tickets matching these filters.</p>
          <button onClick={()=>setShowNew(true)} style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--text-primary)', color: 'var(--card-bg)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <Plus size={14}/> Create Ticket
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((t, i) => {
            const ss = STATUS_STYLE[t.status] || {};
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ x: 4, borderColor: ss.dot || 'var(--primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                style={{ ...card, padding: '18px 24px', display: 'flex', gap: 18, alignItems: 'center', cursor: 'pointer', borderLeft: `4px solid ${ss.dot || 'var(--card-border)'}` }}
                onClick={() => setDetail(t)}>
                {/* Icon */}
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--input-bg)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <MessageCircle size={18} color='var(--text-secondary)' />
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{t.subject}</span>
                    <PrioBadge priority={t.priority} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{t.desc}</p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{t.id}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.category}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Created {t.date}</span>
                    {t.assignee !== 'Unassigned' && (
                      <>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><User size={10} /> {t.assignee}</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <Badge status={t.status} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.messages.length} replies</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TICKET DETAIL MODAL (SIDE DRAWER)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setDetail(null)}>
            <motion.div initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ width: 700, height: '100vh', background: 'var(--card-bg)', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{detail.id}</span>
                      <Badge status={detail.status} />
                      <PrioBadge priority={detail.priority} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>{detail.subject}</h2>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setDetail(null)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', background: 'var(--input-bg)' }}>
                
                {/* Tracker */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid #f1f5f9', padding: '0 24px' }}>
                  <ProgressTracker step={detail.progress} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: '#e0e7ff', color: '#3730a3', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #c7d2fe' }}>
                  <LifeBuoy size={14} /> Managed by Support Team
                </div>

                <div style={{ padding: '24px' }}>
                  
                  {/* Category & Attachments Strip */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--card-bg)', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Category</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{detail.category}</span>
                    </div>
                    <div style={{ background: 'var(--card-bg)', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Support Agent</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{detail.assignee}</span>
                    </div>
                  </div>

                  {detail.files.length > 0 && (
                    <div style={{ background: 'var(--card-bg)', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Attachments</span>
                      {detail.files.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', background: 'var(--input-bg)', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <File size={14} color="#6366f1" />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{f.name}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.size}</span>
                          <Download size={14} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat Thread */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {detail.messages.map(m => {
                      const isMe = !m.isStaff;
                      return (
                        <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: isMe ? '#e0e7ff' : 'var(--text-primary)', color: isMe ? '#3730a3' : 'var(--card-bg)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                            {m.sender.split(' ').map(w => w[0]).join('').slice(0,2)}
                          </div>
                          <div style={{ maxWidth: '75%' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textAlign: isMe ? 'right' : 'left', fontWeight: 600 }}>
                              {m.sender} <span style={{ opacity: 0.6 }}>• {m.time}</span>
                            </div>
                            <div style={{ background: isMe ? 'var(--primary)' : 'var(--card-bg)', color: isMe ? 'var(--card-bg)' : 'var(--text-primary)', padding: '12px 16px', borderRadius: 16, borderBottomRightRadius: isMe ? 0 : 16, borderBottomLeftRadius: isMe ? 16 : 0, fontSize: 13, lineHeight: 1.5, boxShadow: isMe ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 4px rgba(0,0,0,0.05)', border: isMe ? 'none' : '1px solid #e2e8f0' }}>
                              {m.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Resolution Banner & Rating */}
                  {detail.status === 'Resolved' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 24, padding: 20, borderRadius: 12, border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--success)', fontSize: 16, fontWeight: 800 }}>
                        <CheckCircle2 size={20} /> Issue Resolved
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--success)', textAlign: 'center' }}>
                        Your support agent marked this issue as resolved. How was your experience?
                      </p>
                      
                      {/* Rating Stars */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star key={star} onClick={() => setRating(detail.id, star)}
                             size={24} style={{ cursor: 'pointer', fill: (detail.rating || 0) >= star ? 'var(--warning)' : 'transparent', color: (detail.rating || 0) >= star ? 'var(--warning)' : 'rgba(16, 185, 129, 0.2)' }} />
                        ))}
                      </div>

                      {detail.rating && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>Thanks for your feedback!</span>}
                      
                      {/* Reopen Feature */}
                      <button onClick={() => updateStatus(detail.id, 'Open', 0)}
                        style={{ marginTop: 10, padding: '8px 16px', borderRadius: 8, background: 'var(--card-bg)', border: '1px solid #059669', color: 'var(--success)', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(5,150,105,0.1)' }}>
                        Issue not fixed? Reopen Ticket
                      </button>
                    </motion.div>
                  )}

                </div>
              </div>

              {/* Reply Box */}
              {(detail.status !== 'Closed' && detail.status !== 'Resolved') ? (
                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: 'var(--card-bg)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ flex: 1, background: 'var(--input-bg)', border: '1px solid #cbd5e1', borderRadius: 12, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <textarea placeholder="Type your reply here..." value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); addReply(); }}}
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none', fontSize: 13, color: 'var(--text-primary)', minHeight: 40 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
                          <Paperclip size={14} /> Attach file
                        </button>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Press Enter to send</span>
                      </div>
                    </div>
                    <button onClick={addReply} style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary)', color: 'var(--card-bg)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                      <Send size={18} style={{ marginLeft: 2 }} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', background: 'var(--input-bg)', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                    {detail.status === 'Resolved' ? 'This ticket is resolved. Reopen it to reply.' : 'This ticket has been permanently closed.'}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          NEW TICKET MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowNew(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 18, maxWidth: 500, width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 3px' }}>Raise a Support Ticket</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>We typically reply within 1-2 hours.</p>
                </div>
                <button onClick={() => setShowNew(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: '22px 28px' }}>
                <div className="b24-field">
                  <label className="b24-label">Subject</label>
                  <input className="b24-input" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="e.g. Cannot access dashboard"/>
                </div>
                <div className="b24-row b24-row-2">
                  <div className="b24-field">
                    <label className="b24-label">Category</label>
                    <select className="b24-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="b24-field">
                    <label className="b24-label">Priority</label>
                    <select className="b24-select" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                      {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="b24-field">
                  <label className="b24-label">Describe your issue in detail</label>
                  <textarea className="b24-textarea" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Please provide steps to reproduce the issue, error messages, etc." style={{ minHeight: 120 }} />
                </div>
                <div style={{ padding: '14px', borderRadius: 10, border: '1px dashed #cbd5e1', background: 'var(--input-bg)', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={18} color="var(--text-muted)" style={{ margin: '0 auto 6px', display: 'block' }} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Drag & drop screenshots or click to browse</p>
                </div>
              </div>
              <div style={{ padding: '14px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
                <button onClick={() => setShowNew(false)} className="b24-btn b24-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={submitNewTicket}
                  style={{ flex: 2, padding: '11px', borderRadius: 8, border: 'none', background: 'var(--text-primary)', color: 'var(--card-bg)', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Send size={14} /> Submit Ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
