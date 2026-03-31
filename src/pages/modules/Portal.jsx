import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, LogIn, LogOut, Check, X, User, Home, Calendar, CreditCard, RefreshCw } from 'lucide-react';

const today = new Date().toISOString().slice(0,10);
const d = (n) => { const x = new Date(); x.setDate(x.getDate()+n); return x.toISOString().slice(0,10); };

const CHECKINS = [
  { id:'BK-1001', guest:'Alice Johnson',  phone:'+1 245-888-0001', room:'Suite 301',   checkIn:today, checkOut:d(4), status:'Pending',   paid:true  },
  { id:'BK-1002', guest:'Bob Smith',      phone:'+1 202-555-0158', room:'Deluxe 205',  checkIn:today, checkOut:d(3), status:'Pending',   paid:true  },
  { id:'BK-1003', guest:'Charlie Brown',  phone:'+1 515-321-7788', room:'Penthouse 401',checkIn:today,checkOut:d(5), status:'Pending',   paid:false },
  { id:'BK-1004', guest:'Diana Prince',   phone:'+1 415-982-3344', room:'Standard 102',checkIn:today, checkOut:d(2), status:'Checked-in',paid:true  },
];

const CHECKOUTS = [
  { id:'BK-0991', guest:'Ethan Hunt',     phone:'+1 650-111-9988', room:'Deluxe 208',  checkIn:d(-3), checkOut:today, status:'Pending',    bill:447  },
  { id:'BK-0992', guest:'Fiona Green',    phone:'+1 312-444-5566', room:'Standard 104',checkIn:d(-2), checkOut:today, status:'Pending',    bill:356  },
  { id:'BK-0993', guest:'George Clooney', phone:'+1 777-321-0000', room:'Suite 302',   checkIn:d(-4), checkOut:today, status:'Checked-out',bill:996  },
];

export default function Portal() {
  const [checkins, setCheckins]   = useState(CHECKINS);
  const [checkouts, setCheckouts] = useState(CHECKOUTS);
  const [search, setSearch]       = useState('');
  const [tab, setTab]             = useState('checkin');
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const doCheckin  = (id) => { setCheckins(c=>c.map(x=>x.id===id?{...x,status:'Checked-in'}:x)); showToast('Guest checked in successfully'); };
  const doCheckout = (id) => { setCheckouts(c=>c.map(x=>x.id===id?{...x,status:'Checked-out'}:x)); showToast('Guest checked out — bill generated'); };

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  const filterList = (list) => list.filter(x => !search || x.guest.toLowerCase().includes(search.toLowerCase()) || x.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Check-in / Check-out</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Manage today's guest arrivals and departures</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:"Today's Check-ins",  value: checkins.length,                                    color:'#10b981', icon: LogIn  },
          { label:'Already Checked In', value: checkins.filter(x=>x.status==='Checked-in').length, color:'#2563eb', icon: Check  },
          { label:"Today's Check-outs", value: checkouts.length,                                   color:'#f59e0b', icon: LogOut },
          { label:'Pending Checkout',   value: checkouts.filter(x=>x.status==='Pending').length,   color:'#dc2626', icon: User   },
        ].map((s,i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ ...card, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'10px 10px 0 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</span>
                <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}15`, display:'grid', placeItems:'center' }}><Icon size={15} color={s.color}/></div>
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div style={{ ...card, padding:'0 20px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex' }}>
          {[['checkin','Check-ins'],['checkout','Check-outs']].map(([k,l]) => (
            <button key={k} onClick={()=>setTab(k)} style={{ padding:'13px 18px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:tab===k?700:500, color:tab===k?'#2563eb':'var(--text-secondary)', borderBottom:tab===k?'2px solid #2563eb':'2px solid transparent', transition:'all 0.15s' }}>{l}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:6, padding:'6px 10px' }}>
          <Search size={13} color='var(--text-muted)'/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guest or booking ID..." style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:200 }}/>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--input-bg)', borderBottom:'1px solid var(--card-border)' }}>
              {(tab==='checkin'
                ? ['Booking ID','Guest Name','Phone','Room','Check-in','Check-out','Payment','Status','Action']
                : ['Booking ID','Guest Name','Phone','Room','Check-in','Check-out','Bill','Status','Action']
              ).map(h => <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(tab==='checkin' ? filterList(checkins) : filterList(checkouts)).map((row,i) => (
              <motion.tr key={row.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                style={{ borderBottom:'1px solid var(--card-border)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(37,99,235,0.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 14px', fontSize:12, fontWeight:700, color:'#2563eb' }}>{row.id}</td>
                <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{row.guest}</td>
                <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{row.phone}</td>
                <td style={{ padding:'12px 14px', fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{row.room}</td>
                <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{row.checkIn}</td>
                <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{row.checkOut}</td>
                <td style={{ padding:'12px 14px' }}>
                  {tab==='checkin'
                    ? <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:row.paid?'#d1fae5':'#fee2e2', color:row.paid?'#059669':'#dc2626' }}>{row.paid?'Paid':'Pending'}</span>
                    : <span style={{ fontSize:14, fontWeight:800, color:'#2563eb' }}>${row.bill}</span>
                  }
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700,
                    background: row.status==='Checked-in'||row.status==='Checked-out' ? '#d1fae5' : '#dbeafe',
                    color: row.status==='Checked-in'||row.status==='Checked-out' ? '#059669' : '#2563eb' }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  {tab==='checkin' && row.status==='Pending' && (
                    <button onClick={()=>doCheckin(row.id)} className="b24-btn b24-btn-primary" style={{ fontSize:12, padding:'6px 14px' }}>
                      <LogIn size={13}/> Check In
                    </button>
                  )}
                  {tab==='checkout' && row.status==='Pending' && (
                    <button onClick={()=>doCheckout(row.id)} className="b24-btn b24-btn-secondary" style={{ fontSize:12, padding:'6px 14px' }}>
                      <LogOut size={13}/> Check Out
                    </button>
                  )}
                  {(row.status==='Checked-in'||row.status==='Checked-out') && (
                    <span style={{ fontSize:12, color:'#059669', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}><Check size={13}/> Done</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'11px 18px', borderRadius:6, background:'#059669', color:'#fff', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
          <Check size={14}/> {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
