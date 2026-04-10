import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Search, Folder, File, Upload, Grid,
  List, Eye, Trash2, Share2, X, Plus, Check, 
  FileSpreadsheet, FileImage, FileArchive, ChevronRight,
  Clock, Tag, Filter, RefreshCw, FolderOpen, Star, Lock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* ── Data ─────────────────────────────────────────────────────────────────── */
const DOCS = [
  { id:1,  name:'CRM Implementation Guide v2.pdf',        type:'pdf',   size:'3.1 MB', date:'Apr 5, 2026',  category:'Guides',    shared:true,  starred:false, tags:['Setup','CRM'] },
  { id:2,  name:'Invoice INV-2401.pdf',                   type:'pdf',   size:'0.4 MB', date:'Apr 5, 2026',  category:'Invoices',  shared:false, starred:true,  tags:['Finance'] },
  { id:3,  name:'Invoice INV-2398.pdf',                   type:'pdf',   size:'0.3 MB', date:'Mar 28, 2026', category:'Invoices',  shared:false, starred:false, tags:['Finance'] },
  { id:4,  name:'Invoice INV-2390.pdf',                   type:'pdf',   size:'0.3 MB', date:'Mar 24, 2026', category:'Invoices',  shared:false, starred:false, tags:['Finance'] },
  { id:5,  name:'API Integration Spec.pdf',               type:'pdf',   size:'1.8 MB', date:'Mar 22, 2026', category:'Technical', shared:true,  starred:true,  tags:['API','Dev'] },
  { id:6,  name:'Service Agreement 2026.pdf',             type:'pdf',   size:'0.9 MB', date:'Mar 20, 2026', category:'Legal',     shared:false, starred:false, tags:['Contract'] },
  { id:7,  name:'Project Roadmap Q2.xlsx',                type:'excel', size:'0.5 MB', date:'Mar 18, 2026', category:'Plans',     shared:true,  starred:false, tags:['Planning'] },
  { id:8,  name:'Onboarding Checklist.pdf',               type:'pdf',   size:'0.6 MB', date:'Mar 15, 2026', category:'Guides',    shared:true,  starred:false, tags:['Onboarding'] },
  { id:9,  name:'Brand Assets Pack.zip',                  type:'zip',   size:'12 MB',  date:'Mar 10, 2026', category:'Assets',    shared:false, starred:false, tags:['Brand'] },
  { id:10, name:'Dashboard Screenshot.png',               type:'image', size:'1.2 MB', date:'Mar 8, 2026',  category:'Assets',    shared:false, starred:false, tags:['UI'] },
  { id:11, name:'Monthly Report March 2026.pdf',          type:'pdf',   size:'2.3 MB', date:'Apr 1, 2026',  category:'Reports',   shared:true,  starred:true,  tags:['Reports'] },
  { id:12, name:'Data Migration Mapping.xlsx',            type:'excel', size:'0.8 MB', date:'Mar 25, 2026', category:'Technical', shared:false, starred:false, tags:['Data','Dev'] },
];

const CATS = ['All', 'Invoices', 'Guides', 'Technical', 'Reports', 'Legal', 'Plans', 'Assets'];

const TYPE_CONFIG = {
  pdf:   { icon: FileText, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'PDF'   },
  excel: { icon: FileSpreadsheet, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'XLSX' },
  image: { icon: FileImage,  color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   label: 'IMG'   },
  zip:   { icon: FileArchive, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   label: 'ZIP'   },
};

function DocTypeIcon({ type, size = 20 }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.pdf;
  const Icon = cfg.icon;
  return (
    <div style={{ width: size + 14, height: size + 14, borderRadius: 10, background: cfg.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Icon size={size} color={cfg.color} />
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.pdf;
  return (
    <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9, fontWeight: 800, background: cfg.bg, color: cfg.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {cfg.label}
    </span>
  );
}

/* ── Upload Modal ──────────────────────────────────────────────────────────── */
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulate = () => {
    setUploaded(false);
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 12;
      setProgress(Math.min(p, 100));
      if (p >= 100) { clearInterval(t); setUploaded(true); }
    }, 120);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 32px 64px rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 2px' }}>Upload Document</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>PDF, DOCX, XLSX, PNG up to 20 MB</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); simulate(); }}
            onClick={simulate}
            style={{ border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--card-border)'}`, borderRadius: 14, padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(99,102,241,0.05)' : 'var(--input-bg)', transition: 'all 0.2s', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
              <Upload size={24} color='var(--primary)' />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Drop files here or click to browse</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Supports PDF, DOCX, XLSX, PNG, ZIP</div>
          </div>

          {/* Progress */}
          {progress > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span>{uploaded ? '✓ Upload complete' : 'Uploading...'}</span>
                <span style={{ color: uploaded ? 'var(--success)' : 'var(--primary)' }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', borderRadius: 10, background: uploaded ? 'var(--success)' : 'var(--primary)' }} />
              </div>
            </div>
          )}

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</label>
            <select className="b24-select">
              {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button onClick={() => { if (uploaded) onClose(); else simulate(); }}
              style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: uploaded ? 'var(--success)' : 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              {uploaded ? <><Check size={14} /> Done</> : <><Upload size={14} /> Upload Files</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Preview Drawer ────────────────────────────────────────────────────────── */
function PreviewDrawer({ doc, onClose }) {
  const cfg = TYPE_CONFIG[doc.type] || TYPE_CONFIG.pdf;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
      onClick={onClose}>
      <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: 'spring', damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: 420, height: '100vh', background: 'var(--card-bg)', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Document Preview</span>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
              <X size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <DocTypeIcon type={doc.type} size={22} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>{doc.name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <TypeBadge type={doc.type} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.size}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Placeholder */}
        <div style={{ flex: 1, background: 'var(--input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 80, height: 100, borderRadius: 8, background: cfg.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cfg.color}30` }}>
            <cfg.icon size={36} color={cfg.color} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Preview not available</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Download to view the full document</div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--card-border)', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Category', val: doc.category },
              { label: 'Size', val: doc.size },
              { label: 'Uploaded', val: doc.date },
              { label: 'Shared', val: doc.shared ? 'Yes' : 'Private' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{r.val}</div>
              </div>
            ))}
          </div>
          {doc.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {doc.tags.map(t => (
                <span key={t} style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>#{t}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Share2 size={14} /> Share
            </button>
            <button style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function ClientDocuments() {
  const { isDark } = useTheme();
  const [docs, setDocs]         = useState(DOCS);
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [preview, setPreview]   = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [starFilter, setStarFilter] = useState(false);

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    return (!q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.tags?.some(t => t.toLowerCase().includes(q)))
      && (cat === 'All' || d.category === cat)
      && (!starFilter || d.starred);
  });

  const toggleStar = (id) => setDocs(ds => ds.map(d => d.id === id ? { ...d, starred: !d.starred } : d));

  const card = {
    background: 'var(--card-bg)',
    borderRadius: 18,
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)',
    transition: 'all 0.3s ease',
  };

  const stats = [
    { label: 'Total Documents', val: docs.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Invoices', val: docs.filter(d => d.category === 'Invoices').length, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Shared with You', val: docs.filter(d => d.shared).length, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Starred', val: docs.filter(d => d.starred).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Documents</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Invoices, contracts, guides, and shared files from our team</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowUpload(true)}
          style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={15} /> Upload File
        </motion.button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }}
            style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', borderLeft: `4px solid ${s.color}`, background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg-darker) 100%)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Folder size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ ...card, padding: '12px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-darker)' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 220 }}>
          <Search size={14} color='var(--text-muted)' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, category, or tag..."
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 13, width: '100%' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><X size={12} /></button>}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${cat === c ? 'var(--primary)' : 'var(--card-border)'}`, background: cat === c ? 'var(--primary)' : 'var(--card-bg)', color: cat === c ? '#fff' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Starred filter */}
        <button onClick={() => setStarFilter(s => !s)}
          style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${starFilter ? '#f59e0b' : 'var(--card-border)'}`, background: starFilter ? 'rgba(245,158,11,0.1)' : 'var(--card-bg)', color: starFilter ? '#f59e0b' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}>
          <Star size={12} style={{ fill: starFilter ? '#f59e0b' : 'transparent' }} /> Starred
        </button>

        <div style={{ width: 1, height: 24, background: 'var(--card-border)' }} />

        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: 8, overflow: 'hidden' }}>
          {[{ mode: 'list', icon: List }, { mode: 'grid', icon: Grid }].map(({ mode, icon: Icon }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{ width: 34, height: 32, border: 'none', background: viewMode === mode ? 'var(--primary)' : 'transparent', color: viewMode === mode ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.15s' }}>
              <Icon size={14} />
            </button>
          ))}
        </div>

        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} file{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Document List / Grid */}
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--card-border)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <FolderOpen size={28} color='var(--text-muted)' />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-secondary)', margin: '0 0 8px' }}>No documents found</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px' }}>Try adjusting your search or category filter.</p>
          <button onClick={() => { setSearch(''); setCat('All'); setStarFilter(false); }}
            style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <RefreshCw size={14} /> Clear Filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div style={{ ...card, overflow: 'hidden' }}>
          {/* Table Head */}
          <div style={{ padding: '10px 20px', background: 'var(--input-bg)', borderBottom: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '1fr 120px 90px 110px 110px', gap: 12, alignItems: 'center' }}>
            {['Name', 'Category', 'Size', 'Uploaded', 'Actions'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              style={{ padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none', display: 'grid', gridTemplateColumns: '1fr 120px 90px 110px 110px', gap: 12, alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--input-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <DocTypeIcon type={doc.type} size={16} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
                    <TypeBadge type={doc.type} />
                    {doc.shared && <span style={{ padding: '2px 6px', borderRadius: 5, fontSize: 9, fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: '#10b981', textTransform: 'uppercase' }}>Shared</span>}
                    {doc.starred && <Star size={10} color='#f59e0b' style={{ fill: '#f59e0b' }} />}
                  </div>
                </div>
              </div>
              {/* Category */}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{doc.category}</span>
              {/* Size */}
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.size}</span>
              {/* Date */}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.date}</span>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={e => { e.stopPropagation(); setPreview(doc); }} title='Preview'
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Eye size={13} />
                </button>
                <button onClick={e => { e.stopPropagation(); toggleStar(doc.id); }} title='Star'
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--card-border)', background: 'var(--card-bg)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: doc.starred ? '#f59e0b' : 'var(--text-secondary)' }}>
                  <Star size={13} style={{ fill: doc.starred ? '#f59e0b' : 'transparent' }} />
                </button>
                <button title='Download'
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--primary)' }}>
                  <Download size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {filtered.map((doc, i) => {
            const cfg = TYPE_CONFIG[doc.type] || TYPE_CONFIG.pdf;
            return (
              <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                whileHover={{ y: -6, boxShadow: `0 20px 40px ${cfg.color}20`, borderColor: cfg.color }}
                style={{ ...card, padding: '20px', cursor: 'pointer', position: 'relative' }}
                onClick={() => setPreview(doc)}>

                {/* Star badge */}
                {doc.starred && (
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Star size={14} color='#f59e0b' style={{ fill: '#f59e0b' }} />
                  </div>
                )}

                {/* Icon */}
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cfg.bg, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                  <cfg.icon size={26} color={cfg.color} />
                </div>

                {/* Name */}
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{doc.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{doc.category} · {doc.size}</div>

                {/* Tags */}
                {doc.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                    {doc.tags.slice(0, 2).map(t => (
                      <span key={t} style={{ padding: '2px 7px', borderRadius: 20, background: `${cfg.color}15`, color: cfg.color, fontSize: 10, fontWeight: 700 }}>#{t}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{doc.date}</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
                      style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--card-border)', background: 'var(--input-bg)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: doc.starred ? '#f59e0b' : 'var(--text-secondary)' }}>
                      <Star size={11} style={{ fill: doc.starred ? '#f59e0b' : 'transparent' }} />
                    </button>
                    <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--primary)' }}>
                      <Download size={11} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {preview && <PreviewDrawer doc={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}
