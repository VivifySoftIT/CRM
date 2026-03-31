import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Download, Eye, Edit2, X, Check, ChevronLeft,
  ChevronRight, Users, DollarSign, Clock, MapPin, Phone, Mail,
  Calendar, AlertTriangle, CheckSquare, Square, RotateCcw,
  Utensils, Flower2, Tv2, Camera, Shield, Banknote, Star
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const VENUES = [
  { name: 'Grand Ballroom',    capacity: 500, rate: 8000  },
  { name: 'Crystal Hall',      capacity: 200, rate: 4000  },
  { name: 'Garden Terrace',    capacity: 150, rate: 2500  },
  { name: 'Conference Room A', capacity: 80,  rate: 1500  },
  { name: 'Rooftop Lounge',    capacity: 100, rate: 3000  },
];

const ADDON_SERVICES = [
  { name: 'Catering',            icon: Utensils, perPerson: true,  flat: 0,    unitLabel: '$80/person' },
  { name: 'Decoration',          icon: Flower2,  perPerson: false, flat: 3000, unitLabel: '$3,000 flat' },
  { name: 'AV Equipment',        icon: Tv2,      perPerson: false, flat: 1500, unitLabel: '$1,500 flat' },
  { name: 'Photography',         icon: Camera,   perPerson: false, flat: 2500, unitLabel: '$2,500 flat' },
  { name: 'Floral Arrangements', icon: Flower2,  perPerson: false, flat: 2000, unitLabel: '$2,000 flat' },
  { name: 'Security',            icon: Shield,   perPerson: false, flat: 1200, unitLabel: '$1,200 flat' },
];

const INITIAL_EVENTS = [
  { id:'E001', name:'Johnson-Smith Wedding',     client:'Sarah Johnson',   phone:'555-0101', email:'sarah@email.com',   type:'Wedding',    date:'2026-04-15', time:'14:00', venue:'Grand Ballroom',    guests:350, status:'Booked',    advance:15000, total:32000, pending:17000, services:[{name:'Catering',cost:28000},{name:'Decoration',cost:3000},{name:'Photography',cost:2500},{name:'Floral Arrangements',cost:2000}], notes:'Outdoor ceremony preferred. Backup indoor plan needed.', checklist:[{task:'Confirm catering menu',done:true},{task:'Send invitations',done:true},{task:'Arrange floral decor',done:false},{task:'Sound check',done:false}] },
  { id:'E002', name:'TechFlow Annual Conference', client:'Mike Chen',       phone:'555-0102', email:'mike@techflow.com', type:'Conference', date:'2026-04-20', time:'09:00', venue:'Conference Room A',  guests:75,  status:'Booked',    advance:3000,  total:8500,  pending:5500,  services:[{name:'AV Equipment',cost:1500},{name:'Catering',cost:6000}], notes:'Projector and microphone setup required.', checklist:[{task:'AV setup',done:false},{task:'Catering confirmed',done:true},{task:'Parking arrangements',done:false}] },
  { id:'E003', name:'Martinez Birthday Gala',    client:'Carlos Martinez', phone:'555-0103', email:'carlos@email.com',  type:'Birthday',   date:'2026-03-28', time:'19:00', venue:'Rooftop Lounge',    guests:80,  status:'Completed', advance:4000,  total:7200,  pending:0,     services:[{name:'Catering',cost:4000},{name:'Decoration',cost:1200},{name:'Photography',cost:2000}], notes:'Surprise party — do not contact guest directly.', checklist:[{task:'Cake ordered',done:true},{task:'Decorations set',done:true},{task:'Guest list confirmed',done:true}] },
  { id:'E004', name:'Green Corp Product Launch', client:'Emma Green',      phone:'555-0104', email:'emma@greencorp.com',type:'Corporate',  date:'2026-05-10', time:'10:00', venue:'Crystal Hall',      guests:150, status:'Booked',    advance:5000,  total:14000, pending:9000,  services:[{name:'AV Equipment',cost:1500},{name:'Catering',cost:9000},{name:'Decoration',cost:3000}], notes:'Brand colors: green and white. Logo display required.', checklist:[{task:'Stage setup',done:false},{task:'Press invites sent',done:true},{task:'AV test',done:false}] },
  { id:'E005', name:'Williams Wedding Reception', client:'Tom Williams',   phone:'555-0105', email:'tom@email.com',     type:'Wedding',    date:'2026-05-22', time:'15:00', venue:'Grand Ballroom',    guests:280, status:'Booked',    advance:12000, total:28000, pending:16000, services:[{name:'Catering',cost:22400},{name:'Decoration',cost:3000},{name:'Photography',cost:2500},{name:'Floral Arrangements',cost:2000}], notes:'Vegan menu options required for 30 guests.', checklist:[{task:'Menu finalized',done:true},{task:'Seating chart',done:false},{task:'DJ confirmed',done:true}] },
  { id:'E006', name:'Annual Charity Gala',       client:'City Foundation', phone:'555-0106', email:'info@cityfound.org',type:'Party',      date:'2026-04-05', time:'18:00', venue:'Crystal Hall',      guests:180, status:'Completed', advance:6000,  total:12000, pending:0,     services:[{name:'Catering',cost:7200},{name:'Decoration',cost:3000},{name:'AV Equipment',cost:1500}], notes:'Silent auction tables needed.', checklist:[{task:'Auction items collected',done:true},{task:'Sponsors confirmed',done:true},{task:'Stage ready',done:true}] },
  { id:'E007', name:'Brown Family Reunion',      client:'David Brown',     phone:'555-0107', email:'david@email.com',   type:'Party',      date:'2026-06-14', time:'12:00', venue:'Garden Terrace',    guests:120, status:'Booked',    advance:2000,  total:6500,  pending:4500,  services:[{name:'Catering',cost:4800},{name:'Decoration',cost:1200}], notes:'Outdoor BBQ style. Need extra seating.', checklist:[{task:'Catering confirmed',done:false},{task:'Tables arranged',done:false}] },
  { id:'E008', name:'StartupX Networking',       client:'StartupX',        phone:'555-0108', email:'events@startupx.io',type:'Corporate', date:'2026-04-25', time:'17:00', venue:'Rooftop Lounge',    guests:90,  status:'Booked',    advance:2500,  total:5500,  pending:3000,  services:[{name:'Catering',cost:3600},{name:'AV Equipment',cost:1500}], notes:'Cocktail style, no seated dinner.', checklist:[{task:'Invites sent',done:true},{task:'Bar setup',done:false}] },
  { id:'E009', name:'Lee-Park Wedding',          client:'Jenny Lee',       phone:'555-0109', email:'jenny@email.com',   type:'Wedding',    date:'2026-07-08', time:'13:00', venue:'Grand Ballroom',    guests:400, status:'Booked',    advance:18000, total:38000, pending:20000, services:[{name:'Catering',cost:32000},{name:'Decoration',cost:3000},{name:'Photography',cost:2500},{name:'Floral Arrangements',cost:2000}], notes:'Korean-Western fusion ceremony.', checklist:[{task:'Venue walkthrough',done:true},{task:'Catering tasting',done:false},{task:'Photographer briefed',done:false}] },
  { id:'E010', name:'Davis Retirement Party',    client:'HR Dept',         phone:'555-0110', email:'hr@company.com',    type:'Party',      date:'2026-03-20', time:'18:00', venue:'Garden Terrace',    guests:60,  status:'Completed', advance:1500,  total:3800,  pending:0,     services:[{name:'Catering',cost:2400},{name:'Decoration',cost:800}], notes:'Slideshow presentation needed.', checklist:[{task:'Slideshow ready',done:true},{task:'Cake ordered',done:true}] },
];

const TYPE_COLOR = { Wedding:'#ec4899', Corporate:'#2563eb', Party:'#f59e0b', Conference:'#6366f1', Birthday:'#10b981' };
const TYPE_BG    = { Wedding:'#fce7f3', Corporate:'#dbeafe', Party:'#fef3c7', Conference:'#ede9fe', Birthday:'#d1fae5' };
const STATUS_COLOR = { Booked:'#2563eb', Completed:'#059669', Cancelled:'#dc2626' };
const STATUS_BG    = { Booked:'#dbeafe', Completed:'#d1fae5', Cancelled:'#fee2e2' };

const STEPS = ['Event Info', 'Client Details', 'Venue & Date', 'Services', 'Payment', 'Review'];
const fmt = (n) => '$' + Number(n).toLocaleString();
const fmtDate = (d) => { if (!d) return '—'; return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const todayStr = new Date().toISOString().slice(0, 10);

function hasConflict(events, venue, date, excludeId = null) {
  return events.some(e => e.venue === venue && e.date === date && e.status === 'Booked' && e.id !== excludeId);
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ event, onClose, onEdit, onCancel }) {
  const [checklist, setChecklist] = useState(event.checklist.map(c => ({ ...c })));
  const pct = Math.round((event.advance / event.total) * 100);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:620, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
              <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{event.name}</h3>
              <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:TYPE_BG[event.type], color:TYPE_COLOR[event.type] }}>{event.type}</span>
              <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:STATUS_BG[event.status], color:STATUS_COLOR[event.status] }}>{event.status}</span>
            </div>
            <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{event.id}</div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={18}/></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Client + Event Info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={{ padding:'14px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Client Info</div>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:6 }}>{event.client}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}><Phone size={11}/>{event.phone}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Mail size={11}/>{event.email}</div>
            </div>
            <div style={{ padding:'14px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Event Info</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)', marginBottom:5 }}><Calendar size={11}/>{fmtDate(event.date)} at {event.time}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)', marginBottom:5 }}><MapPin size={11}/>{event.venue}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Users size={11}/>{event.guests} guests</div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10, paddingBottom:6, borderBottom:'1px solid var(--card-border)' }}>Services</div>
            {event.services.map((s,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--card-border)', fontSize:13 }}>
                <span style={{ color:'var(--text-secondary)' }}>{s.name}</span>
                <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{fmt(s.cost)}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 0', fontSize:14, fontWeight:800 }}>
              <span>Total Services</span><span style={{ color:'#2563eb' }}>{fmt(event.services.reduce((a,s)=>a+s.cost,0))}</span>
            </div>
          </div>

          {/* Payment */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10, paddingBottom:6, borderBottom:'1px solid var(--card-border)' }}>Payment</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:12 }}>
              {[['Total',fmt(event.total),'#2563eb'],['Advance Paid',fmt(event.advance),'#059669'],['Pending',fmt(event.pending),event.pending>0?'#dc2626':'#059669']].map(([l,v,c]) => (
                <div key={l} style={{ padding:'10px 12px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)', textAlign:'center' }}>
                  <div style={{ fontSize:16, fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ height:7, borderRadius:99, background:'var(--input-bg)', overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:'#059669', borderRadius:99, transition:'width 0.4s' }}/>
            </div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{pct}% paid</div>
          </div>

          {/* Checklist */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10, paddingBottom:6, borderBottom:'1px solid var(--card-border)' }}>Checklist</div>
            {checklist.map((c,i) => (
              <div key={i} onClick={() => setChecklist(prev=>prev.map((x,j)=>j===i?{...x,done:!x.done}:x))}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', cursor:'pointer', fontSize:13 }}>
                {c.done ? <CheckSquare size={16} color='#059669'/> : <Square size={16} color='var(--text-muted)'/>}
                <span style={{ color:c.done?'var(--text-muted)':'var(--text-primary)', textDecoration:c.done?'line-through':'none' }}>{c.task}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {event.notes && (
            <div style={{ padding:'12px 14px', borderRadius:8, background:'#fffbeb', border:'1px solid #fde68a' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#92400e', textTransform:'uppercase', marginBottom:4 }}>Notes</div>
              <p style={{ fontSize:13, color:'#78350f', margin:0, lineHeight:1.6 }}>{event.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', gap:8, justifyContent:'space-between', flexShrink:0 }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Close</button>
          <div style={{ display:'flex', gap:8 }}>
            {event.status !== 'Completed' && event.status !== 'Cancelled' && (
              <button className="b24-btn b24-btn-danger" onClick={() => onCancel(event.id)}>Cancel Event</button>
            )}
            <button className="b24-btn b24-btn-primary" onClick={() => onEdit(event)}><Edit2 size={13}/> Edit</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────
function EventModal({ events, editEvent, onClose, onSave }) {
  const isEdit = !!editEvent;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(editEvent ? {
    name:editEvent.name, type:editEvent.type,
    client:editEvent.client, phone:editEvent.phone, email:editEvent.email,
    venue:editEvent.venue, date:editEvent.date, time:editEvent.time, guests:String(editEvent.guests),
    services:editEvent.services.map(s=>s.name), advance:String(editEvent.advance), payMethod:'Cash', notes:editEvent.notes||'',
  } : { name:'', type:'Wedding', client:'', phone:'', email:'', venue:'Grand Ballroom', date:'', time:'', guests:'', services:[], advance:'', payMethod:'Cash', notes:'' });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const selectedVenue = VENUES.find(v=>v.name===form.venue);
  const guestsNum = parseInt(form.guests)||0;
  const conflict = form.venue && form.date && hasConflict(events, form.venue, form.date, editEvent?.id);

  const calcTotal = () => {
    const venueRate = selectedVenue?.rate || 0;
    return venueRate + ADDON_SERVICES.reduce((sum,s) => {
      if (!form.services.includes(s.name)) return sum;
      return sum + (s.perPerson ? 80*guestsNum : s.flat);
    }, 0);
  };

  const totalAmt = calcTotal();
  const advanceNum = parseInt(form.advance)||0;
  const pendingAmt = Math.max(0, totalAmt - advanceNum);

  const toggleService = (name) => set('services', form.services.includes(name) ? form.services.filter(s=>s!==name) : [...form.services, name]);

  const canNext = () => {
    if (step===0) return form.name.trim() && form.type;
    if (step===1) return form.client.trim() && form.phone.trim() && form.email.trim();
    if (step===2) return form.venue && form.date && form.time && form.guests && !conflict;
    return true;
  };

  const handleSave = () => {
    const svcList = ADDON_SERVICES.filter(s=>form.services.includes(s.name)).map(s=>({ name:s.name, cost:s.perPerson?80*guestsNum:s.flat }));
    onSave({ id:editEvent?.id||'E'+Date.now(), name:form.name, client:form.client, phone:form.phone, email:form.email, type:form.type, date:form.date, time:form.time, venue:form.venue, guests:guestsNum, status:editEvent?.status||'Booked', advance:advanceNum, total:totalAmt, pending:pendingAmt, services:svcList, notes:form.notes, checklist:editEvent?.checklist||[{task:'Confirm booking details',done:false}] });
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:580, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{isEdit?'Edit Event':'New Event Booking'}</h3>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={16}/></button>
        </div>

        {/* Step indicator */}
        <div style={{ padding:'14px 20px 0', borderBottom:'1px solid var(--card-border)', flexShrink:0 }}>
          <div style={{ display:'flex', gap:0 }}>
            {STEPS.map((s,i) => (
              <div key={i} style={{ flex:1, textAlign:'center', position:'relative' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:i<step?'#059669':i===step?'#2563eb':'var(--input-bg)', border:`2px solid ${i<=step?(i<step?'#059669':'#2563eb'):'var(--input-border)'}`, color:i<=step?'#fff':'var(--text-muted)', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 4px' }}>
                  {i<step?<Check size={12}/>:i+1}
                </div>
                <div style={{ fontSize:9.5, color:i===step?'#2563eb':'var(--text-muted)', fontWeight:i===step?700:400, whiteSpace:'nowrap' }}>{s}</div>
                {i<STEPS.length-1 && <div style={{ position:'absolute', top:11, left:'50%', width:'100%', height:2, background:i<step?'#059669':'var(--input-border)', zIndex:-1 }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

          {step===0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="b24-field"><label className="b24-label">Event Name <span className="required">*</span></label>
                <input className="b24-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Johnson-Smith Wedding"/></div>
              <div className="b24-field"><label className="b24-label">Event Type <span className="required">*</span></label>
                <select className="b24-select" value={form.type} onChange={e=>set('type',e.target.value)}>
                  {['Wedding','Corporate','Party','Conference','Birthday'].map(t=><option key={t}>{t}</option>)}
                </select></div>
              <div className="b24-field"><label className="b24-label">Notes</label>
                <textarea className="b24-textarea" value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Special requirements..."/></div>
            </div>
          )}

          {step===1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="b24-field"><label className="b24-label">Client Name <span className="required">*</span></label>
                <input className="b24-input" value={form.client} onChange={e=>set('client',e.target.value)} placeholder="Full name"/></div>
              <div className="b24-row b24-row-2">
                <div className="b24-field"><label className="b24-label">Phone <span className="required">*</span></label>
                  <input className="b24-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="555-0100"/></div>
                <div className="b24-field"><label className="b24-label">Email <span className="required">*</span></label>
                  <input className="b24-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="client@email.com"/></div>
              </div>
            </div>
          )}

          {step===2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="b24-field"><label className="b24-label">Venue <span className="required">*</span></label>
                <select className="b24-select" value={form.venue} onChange={e=>set('venue',e.target.value)}>
                  {VENUES.map(v=><option key={v.name} value={v.name}>{v.name} — Cap: {v.capacity} | {fmt(v.rate)}/event</option>)}
                </select></div>
              {selectedVenue && <div style={{ padding:'10px 12px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)', fontSize:12, color:'var(--text-secondary)', display:'flex', gap:20 }}>
                <span>Capacity: <strong>{selectedVenue.capacity}</strong></span>
                <span>Base Rate: <strong>{fmt(selectedVenue.rate)}</strong></span>
              </div>}
              {conflict && <div style={{ padding:'10px 12px', borderRadius:6, background:'#fef2f2', border:'1px solid #fecaca', fontSize:13, color:'#dc2626', display:'flex', alignItems:'center', gap:8 }}>
                <AlertTriangle size={14}/> ⚠️ {form.venue} is already booked on this date
              </div>}
              <div className="b24-row b24-row-2">
                <div className="b24-field"><label className="b24-label">Date <span className="required">*</span></label>
                  <input className="b24-input" type="date" value={form.date} onChange={e=>set('date',e.target.value)}/></div>
                <div className="b24-field"><label className="b24-label">Time <span className="required">*</span></label>
                  <input className="b24-input" type="time" value={form.time} onChange={e=>set('time',e.target.value)}/></div>
              </div>
              <div className="b24-field"><label className="b24-label">Number of Guests <span className="required">*</span></label>
                <input className="b24-input" type="number" value={form.guests} onChange={e=>set('guests',e.target.value)} placeholder="e.g. 150" min={1}/>
                {selectedVenue && guestsNum > selectedVenue.capacity && <span className="b24-error">Exceeds venue capacity of {selectedVenue.capacity}</span>}
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 4px' }}>Select add-on services:</p>
              {ADDON_SERVICES.map(s => {
                const cost = s.perPerson ? 80*guestsNum : s.flat;
                const checked = form.services.includes(s.name);
                const Icon = s.icon;
                return (
                  <div key={s.name} onClick={()=>toggleService(s.name)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:8, border:`1px solid ${checked?'#2563eb':'var(--input-border)'}`, background:checked?'#eff6ff':'var(--input-bg)', cursor:'pointer', transition:'all 0.12s' }}>
                    <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${checked?'#2563eb':'var(--input-border)'}`, background:checked?'#2563eb':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {checked && <Check size={11} color='#fff'/>}
                    </div>
                    <Icon size={16} color={checked?'#2563eb':'var(--text-muted)'}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.unitLabel}</div>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:checked?'#2563eb':'var(--text-muted)' }}>{fmt(cost)}</div>
                  </div>
                );
              })}
              <div style={{ marginTop:6, padding:'10px 14px', background:'var(--input-bg)', borderRadius:8, display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700 }}>
                <span>Estimated Total</span><span style={{ color:'#2563eb' }}>{fmt(totalAmt)}</span>
              </div>
            </div>
          )}

          {step===4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:4 }}>
                {[['Total Amount',fmt(totalAmt),'#2563eb'],['Pending After Advance',fmt(pendingAmt),pendingAmt>0?'#dc2626':'#059669']].map(([l,v,c]) => (
                  <div key={l} style={{ padding:'12px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)', textAlign:'center' }}>
                    <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="b24-field"><label className="b24-label">Advance Payment <span className="required">*</span></label>
                <input className="b24-input" type="number" value={form.advance} onChange={e=>set('advance',e.target.value)} placeholder="0" min={0}/></div>
              <div className="b24-field"><label className="b24-label">Payment Method</label>
                <select className="b24-select" value={form.payMethod} onChange={e=>set('payMethod',e.target.value)}>
                  {['Cash','Credit Card','Bank Transfer','Cheque'].map(m=><option key={m}>{m}</option>)}
                </select></div>
            </div>
          )}

          {step===5 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['Event',form.name],['Type',form.type],['Client',form.client],['Contact',`${form.phone} | ${form.email}`],['Venue',form.venue],['Date & Time',`${fmtDate(form.date)} at ${form.time}`],['Guests',form.guests],['Services',form.services.join(', ')||'None'],['Total',fmt(totalAmt)],['Advance',fmt(advanceNum)],['Pending',fmt(pendingAmt)]].map(([l,v],i) => (
                <div key={i} style={{ display:'flex', gap:12, fontSize:13, padding:'6px 0', borderBottom:'1px solid var(--card-border)' }}>
                  <span style={{ color:'var(--text-muted)', minWidth:100 }}>{l}</span>
                  <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', flexShrink:0 }}>
          {step>0 ? <button className="b24-btn b24-btn-secondary" onClick={()=>setStep(s=>s-1)}><ChevronLeft size={14}/> Back</button> : <button className="b24-btn b24-btn-secondary" onClick={onClose}>Cancel</button>}
          {step<STEPS.length-1
            ? <button className="b24-btn b24-btn-primary" onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ opacity:canNext()?1:0.5 }}>Next <ChevronRight size={14}/></button>
            : <button className="b24-btn b24-btn-primary" onClick={handleSave}><Check size={14}/> {isEdit?'Save Changes':'Confirm Booking'}</button>
          }
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EventBookings() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [detailEvent, setDetailEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Stats
  const totalEvents = events.length;
  const upcoming = events.filter(e => e.status === 'Booked' && e.date >= todayStr).length;
  const revenue = events.filter(e => e.status !== 'Cancelled').reduce((sum, e) => sum + e.total, 0);

  // Filtered
  const filtered = events.filter(e => {
    const mSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.client.toLowerCase().includes(search.toLowerCase());
    const mType = filterType === 'All' || e.type === filterType;
    const mStatus = filterStatus === 'All' || e.status === filterStatus;
    return mSearch && mType && mStatus;
  }).sort((a,b) => new Date(a.date) - new Date(b.date));

  const handleSave = (ev) => {
    setEvents(prev => {
      const exists = prev.find(p => p.id === ev.id);
      if (exists) return prev.map(p => p.id === ev.id ? ev : p);
      return [...prev, ev];
    });
    setShowForm(false);
    setEditEvent(null);
  };

  const handleCancelEvent = (id) => {
    setEvents(prev => prev.map(p => p.id === id ? {...p, status:'Cancelled'} : p));
    setDetailEvent(null);
  };

  return (
    <div style={{ padding:'28px 32px', minHeight:'100%', background:'var(--bg-page)' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg, #10b981, #059669)', display:'grid', placeItems:'center' }}>
            <Calendar size={24} color='#fff'/>
          </div>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', margin:0, letterSpacing:'-0.5px' }}>Event Bookings</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'3px 0 0' }}>Manage hotel events, venues, and services</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ display:'flex', background:'var(--input-bg)', padding:4, borderRadius:10, border:'1px solid var(--input-border)' }}>
            <button onClick={()=>setView('list')} style={{ padding:'6px 12px', borderRadius:6, border:'none', background:view==='list'?'var(--card-bg)':'transparent', boxShadow:view==='list'?'0 2px 8px rgba(0,0,0,0.1)':'none', color:view==='list'?'var(--text-primary)':'var(--text-muted)', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Search size={14}/> List</button>
            <button onClick={()=>setView('calendar')} style={{ padding:'6px 12px', borderRadius:6, border:'none', background:view==='calendar'?'var(--card-bg)':'transparent', boxShadow:view==='calendar'?'0 2px 8px rgba(0,0,0,0.1)':'none', color:view==='calendar'?'var(--text-primary)':'var(--text-muted)', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Calendar size={14}/> Calendar</button>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            onClick={() => { setEditEvent(null); setShowForm(true); }}
            style={{ padding:'10px 20px', borderRadius:8, border:'none', background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <Plus size={16}/> New Booking
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        <div style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', padding:'20px', display:'flex', alignItems:'center', gap:16, boxShadow:'var(--card-shadow)' }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'rgba(37,99,235,0.12)', display:'grid', placeItems:'center' }}><Search size={22} color='#2563eb'/></div>
          <div><div style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Total Events</div><div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)' }}>{totalEvents}</div></div>
        </div>
        <div style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', padding:'20px', display:'flex', alignItems:'center', gap:16, boxShadow:'var(--card-shadow)' }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'rgba(16,185,129,0.12)', display:'grid', placeItems:'center' }}><Calendar size={22} color='#10b981'/></div>
          <div><div style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Upcoming</div><div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)' }}>{upcoming}</div></div>
        </div>
        <div style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', padding:'20px', display:'flex', alignItems:'center', gap:16, boxShadow:'var(--card-shadow)' }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'rgba(245,158,11,0.12)', display:'grid', placeItems:'center' }}><DollarSign size={22} color='#f59e0b'/></div>
          <div><div style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Est. Revenue</div><div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)' }}>{fmt(revenue)}</div></div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', padding:'16px 20px', marginBottom:24, display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', boxShadow:'var(--card-shadow)' }}>
        <div style={{ flex:1, minWidth:200, display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:'9px 12px' }}>
          <Search size={16} color='var(--text-muted)'/>
          <input placeholder="Search events, clients..." value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', background:'transparent', outline:'none', fontSize:13, color:'var(--text-primary)', width:'100%' }}/>
        </div>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:'9px 12px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', color:'var(--text-primary)', fontSize:13, outline:'none', minWidth:140 }}>
          <option value="All">All Types</option>
          {Object.keys(TYPE_COLOR).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'9px 12px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', color:'var(--text-primary)', fontSize:13, outline:'none', minWidth:140 }}>
          <option value="All">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Main Content */}
      <div style={{ background:'var(--card-bg)', borderRadius:16, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)', overflow:'hidden' }}>
        {view === 'list' && (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
              <thead>
                <tr style={{ background:'var(--input-bg)', borderBottom:'1px solid var(--card-border)' }}>
                  {['Event Name','Client','Type','Date & Venue','Guests','Status','Total',''].map((h,i) => (
                    <th key={i} style={{ padding:'12px 16px', textAlign:h==='Total'?'right':'left', fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} onClick={(ev)=>{ev.stopPropagation(); setDetailEvent(e);}} style={{ borderBottom:'1px solid var(--card-border)', cursor:'pointer' }} className="b24-tr-hover">
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{e.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{e.id}</div>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text-primary)' }}>{e.client}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:TYPE_BG[e.type] || 'rgba(0,0,0,0.1)', color:TYPE_COLOR[e.type] || '#333', whiteSpace:'nowrap' }}>{e.type}</span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ fontSize:13, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:5, marginBottom:4 }}><Calendar size={12}/>{fmtDate(e.date)}</div>
                      <div style={{ fontSize:11, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:5 }}><MapPin size={11}/>{e.venue}</div>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text-secondary)' }}>{e.guests}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:STATUS_BG[e.status], color:STATUS_COLOR[e.status] }}>{e.status}</span>
                    </td>
                    <td style={{ padding:'12px 16px', textAlign:'right', fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{fmt(e.total)}</td>
                    <td style={{ padding:'12px 16px', textAlign:'right' }}>
                      <button onClick={(ev)=>{ev.stopPropagation(); setEditEvent(e); setShowForm(true);}} style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:4 }} className="b24-action-btn"><Edit2 size={16}/></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding:'40px 0', textAlign:'center', color:'var(--text-muted)' }}><Calendar size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/><p>No events found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {view === 'calendar' && (
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, background:'var(--card-bg)' }}>
            {filtered.map(e => (
              <motion.div key={e.id} whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(0,0,0,0.1)' }} onClick={()=>setDetailEvent(e)}
                style={{ background:'var(--input-bg)', borderRadius:12, border:'1px solid var(--card-border)', padding:16, cursor:'pointer', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, width:4, height:'100%', background:TYPE_COLOR[e.type] }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <span style={{ padding:'3px 10px', borderRadius:12, fontSize:10, fontWeight:700, background:STATUS_BG[e.status], color:STATUS_COLOR[e.status] }}>{e.status}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:TYPE_COLOR[e.type] }}>{e.type}</span>
                </div>
                <h4 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px' }}>{e.name}</h4>
                <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:12 }}>{e.client}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Calendar size={13}/>{fmtDate(e.date)} at {e.time}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><MapPin size={13}/>{e.venue}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Users size={13}/>{e.guests} guests</div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}><Calendar size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/><p>No events found</p></div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {detailEvent && <DetailModal event={detailEvent} onClose={()=>setDetailEvent(null)} onEdit={(e)=>{setDetailEvent(null); setEditEvent(e); setShowForm(true);}} onCancel={handleCancelEvent}/>}
        {showForm && <EventModal events={events} editEvent={editEvent} onClose={()=>setShowForm(false)} onSave={handleSave}/>}
      </AnimatePresence>
    </div>
  );
}
