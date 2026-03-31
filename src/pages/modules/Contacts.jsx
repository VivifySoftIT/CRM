import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Download, Upload, Filter, X, Check,
  ChevronUp, MoreVertical, Eye, Edit2, Trash2, Phone, Mail,
  Star, Users, MapPin, Building2, Briefcase, RefreshCw,
  SlidersHorizontal, CheckSquare, Square, User, ShieldCheck,
  MoreHorizontal, Tag, ArrowUpRight, AlertCircle
} from 'lucide-react';
import AddContactModal, { SuccessToast } from '../../components/AddContactModal';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CONTACTS = [
  { id: 1, name: 'Alice Johnson', company: 'Vertex Corp', email: 'alice@vertex.io', phone: '+1-202-555-0101', designation: 'VP Operations', location: 'New York, USA', owner: 'John Sales', date: '2026-03-20', tags: ['VIP', 'Customer'], contactType: 'VIP' },
  { id: 2, name: 'Robert Brown', company: 'BlueSky Ltd', email: 'rob@bluesky.com', phone: '+1-202-555-0132', designation: 'CEO', location: 'London, UK', owner: 'Sarah Doe', date: '2026-03-21', tags: ['Hot Lead'], contactType: 'Lead' },
  { id: 3, name: 'Emma Wilson', company: 'Acme Inc.', email: 'emma@acme.com', phone: '+1-202-555-0187', designation: 'Sales Director', location: 'San Francisco, USA', owner: 'Mike Ross', date: '2026-03-22', tags: ['Customer'], contactType: 'Customer' },
  { id: 4, name: 'David Lee', company: 'Horizon Tech', email: 'david@horizon.io', phone: '+1-202-555-0145', designation: 'CTO', location: 'Austin, USA', owner: 'John Sales', date: '2026-03-23', tags: ['Hot Lead'], contactType: 'Lead' },
  { id: 5, name: 'Sophia Martinez', company: 'Nova Solutions', email: 'sophia@nova.com', phone: '+1-202-555-0198', designation: 'Product Manager', location: 'Madrid, Spain', owner: 'Sarah Doe', date: '2026-03-24', tags: ['VIP'], contactType: 'VIP' },
  { id: 6, name: 'James Taylor', company: 'PeakSoft', email: 'james@peaksoft.io', phone: '+1-202-555-0167', designation: 'Project Lead', location: 'Toronto, Canada', owner: 'Mike Ross', date: '2026-03-19', tags: ['Customer'], contactType: 'Customer' },
];

const TAG_COLORS = {
  'VIP':      { bg: 'rgba(124,58,237,0.12)', text: '#7c3aed' },
  'Customer': { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  'Hot Lead': { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444' },
  'New':      { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  'Lead':     { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
};

const TYPE_BADGE = {
  Lead:     { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  Customer: { bg: 'rgba(16,185,129,0.1)',  text: '#10b981' },
  VIP:      { bg: 'rgba(124,58,237,0.1)',  text: '#7c3aed' },
};

const ALL_OWNERS    = ['John Sales', 'Sarah Doe', 'Mike Ross', 'Emily Clark'];
const ALL_LOCATIONS = ['New York, USA', 'London, UK', 'San Francisco, USA', 'Austin, USA', 'Madrid, Spain', 'Toronto, Canada'];

const AVATAR_PALETTES = [
  { bg: 'rgba(37,99,235,0.15)',  text: '#2563eb' },
  { bg: 'rgba(124,58,237,0.15)', text: '#7c3aed' },
  { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444' },
  { bg: 'rgba(236,72,153,0.15)', text: '#ec4899' },
];

function getAvatarPalette(name = '') {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

// ─── Edit Drawer (kept for editing existing contacts) ─────────────────────────
function ContactDrawer({ contact, onClose, onSave }) {
  const [form, setForm] = useState(contact || {
    name: '', company: '', email: '', phone: '', designation: '', location: '', owner: 'John Sales', tags: []
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 500,
          background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)',
          zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(0,0,0,0.12)'
        }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Edit Contact</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'e.g. Alice Johnson' },
              { label: 'Company', key: 'company', placeholder: 'e.g. Vertex Corp' },
              { label: 'Email', key: 'email', placeholder: 'alice@company.com', type: 'email' },
              { label: 'Phone', key: 'phone', placeholder: '+1-202-555-0101', type: 'tel' },
              { label: 'Designation', key: 'designation', placeholder: 'e.g. CEO' },
            ].map(f => (
              <div key={f.key}>
                <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key] || ''}
                  onChange={e => set(f.key, e.target.value)}
                  className="b24-input" style={{ borderRadius: 8 }} />
              </div>
            ))}
            <div>
              <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Location</label>
              <select value={form.location || ''} onChange={e => set('location', e.target.value)}
                className="b24-select" style={{ borderRadius: 8 }}>
                <option value="">Select Location</option>
                {ALL_LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Record Owner</label>
              <select value={form.owner} onChange={e => set('owner', e.target.value)}
                className="b24-select" style={{ borderRadius: 8 }}>
                {ALL_OWNERS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Check size={14} /> Update Contact
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Contacts Page ──────────────────────────────────────────────────────
export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts]       = useState(MOCK_CONTACTS);
  const [search, setSearch]           = useState('');
  const [filterOwner, setFilterOwner]     = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showFilter, setShowFilter]   = useState(false);
  const [selected, setSelected]       = useState([]);
  const [editDrawer, setEditDrawer]   = useState(null);   // contact obj or null
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toast, setToast]             = useState(null);    // message string or null
  const [page, setPage]               = useState(1);
  const PER_PAGE = 8;

  const processed = useMemo(() => {
    return contacts.filter(c =>
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.email.toLowerCase().includes(search.toLowerCase()) ||
       c.company.toLowerCase().includes(search.toLowerCase())) &&
      (!filterOwner || c.owner === filterOwner) &&
      (!filterLocation || c.location === filterLocation)
    ).sort((a, b) => b.id - a.id);
  }, [contacts, search, filterOwner, filterLocation]);

  const paginated  = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(processed.length / PER_PAGE);

  const toggleSelection = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Called from AddContactModal ──────────────────────────────────────────────
  const handleAddContact = (newContact) => {
    setContacts(prev => [newContact, ...prev]);
    setToast(`✅ "${newContact.name}" added successfully!`);
    setPage(1);
  };

  // Called from EditDrawer ───────────────────────────────────────────────────
  const handleUpdateContact = (form) => {
    setContacts(prev => prev.map(c => c.id === editDrawer.id ? { ...c, ...form } : c));
    setEditDrawer(null);
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)' }}>

      {/* Add Contact Modal */}
      <AddContactModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddContact}
      />

      {/* Success Toast */}
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.6px' }}>
              Contacts
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              {processed.length} total contact{processed.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary"><Upload size={14} /> Import</button>
            <button className="b24-btn b24-btn-secondary"><Download size={14} /> Export</button>
            <button
              className="b24-btn b24-btn-primary"
              onClick={() => setAddModalOpen(true)}
              style={{ gap: 7 }}
            >
              <Plus size={15} /> Add Contact
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search by name, email, or company…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="b24-input"
              style={{ paddingLeft: 38, borderRadius: 8, border: '1px solid var(--card-border)' }}
            />
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => setShowFilter(v => !v)}>
            <Filter size={14} /> Filters
            {(filterOwner || filterLocation) &&
              <span style={{ background: '#2563eb', color: '#fff', fontSize: 9, borderRadius: 99, padding: '1px 6px', marginLeft: 2 }}>!</span>
            }
          </button>
          <button className="b24-btn b24-btn-secondary" onClick={() => { setSearch(''); setFilterOwner(''); setFilterLocation(''); }}>
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Owner</label>
                  <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className="b24-select" style={{ borderRadius: 8 }}>
                    <option value="">All Owners</option>
                    {ALL_OWNERS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="b24-label" style={{ display: 'block', marginBottom: 6 }}>Location</label>
                  <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="b24-select" style={{ borderRadius: 8 }}>
                    <option value="">All Locations</option>
                    {ALL_LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <button className="b24-btn b24-btn-secondary" style={{ alignSelf: 'flex-end', height: 34 }}
                  onClick={() => { setFilterOwner(''); setFilterLocation(''); }}>
                  <X size={12} /> Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Table ── */}
      <div style={{ padding: '0 32px 32px' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '12px 14px', width: 40 }}>
                  <Square size={16} color="var(--text-muted)" />
                </th>
                {['Contact', 'Company', 'Designation', 'Email', 'Owner', 'Location', 'Added', ''].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
                    No contacts found. Click <strong>+ Add Contact</strong> to get started.
                  </td>
                </tr>
              )}
              {paginated.map((c, i) => {
                const palette = getAvatarPalette(c.name);
                const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const typeBadge = TYPE_BADGE[c.contactType];
                return (
                  <motion.tr key={c.id}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/contacts/${c.id}`)}
                  >
                    <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleSelection(c.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                        {selected.includes(c.id) ? <CheckSquare size={16} color="#2563eb" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: palette.bg, color: palette.text,
                          fontSize: 13, fontWeight: 900, display: 'grid', placeItems: 'center',
                          flexShrink: 0, fontFamily: 'var(--font-heading)'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{c.name}</div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                            {typeBadge && (
                              <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', padding: '1px 7px', borderRadius: 99, background: typeBadge.bg, color: typeBadge.text, letterSpacing: '0.05em' }}>
                                {c.contactType}
                              </span>
                            )}
                            {c.tags.filter(t => t !== c.contactType).slice(0, 1).map(tag => (
                              TAG_COLORS[tag] &&
                              <span key={tag} style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', padding: '1px 7px', borderRadius: 99, background: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].text, letterSpacing: '0.05em' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        <Building2 size={12} color="#2563eb" /> {c.company || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{c.designation || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 99, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          {c.owner.charAt(0)}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{c.owner}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                        <MapPin size={11} /> {c.location || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--text-muted)' }}>{c.date}</td>
                    <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <button onClick={() => setEditDrawer(c)}
                          style={{ background: 'none', border: 'none', padding: '6px', borderRadius: 7, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}
                          title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDeleteContact(c.id)}
                          style={{ background: 'none', border: 'none', padding: '6px', borderRadius: 7, color: '#ef4444', cursor: 'pointer', transition: 'all 0.15s' }}
                          title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '14px 18px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing {paginated.length} of {processed.length} contacts
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{
                      width: 30, height: 30, borderRadius: 7,
                      border: '1px solid var(--card-border)',
                      background: page === i + 1 ? '#2563eb' : 'transparent',
                      color: page === i + 1 ? '#fff' : 'var(--text-primary)',
                      fontWeight: 800, cursor: 'pointer', fontSize: 12, padding: 0
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Drawer */}
      {editDrawer && (
        <ContactDrawer
          contact={editDrawer}
          onClose={() => setEditDrawer(null)}
          onSave={handleUpdateContact}
        />
      )}
    </div>
  );
}
