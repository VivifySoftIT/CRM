import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, AlertTriangle, BedDouble } from 'lucide-react';

const today = new Date().toISOString().slice(0,10);
const d = (n) => { const x = new Date(); x.setDate(x.getDate()+n); return x.toISOString().slice(0,10); };

const ROOMS = [
  { id:'r101', name:'Room 101', type:'Standard',  floor:1, rate:89,  status:'Available' },
  { id:'r102', name:'Room 102', type:'Standard',  floor:1, rate:89,  status:'Occupied'  },
  { id:'r201', name:'Room 201', type:'Deluxe',    floor:2, rate:149, status:'Available' },
  { id:'r202', name:'Room 202', type:'Deluxe',    floor:2, rate:149, status:'Available' },
  { id:'r301', name:'Suite 301',type:'Suite',     floor:3, rate:249, status:'Occupied'  },
  { id:'r401', name:'Penthouse',type:'Penthouse', floor:4, rate:499, status:'Available' },
];

const ROOM_TYPES = ['Standard','Deluxe','Suite','Penthouse'];

export default function Subscriptions() {
  const [form, setForm] = useState({ name:'', phone:'', checkIn:today, checkOut:d(1), guests:1, roomType:'Standard', roomId:'' });
  const [confirmed, setConfirmed] = useState(null);
  const [err, setErr] = useState('');

  const availableRooms = ROOMS.filter(r => r.type === form.roomType && r.status === 'Available');
  const selectedRoom = ROOMS.find(r => r.id === form.roomId) || availableRooms[0];
  const nights = Math.max(1, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000));
  const total = selectedRoom ? selectedRoom.rate * nights : 0;

  const submit = () => {
    if (!form.name.trim()) return setErr('Guest name is required');
    if (!form.phone.trim()) return setErr('Phone number is required');
    if (!selectedRoom) return setErr('No available rooms for selected type');
    if (form.checkIn >= form.checkOut) return setErr('Check-out must be after check-in');
    setErr('');
    setConfirmed({ ...form, roomName: selectedRoom.name, roomType: selectedRoom.type, nights, total, id:'BK-'+Date.now() });
  };

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  if (confirmed) return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        style={{ ...card, padding:32, maxWidth:480, width:'100%', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#d1fae5', display:'grid', placeItems:'center', margin:'0 auto 16px' }}>
          <Check size={32} color='#059669'/>
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px' }}>Booking Confirmed!</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 20px' }}>Walk-in booking created successfully</p>
        <div style={{ background:'var(--input-bg)', borderRadius:8, padding:'14px 16px', marginBottom:20, textAlign:'left' }}>
          {[['Booking ID',confirmed.id],['Guest',confirmed.name],['Room',confirmed.roomName],['Check-In',confirmed.checkIn],['Check-Out',confirmed.checkOut],['Nights',confirmed.nights],['Total',`$${confirmed.total}`]].map(([l,v],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:i<6?'1px solid var(--card-border)':'none', fontSize:13 }}>
              <span style={{ color:'var(--text-muted)' }}>{l}</span>
              <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="b24-btn b24-btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => { setConfirmed(null); setForm({ name:'', phone:'', checkIn:today, checkOut:d(1), guests:1, roomType:'Standard', roomId:'' }); }}>
          New Walk-in Booking
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Walk-in Booking</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Create instant booking for walk-in guests</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start' }}>
        {/* Form */}
        <div style={{ ...card, padding:'24px' }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:'0 0 18px' }}>Guest & Booking Details</h3>
          <div className="b24-row b24-row-2">
            <div className="b24-field"><label className="b24-label">Guest Name <span className="required">*</span></label>
              <input className="b24-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name"/></div>
            <div className="b24-field"><label className="b24-label">Phone <span className="required">*</span></label>
              <input className="b24-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 555-000-0000"/></div>
          </div>
          <div className="b24-row b24-row-2">
            <div className="b24-field"><label className="b24-label">Check-In</label>
              <input type="date" className="b24-input" value={form.checkIn} onChange={e=>setForm(f=>({...f,checkIn:e.target.value}))}/></div>
            <div className="b24-field"><label className="b24-label">Check-Out</label>
              <input type="date" className="b24-input" value={form.checkOut} onChange={e=>setForm(f=>({...f,checkOut:e.target.value}))}/></div>
          </div>
          <div className="b24-row b24-row-2">
            <div className="b24-field"><label className="b24-label">Room Type</label>
              <select className="b24-select" value={form.roomType} onChange={e=>setForm(f=>({...f,roomType:e.target.value,roomId:''}))}>
                {ROOM_TYPES.map(t=><option key={t}>{t}</option>)}
              </select></div>
            <div className="b24-field"><label className="b24-label">Guests</label>
              <input type="number" min={1} max={8} className="b24-input" value={form.guests} onChange={e=>setForm(f=>({...f,guests:Number(e.target.value)}))}/></div>
          </div>
          <div className="b24-field"><label className="b24-label">Select Room</label>
            {availableRooms.length === 0
              ? <div style={{ padding:'10px 12px', borderRadius:6, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:13, display:'flex', alignItems:'center', gap:8 }}><AlertTriangle size={14}/> No {form.roomType} rooms available</div>
              : <select className="b24-select" value={form.roomId || availableRooms[0]?.id} onChange={e=>setForm(f=>({...f,roomId:e.target.value}))}>
                  {availableRooms.map(r=><option key={r.id} value={r.id}>{r.name} — Floor {r.floor} — ${r.rate}/night</option>)}
                </select>
            }
          </div>
          {err && <div style={{ padding:'8px 12px', borderRadius:6, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:12, marginBottom:12 }}>{err}</div>}
          <button className="b24-btn b24-btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={submit}>
            <Plus size={14}/> Confirm Walk-in Booking
          </button>
        </div>

        {/* Price summary */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ ...card, padding:'18px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 14px' }}>Price Summary</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                ['Room Type', form.roomType],
                ['Rate/Night', selectedRoom ? `$${selectedRoom.rate}` : '—'],
                ['Nights', nights],
                ['Guests', form.guests],
              ].map(([l,v],i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom:'1px solid var(--card-border)' }}>
                  <span style={{ color:'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0', fontSize:16, fontWeight:800 }}>
                <span>Total</span>
                <span style={{ color:'#2563eb' }}>${total}</span>
              </div>
            </div>
          </div>

          {/* Available rooms */}
          <div style={{ ...card, padding:'18px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 12px' }}>Room Availability</h3>
            {ROOMS.filter(r=>r.type===form.roomType).map(r => (
              <div key={r.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--card-border)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:r.status==='Available'?'#10b981':'#ef4444', flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', flex:1 }}>{r.name}</span>
                <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10, background:r.status==='Available'?'#d1fae5':'#fee2e2', color:r.status==='Available'?'#059669':'#dc2626' }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
