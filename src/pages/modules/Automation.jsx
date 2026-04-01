import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Play, Edit2, Trash2, Copy, ToggleLeft, ToggleRight,
  ChevronRight, ChevronDown, Check, X, Search, Filter, Clock,
  AlertTriangle, CheckCircle2, XCircle, ArrowDown, Settings,
  Bell, UserCheck, FileText, Receipt, RefreshCw, List, Eye,
  Layers, Calendar, TrendingUp, Users, Briefcase, Activity,
  ChevronLeft, Info, MoreVertical
} from 'lucide-react';
import { runWorkflows } from '../../utils/workflowEngine';

// ── Config ────────────────────────────────────────────────────────────────────
const TRIGGERS = [
  { id:'LEAD_CREATED',       label:'Lead Created',        icon:Users,     color:'#2563eb', desc:'Fires when a new lead is added to the CRM' },
  { id:'DEAL_STAGE_CHANGED', label:'Deal Stage Changed',  icon:Briefcase, color:'#8b5cf6', desc:'Fires when a deal moves to a new pipeline stage' },
  { id:'TASK_OVERDUE',       label:'Task Overdue',        icon:Clock,     color:'#ef4444', desc:'Fires when a task passes its due date' },
  { id:'MEETING_SCHEDULED',  label:'Meeting Scheduled',   icon:Calendar,  color:'#10b981', desc:'Fires when a new meeting is created' },
  { id:'DEAL_CLOSED_WON',    label:'Deal Closed Won',     icon:TrendingUp,color:'#f59e0b', desc:'Fires when a deal is marked as converted' },
  { id:'CONTACT_UPDATED',    label:'Contact Updated',     icon:UserCheck, color:'#06b6d4', desc:'Fires when a contact record is modified' },
];

const CONDITION_FIELDS = [
  { id:'amount',      label:'Deal Value',    type:'number' },
  { id:'source',      label:'Lead Source',   type:'text'   },
  { id:'stage',       label:'Deal Stage',    type:'text'   },
  { id:'owner',       label:'Owner',         type:'text'   },
  { id:'priority',    label:'Priority',      type:'text'   },
  { id:'dueDate',     label:'Due Date',      type:'date'   },
];
const OPERATORS = [
  { id:'>',  label:'Greater than' },
  { id:'<',  label:'Less than'    },
  { id:'=',  label:'Equals'       },
  { id:'!=', label:'Not equals'   },
  { id:'>=', label:'>= (at least)'},
  { id:'<=', label:'<= (at most)' },
];

const ACTION_TYPES = [
  { id:'ASSIGN_USER',        label:'Assign User',        icon:UserCheck,  color:'#2563eb', desc:'Assign the record to a team member' },
  { id:'SEND_NOTIFICATION',  label:'Send Notification',  icon:Bell,       color:'#f59e0b', desc:'Push an in-app notification' },
  { id:'CREATE_TASK',        label:'Create Task',        icon:CheckCircle2,color:'#10b981',desc:'Auto-create a follow-up task' },
  { id:'CREATE_INVOICE',     label:'Create Invoice',     icon:Receipt,    color:'#8b5cf6', desc:'Generate an invoice automatically' },
  { id:'UPDATE_STATUS',      label:'Update Status',      icon:RefreshCw,  color:'#06b6d4', desc:'Change the record status field' },
  { id:'SEND_EMAIL',         label:'Send Email',         icon:FileText,   color:'#ec4899', desc:'Send an automated email' },
];

const USERS = ['John Sales','Sarah Doe','Mike Ross','Emily Clark'];

const TEMPLATES = [
  { name:'Lead Assignment',       trigger:'LEAD_CREATED',       conditions:[], actions:[{ type:'ASSIGN_USER', payload:{ user:'John Sales' } }] },
  { name:'Deal Closing Automation',trigger:'DEAL_CLOSED_WON',   conditions:[], actions:[{ type:'CREATE_INVOICE', payload:{} }, { type:'SEND_NOTIFICATION', payload:{ message:'Deal closed! Invoice created.' } }] },
  { name:'Overdue Task Alert',    trigger:'TASK_OVERDUE',        conditions:[], actions:[{ type:'SEND_NOTIFICATION', payload:{ message:'You have an overdue task!' } }] },
  { name:'Meeting Follow-up',     trigger:'MEETING_SCHEDULED',   conditions:[], actions:[{ type:'CREATE_TASK', payload:{ title:'Follow up after meeting', priority:'High' } }] },
];

const SEED_WORKFLOWS = [
  { id:'wf1', name:'New Lead Auto-Assign',    trigger:'LEAD_CREATED',       conditions:[], actions:[{ type:'ASSIGN_USER', payload:{ user:'John Sales' } }],                                                                isActive:true,  createdAt:'2026-03-01T10:00:00Z', lastRun:'2026-03-28T14:22:00Z' },
  { id:'wf2', name:'Deal Won → Invoice',      trigger:'DEAL_CLOSED_WON',    conditions:[{ field:'amount', operator:'>', value:'50000' }], actions:[{ type:'CREATE_INVOICE', payload:{} }, { type:'SEND_NOTIFICATION', payload:{ message:'Invoice created for closed deal' } }], isActive:true,  createdAt:'2026-03-05T09:00:00Z', lastRun:'2026-03-25T11:10:00Z' },
  { id:'wf3', name:'Overdue Task Reminder',   trigger:'TASK_OVERDUE',       conditions:[], actions:[{ type:'SEND_NOTIFICATION', payload:{ message:'Task is overdue!' } }],                                                isActive:false, createdAt:'2026-03-10T08:00:00Z', lastRun:null },
  { id:'wf4', name:'Meeting Follow-up Task',  trigger:'MEETING_SCHEDULED',  conditions:[], actions:[{ type:'CREATE_TASK', payload:{ title:'Follow up after meeting', priority:'High' } }],                                isActive:true,  createdAt:'2026-03-15T12:00:00Z', lastRun:'2026-03-27T09:45:00Z' },
];

const SEED_LOGS = [
  { id:'l1', workflowId:'wf1', workflowName:'New Lead Auto-Assign',   trigger:'LEAD_CREATED',      time:'2026-03-28T14:22:00Z', actions:['Assign to John Sales'],                    status:'Success' },
  { id:'l2', workflowId:'wf2', workflowName:'Deal Won → Invoice',     trigger:'DEAL_CLOSED_WON',   time:'2026-03-25T11:10:00Z', actions:['Create Invoice','Send Notification'],       status:'Success' },
  { id:'l3', workflowId:'wf4', workflowName:'Meeting Follow-up Task', trigger:'MEETING_SCHEDULED', time:'2026-03-27T09:45:00Z', actions:['Create Task'],                              status:'Success' },
  { id:'l4', workflowId:'wf2', workflowName:'Deal Won → Invoice',     trigger:'DEAL_CLOSED_WON',   time:'2026-03-20T16:30:00Z', actions:['Create Invoice','Send Notification'],       status:'Failed'  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtTime = iso => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) + ' ' + d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); };
const triggerMeta  = id => TRIGGERS.find(t => t.id === id)    || TRIGGERS[0];
const actionMeta   = id => ACTION_TYPES.find(a => a.id === id) || ACTION_TYPES[0];
const newCondition = ()  => ({ id:`c-${Date.now()}`, field:'amount', operator:'>', value:'' });
const newAction    = ()  => ({ id:`a-${Date.now()}`, type:'ASSIGN_USER', payload:{ user: USERS[0] } });

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(!value); }}
      style={{ width:44, height:24, borderRadius:99, background: value ? '#2563eb' : 'var(--card-border)', position:'relative', cursor:'pointer', transition:'background 0.25s', flexShrink:0, boxShadow: value ? '0 2px 8px rgba(37,99,235,0.35)' : 'none' }}>
      <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
        style={{ position:'absolute', top:2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

// ── Action Payload Config ─────────────────────────────────────────────────────
function ActionConfig({ action, onChange }) {
  const set = (k, v) => onChange({ ...action, payload: { ...action.payload, [k]: v } });
  switch (action.type) {
    case 'ASSIGN_USER':
      return (
        <div>
          <label style={lbl}>Assign To</label>
          <select value={action.payload?.user || ''} onChange={e => set('user', e.target.value)} style={sel}>
            {USERS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      );
    case 'SEND_NOTIFICATION':
      return (
        <div>
          <label style={lbl}>Message</label>
          <input value={action.payload?.message || ''} onChange={e => set('message', e.target.value)} placeholder="Notification message..." style={inp} />
        </div>
      );
    case 'CREATE_TASK':
      return (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div><label style={lbl}>Task Title</label><input value={action.payload?.title || ''} onChange={e => set('title', e.target.value)} placeholder="Task title..." style={inp} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div><label style={lbl}>Priority</label>
              <select value={action.payload?.priority || 'Medium'} onChange={e => set('priority', e.target.value)} style={sel}>
                {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Assign To</label>
              <select value={action.payload?.owner || ''} onChange={e => set('owner', e.target.value)} style={sel}>
                {USERS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      );
    case 'UPDATE_STATUS':
      return (
        <div>
          <label style={lbl}>New Status</label>
          <input value={action.payload?.status || ''} onChange={e => set('status', e.target.value)} placeholder="e.g. Active, Closed..." style={inp} />
        </div>
      );
    case 'SEND_EMAIL':
      return (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div><label style={lbl}>To</label><input value={action.payload?.to || ''} onChange={e => set('to', e.target.value)} placeholder="email@example.com" style={inp} /></div>
          <div><label style={lbl}>Subject</label><input value={action.payload?.subject || ''} onChange={e => set('subject', e.target.value)} placeholder="Email subject..." style={inp} /></div>
        </div>
      );
    default: return null;
  }
}

// shared mini styles
const lbl = { fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 };
const inp = { width:'100%', padding:'9px 12px', borderRadius:9, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:13, outline:'none', boxSizing:'border-box' };
const sel = { width:'100%', padding:'9px 12px', borderRadius:9, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontSize:13, outline:'none' };

// ── Workflow Builder Modal (4-step stepper) ───────────────────────────────────
function WorkflowModal({ onClose, onSave, editWorkflow }) {
  const [step, setStep]         = useState(0);
  const [name, setName]         = useState(editWorkflow?.name || '');
  const [trigger, setTrigger]   = useState(editWorkflow?.trigger || '');
  const [conditions, setConds]  = useState(editWorkflow?.conditions || []);
  const [actions, setActions]   = useState(editWorkflow?.actions?.map((a,i) => ({ ...a, id:`a-${i}` })) || []);
  const [isActive, setIsActive] = useState(editWorkflow?.isActive ?? true);

  const STEPS = ['Trigger','Conditions','Actions','Review'];
  const canNext = [!!trigger, true, actions.length > 0, !!name];

  const addCond   = () => setConds(c => [...c, newCondition()]);
  const removeCond = id => setConds(c => c.filter(x => x.id !== id));
  const updateCond = (id, k, v) => setConds(c => c.map(x => x.id === id ? { ...x, [k]:v } : x));

  const addAction    = () => setActions(a => [...a, newAction()]);
  const removeAction = id => setActions(a => a.filter(x => x.id !== id));
  const updateAction = (id, updated) => setActions(a => a.map(x => x.id === id ? { ...x, ...updated } : x));

  const handleSave = () => {
    onSave({ name: name || 'Untitled Workflow', trigger, conditions, actions: actions.map(({ id, ...rest }) => rest), isActive });
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:300, backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ scale:0.93, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.93 }}
        transition={{ type:'spring', damping:26, stiffness:240 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--card-bg)', borderRadius:22, width:'100%', maxWidth:680, maxHeight:'92vh', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.3)', border:'1px solid var(--card-border)', overflow:'hidden' }}>

        {/* Modal Header */}
        <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg,rgba(37,99,235,0.05),rgba(139,92,246,0.03))' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', display:'grid', placeItems:'center' }}>
              <Zap size={18} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ margin:0, fontSize:16, fontWeight:900, color:'var(--text-primary)' }}>{editWorkflow ? 'Edit Workflow' : 'Create Workflow'}</h2>
              <p style={{ margin:0, fontSize:12, color:'var(--text-muted)' }}>Step {step+1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}><X size={16} /></button>
        </div>

        {/* Stepper */}
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--card-border)', display:'flex', alignItems:'center', gap:0 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div onClick={() => i < step && setStep(i)}
                style={{ display:'flex', alignItems:'center', gap:8, cursor: i < step ? 'pointer' : 'default' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', display:'grid', placeItems:'center', fontSize:12, fontWeight:900, transition:'all 0.2s',
                  background: i < step ? '#10b981' : i === step ? '#2563eb' : 'var(--input-bg)',
                  color: i <= step ? '#fff' : 'var(--text-muted)',
                  border: i > step ? '2px solid var(--card-border)' : 'none' }}>
                  {i < step ? <Check size={13} /> : i+1}
                </div>
                <span style={{ fontSize:12, fontWeight: i === step ? 800 : 600, color: i === step ? '#2563eb' : i < step ? '#10b981' : 'var(--text-muted)', whiteSpace:'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length-1 && (
                <div style={{ flex:1, height:2, background: i < step ? '#10b981' : 'var(--card-border)', margin:'0 8px', borderRadius:99, transition:'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px' }}>

          {/* Step 0: Trigger */}
          {step === 0 && (
            <div>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:18, fontWeight:600 }}>Choose what event starts this workflow</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                {TRIGGERS.map(t => {
                  const Icon = t.icon;
                  const active = trigger === t.id;
                  return (
                    <motion.div key={t.id} whileHover={{ y:-2 }} onClick={() => setTrigger(t.id)}
                      style={{ padding:'16px', borderRadius:14, border:`2px solid ${active ? t.color : 'var(--card-border)'}`, background: active ? `${t.color}08` : 'var(--input-bg)', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:12, transition:'all 0.18s', boxShadow: active ? `0 4px 16px ${t.color}20` : 'none' }}>
                      <div style={{ width:40, height:40, borderRadius:11, background:`${t.color}15`, border:`1px solid ${t.color}25`, display:'grid', placeItems:'center', flexShrink:0 }}>
                        <Icon size={18} color={t.color} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:800, color: active ? t.color : 'var(--text-primary)', marginBottom:4 }}>{t.label}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>{t.desc}</div>
                      </div>
                      {active && <Check size={16} color={t.color} style={{ flexShrink:0, marginTop:2 }} />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Conditions */}
          {step === 1 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0 }}>Add Conditions <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>(optional)</span></p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:'4px 0 0' }}>All conditions must be true for the workflow to run</p>
                </div>
                <button onClick={addCond}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:'1.5px dashed #f59e0b', background:'rgba(245,158,11,0.06)', color:'#f59e0b', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  <Plus size={14} /> Add Condition
                </button>
              </div>

              {conditions.length === 0 ? (
                <div style={{ padding:'40px', textAlign:'center', borderRadius:14, border:'2px dashed var(--card-border)', background:'var(--input-bg)' }}>
                  <Filter size={32} color="var(--text-muted)" style={{ margin:'0 auto 12px', display:'block', opacity:0.4 }} />
                  <p style={{ fontSize:13, color:'var(--text-muted)', margin:0, fontWeight:600 }}>No conditions — workflow runs on every trigger</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {conditions.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      style={{ padding:'14px 16px', borderRadius:12, border:'1.5px solid rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.04)', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                      {i > 0 && <span style={{ fontSize:10, fontWeight:900, color:'#f59e0b', background:'rgba(245,158,11,0.12)', padding:'2px 8px', borderRadius:6, marginRight:4 }}>AND</span>}
                      <select value={c.field} onChange={e => updateCond(c.id,'field',e.target.value)} style={{ ...sel, width:'auto', flex:1, minWidth:120 }}>
                        {CONDITION_FIELDS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                      <select value={c.operator} onChange={e => updateCond(c.id,'operator',e.target.value)} style={{ ...sel, width:'auto', flex:1, minWidth:120 }}>
                        {OPERATORS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                      <input value={c.value} onChange={e => updateCond(c.id,'value',e.target.value)} placeholder="Value..." style={{ ...inp, flex:1, minWidth:100 }} />
                      <button onClick={() => removeCond(c.id)} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--card-border)', background:'transparent', cursor:'pointer', display:'grid', placeItems:'center', color:'#ef4444', flexShrink:0 }}><X size={13} /></button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Actions */}
          {step === 2 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0 }}>Define Actions</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:'4px 0 0' }}>Actions execute in order when the workflow runs</p>
                </div>
                <button onClick={addAction}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:'1.5px dashed #10b981', background:'rgba(16,185,129,0.06)', color:'#10b981', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  <Plus size={14} /> Add Action
                </button>
              </div>

              {actions.length === 0 ? (
                <div style={{ padding:'40px', textAlign:'center', borderRadius:14, border:'2px dashed var(--card-border)', background:'var(--input-bg)' }}>
                  <Zap size={32} color="var(--text-muted)" style={{ margin:'0 auto 12px', display:'block', opacity:0.4 }} />
                  <p style={{ fontSize:13, color:'var(--text-muted)', margin:0, fontWeight:600 }}>Add at least one action</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {actions.map((a, i) => {
                    const meta = actionMeta(a.type);
                    const Icon = meta.icon;
                    return (
                      <motion.div key={a.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        style={{ borderRadius:14, border:`1.5px solid ${meta.color}30`, background:`${meta.color}05`, overflow:'hidden' }}>
                        <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${meta.color}15` }}>
                          <div style={{ width:28, height:28, borderRadius:8, background:`${meta.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}>
                            <Icon size={14} color={meta.color} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Action {i+1}</span>
                          <select value={a.type} onChange={e => updateAction(a.id, { type:e.target.value, payload:{} })}
                            style={{ ...sel, flex:1, marginLeft:4 }}>
                            {ACTION_TYPES.map(at => <option key={at.id} value={at.id}>{at.label}</option>)}
                          </select>
                          <button onClick={() => removeAction(a.id)} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--card-border)', background:'transparent', cursor:'pointer', display:'grid', placeItems:'center', color:'#ef4444', flexShrink:0 }}><X size={13} /></button>
                        </div>
                        <div style={{ padding:'14px 16px' }}>
                          <ActionConfig action={a} onChange={updated => updateAction(a.id, updated)} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Name */}
              <div>
                <label style={{ ...lbl, marginBottom:8 }}>Workflow Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lead Auto-Assignment"
                  style={{ ...inp, fontSize:15, fontWeight:700, padding:'12px 14px' }} />
              </div>

              {/* Visual summary */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
                {/* Trigger block */}
                {(() => { const t = triggerMeta(trigger); const Icon = t.icon; return (
                  <div style={{ width:'100%', padding:'14px 18px', borderRadius:14, border:`2px solid ${t.color}40`, background:`${t.color}08`, display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${t.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}><Icon size={17} color={t.color} /></div>
                    <div><div style={{ fontSize:10, fontWeight:800, color:t.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>Trigger</div><div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)' }}>{t.label}</div></div>
                  </div>
                ); })()}

                {conditions.length > 0 && <>
                  <div style={{ width:2, height:20, background:'var(--card-border)' }} />
                  <div style={{ width:'100%', padding:'12px 18px', borderRadius:14, border:'2px solid rgba(245,158,11,0.4)', background:'rgba(245,158,11,0.06)' }}>
                    <div style={{ fontSize:10, fontWeight:800, color:'#f59e0b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Conditions ({conditions.length})</div>
                    {conditions.map((c,i) => {
                      const f = CONDITION_FIELDS.find(x=>x.id===c.field);
                      const o = OPERATORS.find(x=>x.id===c.operator);
                      return <div key={c.id} style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600, marginBottom:i<conditions.length-1?4:0 }}>{i>0&&<span style={{ color:'#f59e0b', fontWeight:800 }}>AND </span>}{f?.label} {o?.label} <strong>{c.value}</strong></div>;
                    })}
                  </div>
                </>}

                {actions.map((a, i) => {
                  const meta = actionMeta(a.type); const Icon = meta.icon;
                  return (
                    <React.Fragment key={a.id}>
                      <div style={{ width:2, height:20, background:'var(--card-border)' }} />
                      <div style={{ width:'100%', padding:'12px 18px', borderRadius:14, border:`2px solid ${meta.color}40`, background:`${meta.color}06`, display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:`${meta.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}><Icon size={15} color={meta.color} /></div>
                        <div><div style={{ fontSize:10, fontWeight:800, color:meta.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>Action {i+1}</div><div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{meta.label}</div></div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Active toggle */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderRadius:12, border:'1px solid var(--card-border)', background:'var(--input-bg)' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Activate Workflow</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Enable this workflow to run automatically</div>
                </div>
                <Toggle value={isActive} onChange={setIsActive} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-page)' }}>
          <button onClick={() => step > 0 ? setStep(s=>s-1) : onClose()}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', borderRadius:10, border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            <ChevronLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length-1 ? (
            <button onClick={() => canNext[step] && setStep(s=>s+1)} disabled={!canNext[step]}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:10, border:'none', background: canNext[step] ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : 'var(--card-border)', color: canNext[step] ? '#fff' : 'var(--text-muted)', fontSize:13, fontWeight:800, cursor: canNext[step] ? 'pointer' : 'not-allowed', boxShadow: canNext[step] ? '0 4px 14px rgba(37,99,235,0.3)' : 'none' }}>
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSave}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(16,185,129,0.3)' }}>
              <Check size={15} /> {editWorkflow ? 'Save Changes' : 'Create Workflow'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Workflow Card ─────────────────────────────────────────────────────────────
function WorkflowCard({ wf, onToggle, onEdit, onDelete, onDuplicate, onRun }) {
  const t = triggerMeta(wf.trigger);
  const TIcon = t.icon;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      whileHover={{ y:-2, boxShadow:'0 8px 28px rgba(0,0,0,0.09)' }}
      style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', position:'relative', transition:'box-shadow 0.2s' }}>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, background: wf.isActive ? t.color : 'var(--card-border)', borderRadius:'16px 0 0 16px' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:`${t.color}12`, border:`1px solid ${t.color}20`, display:'grid', placeItems:'center', flexShrink:0 }}>
            <TIcon size={17} color={t.color} />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:900, color:'var(--text-primary)', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{wf.name}</div>
            <span style={{ fontSize:11, fontWeight:700, color:t.color, background:`${t.color}10`, padding:'2px 8px', borderRadius:6 }}>{t.label}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, marginLeft:8 }}>
          <Toggle value={wf.isActive} onChange={() => onToggle(wf.id)} />
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(v=>!v)}
              style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}>
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity:0, scale:0.92, y:-4 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.92 }}
                  style={{ position:'absolute', top:36, right:0, background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:12, boxShadow:'0 12px 32px rgba(0,0,0,0.15)', zIndex:50, minWidth:160, overflow:'hidden' }}>
                  {[
                    { icon:Edit2,   label:'Edit',      action:() => { onEdit(wf); setMenuOpen(false); }, color:'var(--text-primary)' },
                    { icon:Copy,    label:'Duplicate', action:() => { onDuplicate(wf); setMenuOpen(false); }, color:'var(--text-primary)' },
                    { icon:Play,    label:'Test Run',  action:() => { onRun(wf); setMenuOpen(false); }, color:'#10b981' },
                    { icon:Trash2,  label:'Delete',    action:() => { onDelete(wf.id); setMenuOpen(false); }, color:'#ef4444' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} onClick={item.action}
                        style={{ width:'100%', padding:'10px 14px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:700, color:item.color, textAlign:'left' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--bg-page)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <Icon size={14} /> {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Actions summary */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {(wf.actions || []).map((a, i) => {
          const meta = actionMeta(a.type); const Icon = meta.icon;
          return (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:7, fontSize:11, fontWeight:700, background:`${meta.color}10`, color:meta.color, border:`1px solid ${meta.color}20` }}>
              <Icon size={10} /> {meta.label}
            </span>
          );
        })}
        {(wf.conditions||[]).length > 0 && (
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:7, fontSize:11, fontWeight:700, background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.2)' }}>
            <Filter size={10} /> {wf.conditions.length} condition{wf.conditions.length>1?'s':''}
          </span>
        )}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--card-border)' }}>
        <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
          <Clock size={11} /> {wf.lastRun ? `Last run ${fmtTime(wf.lastRun)}` : 'Never run'}
        </span>
        <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:99,
          background: wf.isActive ? 'rgba(16,185,129,0.1)' : 'var(--input-bg)',
          color: wf.isActive ? '#10b981' : 'var(--text-muted)',
          border: `1px solid ${wf.isActive ? 'rgba(16,185,129,0.2)' : 'var(--card-border)'}` }}>
          {wf.isActive ? '● Active' : '○ Inactive'}
        </span>
      </div>
    </motion.div>
  );
}

// ── Visual Builder Panel ──────────────────────────────────────────────────────
function VisualBuilder({ wf }) {
  if (!wf) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'var(--text-muted)', padding:40 }}>
      <Layers size={40} style={{ opacity:0.3 }} />
      <p style={{ fontSize:14, fontWeight:700, margin:0 }}>Select a workflow to preview</p>
    </div>
  );

  const t = triggerMeta(wf.trigger);
  const TIcon = t.icon;

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'24px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
      <div style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>Workflow Flow</div>

      {/* Trigger */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        style={{ width:'100%', maxWidth:320, padding:'16px', borderRadius:14, border:`2px solid ${t.color}50`, background:`${t.color}08`, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:`${t.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}><TIcon size={18} color={t.color} /></div>
        <div><div style={{ fontSize:10, fontWeight:800, color:t.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>⚡ Trigger</div><div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>{t.label}</div></div>
      </motion.div>

      {/* Conditions */}
      {(wf.conditions||[]).map((c, i) => {
        const f = CONDITION_FIELDS.find(x=>x.id===c.field);
        const o = OPERATORS.find(x=>x.id===c.operator);
        return (
          <React.Fragment key={i}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, margin:'6px 0' }}>
              <div style={{ width:2, height:12, background:'rgba(245,158,11,0.4)' }} />
              <ArrowDown size={14} color="#f59e0b" />
            </div>
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1+i*0.05 }}
              style={{ width:'100%', maxWidth:320, padding:'12px 16px', borderRadius:12, border:'2px solid rgba(245,158,11,0.35)', background:'rgba(245,158,11,0.05)' }}>
              <div style={{ fontSize:10, fontWeight:800, color:'#f59e0b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>🔍 Condition {i+1}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>{f?.label} {o?.label} <strong style={{ color:'var(--text-primary)' }}>{c.value}</strong></div>
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Actions */}
      {(wf.actions||[]).map((a, i) => {
        const meta = actionMeta(a.type); const Icon = meta.icon;
        return (
          <React.Fragment key={i}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, margin:'6px 0' }}>
              <div style={{ width:2, height:12, background:`${meta.color}40` }} />
              <ArrowDown size={14} color={meta.color} />
            </div>
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2+i*0.06 }}
              style={{ width:'100%', maxWidth:320, padding:'12px 16px', borderRadius:12, border:`2px solid ${meta.color}35`, background:`${meta.color}06`, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${meta.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}><Icon size={15} color={meta.color} /></div>
              <div><div style={{ fontSize:10, fontWeight:800, color:meta.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>⚡ Action {i+1}</div><div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>{meta.label}</div></div>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Logs Panel ────────────────────────────────────────────────────────────────
function LogsPanel({ logs, workflows, onClose }) {
  const [filterWf, setFilterWf] = useState('');
  const filtered = filterWf ? logs.filter(l => l.workflowId === filterWf) : logs;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200, backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-end', justifyContent:'flex-end' }}>
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
        transition={{ type:'spring', damping:28, stiffness:220 }}
        onClick={e => e.stopPropagation()}
        style={{ width:520, height:'100vh', background:'var(--card-bg)', borderLeft:'1px solid var(--card-border)', display:'flex', flexDirection:'column', boxShadow:'-16px 0 48px rgba(0,0,0,0.15)' }}>

        <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'rgba(37,99,235,0.1)', display:'grid', placeItems:'center' }}><Activity size={16} color="#2563eb" /></div>
            <div><h3 style={{ margin:0, fontSize:15, fontWeight:900, color:'var(--text-primary)' }}>Execution Logs</h3><p style={{ margin:0, fontSize:11, color:'var(--text-muted)' }}>{logs.length} total entries</p></div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text-muted)' }}><X size={15} /></button>
        </div>

        <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--card-border)' }}>
          <select value={filterWf} onChange={e => setFilterWf(e.target.value)} style={{ ...sel, fontSize:12 }}>
            <option value="">All Workflows</option>
            {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 22px', display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center', color:'var(--text-muted)' }}>
              <Activity size={32} style={{ margin:'0 auto 12px', display:'block', opacity:0.3 }} />
              <p style={{ fontSize:13, fontWeight:700, margin:0 }}>No logs yet</p>
            </div>
          ) : filtered.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.03 }}
              style={{ padding:'14px 16px', borderRadius:12, border:'1px solid var(--card-border)', background:'var(--input-bg)', borderLeft:`3px solid ${log.status==='Success'?'#10b981':'#ef4444'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>{log.workflowName}</div>
                <span style={{ fontSize:11, fontWeight:800, padding:'2px 9px', borderRadius:99, background: log.status==='Success'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color: log.status==='Success'?'#10b981':'#ef4444', display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                  {log.status==='Success' ? <CheckCircle2 size={10}/> : <XCircle size={10}/>} {log.status}
                </span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:8 }}>
                {(log.actions||[]).map((a,j) => <span key={j} style={{ fontSize:11, fontWeight:700, color:'var(--text-secondary)', background:'var(--card-bg)', padding:'2px 8px', borderRadius:6, border:'1px solid var(--card-border)' }}>{a}</span>)}
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:5 }}>
                <Clock size={10} /> {fmtTime(log.time)}
                <span style={{ marginLeft:8, padding:'1px 7px', borderRadius:5, background:'var(--card-bg)', border:'1px solid var(--card-border)', fontSize:10, fontWeight:700, color:'var(--text-muted)' }}>{log.trigger?.replace(/_/g,' ')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Automation() {
  const [workflows, setWorkflows] = useState(() => {
    try { const s = localStorage.getItem('crm_workflows'); return s ? JSON.parse(s) : SEED_WORKFLOWS; } catch { return SEED_WORKFLOWS; }
  });
  const [logs, setLogs] = useState(() => {
    try { const s = localStorage.getItem('crm_workflow_logs'); return s ? JSON.parse(s) : SEED_LOGS; } catch { return SEED_LOGS; }
  });

  useEffect(() => { localStorage.setItem('crm_workflows', JSON.stringify(workflows)); }, [workflows]);
  useEffect(() => { localStorage.setItem('crm_workflow_logs', JSON.stringify(logs)); }, [logs]);

  const [modalOpen, setModalOpen]     = useState(false);
  const [editWf, setEditWf]           = useState(null);
  const [logsOpen, setLogsOpen]       = useState(false);
  const [selectedWf, setSelectedWf]   = useState(null);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast]             = useState(null);
  const [view, setView]               = useState('grid'); // grid | builder
  const [showTemplates, setShowTemplates] = useState(false);

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const filtered = useMemo(() =>
    workflows.filter(w =>
      (!search || w.name.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'all' || (filterStatus === 'active' ? w.isActive : !w.isActive))
    ), [workflows, search, filterStatus]);

  const kpis = useMemo(() => ({
    total:    workflows.length,
    active:   workflows.filter(w=>w.isActive).length,
    runs:     logs.length,
    success:  logs.filter(l=>l.status==='Success').length,
  }), [workflows, logs]);

  const handleSave = (form) => {
    if (editWf) {
      setWorkflows(prev => prev.map(w => w.id === editWf.id ? { ...w, ...form } : w));
      showToast('Workflow updated');
    } else {
      const nw = { ...form, id:`wf-${Date.now()}`, createdAt:new Date().toISOString(), lastRun:null };
      setWorkflows(prev => [nw, ...prev]);
      showToast('Workflow created');
    }
    setModalOpen(false); setEditWf(null);
  };

  const handleToggle = id => setWorkflows(prev => prev.map(w => w.id===id ? { ...w, isActive:!w.isActive } : w));
  const handleDelete = id => { setWorkflows(prev => prev.filter(w => w.id!==id)); if(selectedWf?.id===id) setSelectedWf(null); showToast('Workflow deleted','info'); };
  const handleDuplicate = wf => { const nw = { ...wf, id:`wf-${Date.now()}`, name:`${wf.name} (Copy)`, createdAt:new Date().toISOString(), lastRun:null }; setWorkflows(prev=>[nw,...prev]); showToast('Workflow duplicated'); };

  const handleRun = useCallback((wf) => {
    const newLog = { id:`log-${Date.now()}`, workflowId:wf.id, workflowName:wf.name, trigger:wf.trigger, time:new Date().toISOString(), actions:(wf.actions||[]).map(a=>actionMeta(a.type).label), status:'Success' };
    setLogs(prev => [newLog, ...prev].slice(0,200));
    setWorkflows(prev => prev.map(w => w.id===wf.id ? { ...w, lastRun:new Date().toISOString() } : w));
    showToast(`✓ "${wf.name}" executed successfully`);
  }, []);

  const applyTemplate = (tpl) => {
    const nw = { ...tpl, id:`wf-${Date.now()}`, isActive:true, createdAt:new Date().toISOString(), lastRun:null };
    setWorkflows(prev => [nw, ...prev]);
    setShowTemplates(false);
    showToast(`Template "${tpl.name}" applied`);
  };

  const card = { background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ minHeight:'100%', background:'var(--bg-page)', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ padding:'28px 32px 40px', maxWidth:1600, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:14 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', display:'grid', placeItems:'center' }}>
                <Zap size={19} color="#2563eb" />
              </div>
              <h1 style={{ fontSize:26, fontWeight:900, color:'var(--text-primary)', margin:0, letterSpacing:'-0.6px' }}>Automation & Workflows</h1>
            </div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, paddingLeft:48 }}>Build rule-based automations: IF trigger → AND conditions → THEN actions</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={() => setShowTemplates(v=>!v)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <Layers size={15} /> Templates
            </button>
            <button onClick={() => setLogsOpen(true)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', borderRadius:11, border:'1.5px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <Activity size={15} /> Logs <span style={{ background:'#2563eb', color:'#fff', fontSize:10, borderRadius:99, padding:'1px 6px' }}>{logs.length}</span>
            </button>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => { setEditWf(null); setModalOpen(true); }}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
              <Plus size={16} /> Create Workflow
            </motion.button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 }}>
          {[
            { label:'Total Workflows', value:kpis.total,   color:'#2563eb', icon:Zap },
            { label:'Active',          value:kpis.active,  color:'#10b981', icon:ToggleRight },
            { label:'Total Runs',      value:kpis.runs,    color:'#8b5cf6', icon:Activity },
            { label:'Success Rate',    value: kpis.runs ? `${Math.round((kpis.success/kpis.runs)*100)}%` : '—', color:'#f59e0b', icon:CheckCircle2 },
          ].map((k,i) => {
            const Icon = k.icon;
            return (
              <motion.div key={k.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                style={{ ...card, padding:'18px 20px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}88)`, borderRadius:'16px 16px 0 0' }} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{k.label}</span>
                  <div style={{ width:32, height:32, borderRadius:9, background:`${k.color}12`, display:'grid', placeItems:'center' }}><Icon size={15} color={k.color} /></div>
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:k.color, letterSpacing:'-0.5px' }}>{k.value}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Templates banner */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
              style={{ overflow:'hidden', marginBottom:20 }}>
              <div style={{ ...card, padding:'18px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 style={{ margin:0, fontSize:14, fontWeight:900, color:'var(--text-primary)' }}>Quick Templates</h3>
                  <button onClick={() => setShowTemplates(false)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={16} /></button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
                  {TEMPLATES.map((tpl,i) => {
                    const t = triggerMeta(tpl.trigger); const TIcon = t.icon;
                    return (
                      <div key={i} onClick={() => applyTemplate(tpl)}
                        style={{ padding:'12px 14px', borderRadius:12, border:'1.5px solid var(--card-border)', background:'var(--input-bg)', cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor=t.color; e.currentTarget.style.background=`${t.color}06`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--card-border)'; e.currentTarget.style.background='var(--input-bg)'; }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:`${t.color}12`, display:'grid', placeItems:'center', flexShrink:0 }}><TIcon size={15} color={t.color} /></div>
                        <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{tpl.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:1, minWidth:240, position:'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workflows..."
              style={{ width:'100%', padding:'9px 10px 9px 32px', borderRadius:10, border:'1px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)', fontSize:13, outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'flex', background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:10, padding:3, gap:2 }}>
            {[['all','All'],['active','Active'],['inactive','Inactive']].map(([k,lbl]) => (
              <button key={k} onClick={() => setFilterStatus(k)}
                style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.15s',
                  background: filterStatus===k ? '#2563eb' : 'transparent',
                  color: filterStatus===k ? '#fff' : 'var(--text-muted)' }}>
                {lbl}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:10, padding:3, gap:2 }}>
            {[['grid',<List size={14}/>],['builder',<Layers size={14}/>]].map(([k,icon]) => (
              <button key={k} onClick={() => setView(k)}
                style={{ padding:'7px 12px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s',
                  background: view===k ? '#2563eb' : 'transparent',
                  color: view===k ? '#fff' : 'var(--text-muted)' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {view === 'grid' ? (
          filtered.length === 0 ? (
            <div style={{ ...card, padding:'64px', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:18, background:'var(--input-bg)', display:'grid', placeItems:'center', margin:'0 auto 16px' }}><Zap size={28} color="var(--text-muted)" style={{ opacity:0.4 }} /></div>
              <h3 style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', margin:'0 0 8px' }}>No workflows found</h3>
              <p style={{ fontSize:13, color:'var(--text-muted)', margin:'0 0 20px' }}>Create your first automation workflow to get started</p>
              <button onClick={() => setModalOpen(true)}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:10, border:'none', background:'#2563eb', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer' }}>
                <Plus size={15} /> Create Workflow
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
              {filtered.map(wf => (
                <WorkflowCard key={wf.id} wf={wf}
                  onToggle={handleToggle} onEdit={w => { setEditWf(w); setModalOpen(true); }}
                  onDelete={handleDelete} onDuplicate={handleDuplicate} onRun={handleRun} />
              ))}
            </div>
          )
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16, alignItems:'start' }}>
            <div style={{ ...card, overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--card-border)', fontSize:13, fontWeight:800, color:'var(--text-muted)' }}>Select a workflow to preview its flow</div>
              {filtered.map(wf => {
                const t = triggerMeta(wf.trigger); const TIcon = t.icon;
                const sel2 = selectedWf?.id === wf.id;
                return (
                  <div key={wf.id} onClick={() => setSelectedWf(wf)}
                    style={{ padding:'14px 18px', borderBottom:'1px solid var(--card-border)', cursor:'pointer', display:'flex', alignItems:'center', gap:12, background: sel2 ? 'rgba(37,99,235,0.05)' : 'transparent', borderLeft: sel2 ? '3px solid #2563eb' : '3px solid transparent', transition:'all 0.15s' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`${t.color}12`, display:'grid', placeItems:'center', flexShrink:0 }}><TIcon size={15} color={t.color} /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{wf.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{t.label} · {(wf.actions||[]).length} action{(wf.actions||[]).length!==1?'s':''}</div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:99, background: wf.isActive?'rgba(16,185,129,0.1)':'var(--input-bg)', color: wf.isActive?'#10b981':'var(--text-muted)' }}>{wf.isActive?'Active':'Off'}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ ...card, minHeight:400, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--card-border)', fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>
                {selectedWf ? selectedWf.name : 'Flow Preview'}
              </div>
              <VisualBuilder wf={selectedWf} />
            </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {modalOpen && <WorkflowModal onClose={() => { setModalOpen(false); setEditWf(null); }} onSave={handleSave} editWorkflow={editWf} />}
      </AnimatePresence>
      <AnimatePresence>
        {logsOpen && <LogsPanel logs={logs} workflows={workflows} onClose={() => setLogsOpen(false)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:24, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:24 }}
            style={{ position:'fixed', bottom:28, right:28, zIndex:999, background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#fff', padding:'12px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:10, boxShadow:'0 16px 40px rgba(0,0,0,0.3)', fontSize:13, fontWeight:700, border:'1px solid rgba(255,255,255,0.08)', maxWidth:360 }}>
            <div style={{ width:24, height:24, borderRadius:7, background: toast.type==='info'?'#2563eb':'#10b981', display:'grid', placeItems:'center', flexShrink:0 }}>
              {toast.type==='info' ? <Info size={13} color="#fff" /> : <Check size={13} color="#fff" />}
            </div>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
