import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Upload, Download, Filter, X, ChevronDown,
  ChevronUp, MoreVertical, Eye, Edit2, Trash2, Phone, Mail,
  Star, TrendingUp, Users, UserCheck, AlertCircle, ArrowUpRight,
  ArrowDownRight, Check, UserPlus, Briefcase, Globe, RefreshCw,
  SlidersHorizontal, CheckSquare, Square
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_LEADS = [
  { id: 1,  name: 'Alice Johnson',  company: 'Vertex Corp',     email: 'alice@vertex.io',   phone: '+1-202-555-0101', source: 'Website',  status: 'New',       assigned: 'John Sales',  date: '2026-03-24', score: 82 },
  { id: 2,  name: 'Robert Brown',   company: 'BlueSky Ltd',     email: 'rob@bluesky.com',   phone: '+1-202-555-0132', source: 'Ads',      status: 'Contacted', assigned: 'Sarah Doe',   date: '2026-03-23', score: 65 },
  { id: 3,  name: 'Emma Wilson',    company: 'Acme Inc.',       email: 'emma@acme.com',     phone: '+1-202-555-0187', source: 'Referral', status: 'Qualified', assigned: 'Mike Ross',   date: '2026-03-22', score: 91 },
  { id: 4,  name: 'David Lee',      company: 'Horizon Tech',    email: 'david@horizon.io',  phone: '+1-202-555-0145', source: 'Website',  status: 'Proposal',  assigned: 'John Sales',  date: '2026-03-21', score: 74 },
  { id: 5,  name: 'Sophia Martinez',company: 'Nova Solutions',  email: 'sophia@nova.com',   phone: '+1-202-555-0198', source: 'Event',    status: 'Converted', assigned: 'Sarah Doe',   date: '2026-03-20', score: 95 },
  { id: 6,  name: 'James Taylor',   company: 'PeakSoft',        email: 'james@peaksoft.io', phone: '+1-202-555-0167', source: 'Ads',      status: 'Lost',      assigned: 'Mike Ross',   date: '2026-03-19', score: 41 },
  { id: 7,  name: 'Olivia Davis',   company: 'Cloudify',        email: 'olivia@clfy.com',   phone: '+1-202-555-0173', source: 'Referral', status: 'New',       assigned: 'John Sales',  date: '2026-03-18', score: 68 },
  { id: 8,  name: 'Noah Clark',     company: 'DataBridge',      email: 'noah@databr.com',   phone: '+1-202-555-0129', source: 'Website',  status: 'Contacted', assigned: 'Sarah Doe',   date: '2026-03-17', score: 55 },
];

const STATUS_META = {
  'New':       { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  'Contacted': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'Qualified': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  'Proposal':  { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  'Converted': { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'Lost':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const SOURCE_ICONS = {
  Website: Globe, Ads: TrendingUp, Referral: Users, Event: Star,
};

const PIPELINE_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Converted'];
const ALL_STATUSES   = ['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost'];
const ALL_SOURCES    = ['Website', 'Ads', 'Referral', 'Event'];
const ALL_ASSIGNEES  = ['John Sales', 'Sarah Doe', 'Mike Ross'];

const SORT_FIELDS = { name: 'name', date: 'date', score: 'score', status: 'status' };

// ─── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 24 }}>{score}</span>
    </div>
  );
}

// ─── Add/Edit Drawer ─────────────────────────────────────────────────────────
function LeadDrawer({ lead, onClose, onSave }) {
  const [form, setForm] = useState(lead || {
    name: '', company: '', email: '', phone: '', source: 'Website', status: 'New', assigned: 'John Sales', notes: ''
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 500,
          background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)',
          zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(0,0,0,0.12)'
        }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'e.g. Alice Johnson', type: 'text' },
              { label: 'Company Name', key: 'company', placeholder: 'e.g. Vertex Corp', type: 'text' },
              { label: 'Email Address *', key: 'email', placeholder: 'alice@company.com', type: 'email' },
              { label: 'Phone Number', key: 'phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Lead Source</label>
                <select value={form.source} onChange={e => set('source', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}>
                  {ALL_SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}>
                  {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Assigned To</label>
              <select value={form.assigned} onChange={e => set('assigned', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}>
                {ALL_ASSIGNEES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Notes</label>
              <textarea rows={4} placeholder="Add any relevant notes about this lead..." value={form.notes || ''} onChange={e => set('notes', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 12 }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Check size={16} /> {lead ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Leads Page ─────────────────────────────────────────────────────────
export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterAssigned, setFilterAssigned] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null); // null | 'add' | lead object
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Active filter tags
  const activeFilters = [
    filterStatus   && { key: 'status',   label: `Status: ${filterStatus}`,   clear: () => setFilterStatus('') },
    filterSource   && { key: 'source',   label: `Source: ${filterSource}`,   clear: () => setFilterSource('') },
    filterAssigned && { key: 'assigned', label: `Assignee: ${filterAssigned}`, clear: () => setFilterAssigned('') },
  ].filter(Boolean);

  // Filtered & sorted leads
  const processed = useMemo(() => {
    let list = leads.filter(l =>
      (!search || l.name.toLowerCase().includes(search.toLowerCase()) ||
       l.email.toLowerCase().includes(search.toLowerCase()) ||
       l.phone.includes(search)) &&
      (!filterStatus   || l.status   === filterStatus) &&
      (!filterSource   || l.source   === filterSource) &&
      (!filterAssigned || l.assigned === filterAssigned)
    );
    list = [...list].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (a[sort.field] < b[sort.field]) return -1 * dir;
      if (a[sort.field] > b[sort.field]) return 1 * dir;
      return 0;
    });
    return list;
  }, [leads, search, filterStatus, filterSource, filterAssigned, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated  = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = field => setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
  const toggleAll  = () => setSelected(selected.length === paginated.length ? [] : paginated.map(l => l.id));
  const toggleOne  = id  => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const saveLead = form => {
    if (drawer && drawer !== 'add') {
      setLeads(ls => ls.map(l => l.id === drawer.id ? { ...l, ...form } : l));
    } else {
      setLeads(ls => [...ls, { ...form, id: Date.now(), date: new Date().toISOString().split('T')[0], score: Math.floor(Math.random() * 40 + 50) }]);
    }
    setDrawer(null);
  };

  const deleteLead = id => setLeads(ls => ls.filter(l => l.id !== id));

  const SortIcon = ({ field }) => sort.field === field
    ? (sort.dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
    : <ChevronDown size={14} style={{ opacity: 0.3 }} />;

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>

      {/* ── Sticky Header ── */}
      <div style={{ padding: '28px 32px 0', position: 'sticky', top: 0, background: 'var(--bg-page)', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.7px' }}>Leads</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {processed.length} leads · {MOCK_LEADS.filter(l => l.status === 'Converted').length} converted
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary"><Upload size={16} /> Import</button>
            <button className="b24-btn b24-btn-secondary"><Download size={16} /> Export</button>
            <button className="b24-btn b24-btn-primary" onClick={() => setDrawer('add')}><Plus size={16} /> Add Lead</button>
          </div>
        </div>

        {/* ── Pipeline Kanban Strip ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '14px 18px', boxShadow: 'var(--card-shadow)' }}>
          {PIPELINE_STAGES.map((stage, i) => {
            const count = leads.filter(l => l.status === stage).length;
            const total = leads.length;
            const pct   = total ? (count / total) * 100 : 0;
            const meta  = STATUS_META[stage];
            return (
              <React.Fragment key={stage}>
                <div style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => setFilterStatus(filterStatus === stage ? '' : stage)}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: filterStatus === stage ? meta.color : 'var(--text-muted)', marginBottom: 6 }}>{stage}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: filterStatus === stage ? meta.color : 'var(--text-primary)', marginBottom: 6 }}>{count}</div>
                  <div style={{ height: 4, borderRadius: 99, background: '#e2e8f0' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: meta.color, transition: 'width 0.5s' }} />
                  </div>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div style={{ width: 1, background: 'var(--card-border)', alignSelf: 'stretch', margin: '0 4px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search by name, email, or phone..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '11px 12px 11px 42px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => setShowFilter(v => !v)}>
            <SlidersHorizontal size={16} /> Filters {activeFilters.length > 0 && <span style={{ background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 900, borderRadius: 99, padding: '1px 7px', marginLeft: 4 }}>{activeFilters.length}</span>}
          </button>
          <button className="b24-btn b24-btn-secondary"><RefreshCw size={16} /></button>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {[
                  { label: 'Status', value: filterStatus, set: v => { setFilterStatus(v); setPage(1); }, options: ALL_STATUSES },
                  { label: 'Source', value: filterSource, set: v => { setFilterSource(v); setPage(1); }, options: ALL_SOURCES },
                  { label: 'Assigned', value: filterAssigned, set: v => { setFilterAssigned(v); setPage(1); }, options: ALL_ASSIGNEES },
                ].map(f => (
                  <div key={f.label} style={{ minWidth: 160 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <select value={f.value} onChange={e => f.set(e.target.value)}
                      style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}>
                      <option value="">All {f.label}s</option>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <button className="b24-btn b24-btn-secondary" style={{ height: 38 }}
                  onClick={() => { setFilterStatus(''); setFilterSource(''); setFilterAssigned(''); }}>
                  <X size={14} /> Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter tags */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {activeFilters.map(f => (
              <motion.span key={f.key} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(37,99,235,0.08)', color: '#2563eb', fontSize: 12, fontWeight: 700, border: '1px solid rgba(37,99,235,0.2)', cursor: 'pointer' }}
                onClick={f.clear}>
                {f.label} <X size={12} />
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ padding: '0 32px 32px' }}>
        {selected.length > 0 && (
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 10, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, fontWeight: 700 }}>
            <span>{selected.length} lead{selected.length > 1 ? 's' : ''} selected</span>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}><Trash2 size={14} style={{ marginRight: 4 }} />Delete</button>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Assign</button>
            <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setSelected([])}><X size={18} /></button>
          </motion.div>
        )}

        <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '14px 16px', width: 40 }}>
                  <button onClick={toggleAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    {selected.length === paginated.length && paginated.length > 0 ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} />}
                  </button>
                </th>
                {[
                  { label: 'Lead Name', field: 'name' },
                  { label: 'Company', field: null },
                  { label: 'Contact', field: null },
                  { label: 'Source', field: null },
                  { label: 'Status', field: 'status' },
                  { label: 'Score', field: 'score' },
                  { label: 'Assigned', field: null },
                  { label: 'Date', field: 'date' },
                  { label: '', field: null }
                ].map((col, i) => (
                  <th key={i} onClick={col.field ? () => toggleSort(col.field) : undefined}
                    style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', cursor: col.field ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead, i) => (
                <motion.tr key={lead.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={e => { e.stopPropagation(); toggleOne(lead.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                      {selected.includes(lead.id) ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} />}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }} onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${STATUS_META[lead.status].color}30, ${STATUS_META[lead.status].color}60)`, color: STATUS_META[lead.status].color, fontSize: 13, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {lead.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{lead.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }} onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Briefcase size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{lead.company}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}><Mail size={11} /> {lead.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} /> {lead.phone}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {React.createElement(SOURCE_ICONS[lead.source] || Globe, { size: 13 })} {lead.source}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 900, background: STATUS_META[lead.status].bg, color: STATUS_META[lead.status].color }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', minWidth: 120 }}>
                    <ScoreBar score={lead.score} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{lead.assigned.charAt(0)}</div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{lead.assigned.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{lead.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button title="View" onClick={() => navigate(`/dashboard/leads/${lead.id}`)} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}><Eye size={14} /></button>
                      <button title="Edit" onClick={() => setDrawer(lead)} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}><Edit2 size={14} /></button>
                      <button title="Delete" onClick={() => deleteLead(lead.id)} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {processed.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <UserPlus size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>No leads found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, processed.length)} of {processed.length} leads
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--card-border)', background: page === p ? '#2563eb' : 'transparent', color: page === p ? '#fff' : 'var(--text-secondary)', fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Drawer ── */}
      {drawer !== null && (
        <LeadDrawer lead={drawer === 'add' ? null : drawer} onClose={() => setDrawer(null)} onSave={saveLead} />
      )}
    </div>
  );
}
