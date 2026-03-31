import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, Eye, Edit2, Trash2, Copy, Send, Mail,
  MessageSquare, Phone, Users, TrendingUp, CheckCircle2,
  ChevronRight, ChevronLeft, X, Check, Calendar, Tag,
  Zap, Star, Gift, PartyPopper, BarChart2, Target
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ── Data ──────────────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id:'C001', name:'Summer Poolside Promo',      type:'Email',    audience:'All Guests',    status:'Completed', sent:12500, openRate:42, clickRate:15, conversions:180, date:'2026-03-01' },
  { id:'C002', name:'VIP Loyalty Reward',          type:'WhatsApp', audience:'VIP',           status:'Active',    sent:340,   openRate:91, clickRate:68, conversions:52,  date:'2026-03-10' },
  { id:'C003', name:'Weekend Getaway Discount',    type:'SMS',      audience:'Returning',     status:'Active',    sent:2800,  openRate:78, clickRate:32, conversions:94,  date:'2026-03-15' },
  { id:'C004', name:'Valentine\'s Couples Offer',  type:'Email',    audience:'All Guests',    status:'Draft',     sent:0,     openRate:0,  clickRate:0,  conversions:0,   date:'2026-03-20' },
  { id:'C005', name:'Birthday Special Offer',      type:'WhatsApp', audience:'Birthday Month',status:'Active',    sent:85,    openRate:95, clickRate:72, conversions:28,  date:'2026-03-05' },
  { id:'C006', name:'Inactive Guest Re-engagement',type:'Email',    audience:'Inactive 90d',  status:'Completed', sent:4200,  openRate:28, clickRate:9,  conversions:67,  date:'2026-02-15' },
];

const TEMPLATES = [
  { icon: PartyPopper, label:'Festival Offer',    color:'#f59e0b', bg:'#fef3c7', desc:'Celebrate with special rates' },
  { icon: Star,        label:'Weekend Discount',  color:'#6366f1', bg:'#ede9fe', desc:'Fill weekend occupancy' },
  { icon: Gift,        label:'Loyalty Reward',    color:'#10b981', bg:'#d1fae5', desc:'Reward your VIP guests' },
  { icon: Zap,         label:'Birthday Offer',    color:'#ec4899', bg:'#fce7f3', desc:'Auto birthday wishes + discount' },
];

const TYPE_META = {
  Email:    { color:'#2563eb', bg:'#dbeafe', icon: Mail },
  SMS:      { color:'#059669', bg:'#d1fae5', icon: Phone },
  WhatsApp: { color:'#16a34a', bg:'#dcfce7', icon: MessageSquare },
};

const STATUS_META = {
  Active:    { color:'#059669', bg:'#d1fae5' },
  Draft:     { color:'#64748b', bg:'#f1f5f9' },
  Completed: { color:'#2563eb', bg:'#dbeafe' },
};

const STEPS = ['Campaign Info','Target Audience','Message Builder','Offer Settings','Schedule','Review & Send'];

const chartOpts = {
  responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1e293b', titleColor:'#f1f5f9', bodyColor:'#94a3b8', borderColor:'rgba(255,255,255,0.1)', borderWidth:1 }},
  scales:{ x:{ grid:{ display:false }, ticks:{ color:'var(--text-muted)', font:{ size:10 }}}, y:{ grid:{ color:'rgba(148,163,184,0.08)' }, ticks:{ color:'var(--text-muted)', font:{ size:10 }}, border:{ display:false }}},
};

// ── Campaign Creator ──────────────────────────────────────────────────────────
function CampaignCreator({ onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:'', type:'Email', audience:[], message:'', subject:'',
    discount:'', coupon:'', validFrom:'', validTo:'',
    schedule:'now', scheduleDate:'', scheduleTime:'',
  });

  const audienceOptions = [
    { label:'New Guests',        count:42  },
    { label:'Returning Guests',  count:118 },
    { label:'VIP Guests',        count:24  },
    { label:'Inactive (90 days)',count:67  },
    { label:'High Spenders',     count:31  },
    { label:'Birthday Month',    count:8   },
  ];

  const totalAudience = audienceOptions.filter(a => form.audience.includes(a.label)).reduce((s,a)=>s+a.count,0);

  const inp = { background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:4, padding:'8px 10px', color:'var(--text-primary)', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' };

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:14, width:'100%', maxWidth:640, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>

        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Create Campaign</h3>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={16}/></button>
        </div>

        {/* Step indicator */}
        <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', gap:0, overflowX:'auto', flexShrink:0 }}>
          {STEPS.map((s,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', display:'grid', placeItems:'center', fontSize:11, fontWeight:700,
                  background: i < step ? '#2563eb' : i===step ? '#2563eb' : 'var(--input-bg)',
                  color: i <= step ? '#fff' : 'var(--text-muted)',
                  border: i===step ? '2px solid #bfdbfe' : 'none' }}>
                  {i < step ? <Check size={12}/> : i+1}
                </div>
                <span style={{ fontSize:9, fontWeight:600, color: i<=step?'#2563eb':'var(--text-muted)', whiteSpace:'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length-1 && <div style={{ width:28, height:1, background: i<step?'#2563eb':'var(--card-border)', marginBottom:14, flexShrink:0 }}/>}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 22px' }}>

          {step === 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="b24-field"><label className="b24-label">Campaign Name <span className="required">*</span></label>
                <input className="b24-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Summer Poolside Promo"/>
              </div>
              <div className="b24-field"><label className="b24-label">Campaign Type</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {['Email','SMS','WhatsApp'].map(t => {
                    const meta = TYPE_META[t]; const Icon = meta.icon;
                    return (
                      <button key={t} onClick={() => setForm(f=>({...f,type:t}))}
                        style={{ padding:'14px', borderRadius:8, border:`2px solid ${form.type===t?meta.color:'var(--card-border)'}`, background: form.type===t?meta.bg:'var(--input-bg)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <Icon size={20} color={form.type===t?meta.color:'var(--text-muted)'}/>
                        <span style={{ fontSize:12, fontWeight:700, color: form.type===t?meta.color:'var(--text-secondary)' }}>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14 }}>Select target audience segments:</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                {audienceOptions.map(a => {
                  const selected = form.audience.includes(a.label);
                  return (
                    <div key={a.label} onClick={() => setForm(f=>({ ...f, audience: selected ? f.audience.filter(x=>x!==a.label) : [...f.audience, a.label] }))}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderRadius:8, border:`1px solid ${selected?'#2563eb':'var(--card-border)'}`, background: selected?'#eff6ff':'var(--input-bg)', cursor:'pointer', transition:'all 0.12s' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${selected?'#2563eb':'var(--input-border)'}`, background: selected?'#2563eb':'transparent', display:'grid', placeItems:'center' }}>
                          {selected && <Check size={11} color='#fff'/>}
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{a.label}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#2563eb', background:'#dbeafe', padding:'2px 8px', borderRadius:10 }}>{a.count} guests</span>
                    </div>
                  );
                })}
              </div>
              {totalAudience > 0 && (
                <div style={{ padding:'12px 14px', borderRadius:8, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#1e40af' }}>Selected audience</span>
                  <span style={{ fontSize:18, fontWeight:800, color:'#2563eb' }}>{totalAudience} guests</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {form.type === 'Email' && (
                <div className="b24-field"><label className="b24-label">Email Subject</label>
                  <input className="b24-input" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="e.g. Exclusive offer just for you, {Guest Name}!"/>
                </div>
              )}
              <div className="b24-field">
                <label className="b24-label">Message</label>
                <textarea className="b24-textarea" style={{ minHeight:120 }} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder={form.type==='Email'?'Write your email content here...':'Write your SMS/WhatsApp message here...'}/>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)' }}>Variables:</span>
                {['{Guest Name}','{Last Stay Date}','{Discount Code}','{Hotel Name}'].map(v => (
                  <button key={v} onClick={() => setForm(f=>({...f,message:f.message+v}))}
                    style={{ padding:'3px 10px', borderRadius:12, border:'1px solid var(--card-border)', background:'var(--input-bg)', color:'#2563eb', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="b24-row b24-row-2">
                <div className="b24-field"><label className="b24-label">Discount</label>
                  <input className="b24-input" value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} placeholder="e.g. 20% or $50"/>
                </div>
                <div className="b24-field"><label className="b24-label">Coupon Code</label>
                  <input className="b24-input" value={form.coupon} onChange={e=>setForm(f=>({...f,coupon:e.target.value}))} placeholder="e.g. SUMMER20"/>
                </div>
              </div>
              <div className="b24-row b24-row-2">
                <div className="b24-field"><label className="b24-label">Valid From</label>
                  <input type="date" className="b24-input" value={form.validFrom} onChange={e=>setForm(f=>({...f,validFrom:e.target.value}))}/>
                </div>
                <div className="b24-field"><label className="b24-label">Valid To</label>
                  <input type="date" className="b24-input" value={form.validTo} onChange={e=>setForm(f=>({...f,validTo:e.target.value}))}/>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['now','scheduled'].map(opt => (
                <div key={opt} onClick={() => setForm(f=>({...f,schedule:opt}))}
                  style={{ padding:'14px 16px', borderRadius:8, border:`2px solid ${form.schedule===opt?'#2563eb':'var(--card-border)'}`, background: form.schedule===opt?'#eff6ff':'var(--input-bg)', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${form.schedule===opt?'#2563eb':'var(--input-border)'}`, display:'grid', placeItems:'center' }}>
                    {form.schedule===opt && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{opt==='now'?'Send Now':'Schedule for Later'}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{opt==='now'?'Campaign will be sent immediately':'Choose a date and time'}</div>
                  </div>
                </div>
              ))}
              {form.schedule === 'scheduled' && (
                <div className="b24-row b24-row-2">
                  <div className="b24-field"><label className="b24-label">Date</label><input type="date" className="b24-input" value={form.scheduleDate} onChange={e=>setForm(f=>({...f,scheduleDate:e.target.value}))}/></div>
                  <div className="b24-field"><label className="b24-label">Time</label><input type="time" className="b24-input" value={form.scheduleTime} onChange={e=>setForm(f=>({...f,scheduleTime:e.target.value}))}/></div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ padding:'16px', borderRadius:8, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
                <h4 style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:'0 0 12px' }}>Campaign Preview</h4>
                {[
                  { label:'Name',     value: form.name || '—' },
                  { label:'Type',     value: form.type },
                  { label:'Audience', value: form.audience.join(', ') || '—' },
                  { label:'Discount', value: form.discount || 'None' },
                  { label:'Coupon',   value: form.coupon || 'None' },
                  { label:'Schedule', value: form.schedule==='now'?'Send Immediately':`${form.scheduleDate} ${form.scheduleTime}` },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', gap:12, padding:'6px 0', borderBottom: i<5?'1px solid var(--card-border)':'none', fontSize:12 }}>
                    <span style={{ color:'var(--text-muted)', minWidth:80 }}>{r.label}</span>
                    <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{r.value}</span>
                  </div>
                ))}
              </div>
              {form.message && (
                <div style={{ padding:'14px', borderRadius:8, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#166534', marginBottom:6 }}>MESSAGE PREVIEW</div>
                  <div style={{ fontSize:13, color:'#14532d', lineHeight:1.6 }}>{form.message}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', flexShrink:0 }}>
          <button className="b24-btn b24-btn-secondary" onClick={() => step>0?setStep(s=>s-1):onClose()}>
            <ChevronLeft size={13}/> {step===0?'Cancel':'Back'}
          </button>
          <button className="b24-btn b24-btn-primary" onClick={() => step<5?setStep(s=>s+1):onSave(form)}>
            {step===5?<><Send size={13}/> Send Campaign</>:<>Next <ChevronRight size={13}/></>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Marketing Page ───────────────────────────────────────────────────────
export default function Marketing() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [showCreator, setShowCreator] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const deleteCampaign = (id) => { setCampaigns(c => c.filter(x => x.id !== id)); showToast('Campaign deleted'); };
  const duplicateCampaign = (c) => { setCampaigns(prev => [...prev, { ...c, id:'C'+Date.now(), name:c.name+' (Copy)', status:'Draft', sent:0, openRate:0, clickRate:0, conversions:0 }]); showToast('Campaign duplicated'); };
  const saveCampaign = (form) => {
    setCampaigns(prev => [...prev, { id:'C'+Date.now(), name:form.name||'New Campaign', type:form.type, audience:form.audience.join(', ')||'All', status:'Active', sent:0, openRate:0, clickRate:0, conversions:0, date:new Date().toISOString().slice(0,10) }]);
    setShowCreator(false); showToast('Campaign launched! 🚀');
  };

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  const totalSent = campaigns.reduce((a,c)=>a+c.sent,0);
  const avgOpen   = Math.round(campaigns.filter(c=>c.sent>0).reduce((a,c)=>a+c.openRate,0) / campaigns.filter(c=>c.sent>0).length);
  const totalConv = campaigns.reduce((a,c)=>a+c.conversions,0);

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Guest Marketing</h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Create and manage marketing campaigns for your guests</p>
        </div>
        <button className="b24-btn b24-btn-primary" onClick={() => setShowCreator(true)}><Plus size={13}/> New Campaign</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Campaigns',  value: campaigns.length,                                    color:'#6366f1' },
          { label:'Active Campaigns', value: campaigns.filter(c=>c.status==='Active').length,     color:'#10b981' },
          { label:'Messages Sent',    value: totalSent.toLocaleString(),                          color:'#2563eb' },
          { label:'Avg Open Rate',    value: `${avgOpen}%`,                                       color:'#f59e0b' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'10px 10px 0 0' }}/>
            <div style={{ fontSize:24, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Templates */}
      <div style={{ ...card, padding:'18px 20px', marginBottom:22 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 14px', display:'flex', alignItems:'center', gap:7 }}><Zap size={15} color='#f59e0b'/> Quick Campaign Templates</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {TEMPLATES.map((t,i) => {
            const Icon = t.icon;
            return (
              <motion.button key={i} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                onClick={() => setShowCreator(true)}
                style={{ padding:'16px 12px', borderRadius:10, border:`1px solid ${t.bg}`, background:t.bg, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8, transition:'all 0.15s' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'#fff', display:'grid', placeItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
                  <Icon size={20} color={t.color}/>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:t.color }}>{t.label}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{t.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Campaign Table */}
      <div style={{ ...card, marginBottom:22, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>All Campaigns</h3>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>{campaigns.length} campaigns</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
            <thead>
              <tr style={{ background:'var(--input-bg)', borderBottom:'1px solid var(--card-border)' }}>
                {['Campaign','Type','Audience','Status','Sent','Open Rate','Click Rate','Conversions','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c,i) => {
                const typeMeta = TYPE_META[c.type];
                const TypeIcon = typeMeta.icon;
                const statusMeta = STATUS_META[c.status];
                return (
                  <motion.tr key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                    style={{ borderBottom:'1px solid var(--card-border)', transition:'background 0.12s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(37,99,235,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.date}</div>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:typeMeta.bg, color:typeMeta.color }}>
                        <TypeIcon size={11}/>{c.type}
                      </span>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-secondary)' }}>{c.audience}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:statusMeta.bg, color:statusMeta.color }}>{c.status}</span>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{c.sent.toLocaleString()}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ flex:1, height:4, borderRadius:99, background:'var(--input-bg)', overflow:'hidden', minWidth:50 }}>
                          <div style={{ height:'100%', width:`${c.openRate}%`, background:'#10b981', borderRadius:99 }}/>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#10b981', minWidth:30 }}>{c.openRate}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ flex:1, height:4, borderRadius:99, background:'var(--input-bg)', overflow:'hidden', minWidth:50 }}>
                          <div style={{ height:'100%', width:`${c.clickRate}%`, background:'#2563eb', borderRadius:99 }}/>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#2563eb', minWidth:30 }}>{c.clickRate}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#6366f1' }}>{c.conversions}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button title="View" style={{ width:26, height:26, borderRadius:4, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}><Eye size={11}/></button>
                        <button title="Edit" style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}><Edit2 size={11}/></button>
                        <button title="Duplicate" onClick={() => duplicateCampaign(c)} style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--card-border)', background:'var(--input-bg)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)' }}><Copy size={11}/></button>
                        <button title="Delete" onClick={() => deleteCampaign(c.id)} style={{ width:26, height:26, borderRadius:4, border:'1px solid #fecaca', background:'#fef2f2', display:'grid', placeItems:'center', cursor:'pointer', color:'#dc2626' }}><Trash2 size={11}/></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ ...card, padding:'20px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><BarChart2 size={15} color='#2563eb'/> Open & Click Rates</h3>
          <div style={{ height:200 }}>
            <Bar data={{
              labels: campaigns.filter(c=>c.sent>0).map(c=>c.name.slice(0,12)+'...'),
              datasets:[
                { label:'Open Rate', data: campaigns.filter(c=>c.sent>0).map(c=>c.openRate), backgroundColor:'rgba(16,185,129,0.7)', borderRadius:4 },
                { label:'Click Rate',data: campaigns.filter(c=>c.sent>0).map(c=>c.clickRate), backgroundColor:'rgba(37,99,235,0.7)', borderRadius:4 },
              ]
            }} options={{ ...chartOpts, plugins:{ ...chartOpts.plugins, legend:{ display:true, labels:{ color:'var(--text-secondary)', font:{ size:11 }}}}}}/>
          </div>
        </div>
        <div style={{ ...card, padding:'20px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px', display:'flex', alignItems:'center', gap:7 }}><Target size={15} color='#6366f1'/> Conversions by Campaign</h3>
          <div style={{ height:200 }}>
            <Bar data={{
              labels: campaigns.filter(c=>c.sent>0).map(c=>c.name.slice(0,12)+'...'),
              datasets:[{ data: campaigns.filter(c=>c.sent>0).map(c=>c.conversions), backgroundColor:'rgba(99,102,241,0.7)', borderRadius:4 }]
            }} options={chartOpts}/>
          </div>
        </div>
      </div>

      {/* Campaign Creator Modal */}
      <AnimatePresence>
        {showCreator && <CampaignCreator onClose={() => setShowCreator(false)} onSave={saveCampaign}/>}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'11px 18px', borderRadius:6, background:'#059669', color:'#fff', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
            <Check size={14}/> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
