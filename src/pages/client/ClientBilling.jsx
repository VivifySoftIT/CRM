import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Download, Eye, X, Check, AlertCircle, DollarSign,
  Clock, Search, Filter, RefreshCw, CheckCircle2, AlertTriangle,
  Receipt, Calendar, User, Mail, ChevronDown, Smartphone,
  Building2, History, FileText, Plus, ArrowUpRight, Printer,
  ChevronLeft, ChevronRight, Bell, TrendingUp, Zap, Shield,
  MapPin, Phone, Hash, Tag, BarChart2, ArrowDown
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────
const today = new Date();
const dStr = (offset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const fmt = (n) => n === 0 ? 'Free' : `$${Number(n).toFixed(2)}`;
const PAGE_SIZE = 4;

// ── Data ─────────────────────────────────────────────────────────────────────
const INVOICES = [
  {
    id: 'INV-2401', title: 'CRM Pro Plan — Monthly Subscription',
    amount: 1149.00, subtotal: 1026.79, tax: 122.21,
    status: 'Pending', issued: dStr(-6), due: dStr(2),
    method: null, billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [
      { desc: 'CRM Pro License (5 users × $149/mo)', qty: 5, rate: 149,   total: 745   },
      { desc: 'Advanced Analytics Add-on',           qty: 1, rate: 199,   total: 199   },
      { desc: 'Priority Support Package',            qty: 1, rate: 82.79, total: 82.79 },
    ],
    payments: [],
  },
  {
    id: 'INV-2398', title: 'Sales Automation & Workflow Setup',
    amount: 3540.00, subtotal: 3160.71, tax: 379.29,
    status: 'Overdue', issued: dStr(-14), due: dStr(-3),
    method: null, billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [
      { desc: 'Automation Workflow Design (8 hrs)',  qty: 8,  rate: 220,   total: 1760   },
      { desc: 'Lead Scoring Model Configuration',   qty: 1,  rate: 850,   total: 850    },
      { desc: 'CRM Data Migration & Import',        qty: 1,  rate: 550.71, total: 550.71 },
    ],
    payments: [],
  },
  {
    id: 'INV-2390', title: 'Business Consulting — Q1 Strategy',
    amount: 2250.00, subtotal: 2008.93, tax: 241.07,
    status: 'Paid', issued: dStr(-10), due: dStr(-5),
    method: 'Credit Card', billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [
      { desc: 'Sales Pipeline Audit (3 hrs)',        qty: 3, rate: 280,   total: 840   },
      { desc: 'CRM Strategy Workshop (half-day)',    qty: 1, rate: 900,   total: 900   },
      { desc: 'Custom Report & KPI Dashboard Build', qty: 1, rate: 268.93, total: 268.93 },
    ],
    payments: [{ date: dStr(-5), amount: 2250.00, method: 'Credit Card', txnId: 'TXN-8821' }],
  },
  {
    id: 'INV-2385', title: 'API Integration — Third-Party Connector',
    amount: 980.00, subtotal: 875.00, tax: 105.00,
    status: 'Paid', issued: dStr(-18), due: dStr(-12),
    method: 'Net Banking', billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [
      { desc: 'Zapier / Webhook Integration Setup', qty: 1, rate: 450, total: 450 },
      { desc: 'REST API Custom Connector (5 hrs)',   qty: 5, rate: 85,  total: 425 },
    ],
    payments: [{ date: dStr(-12), amount: 980.00, method: 'Net Banking', txnId: 'TXN-8790' }],
  },
  {
    id: 'INV-2380', title: 'Onboarding & Team Training Package',
    amount: 0, subtotal: 0, tax: 0,
    status: 'Paid', issued: dStr(-22), due: dStr(-22),
    method: 'Complimentary', billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [{ desc: 'Onboarding Session (Complimentary — Annual Plan)', qty: 1, rate: 0, total: 0 }],
    payments: [{ date: dStr(-22), amount: 0, method: 'Complimentary', txnId: 'TXN-COMP' }],
  },
  {
    id: 'INV-2375', title: 'Email Marketing Module — Setup',
    amount: 760.00, subtotal: 678.57, tax: 81.43,
    status: 'Pending', issued: dStr(-3), due: dStr(7),
    method: null, billingAddress: '320 Commerce Blvd, Suite 12, Austin, TX 78701',
    client: 'Sophia Bennett', email: 'sophia@nexatech.io', phone: '+1 512 555 0192',
    items: [
      { desc: 'Email Campaign Template Design (×5)', qty: 5, rate: 95,   total: 475   },
      { desc: 'Drip Sequence Automation Setup',      qty: 1, rate: 203.57, total: 203.57 },
    ],
    payments: [],
  },
];

const STATUS_META = {
  Paid:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle2,  label: 'Paid'    },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', icon: Clock,         label: 'Pending' },
  Overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  icon: AlertTriangle, label: 'Overdue' },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status] || { color:'#94a3b8', bg:'transparent', border:'#94a3b8', icon: AlertCircle, label: status };
  const Icon = m.icon;
  return (
    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
      background:m.bg, color:m.color, border:`1px solid ${m.border}`,
      display:'inline-flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
      <Icon size={11}/>{m.label}
    </span>
  );
}

// ── Invoice Detail Modal ──────────────────────────────────────────────────────
function InvoiceModal({ invoice, onClose, onPay }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:1001,
        display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:20, width:'100%', maxWidth:640,
          maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.45)',
          border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--card-border)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'linear-gradient(135deg,var(--bg-darker),var(--card-bg))' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.12)',
                display:'grid', placeItems:'center' }}>
                <Receipt size={16} color='var(--primary)'/>
              </div>
              <div>
                <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{invoice.id}</h3>
                <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'1px 0 0' }}>{invoice.title}</p>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <StatusBadge status={invoice.status}/>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--card-border)',
              background:'transparent', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-muted)' }}>
              <X size={14}/>
            </button>
          </div>
        </div>

        <div style={{ padding:24 }}>
          {/* Dates row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
            {[
              { label:'Issue Date',   val:invoice.issued, icon:Calendar, color:'var(--primary)' },
              { label:'Due Date',     val:invoice.due, icon:Clock, color: invoice.status==='Overdue'?'#ef4444':'#f59e0b' },
              { label:'Payment Method', val:invoice.method||'Pending', icon:CreditCard, color:'var(--text-secondary)' },
            ].map((d,i) => (
              <div key={i} style={{ padding:'12px 14px', borderRadius:10, background:'var(--input-bg)',
                border:'1px solid var(--card-border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <d.icon size={12} color={d.color}/>
                  <span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{d.label}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{d.val}</div>
              </div>
            ))}
          </div>

          {/* Billing info */}
          <div style={{ padding:'14px 16px', borderRadius:12, background:'var(--input-bg)',
            border:'1px solid var(--card-border)', marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase',
              letterSpacing:'0.05em', marginBottom:10 }}>Billing Information</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { icon:User,   val:invoice.client },
                { icon:Mail,   val:invoice.email },
                { icon:Phone,  val:invoice.phone },
                { icon:MapPin, val:invoice.billingAddress },
              ].map((r,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-secondary)' }}>
                  <r.icon size={13} color='var(--primary)'/>{r.val}
                </div>
              ))}
            </div>
          </div>

          {/* Items table */}
          <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--card-border)', marginBottom:20 }}>
            <div style={{ background:'var(--input-bg)', padding:'10px 16px',
              display:'grid', gridTemplateColumns:'1fr 60px 80px 80px', gap:8 }}>
              {['Description','Qty','Rate','Total'].map(h => (
                <div key={h} style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)',
                  textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
              ))}
            </div>
            {invoice.items.map((item, i) => (
              <div key={i} style={{ padding:'11px 16px', borderTop:'1px solid var(--card-border)',
                display:'grid', gridTemplateColumns:'1fr 60px 80px 80px', gap:8, alignItems:'center' }}>
                <div style={{ fontSize:13, color:'var(--text-primary)' }}>{item.desc}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{item.qty}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{fmt(item.rate)}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{fmt(item.total)}</div>
              </div>
            ))}

            {/* Totals */}
            <div style={{ background:'var(--bg-darker)', padding:'12px 16px', borderTop:'2px solid var(--card-border)' }}>
              {[
                { label:'Subtotal', val:fmt(invoice.subtotal) },
                { label:'Tax (12%)', val:fmt(invoice.tax) },
              ].map((r,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13,
                  color:'var(--text-secondary)', marginBottom:6 }}>
                  <span>{r.label}</span><span>{r.val}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:900,
                color:'var(--text-primary)', paddingTop:8, borderTop:'1px solid var(--card-border)', marginTop:4 }}>
                <span>Total</span><span style={{ color:'var(--primary)' }}>{fmt(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment records */}
          {invoice.payments.length > 0 && (
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(16,185,129,0.06)',
              border:'1px solid rgba(16,185,129,0.2)', marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#10b981', textTransform:'uppercase',
                letterSpacing:'0.05em', marginBottom:10 }}>Payment Confirmed</div>
              {invoice.payments.map((p, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                  <div style={{ color:'var(--text-secondary)' }}>
                    <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{p.txnId}</span> · {p.method} · {p.date}
                  </div>
                  <div style={{ fontWeight:800, color:'#10b981', fontSize:15 }}>{fmt(p.amount)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display:'flex', gap:10 }}>
            <button style={{ flex:1, padding:'11px', borderRadius:9, border:'1px solid var(--card-border)',
              background:'var(--input-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:600,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              <Download size={14}/> Download PDF
            </button>
            <button style={{ flex:1, padding:'11px', borderRadius:9, border:'1px solid var(--card-border)',
              background:'var(--input-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:600,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              <Printer size={14}/> Print
            </button>
            {invoice.status !== 'Paid' && (
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => onPay(invoice)}
                style={{ flex:2, padding:'11px', borderRadius:9, border:'none',
                  background:'var(--primary)', color:'#fff', fontSize:13, fontWeight:700,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                  boxShadow:'0 4px 16px rgba(99,102,241,0.3)' }}>
                <CreditCard size={14}/> Pay Now — {fmt(invoice.amount)}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ invoice, onClose, onSuccess }) {
  const [method, setMethod] = useState('Credit Card');
  const [paying, setPaying] = useState(false);
  const [done, setDone]     = useState(false);
  const [txnId, setTxnId]   = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry]   = useState('');
  const [cvv, setCvv]         = useState('');
  const [upiId, setUpiId]     = useState('');
  const [bank, setBank]       = useState('HDFC Bank');

  const confirm = () => {
    setPaying(true);
    const id = 'TXN-' + Math.random().toString(36).slice(2,8).toUpperCase();
    setTimeout(() => { setPaying(false); setDone(true); setTxnId(id); }, 2000);
  };

  const finish = () => { onSuccess(invoice.id, method, txnId); onClose(); };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.65)', zIndex:1002,
        display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={done ? undefined : onClose}>
      <motion.div initial={{ scale:0.95, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:20, width:'100%', maxWidth:440,
          boxShadow:'0 32px 80px rgba(0,0,0,0.45)', border:'1px solid var(--card-border)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--card-border)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'var(--bg-darker)' }}>
          <div>
            <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:0 }}>
              {done ? '🎉 Payment Successful' : 'Complete Payment'}
            </h3>
            <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'2px 0 0' }}>{invoice.id} · {invoice.title}</p>
          </div>
          {!done && <button onClick={onClose} style={{ background:'transparent', border:'none',
            cursor:'pointer', color:'var(--text-muted)', display:'grid', placeItems:'center' }}><X size={15}/></button>}
        </div>

        <div style={{ padding:22 }}>
          {done ? (
            /* Success Screen */
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              style={{ textAlign:'center', padding:'16px 0' }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.1 }}
                style={{ width:72, height:72, borderRadius:'50%', background:'rgba(16,185,129,0.12)',
                  display:'grid', placeItems:'center', margin:'0 auto 16px',
                  border:'3px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle2 size={36} color='#10b981'/>
              </motion.div>
              <div style={{ fontSize:26, fontWeight:900, color:'var(--text-primary)', marginBottom:4 }}>{fmt(invoice.amount)}</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>Payment processed successfully</div>
              <div style={{ padding:'14px 16px', borderRadius:12, background:'var(--input-bg)',
                border:'1px solid var(--card-border)', textAlign:'left', marginBottom:20 }}>
                {[
                  { label:'Transaction ID', val:txnId },
                  { label:'Method',        val:method },
                  { label:'Amount',        val:fmt(invoice.amount) },
                  { label:'Status',        val:'Confirmed ✓' },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13,
                    color:'var(--text-secondary)', marginBottom:i<3?8:0 }}>
                    <span>{r.label}</span>
                    <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{r.val}</span>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={finish}
                style={{ width:'100%', padding:13, borderRadius:9, border:'none',
                  background:'#10b981', color:'#fff', fontWeight:700, fontSize:14,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Check size={16}/> Done
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Amount box */}
              <div style={{ padding:'14px 18px', borderRadius:12,
                background:'linear-gradient(135deg,#1e293b,#0f172a)',
                border:'1px solid rgba(99,102,241,0.3)', marginBottom:18,
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:10, color:'var(--primary)', fontWeight:600, marginBottom:2 }}>Amount Due</div>
                  <div style={{ fontSize:24, fontWeight:900, color:'var(--primary)' }}>{fmt(invoice.amount)}</div>
                </div>
                <div style={{ textAlign:'right', fontSize:12, color:'rgba(99,102,241,0.7)' }}>
                  <div>Due: {invoice.due}</div>
                </div>
              </div>

              {/* Method tabs */}
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:8,
                textTransform:'uppercase', letterSpacing:'0.05em' }}>Payment Method</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
                {[
                  { id:'Credit Card', icon:CreditCard,  label:'Card'        },
                  { id:'UPI',         icon:Smartphone,  label:'UPI'         },
                  { id:'Net Banking', icon:Building2,   label:'Net Banking' },
                ].map(m => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)}
                      style={{ padding:'10px 8px', borderRadius:8,
                        border:`2px solid ${active?'var(--primary)':'var(--card-border)'}`,
                        background:active?'rgba(99,102,241,0.1)':'var(--card-bg)',
                        cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center',
                        gap:5, transition:'all 0.15s' }}>
                      <Icon size={18} color={active?'var(--primary)':'var(--text-muted)'}/>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:active?'var(--primary)':'var(--text-secondary)' }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card fields */}
              {(method==='Credit Card'||method==='Debit Card') && (
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:4 }}>Card Number</label>
                    <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="1234 5678 9012 3456"
                      className="b24-input"/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:4 }}>Expiry</label>
                      <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" className="b24-input"/>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:4 }}>CVV</label>
                      <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="•••" type="password" maxLength={4} className="b24-input"/>
                    </div>
                  </div>
                </div>
              )}

              {method==='UPI' && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:4 }}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="b24-input" style={{ marginBottom:8 }}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {['GPay','PhonePe','Paytm'].map(app => (
                      <button key={app} onClick={() => setUpiId(app.toLowerCase()+'@upi')}
                        style={{ padding:'8px', borderRadius:7, border:'1px solid var(--card-border)',
                          background:'var(--input-bg)', fontSize:12, fontWeight:600,
                          color:'var(--text-primary)', cursor:'pointer' }}>{app}</button>
                    ))}
                  </div>
                </div>
              )}

              {method==='Net Banking' && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:4 }}>Select Bank</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="b24-select">
                    {['HDFC Bank','ICICI Bank','SBI','Axis Bank','Kotak Bank'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {/* SSL note */}
              <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11,
                color:'var(--text-muted)', marginBottom:14, padding:'8px 12px',
                borderRadius:8, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)' }}>
                <Shield size={13} color='#10b981'/>
                256-bit SSL encrypted · Your payment information is secure
              </div>

              <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                onClick={confirm} disabled={paying}
                style={{ width:'100%', padding:13, borderRadius:9, border:'none',
                  background:paying?'rgba(99,102,241,0.4)':'var(--primary)',
                  color:paying?'rgba(255,255,255,0.6)':'#fff',
                  fontWeight:700, fontSize:14, cursor:paying?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  boxShadow:'0 4px 18px rgba(99,102,241,0.3)' }}>
                {paying ? (
                  <><motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.8, ease:'linear' }}
                    style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/>
                    Processing…</>
                ) : (
                  <><CreditCard size={15}/> Confirm Payment — {fmt(invoice.amount)}</>
                )}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type='success' }) {
  const colors = { success:{ bg:'#10b981', icon:Check }, error:{ bg:'#ef4444', icon:AlertCircle } };
  const cfg = colors[type] || colors.success;
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity:0, y:20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20 }}
      style={{ position:'fixed', bottom:28, right:28, zIndex:9999, background:cfg.bg,
        color:'#fff', padding:'13px 20px', borderRadius:10, fontWeight:600, fontSize:13,
        display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 24px rgba(0,0,0,0.25)', maxWidth:380 }}>
      <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,0.2)',
        display:'grid', placeItems:'center', flexShrink:0 }}><Icon size={13}/></div>
      {msg}
    </motion.div>
  );
}

// ── Alert Banner ──────────────────────────────────────────────────────────────
function AlertBanner({ invoices }) {
  const overdue = invoices.filter(i => i.status === 'Overdue');
  const upcoming = invoices.filter(i => i.status === 'Pending');
  if (overdue.length === 0 && upcoming.length === 0) return null;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
      {overdue.length > 0 && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          style={{ padding:'12px 16px', borderRadius:10, background:'rgba(239,68,68,0.08)',
            border:'1px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', gap:10 }}>
          <AlertTriangle size={16} color='#ef4444'/>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#ef4444' }}>
              {overdue.length} Overdue Invoice{overdue.length>1?'s':''}
            </span>
          </div>
          <Bell size={14} color='#ef4444'/>
        </motion.div>
      )}
      {upcoming.length > 0 && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.08)',
            border:'1px solid rgba(245,158,11,0.25)', display:'flex', alignItems:'center', gap:10 }}>
          <Clock size={16} color='#f59e0b'/>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#f59e0b' }}>
              {upcoming.length} Upcoming Payment{upcoming.length>1?'s':''}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ClientBilling() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState('All');
  const [viewInv, setViewInv]   = useState(null);
  const [payInv, setPayInv]     = useState(null);
  const [toast, setToast]       = useState(null);
  const [page, setPage]         = useState(1);
  const [activeTab, setActiveTab] = useState('invoices'); // invoices | history

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handlePaySuccess = (id, method, txnId) => {
    setInvoices(is => is.map(i => i.id === id ? {
      ...i, status:'Paid', method,
      payments: [...(i.payments||[]), {
        date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
        amount:i.amount, method, txnId
      }]
    } : i));
    showToast(`Payment confirmed! Transaction ID: ${txnId}`);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter(inv => {
      const matchQ = !q || inv.id.toLowerCase().includes(q) || inv.title.toLowerCase().includes(q);
      const matchS = statusF === 'All' || inv.status === statusF;
      return matchQ && matchS;
    });
  }, [invoices, search, statusF]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Reset page when filters change
  const setFilter = (f) => { setStatusF(f); setPage(1); };
  const setSearchVal = (v) => { setSearch(v); setPage(1); };

  // Stats
  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((a,i) => a+i.amount, 0);
  const paidAmt     = invoices.filter(i => i.status === 'Paid').reduce((a,i) => a+i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const upcomingAmt  = invoices.filter(i => i.status === 'Pending').reduce((a,i) => a+i.amount, 0);

  const allPayments = invoices.flatMap(i =>
    (i.payments||[]).map(p => ({ ...p, invoiceId:i.id, title:i.title }))
  );

  const card = {
    background:'var(--card-bg)',
    borderRadius:16,
    border:'1px solid var(--card-border)',
    boxShadow:'var(--card-shadow)',
  };

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>

      {/* Page header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', margin:0,
              fontFamily:"'Outfit',sans-serif" }}>Billing &amp; Payments</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>
              Manage your invoices, track payments, and view financial history
            </p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ padding:'8px 14px', borderRadius:8, border:'1px solid var(--card-border)',
              background:'var(--card-bg)', color:'var(--text-secondary)', fontSize:12, fontWeight:600,
              cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <Download size={13}/> Export
            </button>
          </div>
        </div>
      </div>


      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Outstanding',     value:fmt(outstanding), color:'#ef4444', bg:'rgba(239,68,68,0.1)',  icon:AlertCircle,   sub:`${invoices.filter(i=>i.status!=='Paid').length} unpaid` },
          { label:'Paid Amount',     value:fmt(paidAmt),     color:'#10b981', bg:'rgba(16,185,129,0.1)', icon:CheckCircle2,  sub:`${invoices.filter(i=>i.status==='Paid').length} settled` },
          { label:'Overdue',         value:overdueCount,     color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:AlertTriangle, sub: overdueCount>0?'Needs attention':'All clear' },
          { label:'Upcoming Due',    value:fmt(upcomingAmt), color:'#6366f1', bg:'rgba(99,102,241,0.1)', icon:TrendingUp,    sub:`${invoices.filter(i=>i.status==='Pending').length} pending` },
        ].map((s,i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} whileHover={{ y:-3, boxShadow:`0 20px 40px ${s.color}18` }}
              transition={{ duration:0.18 }}
              style={{ ...card, padding:'20px', position:'relative', overflow:'hidden',
                borderTop:`3px solid ${s.color}`,
                background:'linear-gradient(145deg,var(--card-bg),var(--bg-darker))' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:s.bg,
                  display:'grid', placeItems:'center' }}>
                  <Icon size={18} color={s.color}/>
                </div>
                <ArrowUpRight size={13} color={s.color} style={{ opacity:0.4 }}/>
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:'var(--text-primary)', marginBottom:2 }}>{s.value}</div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase',
                letterSpacing:'0.04em', marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:18, background:'var(--card-bg)',
        border:'1px solid var(--card-border)', borderRadius:10, padding:4, width:'fit-content' }}>
        {[
          { id:'invoices', icon:Receipt,  label:'Invoices' },
          { id:'history',  icon:History,  label:'Payment History' },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding:'7px 16px', borderRadius:7, border:'none',
                background:active?'var(--primary)':'transparent',
                color:active?'#fff':'var(--text-secondary)',
                fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
                transition:'all 0.15s' }}>
              <Icon size={13}/>{t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'invoices' && (
        <>
          {/* Filter bar */}
          <div style={{ ...card, padding:'12px 16px', marginBottom:16,
            display:'flex', gap:10, alignItems:'center', flexWrap:'wrap',
            background:'var(--bg-darker)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--input-bg)',
              border:'1px solid var(--input-border)', borderRadius:8, padding:'7px 12px', flex:1, minWidth:220 }}>
              <Search size={13} color='var(--text-muted)'/>
              <input value={search} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search by ID or description…"
                style={{ background:'transparent', border:'none', color:'var(--text-primary)',
                  outline:'none', fontSize:13, width:'100%' }}/>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['All','Paid','Pending','Overdue'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding:'6px 13px', borderRadius:7,
                    border:`1px solid ${statusF===f?'var(--primary)':'var(--card-border)'}`,
                    background:statusF===f?'var(--primary)':'var(--card-bg)',
                    color:statusF===f?'#fff':'var(--text-secondary)',
                    fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.12s' }}>
                  {f}
                </button>
              ))}
            </div>
            {(search || statusF!=='All') && (
              <button onClick={() => { setSearchVal(''); setFilter('All'); }}
                style={{ padding:'6px 11px', borderRadius:7, border:'1px solid var(--card-border)',
                  background:'var(--input-bg)', color:'var(--text-secondary)', fontSize:12,
                  cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                <RefreshCw size={11}/> Reset
              </button>
            )}
            <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:'auto' }}>
              {filtered.length} invoice{filtered.length!==1?'s':''}
            </span>
          </div>

          {/* Invoice table */}
          <div style={{ ...card, overflow:'hidden', marginBottom:14 }}>
            {paginated.length === 0 ? (
              <div style={{ padding:'70px 20px', textAlign:'center' }}>
                <div style={{ width:60, height:60, borderRadius:14, background:'var(--input-bg)',
                  display:'grid', placeItems:'center', margin:'0 auto 14px' }}>
                  <Receipt size={26} color='var(--text-muted)'/>
                </div>
                <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:'0 0 5px' }}>No invoices found</p>
                <p style={{ fontSize:13, color:'var(--text-muted)', margin:0 }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:780 }}>
                  <thead>
                    <tr style={{ background:'var(--input-bg)', borderBottom:'1px solid var(--card-border)' }}>
                      {['Invoice ID','Description','Amount','Status','Issue Date','Due Date','Actions'].map(h => (
                        <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:10,
                          fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase',
                          letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((inv, i) => (
                      <motion.tr key={inv.id}
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:i*0.04 }}
                        style={{ borderBottom:'1px solid var(--card-border)', transition:'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--input-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'12px 14px', fontSize:12, fontWeight:800,
                          color:'var(--primary)', whiteSpace:'nowrap' }}>{inv.id}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{inv.title}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>
                            {inv.items.length} item{inv.items.length!==1?'s':''}
                          </div>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:15, fontWeight:800,
                          color:'var(--text-primary)', whiteSpace:'nowrap' }}>{fmt(inv.amount)}</td>
                        <td style={{ padding:'12px 14px' }}><StatusBadge status={inv.status}/></td>
                        <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{inv.issued}</td>
                        <td style={{ padding:'12px 14px', fontSize:12, whiteSpace:'nowrap',
                          color:inv.status==='Overdue'?'#ef4444':'var(--text-secondary)',
                          fontWeight:inv.status==='Overdue'?700:400 }}>{inv.due}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                            <button onClick={() => setViewInv(inv)} title="View"
                              style={{ width:30, height:30, borderRadius:6,
                                border:'1px solid rgba(99,102,241,0.3)',
                                background:'rgba(99,102,241,0.08)',
                                display:'grid', placeItems:'center', cursor:'pointer',
                                color:'var(--primary)' }}>
                              <Eye size={13}/>
                            </button>
                            <button title="Download"
                              style={{ width:30, height:30, borderRadius:6,
                                border:'1px solid var(--card-border)', background:'var(--input-bg)',
                                display:'grid', placeItems:'center', cursor:'pointer',
                                color:'var(--text-secondary)' }}>
                              <Download size={13}/>
                            </button>
                            {inv.status !== 'Paid' && (
                              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                                onClick={() => setPayInv(inv)}
                                style={{ padding:'5px 11px', borderRadius:6, border:'none',
                                  background:'var(--primary)', color:'#fff', fontSize:11,
                                  fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                                  display:'flex', alignItems:'center', gap:4 }}>
                                <CreditCard size={11}/> Pay Now
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ width:32, height:32, borderRadius:7, border:'1px solid var(--card-border)',
                  background:'var(--card-bg)', color:page===1?'var(--text-muted)':'var(--text-primary)',
                  display:'grid', placeItems:'center', cursor:page===1?'not-allowed':'pointer' }}>
                <ChevronLeft size={14}/>
              </button>
              {Array.from({ length:totalPages }, (_,i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width:32, height:32, borderRadius:7,
                    border:`1px solid ${page===p?'var(--primary)':'var(--card-border)'}`,
                    background:page===p?'var(--primary)':'var(--card-bg)',
                    color:page===p?'#fff':'var(--text-secondary)',
                    fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ width:32, height:32, borderRadius:7, border:'1px solid var(--card-border)',
                  background:'var(--card-bg)', color:page===totalPages?'var(--text-muted)':'var(--text-primary)',
                  display:'grid', placeItems:'center', cursor:page===totalPages?'not-allowed':'pointer' }}>
                <ChevronRight size={14}/>
              </button>
              <span style={{ fontSize:12, color:'var(--text-muted)', marginLeft:4 }}>
                Page {page} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <div style={card}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--card-border)',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <History size={15} color='var(--primary)'/>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>Payment History</h3>
            </div>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>{allPayments.length} transaction{allPayments.length!==1?'s':''}</span>
          </div>

          {allPayments.length === 0 ? (
            <div style={{ padding:'50px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
              <History size={32} style={{ marginBottom:10, opacity:0.3 }}/>
              <p>No payment records yet</p>
            </div>
          ) : (
            <>
              {/* History table header */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 120px 120px 120px 100px',
                gap:12, padding:'10px 18px', background:'var(--input-bg)',
                borderBottom:'1px solid var(--card-border)' }}>
                {['Invoice / Description','Payment ID','Date','Method','Amount'].map(h => (
                  <div key={h} style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)',
                    textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
                ))}
              </div>
              {allPayments.map((p, i) => (
                <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                  style={{ display:'grid', gridTemplateColumns:'1fr 120px 120px 120px 100px',
                    gap:12, padding:'13px 18px', borderBottom:'1px solid var(--card-border)',
                    alignItems:'center', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--input-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{p.title}</div>
                    <div style={{ fontSize:11, color:'var(--primary)', fontWeight:700 }}>{p.invoiceId}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', fontFamily:'monospace' }}>{p.txnId}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{p.date}</div>
                  <div>
                    <span style={{ padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600,
                      background:'rgba(99,102,241,0.10)', color:'var(--primary)',
                      border:'1px solid rgba(99,102,241,0.2)' }}>{p.method}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#10b981' }}>{fmt(p.amount)}</div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {viewInv && (
          <InvoiceModal invoice={viewInv} onClose={() => setViewInv(null)}
            onPay={inv => { setViewInv(null); setPayInv(inv); }}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {payInv && (
          <PaymentModal invoice={payInv} onClose={() => setPayInv(null)}
            onSuccess={handlePaySuccess}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type}/>}
      </AnimatePresence>
    </div>
  );
}
