import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, X, Check, Search,
  Calendar as CalIcon, Clock, User, CreditCard, Home,
  AlertTriangle, Filter, Download, RefreshCw, LayoutGrid,
  List, CalendarDays, BedDouble, LogIn, LogOut
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const ROOM_TYPES = ['All Types', 'Standard', 'Deluxe', 'Suite', 'Penthouse'];
const STATUS_OPTS = ['All Status', 'confirmed', 'checked-in', 'pending', 'cancelled', 'maintenance'];
const PAYMENT_OPTS = ['Paid', 'Partial', 'Pending', 'Refunded'];

const STATUS_META = {
  'confirmed':   { color: '#10b981', bg: 'rgba(16,185,129,0.18)',  border: '#10b981', label: 'Confirmed'   },
  'checked-in':  { color: '#3b82f6', bg: 'rgba(59,130,246,0.18)',  border: '#3b82f6', label: 'Checked In'  },
  'pending':     { color: '#f59e0b', bg: 'rgba(245,158,11,0.18)',  border: '#f59e0b', label: 'Pending'     },
  'cancelled':   { color: '#ef4444', bg: 'rgba(239,68,68,0.18)',   border: '#ef4444', label: 'Cancelled'   },
  'maintenance': { color: '#94a3b8', bg: 'rgba(148,163,184,0.18)', border: '#94a3b8', label: 'Maintenance' },
};

const ROOMS = [
  { id:'r101', name:'Room 101',  type:'Standard',  floor:1 },
  { id:'r102', name:'Room 102',  type:'Standard',  floor:1 },
  { id:'r103', name:'Room 103',  type:'Standard',  floor:1 },
  { id:'r201', name:'Room 201',  type:'Deluxe',    floor:2 },
  { id:'r202', name:'Room 202',  type:'Deluxe',    floor:2 },
  { id:'r203', name:'Room 203',  type:'Deluxe',    floor:2 },
  { id:'r301', name:'Suite 301', type:'Suite',     floor:3 },
  { id:'r302', name:'Suite 302', type:'Suite',     floor:3 },
  { id:'r401', name:'Penthouse', type:'Penthouse', floor:4 },
];

const today = new Date(); today.setHours(0,0,0,0);
const d = (offset) => { const x = new Date(today); x.setDate(x.getDate()+offset); return x.toISOString().slice(0,10); };

let _bid = 1;
const mkB = (roomId, guestName, ciOff, coOff, status, payment='Paid', notes='') => ({
  id: `b${_bid++}`, roomId, guestName,
  checkIn: d(ciOff), checkOut: d(coOff),
  status, paymentStatus: payment, notes,
});

const INIT_BOOKINGS = [
  mkB('r101','Alice Johnson',  -1, 2, 'checked-in', 'Paid',    'Early check-in requested'),
  mkB('r102','Bob Smith',       0, 3, 'confirmed',  'Partial', 'Honeymoon package'),
  mkB('r103','Charlie Brown',  -3,-1, 'checked-in', 'Paid'),
  mkB('r201','Diana Prince',    1, 4, 'confirmed',  'Pending', 'Corporate booking'),
  mkB('r202','Ethan Hunt',     -2, 1, 'checked-in', 'Paid'),
  mkB('r203','Fiona Green',     2, 5, 'pending',    'Pending', 'Awaiting confirmation'),
  mkB('r301','George Clooney', -1, 3, 'confirmed',  'Paid',    'VIP guest — extra amenities'),
  mkB('r302','Hannah Lee',      0, 2, 'checked-in', 'Paid'),
  mkB('r401','Ivan Drago',     -2, 4, 'confirmed',  'Paid',    'Penthouse suite — full board'),
  mkB('r101','James Bond',      4, 7, 'confirmed',  'Paid'),
  mkB('r103','Karen White',     3, 6, 'pending',    'Pending'),
  mkB('r201','Leo Messi',       5, 8, 'confirmed',  'Partial'),
  mkB('r202','Maria Garcia',   -5,-3, 'cancelled',  'Refunded','Guest cancelled'),
  mkB('r203','Nina Simone',     6, 9, 'confirmed',  'Pending'),
  mkB('r102','Oscar Wilde',    -6,-4, 'maintenance','Paid',    'Deep cleaning'),
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const toDate = (s) => { const [y,m,d2] = s.split('-').map(Number); return new Date(y,m-1,d2); };
const toStr  = (dt) => dt.toISOString().slice(0,10);
const addDays = (dt, n) => { const x = new Date(dt); x.setDate(x.getDate()+n); return x; };
const diffDays = (a, b) => Math.round((toDate(b)-toDate(a))/(1000*60*60*24));

const getWeekDays = (anchor) => {
  const day = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((day+6)%7));
  return Array.from({length:7}, (_,i) => addDays(monday, i));
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const hasConflict = (bookings, roomId, checkIn, checkOut, excludeId=null) =>
  bookings.some(b =>
    b.id !== excludeId &&
    b.roomId === roomId &&
    b.status !== 'cancelled' &&
    toDate(b.checkIn) < toDate(checkOut) &&
    toDate(b.checkOut) > toDate(checkIn)
  );

const initForm = () => ({
  guestName:'', roomId: ROOMS[0].id,
  checkIn: toStr(today), checkOut: toStr(addDays(today,1)),
  paymentStatus:'Paid', notes:'', status:'confirmed',
});

// ── Type-color badge ──────────────────────────────────────────────────────────
const TYPE_COLOR = { Standard:'#6366f1', Deluxe:'#8b5cf6', Suite:'#ec4899', Penthouse:'#f59e0b' };

// ── Main Component ────────────────────────────────────────────────────────────
export default function Calendar() {
  const [anchor, setAnchor]       = useState(new Date(today));
  const [view, setView]           = useState('week'); // 'day' | 'week' | 'month'
  const [bookings, setBookings]   = useState(INIT_BOOKINGS);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(null); // null | { mode:'new'|'edit'|'view', booking?, slot? }
  const [form, setForm]           = useState(initForm());
  const [formErr, setFormErr]     = useState('');
  const [tooltip, setTooltip]     = useState(null); // { booking, x, y }
  const [toast, setToast]         = useState(null);
  const [drag, setDrag]           = useState(null); // { bookingId, startRoomId, startDate }
  const [dragOver, setDragOver]   = useState(null); // { roomId, date }
  const gridRef = useRef(null);

  const weekDays = getWeekDays(anchor);
  const weekStart = weekDays[0];
  const weekEnd   = weekDays[6];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Filtered rooms ──
  const filteredRooms = ROOMS.filter(r =>
    typeFilter === 'All Types' || r.type === typeFilter
  );

  // ── Bookings visible in this week ──
  const visibleBookings = bookings.filter(b => {
    if (statusFilter !== 'All Status' && b.status !== statusFilter) return false;
    if (search && !b.guestName.toLowerCase().includes(search.toLowerCase())) return false;
    return toDate(b.checkOut) > weekStart && toDate(b.checkIn) <= weekEnd;
  });

  // ── Occupancy summary ──
  const occupiedRooms = new Set(
    bookings.filter(b =>
      ['confirmed','checked-in','pending'].includes(b.status) &&
      toDate(b.checkIn) <= today && toDate(b.checkOut) > today
    ).map(b => b.roomId)
  ).size;
  const totalRooms = ROOMS.length;
  const availableRooms = totalRooms - occupiedRooms;
  const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

  // ── Week navigation ──
  const prevWeek = () => setAnchor(a => addDays(a, -7));
  const nextWeek = () => setAnchor(a => addDays(a, 7));
  const goToday  = () => setAnchor(new Date(today));

  // ── Open new booking modal from empty slot ──
  const openNewBooking = (roomId, date) => {
    const ci = toStr(date);
    const co = toStr(addDays(date, 1));
    setForm({ ...initForm(), roomId, checkIn: ci, checkOut: co });
    setFormErr('');
    setModal({ mode: 'new' });
  };

  // ── Open edit/view modal ──
  const openBooking = (b, e) => {
    e.stopPropagation();
    setForm({ ...b });
    setFormErr('');
    setModal({ mode: 'edit', booking: b });
  };

  // ── Save booking ──
  const saveBooking = () => {
    if (!form.guestName.trim()) return setFormErr('Guest name is required.');
    if (form.checkIn >= form.checkOut) return setFormErr('Check-out must be after check-in.');
    const excludeId = modal.mode === 'edit' ? form.id : null;
    if (hasConflict(bookings, form.roomId, form.checkIn, form.checkOut, excludeId))
      return setFormErr('Conflict: another booking exists for this room and dates.');
    if (modal.mode === 'new') {
      const nb = { ...form, id: `b${Date.now()}` };
      setBookings(prev => [...prev, nb]);
      showToast('Booking created');
    } else {
      setBookings(prev => prev.map(b => b.id === form.id ? { ...form } : b));
      showToast('Booking updated');
    }
    setModal(null);
  };

  // ── Cancel booking ──
  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    setModal(null);
    showToast('Booking cancelled', 'warn');
  };

  // ── Check-in / Check-out ──
  const checkInOut = (id, action) => {
    setBookings(prev => prev.map(b =>
      b.id === id ? { ...b, status: action === 'checkin' ? 'checked-in' : 'confirmed' } : b
    ));
    setModal(null);
    showToast(action === 'checkin' ? 'Guest checked in' : 'Guest checked out');
  };

  // ── Drag & Drop ──
  const onDragStart = (e, booking) => {
    setDrag({ bookingId: booking.id, origRoomId: booking.roomId, origCheckIn: booking.checkIn, origCheckOut: booking.checkOut });
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, roomId, date) => {
    e.preventDefault();
    setDragOver({ roomId, date: toStr(date) });
  };

  const onDrop = (e, roomId, date) => {
    e.preventDefault();
    if (!drag) return;
    const b = bookings.find(x => x.id === drag.bookingId);
    if (!b) return;
    const nights = diffDays(b.checkIn, b.checkOut);
    const newCI  = toStr(date);
    const newCO  = toStr(addDays(date, nights));
    if (hasConflict(bookings, roomId, newCI, newCO, b.id)) {
      showToast('Conflict: cannot move booking here', 'error');
    } else {
      setBookings(prev => prev.map(x =>
        x.id === drag.bookingId ? { ...x, roomId, checkIn: newCI, checkOut: newCO } : x
      ));
      showToast('Booking moved');
    }
    setDrag(null);
    setDragOver(null);
  };

  const onDragEnd = () => { setDrag(null); setDragOver(null); };

  // ── CSV Export ──
  const exportCSV = () => {
    const rows = [['ID','Guest','Room','Check-In','Check-Out','Status','Payment','Notes']];
    bookings.forEach(b => {
      const room = ROOMS.find(r => r.id === b.roomId);
      rows.push([b.id, b.guestName, room?.name||b.roomId, b.checkIn, b.checkOut, b.status, b.paymentStatus, b.notes]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = 'bookings.csv';
    a.click();
  };

  // ── Booking block position ──
  const getBlockStyle = (booking, weekDays) => {
    const ci = toDate(booking.checkIn);
    const co = toDate(booking.checkOut);
    const wStart = weekDays[0];
    const wEnd   = addDays(weekDays[6], 1);
    const visStart = ci < wStart ? wStart : ci;
    const visEnd   = co > wEnd   ? wEnd   : co;
    const startIdx = weekDays.findIndex(d2 => toStr(d2) === toStr(visStart));
    const span     = Math.round((visEnd - visStart) / (1000*60*60*24));
    const meta     = STATUS_META[booking.status] || STATUS_META['pending'];
    return { startIdx, span, meta };
  };

  // ── Month/year label ──
  const monthLabel = (() => {
    const months = [...new Set(weekDays.map(d2 => `${MONTHS[d2.getMonth()]} ${d2.getFullYear()}`))];
    return months.join(' – ');
  })();

  const isToday = (d2) => toStr(d2) === toStr(today);

  // ── Styles ──
  const s = {
    page:       { padding: '28px 32px', minHeight: '100%', background: 'var(--bg-page)', color: 'var(--text-primary)' },
    card:       { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' },
    input:      { background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: '100%' },
    label:      { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' },
    btn:        { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' },
    btnPrimary: { background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff' },
    btnGhost:   { background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--input-border)' },
    btnDanger:  { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
    CELL_W:     120,
    ROW_H:      56,
    ROOM_COL:   160,
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, margin:0, letterSpacing:'-0.5px' }}>
            Room Calendar
          </h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>
            Drag bookings to move • Click empty cell to create • Click booking to edit
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* View switcher */}
          <div style={{ display:'flex', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:8, padding:3, gap:2 }}>
            {[['day','Day'],['week','Week'],['month','Month']].map(([v,label]) => (
              <button key={v} onClick={() => setView(v)}
                style={{ ...s.btn, padding:'5px 12px', fontSize:12, background: view===v ? 'var(--primary)' : 'transparent', color: view===v ? '#fff' : 'var(--text-secondary)', border:'none' }}>
                {label}
              </button>
            ))}
          </div>
          <button style={{ ...s.btn, ...s.btnGhost, display:'flex', alignItems:'center', gap:6 }} onClick={exportCSV}>
            <Download size={14}/> Export CSV
          </button>
          <button style={{ ...s.btn, ...s.btnPrimary, display:'flex', alignItems:'center', gap:6 }}
            onClick={() => { setForm(initForm()); setFormErr(''); setModal({ mode:'new' }); }}>
            <Plus size={14}/> New Booking
          </button>
        </div>
      </div>

      {/* ── Layout: Calendar + Side Panel ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:16, alignItems:'start' }}>
      <div style={{ minWidth:0 }}>

      {/* ── Occupancy Summary ── */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>        {[
          { label:'Total Rooms',    value: totalRooms,     color:'var(--primary)' },
          { label:'Occupied Today', value: occupiedRooms,  color:'#3b82f6' },
          { label:'Available',      value: availableRooms, color:'#10b981' },
          { label:'Occupancy Rate', value: `${occupancyPct}%`, color:'#f59e0b' },
        ].map(item => (
          <div key={item.label} style={{ ...s.card, padding:'14px 20px', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
            <span style={{ fontSize:11, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{item.label}</span>
            <span style={{ fontSize:22, fontWeight:800, color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ ...s.card, padding:'14px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:180 }}>
          <Search size={14} color='var(--text-muted)'/>
          <input placeholder="Search guest..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ ...s.input, width:'auto', flex:1 }}/>
        </div>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ ...s.input, width:'auto' }}>
          {ROOM_TYPES.map(t2 => <option key={t2}>{t2}</option>)}
        </select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ ...s.input, width:'auto' }}>
          {STATUS_OPTS.map(s2 => <option key={s2}>{s2}</option>)}
        </select>
        {(search || typeFilter !== 'All Types' || statusFilter !== 'All Status') && (
          <button style={{ ...s.btn, ...s.btnGhost, display:'flex', alignItems:'center', gap:6 }}
            onClick={() => { setSearch(''); setTypeFilter('All Types'); setStatusFilter('All Status'); }}>
            <RefreshCw size={13}/> Reset
          </button>
        )}
      </div>

      {/* ── Week Navigation ── */}
      <div style={{ ...s.card, padding:'14px 20px', marginBottom:0, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottomLeftRadius:0, borderBottomRightRadius:0, borderBottom:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button style={{ ...s.btn, ...s.btnGhost, padding:'6px 10px' }} onClick={prevWeek}><ChevronLeft size={16}/></button>
          <button style={{ ...s.btn, ...s.btnGhost, padding:'6px 14px', fontSize:12 }} onClick={goToday}>Today</button>
          <button style={{ ...s.btn, ...s.btnGhost, padding:'6px 10px' }} onClick={nextWeek}><ChevronRight size={16}/></button>
        </div>
        <span style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{monthLabel}</span>
        <span style={{ fontSize:12, color:'var(--text-secondary)' }}>
          {weekDays[0].toLocaleDateString('en-GB',{day:'2-digit',month:'short'})} – {weekDays[6].toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}
        </span>
      </div>

      {/* ── Grid ── */}
      <div style={{ ...s.card, borderTopLeftRadius:0, borderTopRightRadius:0, overflow:'hidden' }}>
        <div ref={gridRef} style={{ overflowX:'auto' }}>
          <div style={{ minWidth: s.ROOM_COL + s.CELL_W * 7 }}>

            {/* Header row */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--card-border)' }}>
              <div style={{ width:s.ROOM_COL, flexShrink:0, padding:'12px 16px', fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', position:'sticky', left:0, background:'var(--card-bg)', zIndex:2 }}>
                Room
              </div>
              {weekDays.map((day, i) => (
                <div key={i} style={{ width:s.CELL_W, flexShrink:0, padding:'10px 8px', textAlign:'center', borderLeft:'1px solid var(--card-border)', background: isToday(day) ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                  <div style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:600 }}>{DAYS[i]}</div>
                  <div style={{ fontSize:16, fontWeight:800, color: isToday(day) ? 'var(--primary)' : 'var(--text-primary)', marginTop:2 }}>{day.getDate()}</div>
                </div>
              ))}
            </div>

            {/* Room rows */}
            {filteredRooms.map((room) => {
              const roomBookings = visibleBookings.filter(b => b.roomId === room.id);
              return (
                <div key={room.id} style={{ display:'flex', borderBottom:'1px solid var(--card-border)', position:'relative', height: s.ROW_H }}>

                  {/* Room label — sticky */}
                  <div style={{ width:s.ROOM_COL, flexShrink:0, padding:'0 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', left:0, background:'var(--card-bg)', zIndex:2, borderRight:'1px solid var(--card-border)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background: TYPE_COLOR[room.type]||'var(--primary)', flexShrink:0 }}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{room.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-secondary)' }}>{room.type}</div>
                    </div>
                  </div>

                  {/* Day cells (click to create) */}
                  {weekDays.map((day, di) => {
                    const isDO = dragOver && dragOver.roomId === room.id && dragOver.date === toStr(day);
                    return (
                      <div key={di}
                        style={{ width:s.CELL_W, flexShrink:0, height:'100%', borderLeft:'1px solid var(--card-border)', cursor:'pointer', background: isDO ? 'rgba(99,102,241,0.15)' : isToday(day) ? 'rgba(99,102,241,0.04)' : 'transparent', transition:'background 0.1s' }}
                        onClick={() => openNewBooking(room.id, day)}
                        onDragOver={e => onDragOver(e, room.id, day)}
                        onDrop={e => onDrop(e, room.id, day)}
                      />
                    );
                  })}

                  {/* Booking blocks — absolutely positioned over cells */}
                  {roomBookings.map(booking => {
                    const { startIdx, span, meta } = getBlockStyle(booking, weekDays);
                    if (startIdx < 0 || span <= 0) return null;
                    const left = s.ROOM_COL + startIdx * s.CELL_W + 3;
                    const width = span * s.CELL_W - 6;
                    return (
                      <div key={booking.id}
                        draggable
                        onDragStart={e => onDragStart(e, booking)}
                        onDragEnd={onDragEnd}
                        onClick={e => openBooking(booking, e)}
                        onMouseEnter={e => setTooltip({ booking, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          position:'absolute', top:8, height: s.ROW_H - 16,
                          left, width,
                          background: meta.bg,
                          border: `1.5px solid ${meta.border}`,
                          borderRadius: 8,
                          display:'flex', alignItems:'center', padding:'0 10px', gap:6,
                          cursor:'grab', zIndex:3, overflow:'hidden',
                          boxShadow: `0 2px 8px ${meta.bg}`,
                          transition:'transform 0.1s, box-shadow 0.1s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow=`0 4px 16px ${meta.bg}`; }}
                        onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 2px 8px ${meta.bg}`; }}
                      >
                        <div style={{ width:6, height:6, borderRadius:'50%', background:meta.color, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:700, color:meta.color, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                          {booking.guestName}
                        </span>
                        {span > 1 && (
                          <span style={{ fontSize:10, color:meta.color, opacity:0.7, marginLeft:'auto', flexShrink:0 }}>
                            {span}n
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tooltip ── */}
      <AnimatePresence>
        {tooltip && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', left: tooltip.x+12, top: tooltip.y-10, zIndex:9999, pointerEvents:'none',
              background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:10, padding:'10px 14px',
              boxShadow:'var(--card-shadow)', minWidth:180 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:6, color:'var(--text-primary)' }}>{tooltip.booking.guestName}</div>
            <div style={{ fontSize:11, color:'var(--text-secondary)', display:'flex', flexDirection:'column', gap:3 }}>
              <span><CalIcon size={10} style={{ marginRight:4 }}/>{tooltip.booking.checkIn} → {tooltip.booking.checkOut}</span>
              <span><Clock size={10} style={{ marginRight:4 }}/>{diffDays(tooltip.booking.checkIn, tooltip.booking.checkOut)} night(s)</span>
              <span><CreditCard size={10} style={{ marginRight:4 }}/>{tooltip.booking.paymentStatus}</span>
              <span style={{ color: STATUS_META[tooltip.booking.status]?.color }}>● {STATUS_META[tooltip.booking.status]?.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            style={{ position:'fixed', bottom:28, right:28, zIndex:9999,
              background: toast.type==='error' ? '#ef4444' : toast.type==='warn' ? '#f59e0b' : '#10b981',
              color:'#fff', padding:'12px 20px', borderRadius:10, fontWeight:600, fontSize:13,
              boxShadow:'0 4px 20px rgba(0,0,0,0.3)', display:'flex', alignItems:'center', gap:8 }}>
            <Check size={14}/> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
              onClick={e => e.stopPropagation()}
              style={{ background:'var(--card-bg)', borderRadius:16, padding:28, width:'100%', maxWidth:480,
                border:'1px solid var(--card-border)', boxShadow:'0 24px 64px rgba(0,0,0,0.3)' }}>

              {/* Modal header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>
                  {modal.mode === 'new' ? 'New Booking' : 'Edit Booking'}
                </h2>
                <button onClick={() => setModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}>
                  <X size={18}/>
                </button>
              </div>

              {/* Status badge (edit mode) */}
              {modal.mode === 'edit' && (
                <div style={{ marginBottom:16 }}>
                  <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700,
                    background: STATUS_META[form.status]?.bg, color: STATUS_META[form.status]?.color,
                    border: `1px solid ${STATUS_META[form.status]?.border}` }}>
                    {STATUS_META[form.status]?.label}
                  </span>
                </div>
              )}

              {/* Form fields */}
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={s.label}><User size={11} style={{ marginRight:4 }}/>Guest Name *</label>
                  <input style={s.input} value={form.guestName} onChange={e => setForm(f=>({...f, guestName:e.target.value}))} placeholder="Full name"/>
                </div>
                <div>
                  <label style={s.label}><Home size={11} style={{ marginRight:4 }}/>Room *</label>
                  <select style={s.input} value={form.roomId} onChange={e => setForm(f=>({...f, roomId:e.target.value}))}>
                    {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={s.label}><CalIcon size={11} style={{ marginRight:4 }}/>Check-In *</label>
                    <input type="date" style={s.input} value={form.checkIn} onChange={e => setForm(f=>({...f, checkIn:e.target.value}))}/>
                  </div>
                  <div>
                    <label style={s.label}><CalIcon size={11} style={{ marginRight:4 }}/>Check-Out *</label>
                    <input type="date" style={s.input} value={form.checkOut} onChange={e => setForm(f=>({...f, checkOut:e.target.value}))}/>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={s.label}><CreditCard size={11} style={{ marginRight:4 }}/>Payment Status</label>
                    <select style={s.input} value={form.paymentStatus} onChange={e => setForm(f=>({...f, paymentStatus:e.target.value}))}>
                      {PAYMENT_OPTS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}><Filter size={11} style={{ marginRight:4 }}/>Status</label>
                    <select style={s.input} value={form.status} onChange={e => setForm(f=>({...f, status:e.target.value}))}>
                      {STATUS_OPTS.slice(1).map(s2 => <option key={s2}>{s2}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={s.label}>Notes</label>
                  <textarea style={{ ...s.input, resize:'vertical', minHeight:64 }} value={form.notes} onChange={e => setForm(f=>({...f, notes:e.target.value}))} placeholder="Optional notes..."/>
                </div>
              </div>

              {/* Error */}
              {formErr && (
                <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, fontSize:12, color:'#ef4444', display:'flex', alignItems:'center', gap:8 }}>
                  <AlertTriangle size={13}/> {formErr}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:'flex', gap:8, marginTop:20, flexWrap:'wrap' }}>
                <button style={{ ...s.btn, ...s.btnPrimary, flex:1 }} onClick={saveBooking}>
                  <Check size={13} style={{ marginRight:6 }}/> {modal.mode === 'new' ? 'Create Booking' : 'Save Changes'}
                </button>
                {modal.mode === 'edit' && form.status === 'confirmed' && (
                  <button style={{ ...s.btn, background:'rgba(59,130,246,0.15)', color:'#3b82f6' }}
                    onClick={() => checkInOut(form.id, 'checkin')}>
                    Check In
                  </button>
                )}
                {modal.mode === 'edit' && form.status === 'checked-in' && (
                  <button style={{ ...s.btn, background:'rgba(16,185,129,0.15)', color:'#10b981' }}
                    onClick={() => checkInOut(form.id, 'checkout')}>
                    Check Out
                  </button>
                )}
                {modal.mode === 'edit' && form.status !== 'cancelled' && (
                  <button style={{ ...s.btn, ...s.btnDanger }} onClick={() => cancelBooking(form.id)}>
                    Cancel Booking
                  </button>
                )}
                <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setModal(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>{/* end calendar column */}

      {/* ── Side Panel ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

        {/* Today's occupancy */}
        <div style={{ ...s.card, padding:'16px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Today's Occupancy</div>
          {(() => {
            const todayStr = toStr(today);
            const occupied = ROOMS.filter(r => bookings.some(b => ['confirmed','checked-in','pending'].includes(b.status) && b.roomId===r.id && b.checkIn<=todayStr && b.checkOut>todayStr)).length;
            const pct = Math.round((occupied/ROOMS.length)*100);
            return (
              <>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--primary)', marginBottom:4 }}>{pct}%</div>
                <div style={{ height:6, borderRadius:99, background:'var(--input-bg)', overflow:'hidden', marginBottom:8 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'var(--primary)', borderRadius:99 }}/>
                </div>
                <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{occupied} of {ROOMS.length} rooms occupied</div>
              </>
            );
          })()}
        </div>

        {/* Available rooms */}
        <div style={{ ...s.card, padding:'16px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Available Now</div>
          {(() => {
            const todayStr = toStr(today);
            return ROOMS.filter(r => !bookings.some(b => ['confirmed','checked-in'].includes(b.status) && b.roomId===r.id && b.checkIn<=todayStr && b.checkOut>todayStr))
              .map(r => (
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--card-border)' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{r.name}</div>
                    <div style={{ fontSize:10, color:'var(--text-secondary)' }}>{r.type}</div>
                  </div>
                </div>
              ));
          })()}
        </div>

        {/* Upcoming check-ins */}
        <div style={{ ...s.card, padding:'16px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Upcoming Check-ins</div>
          {bookings.filter(b => b.status==='confirmed' && b.checkIn >= toStr(today)).slice(0,4).map(b => (
            <div key={b.id} style={{ padding:'7px 0', borderBottom:'1px solid var(--card-border)' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.guestName}</div>
              <div style={{ fontSize:10, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                <LogIn size={10}/>{b.checkIn} · {ROOMS.find(r=>r.id===b.roomId)?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Block room */}
        <button style={{ ...s.btn, ...s.btnGhost, width:'100%', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}
          onClick={() => { setForm({...initForm(), status:'maintenance', guestName:'Maintenance Block'}); setFormErr(''); setModal({mode:'new'}); }}>
          🔧 Block Room
        </button>
      </div>

      </div>{/* end grid */}

    </div>
  );
}
