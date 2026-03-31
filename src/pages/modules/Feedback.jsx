import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MessageSquare, AlertTriangle, CheckCircle2, Clock,
  Search, Filter, Download, Send, X, Check, ChevronDown,
  User, Calendar, Home, Utensils, Wrench, Sparkles,
  TrendingUp, BarChart2, PieChart, RefreshCw, Bell, Eye
} from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// ── Data ──────────────────────────────────────────────────────────────────────
const REVIEWS = [
  { id:'R001', guest:'Alice Johnson',  avatar:'AJ', color:'#6366f1', rating:5, type:'Feedback',   status:'Resolved',    date:'2026-03-24', room:'Suite 301',    stay:'Mar 22–26', comment:'Absolutely exceptional service! The staff went above and beyond. The room was immaculate and the view was breathtaking. Will definitely return.',              issue:null,          assignee:'Front Desk',  responseTime:'2h',  reply:'Thank you so much, Alice! We look forward to welcoming you back.' },
  { id:'R002', guest:'Bob Smith',      avatar:'BS', color:'#3b82f6', rating:2, type:'Complaint',  status:'In Progress', date:'2026-03-22', room:'Deluxe 205',   stay:'Mar 19–22', comment:'The air conditioning was broken for the first two nights. Maintenance was slow to respond. Very disappointing for the price paid.',                            issue:'Maintenance',  assignee:'Maintenance', responseTime:'6h',  reply:'' },
  { id:'R003', guest:'Charlie Brown',  avatar:'CB', color:'#f59e0b', rating:5, type:'Feedback',   status:'Resolved',    date:'2026-03-23', room:'Penthouse 401', stay:'Mar 22–26', comment:'VIP treatment was outstanding. Butler service was prompt and professional. The penthouse exceeded all expectations.',                                           issue:null,          assignee:'Manager',     responseTime:'1h',  reply:'We are delighted to hear this, Charlie!' },
  { id:'R004', guest:'Diana Prince',   avatar:'DP', color:'#10b981', rating:4, type:'Feedback',   status:'New',         date:'2026-03-20', room:'Standard 102',  stay:'Mar 18–20', comment:'Good stay overall. Room was clean and comfortable. Breakfast could have more variety but everything else was great.',                                            issue:null,          assignee:null,          responseTime:null,  reply:'' },
  { id:'R005', guest:'Ethan Hunt',     avatar:'EH', color:'#8b5cf6', rating:1, type:'Complaint',  status:'Open',        date:'2026-03-18', room:'Deluxe 208',   stay:'Mar 15–18', comment:'Terrible experience. Found cockroaches in the bathroom. Completely unacceptable for a hotel of this caliber. Demanding a full refund.',                         issue:'Cleanliness',  assignee:null,          responseTime:null,  reply:'', urgent:true },
  { id:'R006', guest:'Fiona Green',    avatar:'FG', color:'#ec4899', rating:3, type:'Complaint',  status:'In Progress', date:'2026-03-15', room:'Standard 104',  stay:'Mar 13–15', comment:'Food quality at the restaurant was below expectations. The pasta was cold and the service was slow during dinner.',                                               issue:'Food',         assignee:'F&B Manager', responseTime:'4h',  reply:'' },
  { id:'R007', guest:'George Clooney', avatar:'GC', color:'#f97316', rating:5, type:'Feedback',   status:'Resolved',    date:'2026-03-14', room:'Penthouse 402', stay:'Mar 10–14', comment:'Perfect in every way. Privacy was respected, amenities were top-notch. The concierge arranged everything flawlessly.',                                          issue:null,          assignee:'Concierge',   responseTime:'30m', reply:'It was our pleasure, George!' },
  { id:'R008', guest:'Hannah Lee',     avatar:'HL', color:'#06b6d4', rating:4, type:'Feedback',   status:'New',         date:'2026-03-12', room:'Suite 303',     stay:'Mar 10–12', comment:'Lovely stay. The spa was wonderful and the room service was quick. Minor issue with WiFi speed but staff resolved it quickly.',                                  issue:null,          assignee:null,          responseTime:null,  reply:'' },
  { id:'R009', guest:'Ivan Drago',     avatar:'ID', color:'#ef4444', rating:2, type:'Complaint',  status:'Resolved',    date:'2026-03-10', room:'Standard 101',  stay:'Mar 7–10',  comment:'Noisy neighbors throughout the night. Staff did not address the issue promptly when called. Sleep was severely disrupted.',                                     issue:'Service',      assignee:'Front Desk',  responseTime:'8h',  reply:'We sincerely apologize for this experience.' },
  { id:'R010', guest:'Julia Roberts',  avatar:'JR', color:'#a855f7', rating:5, type:'Feedback',   status:'Resolved',    date:'2026-03-08', room:'Penthouse 401', stay:'Mar 5–8',   comment:'Magical experience as always. The flowers and champagne on arrival were a lovely touch. Staff remembered my preferences from last visit.',                     issue:null,          assignee:'Manager',     responseTime:'1h',  reply:'Always a pleasure, Julia!' },
  { id:'R011', guest:'Kevin Hart',     avatar:'KH', color:'#14b8a6', rating:3, type:'Complaint',  status:'Open',        date:'2026-03-06', room:'Deluxe 210',   stay:'Mar 4–6',   comment:'Gym equipment was outdated and two machines were broken. For a premium hotel this is not acceptable.',                                                         issue:'Maintenance',  assignee:null,          responseTime:null,  reply:'' },
  { id:'R012', guest:'Laura Palmer',   avatar:'LP', color:'#64748b', rating:4, type:'Feedback',   status:'New',         date:'2026-03-04', room:'Standard 103',  stay:'Mar 2–4',   comment:'First time staying here. Very impressed with the cleanliness and friendly staff. Will recommend to friends.',                                                  issue:null,          assignee:null,          responseTime:null,  reply:'' },
];

const STATUS_META = {
  New:          { color:'#2563eb', bg:'#dbeafe', label:'New'         },
  'In Progress':{ color:'#d97706', bg:'#fef3c7', label:'In Progress' },
  Resolved:     { color:'#059669', bg:'#d1fae5', label:'Resolved'    },
  Open:         { color:'#dc2626', bg:'#fee2e2', label:'Open'        },
};

const ISSUE_META = {
  Cleanliness: { color:'#ec4899', icon: Sparkles },
  Service:     { color:'#6366f1', icon: User     },
  Food:        { color:'#f59e0b', icon: Utensils },
  Maintenance: { color:'#ef4444', icon: Wrench   },
};

const STAFF_OPTIONS = ['Front Desk','Housekeeping','Maintenance','F&B Manager','Concierge','Manager'];
const NEXT_STATUS = { Open:'In Progress', 'In Progress':'Resolved', New:'In Progress', Resolved:'Resolved' };

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} fill={s<=rating ? '#f59e0b' : 'none'} color={s<=rating ? '#f59e0b' : '#d1d5db'}/>
      ))}
    </div>
  );
}

function Avatar({ name, color, size=36 }) {
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}20`, border:`2px solid ${color}40`, display:'grid', placeItems:'center', flexShrink:0 }}>
      <span style={{ fontSize:size*0.33, fontWeight:800, color }}>{initials}</span>
    </div>
  );
}

// ── Review Detail Modal ───────────────────────────────────────────────────────
function ReviewModal({ review, onClose, onUpdate }) {
  const [reply, setReply]       = useState(review.reply || '');
  const [assignee, setAssignee] = useState(review.assignee || '');
  const [note, setNote]         = useState('');
  const [notes, setNotes]       = useState([]);

  const statusMeta = STATUS_META[review.status] || STATUS_META.New;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:620, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <Avatar name={review.guest} color={review.color} size={38}/>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>{review.guest}</span>
                {review.urgent && <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:'#fee2e2', color:'#dc2626' }}>⚠️ URGENT</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                <Stars rating={review.rating} size={12}/>
                <span style={{ padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background:statusMeta.bg, color:statusMeta.color }}>{review.status}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={16}/></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* Booking info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{ padding:'10px 12px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:3 }}>Room</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{review.room}</div>
            </div>
            <div style={{ padding:'10px 12px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:3 }}>Stay Dates</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{review.stay}</div>
            </div>
          </div>

          {/* Full comment */}
          <div style={{ padding:'14px', borderRadius:8, background: review.rating <= 2 ? '#fef2f2' : review.rating === 5 ? '#f0fdf4' : 'var(--input-bg)', border:`1px solid ${review.rating <= 2 ? '#fecaca' : review.rating === 5 ? '#bbf7d0' : 'var(--card-border)'}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:6 }}>Guest Feedback</div>
            <p style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.7, margin:0 }}>{review.comment}</p>
          </div>

          {/* Issue type */}
          {review.issue && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)' }}>Issue Category:</span>
              {(() => { const meta = ISSUE_META[review.issue]; const Icon = meta.icon; return (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:12, background:`${meta.color}15`, color:meta.color, fontSize:12, fontWeight:700 }}>
                  <Icon size={12}/>{review.issue}
                </span>
              );})()}
            </div>
          )}

          {/* Assign + Status */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="b24-field" style={{ marginBottom:0 }}>
              <label className="b24-label">Assign to Staff</label>
              <select className="b24-select" value={assignee} onChange={e=>setAssignee(e.target.value)}>
                <option value="">— Unassigned —</option>
                {STAFF_OPTIONS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="b24-field" style={{ marginBottom:0 }}>
              <label className="b24-label">Change Status</label>
              <select className="b24-select" value={review.status} onChange={e=>onUpdate(review.id,'status',e.target.value)}>
                {Object.keys(STATUS_META).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Internal notes */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Internal Notes</div>
            {notes.map((n,i) => (
              <div key={i} style={{ padding:'8px 10px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)', fontSize:12, color:'var(--text-secondary)', marginBottom:6 }}>
                <span style={{ fontWeight:600, color:'var(--text-primary)' }}>Admin</span> · {n}
              </div>
            ))}
            <div style={{ display:'flex', gap:8 }}>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add internal note..." className="b24-input" style={{ flex:1 }}/>
              <button className="b24-btn b24-btn-secondary" onClick={() => { if(note.trim()){ setNotes(n=>[...n,note]); setNote(''); }}}>Add</button>
            </div>
          </div>

          {/* Reply */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Reply to Guest</div>
            {review.reply && (
              <div style={{ padding:'10px 12px', borderRadius:6, background:'#eff6ff', border:'1px solid #bfdbfe', fontSize:12, color:'#1e40af', marginBottom:8 }}>
                <span style={{ fontWeight:700 }}>Sent reply:</span> {review.reply}
              </div>
            )}
            <textarea className="b24-textarea" value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write your reply to the guest..." style={{ minHeight:72 }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', gap:8, justifyContent:'space-between', flexShrink:0 }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Close</button>
          <div style={{ display:'flex', gap:8 }}>
            {review.status !== 'Resolved' && (
              <button className="b24-btn b24-btn-secondary" onClick={() => onUpdate(review.id,'status','Resolved')}>
                <CheckCircle2 size={13}/> Mark Resolved
              </button>
            )}
            <button className="b24-btn b24-btn-primary" onClick={() => { onUpdate(review.id,'reply',reply); onUpdate(review.id,'assignee',assignee); onClose(); }}>
              <Send size={13}/> Send Reply
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Feedback() {
  const [reviews, setReviews]               = useState(REVIEWS);
  const [search, setSearch]                 = useState('');
  const [ratingFilter, setRatingFilter]     = useState('All');
  const [typeFilter, setTypeFilter]         = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [selected, setSelected]             = useState(null);
  const [tab, setTab]                       = useState('Reviews');
  const [toast, setToast]                   = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const updateReview = (id, field, value) => {
    setReviews(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r));
    showToast('Updated successfully');
  };

  const filtered = useMemo(() => reviews.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.guest.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q);
    const matchR = ratingFilter === 'All' || (ratingFilter === '5' && r.rating === 5) || (ratingFilter === '4' && r.rating === 4) || (ratingFilter === '3-' && r.rating <= 3);
    const matchT = typeFilter === 'All' || r.type === typeFilter;
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchR && matchT && matchS;
  }), [reviews, search, ratingFilter, typeFilter, statusFilter]);

  const complaints  = filtered.filter(r => r.type === 'Complaint');
  const avgRating   = (reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1);
  const positivePct = Math.round((reviews.filter(r=>r.rating>=4).length/reviews.length)*100);
  const openCount   = reviews.filter(r=>['Open','New','In Progress'].includes(r.status) && r.type==='Complaint').length;
  const ratingDist  = [5,4,3,2,1].map(n => reviews.filter(r=>r.rating===n).length);
  const monthlyData = [3,5,4,7,6,8,5,9,7,10,8,12];

  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1e293b', titleColor:'#f1f5f9', bodyColor:'#94a3b8', borderColor:'rgba(255,255,255,0.1)', borderWidth:1 }},
    scales:{ x:{ grid:{ display:false }, ticks:{ color:'var(--text-muted)', font:{ size:10 }}}, y:{ grid:{ color:'rgba(148,163,184,0.08)' }, ticks:{ color:'var(--text-muted)', font:{ size:10 }}, border:{ display:false }}},
  };

  const card = { background:'var(--card-bg)', borderRadius:12, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  return (
    <div style={{ minHeight:'100%', background:'var(--bg-page)', display:'flex', flexDirection:'column' }}>

      {/* ── Header ── */}
      <div style={{ padding:'28px 32px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:900, color:'var(--text-primary)', margin:0, letterSpacing:'-0.6px' }}>Feedback &amp; Reviews</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'3px 0 0' }}>Monitor customer satisfaction, track complaints, and respond to reviews.</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="b24-btn b24-btn-secondary"><Bell size={13}/> Auto Request</button>
            <button className="b24-btn b24-btn-primary"><Download size={13}/> Export CSV</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Average Rating',    value:`${avgRating} / 5`, color:'#f59e0b', icon: Star,         extra: <Stars rating={Math.round(Number(avgRating))} size={13}/> },
            { label:'Total Reviews',     value:reviews.length,     color:'#6366f1', icon: MessageSquare, extra: null },
            { label:'Positive Feedback', value:`${positivePct}%`,  color:'#10b981', icon: TrendingUp,    extra: null },
            { label:'Open Complaints',   value:openCount,          color:'#dc2626', icon: AlertTriangle, extra: null },
          ].map((s,i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ ...card, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'12px 12px 0 0' }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</span>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}15`, display:'grid', placeItems:'center' }}>
                    <Icon size={15} color={s.color}/>
                  </div>
                </div>
                <div style={{ fontSize:26, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
                {s.extra}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ ...card, padding:'0 20px', marginBottom:20, display:'flex', gap:0 }}>
          {['Reviews','Complaints','Analytics'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'13px 18px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight: tab===t?700:500, color: tab===t?'#2563eb':'var(--text-secondary)', borderBottom: tab===t?'2px solid #2563eb':'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' }}>
              {t} {t==='Complaints' && openCount>0 && <span style={{ marginLeft:5, padding:'1px 6px', borderRadius:10, background:'#fee2e2', color:'#dc2626', fontSize:10, fontWeight:700 }}>{openCount}</span>}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        {tab !== 'Analytics' && (
          <div style={{ ...card, padding:'12px 16px', marginBottom:20, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:6, padding:'7px 10px', flex:1, minWidth:200 }}>
              <Search size={13} color='var(--text-muted)'/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guest or review..."
                style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:'100%' }}/>
            </div>
            <select value={ratingFilter} onChange={e=>setRatingFilter(e.target.value)} className="b24-select" style={{ width:'auto' }}>
              <option value="All">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3-">⭐⭐⭐ 3 &amp; Below</option>
            </select>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="b24-select" style={{ width:'auto' }}>
              <option value="All">All Types</option>
              <option value="Feedback">Feedback</option>
              <option value="Complaint">Complaint</option>
            </select>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="b24-select" style={{ width:'auto' }}>
              <option value="All">All Status</option>
              {Object.keys(STATUS_META).map(s=><option key={s}>{s}</option>)}
            </select>
            {(search||ratingFilter!=='All'||typeFilter!=='All'||statusFilter!=='All') && (
              <button className="b24-btn b24-btn-secondary" onClick={()=>{setSearch('');setRatingFilter('All');setTypeFilter('All');setStatusFilter('All');}}>
                <RefreshCw size={12}/> Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div style={{ padding:'0 32px 32px', flex:1 }}>

        {/* ── REVIEWS TAB ── */}
        {tab === 'Reviews' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.length === 0 ? (
              <div style={{ ...card, padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>
                <MessageSquare size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/>
                <p>No reviews match your filters</p>
              </div>
            ) : filtered.map((r,i) => {
              const statusMeta = STATUS_META[r.status] || STATUS_META.New;
              return (
                <motion.div key={r.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                  style={{ ...card, padding:'16px 20px', borderLeft:`3px solid ${r.rating<=2?'#ef4444':r.rating===5?'#10b981':'#f59e0b'}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <Avatar name={r.guest} color={r.color} size={40}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5, flexWrap:'wrap' }}>
                        <span style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)' }}>{r.guest}</span>
                        <Stars rating={r.rating} size={13}/>
                        <span style={{ padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background: r.type==='Complaint'?'#fee2e2':'#dbeafe', color: r.type==='Complaint'?'#dc2626':'#2563eb' }}>{r.type}</span>
                        {r.urgent && <span style={{ padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background:'#fee2e2', color:'#dc2626' }}>⚠️ URGENT</span>}
                        <span style={{ padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background:statusMeta.bg, color:statusMeta.color }}>{r.status}</span>
                        {r.issue && (() => { const meta = ISSUE_META[r.issue]; const Icon = meta.icon; return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background:`${meta.color}15`, color:meta.color }}><Icon size={10}/>{r.issue}</span>; })()}
                      </div>
                      <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 8px', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{r.comment}</p>
                      <div style={{ display:'flex', gap:14, fontSize:11, color:'var(--text-muted)', flexWrap:'wrap' }}>
                        <span style={{ display:'flex', alignItems:'center', gap:4 }}><Home size={11}/>{r.room}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={11}/>{r.date}</span>
                        {r.responseTime && <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={11}/>Response: {r.responseTime}</span>}
                        {r.assignee && <span style={{ display:'flex', alignItems:'center', gap:4 }}><User size={11}/>{r.assignee}</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                      <button onClick={() => setSelected(r)} title="View Details"
                        style={{ width:30, height:30, borderRadius:6, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}>
                        <Eye size={13}/>
                      </button>
                      <button onClick={() => setSelected(r)} title="Reply"
                        style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
                        <Send size={13}/>
                      </button>
                      {r.status !== 'Resolved' && (
                        <button onClick={() => updateReview(r.id,'status','Resolved')} title="Mark Resolved"
                          style={{ width:30, height:30, borderRadius:6, border:'1px solid #bbf7d0', background:'#f0fdf4', display:'grid', placeItems:'center', cursor:'pointer', color:'#059669' }}>
                          <CheckCircle2 size={13}/>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── COMPLAINTS TAB ── */}
        {tab === 'Complaints' && (
          <div style={{ ...card, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg-page)', borderBottom:'1px solid var(--card-border)' }}>
                  {['Guest','Issue','Room','Date','Status','Assignee','Actions'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', color:'var(--text-muted)' }}>No complaints found</td></tr>
                ) : complaints.map((r,i) => {
                  const statusMeta = STATUS_META[r.status] || STATUS_META.New;
                  const issueMeta  = r.issue ? ISSUE_META[r.issue] : null;
                  const IssueIcon  = issueMeta?.icon;
                  return (
                    <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                      style={{ borderBottom:'1px solid var(--card-border)' }}>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <Avatar name={r.guest} color={r.color} size={30}/>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{r.guest}</div>
                            <Stars rating={r.rating} size={10}/>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 14px' }}>
                        {issueMeta ? (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:`${issueMeta.color}15`, color:issueMeta.color }}>
                            <IssueIcon size={11}/>{r.issue}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{r.room}</td>
                      <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{r.date}</td>
                      <td style={{ padding:'12px 14px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:statusMeta.bg, color:statusMeta.color }}>{r.status}</span>
                      </td>
                      <td style={{ padding:'12px 14px' }}>
                        <select value={r.assignee||''} onChange={e=>updateReview(r.id,'assignee',e.target.value)} className="b24-select" style={{ width:130, fontSize:11 }}>
                          <option value="">Unassigned</option>
                          {STAFF_OPTIONS.map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={() => setSelected(r)} style={{ width:26, height:26, borderRadius:4, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}><Eye size={11}/></button>
                          {r.status !== 'Resolved' && (
                            <button onClick={() => updateReview(r.id,'status', NEXT_STATUS[r.status]||'Resolved')}
                              style={{ padding:'4px 10px', borderRadius:4, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                              → {NEXT_STATUS[r.status]}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === 'Analytics' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {/* Rating distribution */}
            <div style={{ ...card, padding:'20px' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><BarChart2 size={15} color='#f59e0b'/> Rating Distribution</h3>
              <div style={{ height:200 }}>
                <Bar data={{
                  labels:['5 ⭐','4 ⭐','3 ⭐','2 ⭐','1 ⭐'],
                  datasets:[{ data: ratingDist, backgroundColor:['#10b981','#3b82f6','#f59e0b','#f97316','#ef4444'], borderRadius:6 }]
                }} options={chartOpts}/>
              </div>
              <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
                {[5,4,3,2,1].map((n,i) => {
                  const count = ratingDist[i];
                  const pct   = Math.round((count/reviews.length)*100);
                  const colors = ['#10b981','#3b82f6','#f59e0b','#f97316','#ef4444'];
                  return (
                    <div key={n} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:11, color:'var(--text-muted)', minWidth:30 }}>{n} ⭐</span>
                      <div style={{ flex:1, height:6, borderRadius:99, background:'var(--input-bg)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:colors[i], borderRadius:99 }}/>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--text-primary)', minWidth:24 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly trend */}
            <div style={{ ...card, padding:'20px' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><TrendingUp size={15} color='#6366f1'/> Feedback Trend (Monthly)</h3>
              <div style={{ height:200 }}>
                <Line data={{
                  labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                  datasets:[{ data:monthlyData, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.08)', fill:true, tension:0.4, pointBackgroundColor:'#6366f1', pointRadius:3 }]
                }} options={chartOpts}/>
              </div>
            </div>

            {/* Issue breakdown */}
            <div style={{ ...card, padding:'20px' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><PieChart size={15} color='#ec4899'/> Common Issues</h3>
              <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                <div style={{ width:160, height:160 }}>
                  <Doughnut data={{
                    labels:['Cleanliness','Service','Food','Maintenance'],
                    datasets:[{ data:[2,3,2,3], backgroundColor:['#ec4899','#6366f1','#f59e0b','#ef4444'], borderColor:'var(--card-bg)', borderWidth:3, hoverOffset:4 }]
                  }} options={{ responsive:true, maintainAspectRatio:false, cutout:'65%', plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1e293b', titleColor:'#f1f5f9', bodyColor:'#94a3b8' }}}}/>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  {[['Cleanliness','#ec4899',2],['Service','#6366f1',3],['Food','#f59e0b',2],['Maintenance','#ef4444',3]].map(([label,color,count]) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:color, flexShrink:0 }}/>
                      <span style={{ fontSize:12, color:'var(--text-secondary)', flex:1 }}>{label}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Response time stats */}
            <div style={{ ...card, padding:'20px' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><Clock size={15} color='#10b981'/> Response Performance</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { label:'Avg Response Time',  value:'3.2 hours', color:'#10b981' },
                  { label:'Resolved Today',      value:'4',         color:'#2563eb' },
                  { label:'Pending > 24h',        value:'2',         color:'#dc2626' },
                  { label:'Satisfaction Score',  value:'87%',       color:'#f59e0b' },
                ].map((s,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 12px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
                    <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.label}</span>
                    <span style={{ fontSize:14, fontWeight:800, color:s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <ReviewModal review={selected} onClose={() => setSelected(null)} onUpdate={(id,field,value) => { updateReview(id,field,value); setSelected(r => r?.id===id ? {...r,[field]:value} : r); }}/>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'11px 18px', borderRadius:8, background:'#059669', color:'#fff', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
            <Check size={14}/> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
