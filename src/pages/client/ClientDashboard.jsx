import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Ticket, CreditCard, CheckCircle2, ArrowRight,
  Plus, Phone, Clock, TrendingUp, Calendar, DollarSign,
  AlertCircle, ChevronRight, Search, Filter, Eye, X,
  Bell, MessageSquare, Folder, User, Zap, Star,
  RefreshCw, ExternalLink, Inbox, Activity, Check,
  BarChart3, Shield, Download, Send, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* ── Data ───────────────────────────────────────────────────────────────────── */
const SUMMARY = [
  {
    label: 'Support Tickets',
    value: 3,
    total: 18,
    color: 'var(--primary)',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    icon: Ticket,
    change: '+2 this week',
    trend: 'up',
    path: '/client/tickets',
  },
  {
    label: 'Pending Payments',
    value: 2,
    total: 5,
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    icon: CreditCard,
    change: '$1,340 due',
    trend: 'warn',
    path: '/client/billing',
  },
  {
    label: 'Open Support Tickets',
    value: 1,
    total: 8,
    color: 'var(--danger)',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    icon: Ticket,
    change: '1 needs action',
    trend: 'alert',
    path: '/client/tickets',
  },
  {
    label: 'Completed Services',
    value: 12,
    total: 15,
    color: 'var(--success)',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
    icon: CheckCircle2,
    change: '80% completion rate',
    trend: 'up',
    path: '/client/tickets',
  },
];

const REQUESTS = [
  {
    id: 'REQ-001',
    title: 'CRM Integration Setup',
    desc: 'Integrate existing HubSpot data with VivifyCRM including all contacts and deal pipelines.',
    status: 'In Progress',
    date: 'Mar 24, 2026',
    type: 'Integration',
    priority: 'High',
  },
  {
    id: 'REQ-002',
    title: 'Custom Report Builder',
    desc: 'Build a drag-and-drop report builder for the sales team with PDF export.',
    status: 'Confirmed',
    date: 'Mar 22, 2026',
    type: 'Feature',
    priority: 'Medium',
  },
  {
    id: 'REQ-003',
    title: 'Mobile App Configuration',
    desc: 'Set up push notifications and configure offline mode for the mobile CRM app.',
    status: 'Pending',
    date: 'Mar 20, 2026',
    type: 'Configuration',
    priority: 'Medium',
  },
  {
    id: 'REQ-004',
    title: 'Email Campaign Module',
    desc: 'Email automation setup with drip campaigns and A/B testing for marketing team.',
    status: 'Completed',
    date: 'Mar 18, 2026',
    type: 'Feature',
    priority: 'Low',
  },
];

const TICKETS = [
  { id: 'TK-005', title: 'Dashboard widgets not loading',   status: 'Open',        date: 'Mar 24, 2026', priority: 'High'   },
  { id: 'TK-004', title: 'Export button throws 500 error',  status: 'In Progress', date: 'Mar 21, 2026', priority: 'Medium' },
  { id: 'TK-003', title: 'User role permissions incorrect', status: 'Resolved',    date: 'Mar 18, 2026', priority: 'Low'    },
];

const INVOICES = [
  { id: 'INV-2401', desc: 'CRM Platform Setup — Q1 2026',   amount: 4800, status: 'Overdue', due: 'Mar 20, 2026' },
  { id: 'INV-2405', desc: 'Custom Development — March',      amount: 1200, status: 'Pending', due: 'Mar 31, 2026' },
  { id: 'INV-2398', desc: 'Monthly Support Retainer',        amount: 500,  status: 'Paid',    due: 'Mar 15, 2026' },
];

const TIMELINE = [
  { icon: FileText,     color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.1)', text: 'New request REQ-001 submitted',       time: 'Today, 10:30 AM',    type: 'request' },
  { icon: CreditCard,   color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)', text: 'Payment of $500 received for INV-2398', time: 'Today, 9:15 AM',     type: 'payment' },
  { icon: MessageSquare,color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', text: 'New message from Support Team',       time: 'Yesterday, 4:45 PM', type: 'message' },
  { icon: Ticket,       color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', text: 'Ticket #TK-005 opened — High priority', time: 'Yesterday, 4:00 PM', type: 'ticket'  },
  { icon: CheckCircle2, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)', text: 'Email Campaign Module completed',     time: 'Mar 22, 2:30 PM',    type: 'complete'},
  { icon: DollarSign,   color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', text: 'Invoice INV-2401 overdue — Action needed', time: 'Mar 20, 12:00 PM', type: 'alert'   },
  { icon: Bell,         color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', text: 'System maintenance scheduled Apr 1',  time: 'Mar 19, 9:00 AM',    type: 'system'  },
];

const NOTIFICATIONS = [
  { id: 1, text: 'Invoice INV-2401 is overdue by 4 days',                    time: '2h ago',  read: false, color: 'var(--danger)', icon: AlertTriangle },
  { id: 2, text: 'Ticket #TK-004 status updated to In Progress',              time: '5h ago',  read: false, color: 'var(--primary)', icon: Ticket        },
  { id: 3, text: 'Support replied to your message about REQ-001',             time: '1d ago',  read: false, color: '#8b5cf6', icon: MessageSquare  },
  { id: 4, text: 'New document shared: CRM Implementation Guide v2',          time: '2d ago',  read: true,  color: 'var(--success)', icon: Folder         },
  { id: 5, text: 'Payment for INV-2398 confirmed — $500',                     time: '3d ago',  read: true,  color: 'var(--success)', icon: CheckCircle2   },
];

const QUICK_ACTIONS = [
  { label: 'Raise New Ticket',    icon: Plus,          color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', path: '/client/tickets' },
  { label: 'Raise Support Ticket',icon: Ticket,        color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', path: '/client/tickets'  },
  { label: 'Make a Payment',      icon: CreditCard,    color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', path: '/client/billing'  },
  { label: 'Contact Support',     icon: MessageSquare, color: '#7c3aed', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', path: '/client/messages' },
];

/* ── Status Config ──────────────────────────────────────────────────────────── */
const STATUS = {
  'In Progress':{ color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', dot: 'var(--warning)' },
  'Confirmed':  { color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.15)', dot: 'var(--primary)' },
  'Pending':    { color: 'var(--warning)', bg: 'rgba(234, 179, 8, 0.1)', dot: '#eab308' },
  'Completed':  { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', dot: 'var(--success)' },
  'Open':       { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.15)', dot: '#f87171' },
  'Resolved':   { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', dot: 'var(--success)' },
  'Paid':       { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', dot: 'var(--success)' },
  'Overdue':    { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.15)', dot: 'var(--danger)' },
};

const PRIORITY = {
  High:   { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.15)' },
  Medium: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  Low:    { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)' },
};

/* ── Sub-components ─────────────────────────────────────────────────────────── */
function Badge({ status }) {
  const s = STATUS[status] || { color: 'var(--text-secondary)', bg: 'var(--card-border)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot || s.color, display: 'inline-block' }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const p = PRIORITY[priority] || { color: 'var(--text-secondary)', bg: 'var(--card-border)' };
  return (
    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 800, background: p.bg, color: p.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {priority}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function ClientDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Integration', desc: '' });
  const [ticketForm, setTicketForm] = useState({ subject: '', priority: 'Medium', desc: '' });
  const [activeTab, setActiveTab] = useState('tickets');

  const unreadCount = notifs.filter(n => !n.read).length;

  const filteredRequests = REQUESTS.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchS;
  });

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  const submitRequest = () => {
    if (!form.title.trim()) return;
    setNewRequestModal(false);
    setForm({ title: '', type: 'Integration', desc: '' });
  };

  const submitTicket = () => {
    if (!ticketForm.subject.trim()) return;
    setNewTicketModal(false);
    setTicketForm({ subject: '', priority: 'Medium', desc: '' });
  };

  const card = {
    background: 'var(--card-bg)',
    borderRadius: 18,
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Welcome Banner ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -20, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>ACCOUNT ACTIVE</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--card-bg)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Welcome back, Alex Morgan 👋
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            You have <strong style={{ color: '#fbbf24' }}>{unreadCount} new notifications</strong> and <strong style={{ color: '#fbbf24' }}>2 pending payments</strong> that need attention.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12 }}>
          <button onClick={() => setNewRequestModal(true)}
            style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.15)', color: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, backdropFilter: 'blur(8px)' }}>
            <Plus size={15} /> New Request
          </button>
          <button onClick={() => navigate('/client/billing')}
            style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--card-bg)', color: 'var(--primary)', border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <CreditCard size={15} /> View Billing
          </button>
        </div>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {SUMMARY.map((s, i) => {
          const Icon = s.icon;
          const pct = Math.round((s.value / s.total) * 100);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 20px 40px ${s.color}25`, borderColor: s.color }}
              onClick={() => navigate(s.path)}
              style={{ 
                ...card, 
                padding: '24px', 
                cursor: 'pointer', 
                position: 'relative',
                borderLeft: `4px solid ${s.color}`,
                background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg-darker) 100%)'
              }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, display: 'grid', placeItems: 'center' }}>
                  <Icon size={20} color={s.color} />
                </div>
                {s.trend === 'alert' && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 20 }}>
                    ⚠ Alert
                  </span>
                )}
                {s.trend === 'warn' && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 20 }}>
                    Action needed
                  </span>
                )}
                {s.trend === 'up' && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <TrendingUp size={10} /> Good
                  </span>
                )}
              </div>
              {/* Value */}
              <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 2, lineHeight: 1, textShadow: isDark ? `0 0 20px ${s.color}40` : 'none' }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 }}>{s.label}</div>
              {/* Progress bar */}
              <div style={{ height: 5, background: 'var(--card-border)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }}
                  style={{ height: '100%', background: s.color, borderRadius: 10 }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.change}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Tab area: Requests + Tickets ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20 }}>

        {/* Left: Requests + Tickets tabbed */}
        <div style={card}>
          {/* Tab headers */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', padding: '0 20px', background: 'var(--bg-darker)' }}>
            {[
              { key: 'tickets',  label: 'My Tickets', count: TICKETS.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: '14px 0', marginRight: 28, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: 'transparent', color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: `2px solid ${activeTab === tab.key ? 'var(--primary)' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                {tab.label}
                <span style={{ minWidth: 20, height: 20, borderRadius: 20, background: activeTab === tab.key ? 'var(--primary)' : 'var(--card-border)', color: activeTab === tab.key ? 'var(--card-bg)' : 'var(--text-secondary)', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                  {tab.count}
                </span>
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {activeTab === 'requests' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--input-bg)', border: '1px solid #e2e8f0', borderRadius: 7, padding: '6px 10px', minWidth: 160 }}>
                  <Search size={12} color="var(--text-muted)" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text-primary)', width: '100%' }} />
                </div>
                {/* Filter */}
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', background: 'var(--input-bg)', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  <option value="All">All Status</option>
                  {['Pending', 'In Progress', 'Confirmed', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            {activeTab === 'tickets' && (
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <button onClick={() => setNewTicketModal(true)}
                  style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--danger)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                  <Plus size={14} /> Raise Ticket
                </button>
              </div>
            )}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tickets' && (
              <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{TICKETS.length} total tickets</span>
                  <button onClick={() => navigate('/client/tickets')}
                    style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                {TICKETS.map((t, i) => (
                  <div key={t.id}
                    style={{ padding: '14px 20px', borderBottom: i < TICKETS.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-hover-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Ticket size={17} color="var(--danger)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{t.title}</div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t.id}</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.date}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                    </div>
                    <Badge status={t.status} />
                    <button onClick={() => navigate('/client/tickets')}
                      style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #fecaca', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={11} /> View
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Quick Actions + Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick Actions */}
          <div style={card}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} color="var(--warning)" />
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Quick Actions</h3>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_ACTIONS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.button key={i} whileHover={{ scale: 1.02, x: 3 }} whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (a.label === 'Raise New Ticket') { setNewTicketModal(true); return; }
                      navigate(a.path);
                    }}
                    style={{ padding: '11px 14px', borderRadius: 10, border: `1px solid ${a.border}`, background: a.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, transition: 'all 0.15s', width: '100%', textAlign: 'left' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--card-bg)', display: 'grid', placeItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.07)', flexShrink: 0 }}>
                      <Icon size={16} color={a.color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: a.color, flex: 1 }}>{a.label}</span>
                    <ChevronRight size={14} color={a.color} />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div style={card}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={15} color="#6366f1" />
                <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Notifications</h3>
                {unreadCount > 0 && (
                  <span style={{ minWidth: 18, height: 18, borderRadius: 20, background: 'var(--danger)', color: 'var(--card-bg)', fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {notifs.slice(0, 5).map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id}
                    style={{ padding: '11px 18px', borderBottom: '1px solid #f8fafc', background: n.read ? 'transparent' : 'var(--sidebar-hover-bg)', display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--card-border)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'var(--sidebar-hover-bg)'}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${n.color}12`, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon size={13} color={n.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.5, fontWeight: n.read ? 500 : 700 }}>{n.text}</p>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0, marginTop: 5 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Billing + Timeline ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

        {/* Billing Summary */}
        <div style={card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={15} color="var(--success)" />
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Billing Summary</h3>
              <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: 10, fontWeight: 800 }}>
                1 Overdue
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate('/client/billing')}
                style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #e2e8f0', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                View All Invoices
              </button>
            </div>
          </div>

          {/* Overdue alert banner */}
          <div style={{ margin: '12px 20px', padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={15} color="var(--danger)" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)' }}>Invoice INV-2401 is overdue.</span>
              <span style={{ fontSize: 12, color: 'var(--danger)', marginLeft: 6 }}>$4,800 was due on Mar 20, 2026.</span>
            </div>
            <button onClick={() => navigate('/client/billing')}
              style={{ padding: '6px 14px', borderRadius: 7, background: 'var(--danger)', color: 'var(--card-bg)', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Pay Now
            </button>
          </div>

          {/* Invoice rows */}
          {INVOICES.map((inv, i) => (
            <div key={inv.id}
              style={{ padding: '14px 20px', borderBottom: i < INVOICES.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'Overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <CreditCard size={17} color={inv.status === 'Paid' ? 'var(--success)' : inv.status === 'Overdue' ? 'var(--danger)' : 'var(--warning)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>{inv.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inv.id} · Due {inv.due}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: inv.status === 'Overdue' ? 'var(--danger)' : 'var(--text-primary)' }}>${inv.amount.toLocaleString()}</div>
              </div>
              <Badge status={inv.status} />
              {inv.status !== 'Paid' && (
                <button onClick={() => navigate('/client/billing')}
                  style={{ padding: '7px 14px', borderRadius: 8, background: inv.status === 'Overdue' ? 'var(--danger)' : 'var(--primary)', color: 'var(--card-bg)', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Pay Now
                </button>
              )}
              {inv.status === 'Paid' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} /> Paid
                </div>
              )}
            </div>
          ))}

          {/* Total unpaid */}
          <div style={{ padding: '12px 20px', background: 'var(--input-bg)', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total outstanding amount:</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--danger)' }}>$6,000</span>
          </div>
        </div>

        {/* Activity Timeline */}
        <div style={card}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={15} color="#8b5cf6" />
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Activity Timeline</h3>
          </div>
          <div style={{ padding: '18px 20px', maxHeight: 380, overflowY: 'auto' }}>
            {TIMELINE.map((ev, i) => {
              const Icon = ev.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 18, position: 'relative' }}>
                  {/* Connector line */}
                  {i < TIMELINE.length - 1 && (
                    <div style={{ position: 'absolute', left: 14, top: 30, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #e2e8f0 0%, transparent 100%)' }} />
                  )}
                  {/* Icon */}
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ev.bg, border: `1.5px solid ${ev.color}25`, display: 'grid', placeItems: 'center', flexShrink: 0, zIndex: 1 }}>
                    <Icon size={13} color={ev.color} />
                  </div>
                  {/* Text */}
                  <div style={{ paddingTop: 3 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 3 }}>{ev.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════ */}

      {/* New Request Modal */}
      <AnimatePresence>
        {newRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setNewRequestModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 18, padding: 28, maxWidth: 460, width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 3px' }}>Create New Request</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Our team will respond within 24 hours</p>
                </div>
                <button onClick={() => setNewRequestModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="b24-field">
                <label className="b24-label">Request Title <span className="required">*</span></label>
                <input className="b24-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. API Integration Setup" />
              </div>
              <div className="b24-field">
                <label className="b24-label">Request Type</label>
                <select className="b24-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {['Integration', 'Feature', 'Configuration', 'Support', 'Training', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="b24-field">
                <label className="b24-label">Details</label>
                <textarea className="b24-textarea" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe your request in detail..." style={{ minHeight: 90 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={() => setNewRequestModal(false)} className="b24-btn b24-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={submitRequest}
                  style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'var(--card-bg)', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Send size={14} /> Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {newTicketModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setNewTicketModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 18, padding: 28, maxWidth: 460, width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 3px' }}>Raise Support Ticket</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Priority tickets are reviewed within 2 hours</p>
                </div>
                <button onClick={() => setNewTicketModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="b24-field">
                <label className="b24-label">Subject <span className="required">*</span></label>
                <input className="b24-input" value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Login page not loading" />
              </div>
              <div className="b24-field">
                <label className="b24-label">Priority Level</label>
                <select className="b24-select" value={ticketForm.priority} onChange={e => setTicketForm(f => ({ ...f, priority: e.target.value }))}>
                  {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="b24-field">
                <label className="b24-label">Description</label>
                <textarea className="b24-textarea" value={ticketForm.desc} onChange={e => setTicketForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe the issue clearly — include steps to reproduce..." style={{ minHeight: 90 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={() => setNewTicketModal(false)} className="b24-btn b24-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={submitTicket}
                  style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--danger)', color: 'var(--card-bg)', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
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
