import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, FileText, Plus, Search, Eye, TrendingUp, Edit2, Trash2,
  ExternalLink, Copy, Check, X, Filter, Download, MoreHorizontal,
  BarChart2, Users, Pause, Play, ChevronDown, AlertTriangle, Layers
} from 'lucide-react';

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_WEBSITES = [
  { id: 'w1', name: 'Grand Omni Hotel', url: 'https://grandomni.com', status: 'published', visitors: 12480, conversion: 4.2, gradient: ['#6366f1','#8b5cf6'], createdAt: '2026-01-10' },
  { id: 'w2', name: 'Booking Landing Page', url: 'https://book.grandomni.com', status: 'published', visitors: 8320, conversion: 6.8, gradient: ['#3b82f6','#06b6d4'], createdAt: '2026-02-01' },
  { id: 'w3', name: 'Spa & Wellness', url: 'https://spa.grandomni.com', status: 'draft', visitors: 0, conversion: 0, gradient: ['#ec4899','#f43f5e'], createdAt: '2026-03-05' },
  { id: 'w4', name: 'Corporate Events', url: 'https://events.grandomni.com', status: 'published', visitors: 3210, conversion: 2.9, gradient: ['#10b981','#059669'], createdAt: '2026-02-18' },
  { id: 'w5', name: 'Loyalty Program', url: 'https://loyalty.grandomni.com', status: 'draft', visitors: 0, conversion: 0, gradient: ['#f59e0b','#f97316'], createdAt: '2026-03-20' },
];

const SEED_FORMS = [
  { id: 'f1', name: 'Guest Check-in Form', status: 'active', submissions: 842, conversion: 78.4, fields: 8, createdAt: '2026-01-15' },
  { id: 'f2', name: 'Event Booking Request', status: 'active', submissions: 234, conversion: 61.2, fields: 12, createdAt: '2026-02-03' },
  { id: 'f3', name: 'Feedback & Review', status: 'active', submissions: 1204, conversion: 45.8, fields: 6, createdAt: '2026-01-28' },
  { id: 'f4', name: 'Spa Appointment', status: 'paused', submissions: 89, conversion: 33.1, fields: 7, createdAt: '2026-03-01' },
  { id: 'f5', name: 'Corporate Inquiry', status: 'active', submissions: 156, conversion: 52.7, fields: 10, createdAt: '2026-02-20' },
  { id: 'f6', name: 'Newsletter Signup', status: 'paused', submissions: 2341, conversion: 88.9, fields: 3, createdAt: '2026-01-05' },
];

const FORM_SUBMISSIONS = {
  f1: [
    { id: 1, name: 'Alice Johnson', email: 'alice@email.com', room: '101', date: '2026-03-24', status: 'Processed' },
    { id: 2, name: 'Bob Smith',     email: 'bob@email.com',   room: '205', date: '2026-03-24', status: 'Pending'   },
    { id: 3, name: 'Carol White',   email: 'carol@email.com', room: '302', date: '2026-03-23', status: 'Processed' },
  ],
  f2: [
    { id: 1, name: 'Diana Prince', email: 'diana@corp.com', event: 'Conference', date: '2026-04-10', status: 'Confirmed' },
    { id: 2, name: 'Ethan Hunt',   email: 'ethan@corp.com', event: 'Gala',       date: '2026-04-15', status: 'Pending'   },
  ],
};

const uid = () => Math.random().toString(36).slice(2, 9);

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
  ['#6366f1','#8b5cf6'], ['#3b82f6','#06b6d4'], ['#ec4899','#f43f5e'],
  ['#10b981','#059669'], ['#f59e0b','#f97316'], ['#8b5cf6','#ec4899'],
];

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
          style={{ position:'fixed', bottom:28, right:28, zIndex:9999, padding:'12px 20px', borderRadius:10,
            background: toast.type === 'error' ? '#ef4444' : '#10b981',
            color:'#fff', fontWeight:600, fontSize:13, boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
            display:'flex', alignItems:'center', gap:8 }}>
          <Check size={14}/> {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={onClose}>
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
            onClick={e => e.stopPropagation()}
            style={{ background:'var(--card-bg)', borderRadius:16, padding:28, width:'100%', maxWidth,
              border:'1px solid var(--card-border)', boxShadow:'0 24px 64px rgba(0,0,0,0.3)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:'var(--text-primary)' }}>{title}</h2>
              <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}>
                <X size={18}/>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Website Card ──────────────────────────────────────────────────────────────
function WebsiteCard({ site, onEdit, onDelete, onPreview, role }) {
  const [copied, setCopied] = useState(false);
  const copyUrl = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const isPublished = site.status === 'published';
  return (
    <motion.div whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(0,0,0,0.15)' }} transition={{ duration:0.2 }}
      style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', overflow:'hidden', boxShadow:'var(--card-shadow)' }}>
      {/* Gradient header */}
      <div style={{ height:90, background:`linear-gradient(135deg, ${site.gradient[0]}, ${site.gradient[1]})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Globe size={32} color='rgba(255,255,255,0.6)'/>
        <div style={{ position:'absolute', top:10, right:10 }}>
          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700,
            background: isPublished ? 'rgba(16,185,129,0.25)' : 'rgba(148,163,184,0.25)',
            color: isPublished ? '#6ee7b7' : '#cbd5e1', border:`1px solid ${isPublished ? 'rgba(16,185,129,0.4)' : 'rgba(148,163,184,0.3)'}` }}>
            {isPublished ? '● Published' : '○ Draft'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'16px 18px' }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:'0 0 4px' }}>{site.name}</h3>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
          <a href={site.url} target="_blank" rel="noreferrer"
            style={{ fontSize:12, color:'var(--primary)', textDecoration:'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
            {site.url}
          </a>
          <ExternalLink size={11} color='var(--primary)'/>
          <button onClick={copyUrl} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, marginLeft:'auto' }}>
            {copied ? <Check size={13} color='#10b981'/> : <Copy size={13}/>}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div style={{ padding:'10px 12px', borderRadius:10, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
              <Eye size={12} color='var(--text-muted)'/><span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>VISITORS</span>
            </div>
            <span style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)' }}>{site.visitors.toLocaleString()}</span>
          </div>
          <div style={{ padding:'10px 12px', borderRadius:10, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
              <TrendingUp size={12} color='var(--text-muted)'/><span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>CONVERSION</span>
            </div>
            <span style={{ fontSize:18, fontWeight:800, color: site.conversion > 5 ? '#10b981' : 'var(--text-primary)' }}>{site.conversion}%</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => onPreview(site)}
            style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            <Eye size={13}/> Preview
          </button>
          {role === 'admin' && <>
            <button onClick={() => onEdit(site)}
              style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              <Edit2 size={13}/> Edit
            </button>
            <button onClick={() => onDelete(site)}
              style={{ padding:'8px 12px', borderRadius:8, border:'1px solid rgba(239,68,68,0.25)', background:'rgba(239,68,68,0.08)', color:'#ef4444', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              <Trash2 size={13}/>
            </button>
          </>}
        </div>
      </div>
    </motion.div>
  );
}

// ── Form Card ─────────────────────────────────────────────────────────────────
function FormCard({ form, onEdit, onToggle, onViewSubmissions, role }) {
  const isActive = form.status === 'active';
  return (
    <motion.div whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(0,0,0,0.15)' }} transition={{ duration:0.2 }}
      style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', overflow:'hidden', boxShadow:'var(--card-shadow)' }}>
      {/* Top accent */}
      <div style={{ height:4, background: isActive ? 'linear-gradient(90deg,#10b981,#3b82f6)' : 'linear-gradient(90deg,#94a3b8,#64748b)' }}/>

      <div style={{ padding:'18px 18px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(148,163,184,0.12)', display:'grid', placeItems:'center' }}>
              <FileText size={18} color={ isActive ? '#10b981' : '#94a3b8'}/>
            </div>
            <div>
              <h3 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{form.name}</h3>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>{form.fields} fields</span>
            </div>
          </div>
          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700,
            background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(148,163,184,0.12)',
            color: isActive ? '#10b981' : '#94a3b8' }}>
            {isActive ? '● Active' : '○ Paused'}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div style={{ padding:'10px 12px', borderRadius:10, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
            <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:3 }}>SUBMISSIONS</div>
            <span style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)' }}>{form.submissions.toLocaleString()}</span>
          </div>
          <div style={{ padding:'10px 12px', borderRadius:10, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
            <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:3 }}>CONVERSION</div>
            <span style={{ fontSize:18, fontWeight:800, color: form.conversion > 60 ? '#10b981' : 'var(--text-primary)' }}>{form.conversion}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom:16 }}>
          <div style={{ height:5, borderRadius:99, background:'var(--input-bg)', overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${form.conversion}%` }} transition={{ duration:0.8, ease:'easeOut' }}
              style={{ height:'100%', borderRadius:99, background: isActive ? 'linear-gradient(90deg,#10b981,#3b82f6)' : '#94a3b8' }}/>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => onViewSubmissions(form)}
            style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            <BarChart2 size={13}/> Submissions
          </button>
          {role === 'admin' && <>
            <button onClick={() => onEdit(form)}
              style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              <Edit2 size={13}/> Edit
            </button>
            <button onClick={() => onToggle(form.id)}
              style={{ padding:'8px 12px', borderRadius:8, border:`1px solid ${isActive ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`, background: isActive ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', color: isActive ? '#f59e0b' : '#10b981', fontSize:12, cursor:'pointer' }}>
              {isActive ? <Pause size={13}/> : <Play size={13}/>}
            </button>
          </>}
        </div>
      </div>
    </motion.div>
  );
}

// ── Website Form Modal ────────────────────────────────────────────────────────
function WebsiteFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { name:'', url:'', status:'draft', gradient: GRADIENTS[0] });
  const [err, setErr] = useState('');
  React.useEffect(() => { setForm(initial || { name:'', url:'', status:'draft', gradient: GRADIENTS[0] }); setErr(''); }, [initial, open]);

  const save = () => {
    if (!form.name.trim()) return setErr('Website name is required.');
    if (!form.url.trim()) return setErr('URL is required.');
    onSave(form); onClose();
  };

  const inp = { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'9px 12px', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%' };
  const lbl = { fontSize:12, color:'var(--text-secondary)', marginBottom:4, display:'block', fontWeight:600 };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Website' : 'New Website'}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div><label style={lbl}>Website Name *</label><input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Grand Omni Hotel"/></div>
        <div><label style={lbl}>URL *</label><input style={inp} value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} placeholder="https://yoursite.com"/></div>
        <div>
          <label style={lbl}>Status</label>
          <select style={inp} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Card Color</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {GRADIENTS.map((g,i) => (
              <div key={i} onClick={() => setForm(f=>({...f,gradient:g}))}
                style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${g[0]},${g[1]})`, cursor:'pointer', border: JSON.stringify(form.gradient)===JSON.stringify(g) ? '3px solid var(--text-primary)' : '3px solid transparent', transition:'border 0.15s' }}/>
            ))}
          </div>
        </div>
        {err && <div style={{ padding:'8px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', color:'#ef4444', fontSize:12, display:'flex', gap:6 }}><AlertTriangle size={13}/>{err}</div>}
        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          <button onClick={save} style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            {initial?.id ? 'Save Changes' : 'Create Website'}
          </button>
          <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontWeight:600, fontSize:13, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ── Form Form Modal ───────────────────────────────────────────────────────────
function FormFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { name:'', status:'active', fields:5 });
  const [err, setErr] = useState('');
  React.useEffect(() => { setForm(initial || { name:'', status:'active', fields:5 }); setErr(''); }, [initial, open]);

  const save = () => {
    if (!form.name.trim()) return setErr('Form name is required.');
    onSave(form); onClose();
  };

  const inp = { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'9px 12px', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%' };
  const lbl = { fontSize:12, color:'var(--text-secondary)', marginBottom:4, display:'block', fontWeight:600 };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Form' : 'New Form'}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div><label style={lbl}>Form Name *</label><input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Guest Check-in Form"/></div>
        <div>
          <label style={lbl}>Status</label>
          <select style={inp} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <div><label style={lbl}>Number of Fields</label>
          <input type="number" min={1} max={30} style={inp} value={form.fields} onChange={e=>setForm(f=>({...f,fields:Number(e.target.value)}))}/>
        </div>
        {err && <div style={{ padding:'8px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', color:'#ef4444', fontSize:12, display:'flex', gap:6 }}><AlertTriangle size={13}/>{err}</div>}
        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          <button onClick={save} style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            {initial?.id ? 'Save Changes' : 'Create Form'}
          </button>
          <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontWeight:600, fontSize:13, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ open, onClose, onConfirm, name }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" maxWidth={400}>
      <div style={{ textAlign:'center', padding:'8px 0 16px' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(239,68,68,0.1)', display:'grid', placeItems:'center', margin:'0 auto 16px' }}>
          <Trash2 size={24} color='#ef4444'/>
        </div>
        <p style={{ fontSize:14, color:'var(--text-primary)', marginBottom:6 }}>Are you sure you want to delete</p>
        <p style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', marginBottom:20 }}>"{name}"?</p>
        <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:24 }}>This action cannot be undone.</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontWeight:600, fontSize:13, cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}

// ── Submissions Modal ─────────────────────────────────────────────────────────
function SubmissionsModal({ open, onClose, form }) {
  const rows = form ? (FORM_SUBMISSIONS[form.id] || []) : [];
  const cols = rows.length > 0 ? Object.keys(rows[0]).filter(k => k !== 'id') : [];
  return (
    <Modal open={open} onClose={onClose} title={`Submissions — ${form?.name || ''}`} maxWidth={680}>
      <div style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{rows.length} submissions</span>
        <button style={{ padding:'6px 14px', borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Download size={13}/> Export CSV
        </button>
      </div>
      {rows.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}>
          <FileText size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/>
          <p>No submissions yet</p>
        </div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--card-border)' }}>
                {cols.map(c => <th key={c} style={{ padding:'8px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid var(--card-border)' }}>
                  {cols.map(c => (
                    <td key={c} style={{ padding:'10px 12px', fontSize:13, color:'var(--text-primary)' }}>
                      {c === 'status' ? (
                        <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700,
                          background: row[c]==='Processed'||row[c]==='Confirmed' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color: row[c]==='Processed'||row[c]==='Confirmed' ? '#10b981' : '#f59e0b' }}>
                          {row[c]}
                        </span>
                      ) : row[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ open, onClose, site }) {
  return (
    <Modal open={open} onClose={onClose} title={`Preview — ${site?.name || ''}`} maxWidth={760}>
      <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--card-border)', background:'var(--input-bg)', height:400, display:'flex', flexDirection:'column' }}>
        {/* Browser chrome */}
        <div style={{ padding:'10px 14px', background:'var(--card-bg)', borderBottom:'1px solid var(--card-border)', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', gap:5 }}>
            {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
          </div>
          <div style={{ flex:1, background:'var(--input-bg)', borderRadius:6, padding:'4px 12px', fontSize:12, color:'var(--text-muted)', border:'1px solid var(--card-border)' }}>
            {site?.url}
          </div>
          <a href={site?.url} target="_blank" rel="noreferrer" style={{ color:'var(--text-muted)' }}><ExternalLink size={14}/></a>
        </div>
        {/* Preview content */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, ${site?.gradient?.[0]}22, ${site?.gradient?.[1]}22)` }}>
          <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg,${site?.gradient?.[0]},${site?.gradient?.[1]})`, display:'grid', placeItems:'center', marginBottom:16 }}>
            <Globe size={28} color='#fff'/>
          </div>
          <h3 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>{site?.name}</h3>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>Live preview not available in demo mode</p>
          <a href={site?.url} target="_blank" rel="noreferrer"
            style={{ padding:'10px 24px', borderRadius:8, background:`linear-gradient(135deg,${site?.gradient?.[0]},${site?.gradient?.[1]})`, color:'#fff', fontWeight:700, fontSize:13, textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
            Open in Browser <ExternalLink size={13}/>
          </a>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SitesAndForms() {
  const [tab, setTab]           = useState('websites');
  const [websites, setWebsites] = useState(SEED_WEBSITES);
  const [forms, setForms]       = useState(SEED_FORMS);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [role]                  = useState('admin'); // 'admin' | 'staff'

  // Modal states
  const [wModal, setWModal]     = useState(false);
  const [fModal, setFModal]     = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [delItem, setDelItem]   = useState(null);
  const [subForm, setSubForm]   = useState(null);
  const [prevSite, setPrevSite] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Website CRUD ──
  const saveWebsite = (data) => {
    if (data.id) {
      setWebsites(ws => ws.map(w => w.id === data.id ? { ...w, ...data } : w));
      showToast('Website updated');
    } else {
      setWebsites(ws => [...ws, { ...data, id: uid(), visitors: 0, conversion: 0, createdAt: new Date().toISOString().slice(0,10) }]);
      showToast('Website created');
    }
  };
  const deleteWebsite = (id) => { setWebsites(ws => ws.filter(w => w.id !== id)); showToast('Website deleted', 'error'); setDelItem(null); };

  // ── Form CRUD ──
  const saveForm = (data) => {
    if (data.id) {
      setForms(fs => fs.map(f => f.id === data.id ? { ...f, ...data } : f));
      showToast('Form updated');
    } else {
      setForms(fs => [...fs, { ...data, id: uid(), submissions: 0, conversion: 0, createdAt: new Date().toISOString().slice(0,10) }]);
      showToast('Form created');
    }
  };
  const toggleForm = (id) => {
    setForms(fs => fs.map(f => f.id === id ? { ...f, status: f.status === 'active' ? 'paused' : 'active' } : f));
    showToast('Form status updated');
  };

  // ── Filtered data ──
  const filteredWebsites = websites.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.url.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || w.status === filter;
    return matchSearch && matchFilter;
  });
  const filteredForms = forms.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || f.status === filter;
    return matchSearch && matchFilter;
  });

  // ── Export CSV ──
  const exportCSV = () => {
    const data = tab === 'websites' ? websites : forms;
    const keys = Object.keys(data[0] || {}).filter(k => k !== 'gradient');
    const csv = [keys.join(','), ...data.map(r => keys.map(k => `"${r[k]}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = `${tab}.csv`;
    a.click();
    showToast('Exported successfully');
  };

  const s = {
    page: { padding:'28px 32px', minHeight:'100%', background:'var(--bg-page)' },
    card: { background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' },
    inp:  { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'8px 12px', color:'var(--text-primary)', fontSize:13, outline:'none' },
    btn:  { padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.15s' },
  };

  return (
    <div style={s.page}>
      <Toast toast={toast}/>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'grid', placeItems:'center' }}>
            <Layers size={24} color='#fff'/>
          </div>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', margin:0, letterSpacing:'-0.5px' }}>Sites & Forms</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'3px 0 0' }}>Manage your hotel websites and lead capture forms</p>
          </div>
        </div>
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => { setEditItem(null); tab === 'websites' ? setWModal(true) : setFModal(true); }}
          style={{ ...s.btn, background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', display:'flex', alignItems:'center', gap:8, padding:'10px 20px' }}>
          <Plus size={16}/> {tab === 'websites' ? 'New Website' : 'New Form'}
        </motion.button>
      </div>

      {/* ── Summary Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Websites', value: websites.length, color:'#6366f1', icon: Globe },
          { label:'Published',      value: websites.filter(w=>w.status==='published').length, color:'#10b981', icon: Check },
          { label:'Total Forms',    value: forms.length, color:'#3b82f6', icon: FileText },
          { label:'Active Forms',   value: forms.filter(f=>f.status==='active').length, color:'#f59e0b', icon: Play },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{ ...s.card, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:stat.color, borderRadius:'16px 16px 0 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{stat.label}</span>
                <div style={{ width:32, height:32, borderRadius:8, background:`${stat.color}18`, display:'grid', placeItems:'center' }}>
                  <Icon size={15} color={stat.color}/>
                </div>
              </div>
              <span style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)' }}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* ── Tabs + Filters ── */}
      <div style={{ ...s.card, padding:'0 20px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        {/* Tabs */}
        <div style={{ display:'flex' }}>
          {[{ key:'websites', label:'Websites', icon: Globe }, { key:'forms', label:'Forms', icon: FileText }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); setFilter('all'); }}
              style={{ padding:'16px 20px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700,
                color: tab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                display:'flex', alignItems:'center', gap:7, transition:'all 0.15s' }}>
              <t.icon size={15}/> {t.label}
            </button>
          ))}
        </div>

        {/* Search + Filter + Export */}
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'7px 12px' }}>
            <Search size={14} color='var(--text-muted)'/>
            <input placeholder={`Search ${tab}...`} value={search} onChange={e=>setSearch(e.target.value)}
              style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:160 }}/>
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ ...s.inp, width:'auto' }}>
            <option value="all">All</option>
            {tab === 'websites' ? <>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </> : <>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </>}
          </select>
          <button onClick={exportCSV} style={{ ...s.btn, background:'var(--input-bg)', border:'1px solid var(--input-border)', color:'var(--text-primary)', display:'flex', alignItems:'center', gap:6 }}>
            <Download size={13}/> Export
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}>

          {tab === 'websites' && (
            filteredWebsites.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
                <Globe size={48} style={{ margin:'0 auto 16px', opacity:0.25 }}/>
                <p style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No websites found</p>
                <p style={{ fontSize:13 }}>Try adjusting your search or create a new website</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:18 }}>
                {filteredWebsites.map(site => (
                  <WebsiteCard key={site.id} site={site} role={role}
                    onEdit={s => { setEditItem(s); setWModal(true); }}
                    onDelete={s => setDelItem({ ...s, type:'website' })}
                    onPreview={s => setPrevSite(s)}/>
                ))}
              </div>
            )
          )}

          {tab === 'forms' && (
            filteredForms.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
                <FileText size={48} style={{ margin:'0 auto 16px', opacity:0.25 }}/>
                <p style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No forms found</p>
                <p style={{ fontSize:13 }}>Try adjusting your search or create a new form</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:18 }}>
                {filteredForms.map(form => (
                  <FormCard key={form.id} form={form} role={role}
                    onEdit={f => { setEditItem(f); setFModal(true); }}
                    onToggle={toggleForm}
                    onViewSubmissions={f => setSubForm(f)}/>
                ))}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ── */}
      <WebsiteFormModal open={wModal} onClose={() => { setWModal(false); setEditItem(null); }} onSave={saveWebsite} initial={editItem}/>
      <FormFormModal    open={fModal} onClose={() => { setFModal(false); setEditItem(null); }} onSave={saveForm}    initial={editItem}/>
      <DeleteModal open={!!delItem} onClose={() => setDelItem(null)} name={delItem?.name}
        onConfirm={() => { if (delItem?.type === 'website') deleteWebsite(delItem.id); setDelItem(null); }}/>
      <SubmissionsModal open={!!subForm} onClose={() => setSubForm(null)} form={subForm}/>
      <PreviewModal     open={!!prevSite} onClose={() => setPrevSite(null)} site={prevSite}/>
    </div>
  );
}
