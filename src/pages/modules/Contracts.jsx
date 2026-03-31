import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Plus, Check, Download, Eye, X, 
  DollarSign, Utensils, Flower2, Tv2, ShoppingCart, 
  Trash2, ArrowUpRight, History, MoreVertical, Search, Home
} from 'lucide-react';

const FOLIOS = [
  { id:'F001', guest: 'Alice Johnson',  room: 'Suite 301',   checkIn: '2026-03-22', checkOut: '2026-03-26', charges: [{ category: 'Room', desc: 'Room (4 nights × $249)', amount: 996, date: '2026-03-22' }, { category: 'Spa', desc: 'Spa Treatment', amount: 120, date: '2026-03-23' }, { category: 'F&B', desc: 'Room Service', amount: 85, date: '2026-03-24' }, { category: 'Mini Bar', desc: 'Mini Bar', amount: 45, date: '2026-03-24' }], payments: [{ date: '2026-03-22', method: 'Credit Card', amount: 996 }], status: 'Open' },
  { id:'F002', guest: 'Bob Smith',      room: 'Deluxe 205',  checkIn: '2026-03-19', checkOut: '2026-03-22', charges: [{ category: 'Room', desc: 'Room (3 nights × $149)', amount: 447, date: '2026-03-19' }, { category: 'F&B', desc: 'Breakfast', amount: 60, date: '2026-03-20' }], payments: [{ date: '2026-03-22', method: 'Cash', amount: 507 }], status: 'Settled' },
  { id:'F003', guest: 'Charlie Brown',  room: 'Penthouse 401', checkIn: '2026-03-22', checkOut: '2026-03-26', charges: [{ category: 'Room', desc: 'Room (4 nights × $499)', amount: 1996, date: '2026-03-22' }, { category: 'Service', desc: 'Butler Service', amount: 200, date: '2026-03-23' }, { category: 'F&B', desc: 'Champagne', amount: 150, date: '2026-03-24' }], payments: [{ date: '2026-03-22', method: 'Credit Card', amount: 1000 }], status: 'Open' },
  { id:'F004', guest: 'Diana Prince',   room: 'Standard 102', checkIn: '2026-03-18', checkOut: '2026-03-20', charges: [{ category: 'Room', desc: 'Room (2 nights × $89)', amount: 178, date: '2026-03-18' }], payments: [{ date: '2026-03-20', method: 'UPI', amount: 178 }], status: 'Settled' },
];

const SERVICE_CATEGORIES = [
  { name: 'Room Service', icon: Utensils,  color: '#ef4444' },
  { name: 'Spa & Wellness', icon: Flower2,   color: '#10b981' },
  { name: 'Mini Bar',     icon: ShoppingCart, color: '#f59e0b' },
  { name: 'Laundry',      icon: Tv2,      color: '#3b82f6' },
  { name: 'Transportation', icon: ArrowUpRight, color: '#6366f1' },
];

export default function Contracts() {
  const [folios, setFolios] = useState(FOLIOS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [chargeModal, setChargeModal] = useState(null); 
  const [payModal, setPayModal] = useState(null);
  
  const [newCharge, setNewCharge] = useState({ category: 'Room Service', desc: '', amount: '' });

  const getTotal = (f) => f.charges.reduce((a,c)=>a+c.amount,0);
  const getPaid  = (f) => f.payments.reduce((a,p)=>a+p.amount,0);
  const getPending = (f) => Math.max(0, getTotal(f) - getPaid(f));

  const addCharge = () => {
    if (!newCharge.amount || !newCharge.desc) return;
    setFolios(fs => fs.map(f => f.id === chargeModal.id ? { 
      ...f, 
      charges: [...f.charges, { ...newCharge, amount: Number(newCharge.amount), date: new Date().toISOString().slice(0,10) }],
      status: 'Open'
    } : f));
    setChargeModal(null);
    setNewCharge({ category: 'Room Service', desc: '', amount: '' });
  };

  const filteredFolios = folios.filter(f => f.guest.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase()) || f.room.toLowerCase().includes(search.toLowerCase()));

  const cardStyle = { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100%', padding: '0 4px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Billing & Folios</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '6px 0 0' }}>Manage live guest folios, add charges and track payment history</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '8px 18px', width: 340 }}>
             <Search size={16} color="var(--text-muted)" />
             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest, room or folio..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, width: '100%', color: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Receivables',   value: `$${folios.reduce((a, f) => a + getTotal(f), 0).toLocaleString()}`, color: '#2563eb', icon: DollarSign },
          { label: 'Payments Collected', value: `$${folios.reduce((a, f) => a + getPaid(f), 0).toLocaleString()}`,  color: '#10b981', icon: Check },
          { label: 'Pending Settlement', value: `$${folios.reduce((a, f) => a + getPending(f), 0).toLocaleString()}`, color: '#ef4444', icon: History },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'grid', placeItems: 'center' }}><s.icon size={22} color={s.color} /></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Folio Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {filteredFolios.map((f, i) => {
          const total = getTotal(f); const paid = getPaid(f); const pending = getPending(f);
          const pct = Math.round((paid / total) * 100);
          return (
            <motion.div key={f.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              style={{ ...cardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{f.guest}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Home size={14} /> {f.room} · <span style={{ fontWeight: 700 }}>{f.id}</span>
                  </div>
                </div>
                <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: f.status === 'Settled' ? '#d1fae5' : '#fee2e2', color: f.status === 'Settled' ? '#059669' : '#dc2626', textTransform: 'uppercase' }}>{f.status}</span>
              </div>

              <div style={{ padding: '24px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Check-in: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{f.checkIn}</span></div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Check-out: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{f.checkOut}</span></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '16px', background: 'var(--input-bg)', borderRadius: 14, border: '1px solid var(--card-border)', marginBottom: 20 }}>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Total</div>
                     <div style={{ fontSize: 17, fontWeight: 900 }}>${total}</div>
                   </div>
                   <div style={{ textAlign: 'center', borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)' }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Paid</div>
                     <div style={{ fontSize: 17, fontWeight: 900, color: '#059669' }}>${paid}</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Balance</div>
                     <div style={{ fontSize: 17, fontWeight: 900, color: pending > 0 ? '#ef4444' : '#059669' }}>${pending}</div>
                   </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8 }}>
                     <span>Settlement Progress</span>
                     <span>{pct}%</span>
                   </div>
                   <div style={{ height: 8, borderRadius: 99, background: 'var(--input-bg)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', background: '#059669', borderRadius: 99 }} />
                   </div>
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10, background: 'var(--bg-darker)' }}>
                <button onClick={() => setSelected(f)} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, height: 40 }}><Eye size={15} /> Details</button>
                <button onClick={() => setChargeModal(f)} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, height: 40, background: 'rgba(59,130,246,0.08)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.2)' }}><Plus size={15} /> Add Charge</button>
                {pending > 0 && (
                  <button onClick={() => setPayModal(f)} className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, height: 40 }}><DollarSign size={15} /> Settle</button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charge Modal */}
      <AnimatePresence>
        {chargeModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setChargeModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%', border: '1px solid var(--card-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Post New Charge</h3>
                <button onClick={() => setChargeModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div className="b24-field">
                   <label className="b24-label" style={{ fontSize: 13, marginBottom: 8 }}>Category</label>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      {SERVICE_CATEGORIES.map(cat => (
                        <button key={cat.name} onClick={() => setNewCharge({ ...newCharge, category: cat.name })}
                          style={{ 
                            padding: '12px 6px', borderRadius: 10, border: `1px solid ${newCharge.category === cat.name ? cat.color : 'var(--card-border)'}`, 
                            background: newCharge.category === cat.name ? `${cat.color}10` : 'var(--input-bg)',
                            color: newCharge.category === cat.name ? cat.color : 'var(--text-secondary)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s'
                          }}>
                           <cat.icon size={20} />
                           <span style={{ fontSize: 10, fontWeight: 800, textAlign: 'center' }}>{cat.name}</span>
                        </button>
                      ))}
                   </div>
                 </div>

                 <div className="b24-field">
                   <label className="b24-label" style={{ fontSize: 13, marginBottom: 8 }}>Description / Item Name</label>
                   <input className="b24-input" style={{ height: 44, fontSize: 14 }} value={newCharge.desc} onChange={e => setNewCharge({ ...newCharge, desc: e.target.value })} placeholder="e.g. Club Sandwich & Soda" />
                 </div>

                 <div className="b24-field">
                   <label className="b24-label" style={{ fontSize: 13, marginBottom: 8 }}>Amount ($)</label>
                   <div style={{ position: 'relative' }}>
                     <DollarSign size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     <input type="number" className="b24-input" style={{ paddingLeft: 38, height: 44, fontSize: 14 }} value={newCharge.amount} onChange={e => setNewCharge({ ...newCharge, amount: e.target.value })} placeholder="0.00" />
                   </div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 48, fontSize: 14 }} onClick={() => setChargeModal(null)}>Cancel</button>
                <button className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center', height: 48, fontSize: 14 }} onClick={addCharge} disabled={!newCharge.amount || !newCharge.desc}>
                  <Check size={18} /> Post Charge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card-bg)', borderRadius: 20, padding: 40, maxWidth: 640, width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--card-border)', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{selected.guest}</h3>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Folio Ledger: <span style={{ fontWeight: 800 }}>{selected.id}</span></div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><X size={28} /></button>
              </div>

              {/* Ledger Table */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--card-border)' }}>Itemized Charges</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {selected.charges.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i === selected.charges.length - 1 ? 'none' : '1px solid var(--card-border)' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{c.desc}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{c.date} · {c.category}</div>
                      </div>
                      <span style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: 17 }}>${c.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '2px solid var(--card-border)', marginTop: 12, fontSize: 22, fontWeight: 900 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Folio Charges</span>
                  <span style={{ color: '#2563eb' }}>${getTotal(selected).toLocaleString()}</span>
                </div>
              </div>

              {/* Payments Section */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--card-border)' }}>Payment History</div>
                {selected.payments.length > 0 ? (
                  selected.payments.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i === selected.payments.length - 1 ? 'none' : '1px solid var(--card-border)', fontSize: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                         <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d1fae5', display: 'grid', placeItems: 'center' }}><Check size={18} color="#059669" /></div>
                         <div>
                            <div style={{ fontWeight: 800 }}>{p.method}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.date}</div>
                         </div>
                      </div>
                      <span style={{ fontWeight: 900, color: '#059669', fontSize: 17 }}>+ ${p.amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, background: 'var(--input-bg)', borderRadius: 12 }}>No payments recorded yet</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <button className="b24-btn b24-btn-secondary" style={{ flex: 1, height: 52, justifyContent: 'center', fontSize: 15 }} onClick={() => window.print()}><Download size={18} /> Generate Folio PDF</button>
                <button className="b24-btn b24-btn-primary" style={{ flex: 1, height: 52, justifyContent: 'center', fontSize: 15 }} onClick={() => setSelected(null)}>Close View</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
