import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Download, Eye, Edit2, X, Check, LogIn, LogOut,
  CreditCard, Calendar, Users, Home, Phone, Mail, Printer,
  AlertTriangle, ChevronLeft, ChevronRight, RefreshCw, Filter,
  BedDouble, Clock, DollarSign, CheckCircle2, XCircle, Send
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

const ROOMS_POOL = [
  { id:'r101', name:'Room 101', type:'Standard',  floor:1, rate:89  },
  { id:'r102', name:'Room 102', type:'Standard',  floor:1, rate:89  },
  { id:'r201', name:'Room 201', type:'Deluxe',    floor:2, rate:149 },
  { id:'r202', name:'Room 202', type:'Deluxe',    floor:2, rate:149 },
  { id:'r301', name:'Suite 301',type:'Suite',     floor:3, rate:249 },
  { id:'r302', name:'Suite 302',type:'Suite',     floor:3, rate:249 },
  { id:'r401', name:'Penthouse',type:'Penthouse', floor:4, rate:499 },
];

let _bid = 1001;
const mkB = (guest, phone, email, roomId, ci, co, bkStatus, payStatus, paid, notes='') => {
  const room = ROOMS_POOL.find(r => r.id === roomId);
  const nights = Math.round((new Date(co) - new Date(ci)) / 86400000);
  const total = room.rate * nights;
  return {
    id: `BK-${_bid++}`, guest, phone, email,
    roomId, roomName: room.name, roomType: room.type, floor: room.floor,
    checkIn: ci, checkOut: co, nights, guests: 2,
    total, paid, pending: total - paid,
    status: bkStatus, payStatus, notes,
    createdAt: d(-Math.floor(Math.random() * 10)),
  };
};

const INIT_BOOKINGS = [
  mkB('Alice Johnson',  '+1 245-888-0001','alice@gmail.com',  'r301', d(-2), d(2),  'Checked-in',  'Paid',    996,  'Early check-in requested'),
  mkB('Bob Smith',      '+1 202-555-0158','bob@vertex.io',    'r201', today, d(3),  'Confirmed',   'Partial', 149,  'Honeymoon package'),
  mkB('Charlie Brown',  '+1 515-321-7788','charlie@corp.com', 'r401', d(-1), d(3),  'Checked-in',  'Paid',    1996, 'VIP — butler service'),
  mkB('Diana Prince',   '+1 415-982-3344','diana@corp.com',   'r101', d(2),  d(5),  'Confirmed',   'Pending', 0,    'Corporate booking'),
  mkB('Ethan Hunt',     '+1 650-111-9988','ethan@agency.com', 'r202', d(-5), d(-2), 'Checked-out', 'Paid',    447,  ''),
  mkB('Fiona Green',    '+1 312-444-5566','fiona@mail.com',   'r102', d(1),  d(4),  'Confirmed',   'Pending', 0,    ''),
  mkB('George Clooney', '+1 777-321-0000','george@vip.com',   'r302', d(-3), d(1),  'Checked-in',  'Paid',    996,  'Privacy required'),
  mkB('Hannah Lee',     '+1 888-222-3344','hannah@tech.io',   'r201', d(-8), d(-5), 'Checked-out', 'Paid',    447,  ''),
  mkB('Ivan Drago',     '+1 999-000-1111','ivan@corp.ru',     'r101', d(-10),d(-7), 'Cancelled',   'Refunded',0,    'Guest cancelled'),
  mkB('Julia Roberts',  '+1 555-678-9012','julia@star.com',   'r401', d(5),  d(8),  'Confirmed',   'Partial', 499,  'Flowers + champagne on arrival'),
  mkB('Kevin Hart',     '+1 444-555-6677','kevin@comedy.com', 'r202', d(3),  d(6),  'Confirmed',   'Pending', 0,    'Gym access required'),
  mkB('Laura Palmer',   '+1 333-444-5555','laura@mystery.com','r102', d(-2), today, 'Checked-out', 'Paid',    178,  ''),
];

const BSTATUS = { 'Confirmed':'#2563eb', 'Checked-in':'#059669', 'Checked-out':'#64748b', 'Cancelled':'#dc2626' };
const BSTATUS_BG = { 'Confirmed':'#dbeafe', 'Checked-in':'#d1fae5', 'Checked-out':'#f1f5f9', 'Cancelled':'#fee2e2' };
const PSTATUS = { Paid:'#059669', Partial:'#d97706', Pending:'#dc2626', Refunded:'#64748b' };
const PSTATUS_BG = { Paid:'#d1fae5', Partial:'#fef3c7', Pending:'#fee2e2', Refunded:'#f1f5f9' };

const ROOM_TYPES = ['All Types','Standard','Deluxe','Suite','Penthouse'];
const PAY_METHODS = ['Cash','Credit Card','Debit Card','UPI','Bank Transfer'];

const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ status, type = 'booking' }) {
  const color = type === 'booking' ? BSTATUS[status] : PSTATUS[status];
  const bg    = type === 'booking' ? BSTATUS_BG[status] : PSTATUS_BG[status];
  return <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background: bg||'#f1f5f9', color: color||'#64748b' }}>{status}</span>;
}

function Toast({ msg, type = 'success' }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
      style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'11px 18px', borderRadius:6,
        background: type==='error'?'#dc2626':'#059669', color:'#fff', fontWeight:600, fontSize:13,
        display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
      <Check size={14}/> {msg}
    </motion.div>
  );
}

// ── Booking Detail Modal ──────────────────────────────────────────────────────
function BookingModal({ booking, onClose, onUpdate }) {
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [showPayForm, setShowPayForm] = useState(false);

  const addPayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;
    const newPaid = Math.min(booking.total, booking.paid + amt);
    onUpdate(booking.id, { paid: newPaid, pending: booking.total - newPaid, payStatus: newPaid >= booking.total ? 'Paid' : 'Partial' });
    setPayAmount(''); setShowPayForm(false);
  };

  const inp = { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:4, padding:'8px 10px', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{booking.id}</h3>
              <StatusBadge status={booking.status}/>
              <StatusBadge status={booking.payStatus} type="payment"/>
            </div>
            <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'3px 0 0' }}>Created {booking.createdAt}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button title="Print" style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}><Printer size={13}/></button>
            <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={16}/></button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* Guest + Booking info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={{ padding:'14px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:10 }}>Guest Info</div>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:6 }}>{booking.guest}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}><Phone size={11}/>{booking.phone}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Mail size={11}/>{booking.email}</div>
            </div>
            <div style={{ padding:'14px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:10 }}>Room Info</div>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>{booking.roomName}</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}>{booking.roomType} · Floor {booking.floor}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}><Users size={11}/>{booking.guests} guests</div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[
              { label:'Check-In',  value: booking.checkIn  },
              { label:'Check-Out', value: booking.checkOut },
              { label:'Nights',    value: booking.nights   },
              { label:'Rate/Night',value: `$${booking.total/booking.nights}` },
            ].map((item,i) => (
              <div key={i} style={{ padding:'10px 12px', borderRadius:6, background:'var(--input-bg)', border:'1px solid var(--card-border)', textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div style={{ padding:'14px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Payment Summary</div>
              <button className="b24-btn b24-btn-ghost" style={{ fontSize:11 }} onClick={() => setShowPayForm(p=>!p)}>
                <Plus size={12}/> Add Payment
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom: showPayForm?12:0 }}>
              {[
                { label:'Total',   value:`$${booking.total}`,   color:'var(--text-primary)' },
                { label:'Paid',    value:`$${booking.paid}`,    color:'#059669' },
                { label:'Pending', value:`$${booking.pending}`, color: booking.pending>0?'#dc2626':'#059669' },
              ].map((p,i) => (
                <div key={i} style={{ textAlign:'center', padding:'8px', borderRadius:6, background:'var(--card-bg)', border:'1px solid var(--card-border)' }}>
                  <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3 }}>{p.label}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:p.color }}>{p.value}</div>
                </div>
              ))}
            </div>
            {showPayForm && (
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="Amount" style={{ ...inp, width:120 }}/>
                <select value={payMethod} onChange={e=>setPayMethod(e.target.value)} style={{ ...inp, width:'auto' }}>
                  {PAY_METHODS.map(m=><option key={m}>{m}</option>)}
                </select>
                <button className="b24-btn b24-btn-primary" onClick={addPayment}><Check size={13}/> Add</button>
              </div>
            )}
          </div>

          {/* Special requests */}
          {booking.notes && (
            <div style={{ padding:'12px 14px', borderRadius:8, background:'#fffbeb', border:'1px solid #fde68a' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#92400e', textTransform:'uppercase', marginBottom:4 }}>Special Requests</div>
              <div style={{ fontSize:13, color:'#78350f' }}>{booking.notes}</div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', gap:8, justifyContent:'space-between', flexShrink:0 }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Close</button>
          <div style={{ display:'flex', gap:8 }}>
            {booking.status === 'Confirmed' && (
              <button className="b24-btn b24-btn-primary" onClick={() => { onUpdate(booking.id,{status:'Checked-in'}); onClose(); }}>
                <LogIn size={13}/> Check In
              </button>
            )}
            {booking.status === 'Checked-in' && (
              <button className="b24-btn b24-btn-primary" onClick={() => { onUpdate(booking.id,{status:'Checked-out'}); onClose(); }}>
                <LogOut size={13}/> Check Out
              </button>
            )}
            {!['Cancelled','Checked-out'].includes(booking.status) && (
              <button className="b24-btn b24-btn-danger" onClick={() => { onUpdate(booking.id,{status:'Cancelled',payStatus:'Refunded'}); onClose(); }}>
                <XCircle size={13}/> Cancel
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Create Booking Modal ──────────────────────────────────────────────────────
function CreateBookingModal({ onClose, onSave }) {
  const [form, setForm] = useState({ guest:'', phone:'', email:'', roomId:'r101', checkIn:today, checkOut:d(2), guests:2, notes:'', payMethod:'Cash' });
  const [err, setErr] = useState('');

  const room = ROOMS_POOL.find(r => r.id === form.roomId);
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const total = room ? room.rate * nights : 0;

  const save = (draft) => {
    if (!form.guest.trim()) return setErr('Guest name is required');
    if (!form.checkIn || !form.checkOut) return setErr('Dates are required');
    if (form.checkIn >= form.checkOut) return setErr('Check-out must be after check-in');
    onSave({ ...form, status: draft ? 'Confirmed' : 'Confirmed', total, nights, paid:0, pending:total, payStatus:'Pending', roomName:room.name, roomType:room.type, floor:room.floor, id:`BK-${Date.now()}`, createdAt:today });
    onClose();
  };

  const inp = { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:4, padding:'8px 10px', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:540, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>New Booking</h3>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={16}/></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* Guest */}
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', borderBottom:'1px solid var(--card-border)', paddingBottom:8 }}>Guest Information</div>
          <div className="b24-row b24-row-2">
            <div className="b24-field">
              <label className="b24-label">Guest Name <span className="required">*</span></label>
              <input className={`b24-input${err?'':''}`} value={form.guest} onChange={e=>setForm(f=>({...f,guest:e.target.value}))} placeholder="Full name"/>
            </div>
            <div className="b24-field">
              <label className="b24-label">Phone</label>
              <input className="b24-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 555-000-0000"/>
            </div>
          </div>
          <div className="b24-field">
            <label className="b24-label">Email</label>
            <input type="email" className="b24-input" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="guest@email.com"/>
          </div>

          {/* Room */}
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', borderBottom:'1px solid var(--card-border)', paddingBottom:8, marginTop:4 }}>Room & Dates</div>
          <div className="b24-row b24-row-2">
            <div className="b24-field">
              <label className="b24-label">Room</label>
              <select className="b24-select" value={form.roomId} onChange={e=>setForm(f=>({...f,roomId:e.target.value}))}>
                {ROOMS_POOL.map(r=><option key={r.id} value={r.id}>{r.name} ({r.type}) — ${r.rate}/night</option>)}
              </select>
            </div>
            <div className="b24-field">
              <label className="b24-label">Guests</label>
              <input type="number" min={1} max={8} className="b24-input" value={form.guests} onChange={e=>setForm(f=>({...f,guests:Number(e.target.value)}))}/>
            </div>
          </div>
          <div className="b24-row b24-row-2">
            <div className="b24-field">
              <label className="b24-label">Check-In <span className="required">*</span></label>
              <input type="date" className="b24-input" value={form.checkIn} onChange={e=>setForm(f=>({...f,checkIn:e.target.value}))}/>
            </div>
            <div className="b24-field">
              <label className="b24-label">Check-Out <span className="required">*</span></label>
              <input type="date" className="b24-input" value={form.checkOut} onChange={e=>setForm(f=>({...f,checkOut:e.target.value}))}/>
            </div>
          </div>

          {/* Price calc */}
          <div style={{ padding:'12px 14px', borderRadius:8, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:12, color:'#1e40af' }}>{nights} night{nights>1?'s':''} × ${room?.rate}/night</div>
            <div style={{ fontSize:20, fontWeight:800, color:'#2563eb' }}>${total}</div>
          </div>

          <div className="b24-field">
            <label className="b24-label">Special Requests / Notes</label>
            <textarea className="b24-textarea" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Any special requests..."/>
          </div>

          {err && <div style={{ padding:'8px 12px', borderRadius:6, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:12 }}>{err}</div>}
        </div>

        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--card-border)', display:'flex', gap:8, justifyContent:'flex-end', flexShrink:0 }}>
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="b24-btn b24-btn-primary" onClick={() => save(false)}>
            <CheckCircle2 size={13}/> Confirm Booking
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Calendar View ─────────────────────────────────────────────────────────────
function CalendarView({ bookings }) {
  const [anchor, setAnchor] = useState(new Date());
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const getBookingsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return bookings.filter(b => b.checkIn <= dateStr && b.checkOut > dateStr && b.status !== 'Cancelled');
  };

  const todayDay = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  return (
    <div style={{ background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', overflow:'hidden' }}>
      {/* Nav */}
      <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={() => setAnchor(a => new Date(a.getFullYear(), a.getMonth()-1, 1))}
          style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
          <ChevronLeft size={14}/>
        </button>
        <span style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{MONTHS[month]} {year}</span>
        <button onClick={() => setAnchor(a => new Date(a.getFullYear(), a.getMonth()+1, 1))}
          style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
          <ChevronRight size={14}/>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid var(--card-border)' }}>
        {DAYS.map(d => <div key={d} style={{ padding:'8px', textAlign:'center', fontSize:11, fontWeight:700, color:'var(--text-muted)' }}>{d}</div>)}
      </div>

      {/* Cells */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
        {cells.map((day, i) => {
          const dayBookings = getBookingsForDay(day);
          const isToday = day === todayDay && month === todayMonth && year === todayYear;
          return (
            <div key={i} style={{ minHeight:80, padding:'6px', borderRight:'1px solid var(--card-border)', borderBottom:'1px solid var(--card-border)', background: isToday ? 'rgba(37,99,235,0.04)' : 'transparent' }}>
              {day && (
                <>
                  <div style={{ fontSize:12, fontWeight: isToday?800:500, color: isToday?'#2563eb':'var(--text-secondary)', width:22, height:22, borderRadius:'50%', background: isToday?'#2563eb':'transparent', display:'grid', placeItems:'center', marginBottom:4, color: isToday?'#fff':'var(--text-secondary)' }}>{day}</div>
                  {dayBookings.slice(0,2).map((b,j) => (
                    <div key={j} style={{ fontSize:9, fontWeight:600, padding:'1px 5px', borderRadius:3, marginBottom:2, background: BSTATUS_BG[b.status], color: BSTATUS[b.status], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {b.guest.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 2 && <div style={{ fontSize:9, color:'var(--text-muted)' }}>+{dayBookings.length-2} more</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Pipeline() {
  const [bookings, setBookings]   = useState(INIT_BOOKINGS);
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState('All');
  const [payF, setPayF]           = useState('All');
  const [typeF, setTypeF]         = useState('All Types');
  const [tab, setTab]             = useState('List');
  const [selected, setSelected]   = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast]         = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 8;

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const updateBooking = (id, changes) => {
    setBookings(bs => bs.map(b => b.id===id ? {...b,...changes} : b));
    if (selected?.id === id) setSelected(s => ({...s,...changes}));
    showToast('Booking updated');
  };

  const addBooking = (data) => {
    setBookings(bs => [...bs, data]);
    showToast('Booking created successfully');
  };

  const filtered = useMemo(() => bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    const matchS = statusF === 'All' || b.status === statusF;
    const matchP = payF === 'All' || b.payStatus === payF;
    const matchT = typeF === 'All Types' || b.roomType === typeF;
    return matchQ && matchS && matchP && matchT;
  }), [bookings, search, statusF, payF, typeF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  // Stats
  const todayCheckins  = bookings.filter(b => b.checkIn === today && b.status === 'Confirmed').length;
  const todayCheckouts = bookings.filter(b => b.checkOut === today && b.status === 'Checked-in').length;
  const pendingPay     = bookings.filter(b => b.payStatus === 'Pending').reduce((a,b)=>a+b.pending,0);

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Booking Management</h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>{bookings.length} total bookings</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="b24-btn b24-btn-secondary"><Download size={13}/> Export</button>
          <button className="b24-btn b24-btn-primary" onClick={() => setShowCreate(true)}><Plus size={13}/> New Booking</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Bookings',    value: bookings.length,                                         color:'#6366f1', icon: BedDouble },
          { label:"Today's Check-ins", value: todayCheckins,                                           color:'#10b981', icon: LogIn     },
          { label:"Today's Check-outs",value: todayCheckouts,                                          color:'#2563eb', icon: LogOut    },
          { label:'Pending Payments',  value: `$${pendingPay.toLocaleString()}`,                       color:'#dc2626', icon: CreditCard},
        ].map((s,i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ ...card, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'10px 10px 0 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</span>
                <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}15`, display:'grid', placeItems:'center' }}>
                  <Icon size={15} color={s.color}/>
                </div>
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ ...card, padding:'0 20px', marginBottom:18, display:'flex', gap:0 }}>
        {['List','Calendar'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'13px 18px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight: tab===t?700:500, color: tab===t?'#2563eb':'var(--text-secondary)', borderBottom: tab===t?'2px solid #2563eb':'2px solid transparent', transition:'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ ...card, padding:'12px 16px', marginBottom:18, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:4, padding:'7px 10px', flex:1, minWidth:200 }}>
          <Search size={13} color='var(--text-muted)'/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search guest name or booking ID..."
            style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:'100%' }}/>
        </div>
        <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} className="b24-select" style={{ width:'auto' }}>
          {['All','Confirmed','Checked-in','Checked-out','Cancelled'].map(o=><option key={o}>{o}</option>)}
        </select>
        <select value={payF} onChange={e=>{setPayF(e.target.value);setPage(1);}} className="b24-select" style={{ width:'auto' }}>
          {['All','Paid','Partial','Pending','Refunded'].map(o=><option key={o}>{o}</option>)}
        </select>
        <select value={typeF} onChange={e=>{setTypeF(e.target.value);setPage(1);}} className="b24-select" style={{ width:'auto' }}>
          {ROOM_TYPES.map(o=><option key={o}>{o}</option>)}
        </select>
        {(search||statusF!=='All'||payF!=='All'||typeF!=='All Types') && (
          <button className="b24-btn b24-btn-secondary" onClick={()=>{setSearch('');setStatusF('All');setPayF('All');setTypeF('All Types');setPage(1);}}>
            <RefreshCw size={12}/> Reset
          </button>
        )}
      </div>

      {/* List View */}
      {tab === 'List' && (
        <div style={{ ...card, overflow:'hidden', marginBottom:16 }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:1000 }}>
              <thead>
                <tr style={{ background:'var(--input-bg)', borderBottom:'1px solid var(--card-border)' }}>
                  {['Booking ID','Guest','Room','Check-In','Check-Out','Nights','Amount','Payment','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>No bookings found</td></tr>
                ) : paged.map((b,i) => (
                  <motion.tr key={b.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                    style={{ borderBottom:'1px solid var(--card-border)', transition:'background 0.12s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(37,99,235,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 14px', fontSize:12, fontWeight:700, color:'#2563eb' }}>{b.id}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{b.guest}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{b.guests} guests</div>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{b.roomName}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{b.roomType}</div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{b.checkIn}</td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{b.checkOut}</td>
                    <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'var(--text-primary)', textAlign:'center' }}>{b.nights}</td>
                    <td style={{ padding:'12px 14px', fontSize:14, fontWeight:800, color:'#2563eb' }}>${b.total}</td>
                    <td style={{ padding:'12px 14px' }}><StatusBadge status={b.payStatus} type="payment"/></td>
                    <td style={{ padding:'12px 14px' }}><StatusBadge status={b.status}/></td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={() => setSelected(b)} title="View"
                          style={{ width:28, height:28, borderRadius:4, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}>
                          <Eye size={12}/>
                        </button>
                        {b.status === 'Confirmed' && (
                          <button onClick={() => updateBooking(b.id,{status:'Checked-in'})} title="Check In"
                            style={{ width:28, height:28, borderRadius:4, border:'1px solid #bbf7d0', background:'#f0fdf4', display:'grid', placeItems:'center', cursor:'pointer', color:'#059669' }}>
                            <LogIn size={12}/>
                          </button>
                        )}
                        {b.status === 'Checked-in' && (
                          <button onClick={() => updateBooking(b.id,{status:'Checked-out'})} title="Check Out"
                            style={{ width:28, height:28, borderRadius:4, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}>
                            <LogOut size={12}/>
                          </button>
                        )}
                        {!['Cancelled','Checked-out'].includes(b.status) && (
                          <button onClick={() => updateBooking(b.id,{status:'Cancelled',payStatus:'Refunded'})} title="Cancel"
                            style={{ width:28, height:28, borderRadius:4, border:'1px solid #fecaca', background:'#fef2f2', display:'grid', placeItems:'center', cursor:'pointer', color:'#dc2626' }}>
                            <XCircle size={12}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding:'12px 16px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--text-secondary)' }}>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</span>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ width:28, height:28, borderRadius:4, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', opacity:page===1?0.4:1 }}>
                  <ChevronLeft size={13}/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    style={{ width:28, height:28, borderRadius:4, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, background:n===page?'#2563eb':'var(--input-bg)', color:n===page?'#fff':'var(--text-secondary)', outline:n===page?'none':'1px solid var(--card-border)' }}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ width:28, height:28, borderRadius:4, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', opacity:page===totalPages?0.4:1 }}>
                  <ChevronRight size={13}/>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {tab === 'Calendar' && <CalendarView bookings={bookings}/>}

      {/* Modals */}
      <AnimatePresence>
        {selected && <BookingModal booking={selected} onClose={() => setSelected(null)} onUpdate={updateBooking}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showCreate && <CreateBookingModal onClose={() => setShowCreate(false)} onSave={addBooking}/>}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type}/>}
      </AnimatePresence>
    </div>
  );
}
