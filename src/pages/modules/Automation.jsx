import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Activity, MessageSquare, CheckCircle, Search, Edit2, Trash2, Power, PowerOff,
  ChevronRight, ArrowLeft, Send, Save, Check
} from 'lucide-react';

const INITIAL_RULES = [
  { id: 1, name: 'Booking Confirmation Email', trigger: 'Booking Created', action: 'Send Email', active: true },
  { id: 2, name: 'Check-in Reminder (SMS)', trigger: 'Guest Checked-in', action: 'Send SMS', active: true },
  { id: 3, name: 'Post-Checkout Feedback', trigger: 'Guest Checked-out', action: 'Send Email', active: false },
  { id: 4, name: 'Payment Escalation', trigger: 'Payment Pending', action: 'Create Task', active: true },
];

const TEMPLATES = [
  { name: 'Booking Confirmation', trigger: 'Booking Created', action: 'Send Email', desc: 'Sends immediate confirmation to guest upon booking.' },
  { name: 'Check-in Reminder', trigger: 'Guest Checked-in', action: 'Send SMS', desc: 'Sends welcome SMS 1 hour before standard check-in.' },
  { name: 'Checkout Reminder', trigger: 'Guest Checked-out', action: 'Send WhatsApp message', desc: 'Sends folio and checkout link on departure morning.' },
  { name: 'Feedback Request', trigger: 'Feedback Not Submitted', action: 'Send Email', desc: 'Follows up 24h post-checkout if no feedback left.' },
];

const STEPS = [
  { id: 1, title: 'Rule Info' },
  { id: 2, title: 'Trigger Event' },
  { id: 3, title: 'Conditions' },
  { id: 4, title: 'Action' },
  { id: 5, title: 'Message Template' },
  { id: 6, title: 'Activate' },
];

export default function Automation() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [view, setView] = useState('list'); // 'list' or 'create'
  const [search, setSearch] = useState('');
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', desc: '', trigger: '', conditions: { guestType: 'All', minAmount: '', roomType: 'All' },
    action: '', message: '', active: true
  });

  const toggleRule = (id) => setRules(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const deleteRule = (id) => setRules(rs => rs.filter(r => r.id !== id));

  const saveRule = () => {
    setRules([...rules, { 
      id: Date.now(), name: formData.name || 'New Rule', 
      trigger: formData.trigger || 'Custom', action: formData.action || 'Custom', active: formData.active 
    }]);
    setView('list');
    setCurrentStep(1);
    setFormData({ name: '', desc: '', trigger: '', conditions: { guestType: 'All', minAmount: '', roomType: 'All' }, action: '', message: '', active: true });
  };

  const useTemplate = (t) => {
    setFormData({ ...formData, name: t.name, trigger: t.trigger, action: t.action, desc: t.desc });
    setView('create');
    setCurrentStep(5); // Jump to message config
  };

  const filteredRules = rules.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.trigger.toLowerCase().includes(search.toLowerCase()) || r.action.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total Rules', value: rules.length, icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { label: 'Active Rules', value: rules.filter(r => r.active).length, icon: Activity, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Messages Sent', value: '4,281', icon: MessageSquare, color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
    { label: 'Success Rate', value: '99.2%', icon: CheckCircle, color: '#059669', bg: 'rgba(5,150,105,0.15)' },
  ];

  const s = {
    page: { padding: '28px 32px', minHeight: '100%', background: 'var(--bg-page)', fontFamily: 'var(--font-main)' },
    card: { background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 20 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  };

  return (
    <div style={s.page}>
      
      {view === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap color="#2563eb" size={26}/> Automation Rules
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0' }}>Automate repetitive workflows and guest communications</p>
            </div>
            <button onClick={() => setView('create')} className="b24-btn b24-btn-primary">
              <Plus size={16} /> Create Automation
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            {stats.map((st, i) => (
              <div key={i} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <st.icon color={st.color} size={22} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{st.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{st.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>🤖 Quick Templates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {TEMPLATES.map((t, i) => (
                <div key={i} style={{ ...s.card, padding: 16, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }} 
                     onMouseOver={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-2px)' }} 
                     onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                     onClick={() => useTemplate(t)}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{t.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.5, height: 36, overflow: 'hidden' }}>{t.desc}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Use Template <ChevronRight size={14}/>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules List */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)' }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Active Workflows</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 6, padding: '6px 12px', width: 260 }}>
                <Search size={14} color="var(--text-muted)" />
                <input type="text" placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, width: '100%', color: 'var(--text-primary)' }} />
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rule Name</th>
                    <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trigger Event</th>
                    <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                    <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }} onMouseOver={e=>e.currentTarget.style.background='var(--bg-darker)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: rule.active ? '#10b981' : '#94a3b8' }} />
                          {rule.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ background: 'var(--input-bg)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid var(--input-border)' }}>
                          {rule.trigger}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: 13 }}>{rule.action}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <button onClick={() => toggleRule(rule.id)} 
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                            background: rule.active ? 'rgba(16,185,129,0.1)' : 'var(--input-bg)', 
                            color: rule.active ? '#059669' : 'var(--text-muted)' }}>
                          {rule.active ? <Power size={12}/> : <PowerOff size={12}/>} {rule.active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <button style={{ padding: 6, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 6, cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button onClick={() => deleteRule(rule.id)} style={{ padding: 6, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRules.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Zap size={40} color="var(--card-border)" style={{ marginBottom: 12 }} />
                  <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 4px', color: 'var(--text-primary)' }}>No rules found</p>
                  <p style={{ fontSize: 13, margin: 0 }}>Create an automation rule to get started or adjust your search.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {view === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: '0 auto' }}>
          
          <button onClick={() => { setView('list'); setCurrentStep(1); }} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13, marginBottom: 20, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={16} /> Back to Automations
          </button>
          
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: 'var(--card-shadow)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
            {/* Stepper Header */}
            <div style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)', padding: '24px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {/* Connecting background line */}
                <div style={{ position: 'absolute', top: 16, left: 20, right: 20, height: 2, background: 'var(--card-border)', zIndex: 0 }} />
                
                {STEPS.map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 10 }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
                        background: isActive ? '#2563eb' : isCompleted ? '#10b981' : 'var(--card-bg)',
                        color: (isActive || isCompleted) ? '#fff' : 'var(--text-muted)',
                        border: `2px solid ${(isActive || isCompleted) ? 'transparent' : 'var(--card-border)'}`,
                        boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,0.1)' : 'none'
                      }}>
                        {isCompleted ? <Check size={16} /> : step.id}
                      </div>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center', width: 80, color: (isActive || isCompleted) ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step.title}
                      </span>
                      {/* Active green line overlay */}
                      {isCompleted && idx !== STEPS.length - 1 && (
                        <div style={{ position: 'absolute', top: 16, left: '50%', width: 100, height: 2, background: '#10b981', zIndex: -1 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stepper Content */}
            <div style={{ padding: '32px 40px', minHeight: 380 }}>
              
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 500 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Rule Information</h3>
                  <div className="b24-field" style={{ marginBottom: 20 }}>
                    <label className="b24-label">Rule Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. VIP Welcome Email" 
                      className="b24-input" style={{ padding: '12px 16px', fontSize: 14 }} />
                  </div>
                  <div className="b24-field">
                    <label className="b24-label">Description</label>
                    <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="What does this rule do?" rows={3}
                      className="b24-textarea" style={{ padding: '12px 16px', fontSize: 14 }}></textarea>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 640 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Select Trigger Event</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {['Booking Created', 'Guest Checked-in', 'Guest Checked-out', 'Payment Pending', 'Feedback Not Submitted'].map(t => (
                      <button key={t} onClick={() => setFormData({...formData, trigger: t})}
                        style={{ padding: 18, borderRadius: 12, textAlign: 'left', transition: 'all 0.15s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                          background: formData.trigger === t ? 'rgba(59,130,246,0.05)' : 'var(--card-bg)',
                          border: `2px solid ${formData.trigger === t ? '#3b82f6' : 'var(--card-border)'}` }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${formData.trigger === t ? '#2563eb' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {formData.trigger === t && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: formData.trigger === t ? '#1e3a8a' : 'var(--text-secondary)' }}>{t}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 560 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Conditions (Optional)</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Rule only runs if these conditions are met.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, background: 'var(--bg-darker)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
                    <div className="b24-field" style={{ margin: 0 }}>
                      <label className="b24-label">Guest Type</label>
                      <select value={formData.conditions.guestType} onChange={e=>setFormData({...formData, conditions:{...formData.conditions, guestType: e.target.value}})} className="b24-select" style={{ padding: '10px 14px', fontSize: 14 }}>
                        <option>All</option><option>VIP Only</option><option>New Guests</option><option>Corporate</option>
                      </select>
                    </div>
                    <div className="b24-field" style={{ margin: 0 }}>
                      <label className="b24-label">Room Type</label>
                      <select value={formData.conditions.roomType} onChange={e=>setFormData({...formData, conditions:{...formData.conditions, roomType: e.target.value}})} className="b24-select" style={{ padding: '10px 14px', fontSize: 14 }}>
                        <option>All</option><option>Suites Only</option><option>Standard</option>
                      </select>
                    </div>
                    <div className="b24-field" style={{ margin: 0 }}>
                      <label className="b24-label">Min. Booking Amount ($)</label>
                      <input type="number" value={formData.conditions.minAmount} onChange={e=>setFormData({...formData, conditions:{...formData.conditions, minAmount: e.target.value}})} placeholder="Leave blank for any amount" className="b24-input" style={{ padding: '10px 14px', fontSize: 14 }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 640 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Select Action</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {['Send Email', 'Send SMS', 'Send WhatsApp message', 'Create Task', 'Send Notification'].map(a => (
                      <button key={a} onClick={() => setFormData({...formData, action: a})}
                        style={{ padding: 18, borderRadius: 12, textAlign: 'left', transition: 'all 0.15s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                          background: formData.action === a ? 'rgba(168,85,247,0.05)' : 'var(--card-bg)',
                          border: `2px solid ${formData.action === a ? '#a855f7' : 'var(--card-border)'}` }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${formData.action === a ? '#9333ea' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {formData.action === a && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#9333ea' }} />}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: formData.action === a ? '#581c87' : 'var(--text-secondary)' }}>{a}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Message Template</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Configure the exact content sent by the action.</p>
                  
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                      <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Dear {Guest Name},&#10;&#10;Welcome to..." rows={10}
                        className="b24-textarea" style={{ width: '100%', padding: 16, fontSize: 14, fontFamily: 'monospace', lineHeight: 1.6 }}></textarea>
                    </div>
                    <div style={{ flex: '0 0 240px', background: 'rgba(59,130,246,0.05)', border: '1px solid #bfdbfe', padding: 20, borderRadius: 12, alignSelf: 'flex-start' }}>
                      <h4 style={{ fontSize: 11, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>Available Variables</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['{Guest Name}', '{Room Number}', '{Check-in Date}', '{Check-out Date}', '{Total Amount}', '{Hotel Name}'].map(v => (
                          <button key={v} onClick={() => setFormData({...formData, message: formData.message + v})} 
                            style={{ textAlign: 'left', padding: '6px 10px', background: '#fff', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', color: '#1d4ed8', cursor: 'pointer', transition: 'background 0.1s' }}
                            onMouseOver={e=>e.currentTarget.style.background='#eff6ff'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                            {v}
                          </button>
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: '#3b82f6', margin: '16px 0 0', lineHeight: 1.4 }}>Click a variable to insert it at the end of your message.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Zap size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>Ready to Launch!</h3>
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 32px' }}>Your automation rule <strong style={{ color: 'var(--text-primary)' }}>"{formData.name}"</strong> is configured and ready.</p>
                  
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, background: 'var(--bg-darker)', border: '1px solid var(--card-border)', padding: '16px 24px', borderRadius: 12 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>Enable this rule immediately?</span>
                    <button onClick={() => setFormData({...formData, active: !formData.active})} 
                      style={{ position: 'relative', width: 44, height: 24, borderRadius: 20, background: formData.active ? '#10b981' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
                      <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'transform 0.3s', transform: formData.active ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Stepper Footer */}
            <div style={{ padding: '20px 30px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button disabled={currentStep === 1} onClick={() => setCurrentStep(s => s - 1)} 
                className="b24-btn b24-btn-secondary" style={{ opacity: currentStep === 1 ? 0 : 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              
              {currentStep < 6 ? (
                <button disabled={
                    (currentStep === 1 && !formData.name) || 
                    (currentStep === 2 && !formData.trigger) || 
                    (currentStep === 4 && !formData.action)
                  } 
                  onClick={() => setCurrentStep(s => s + 1)} 
                  className="b24-btn b24-btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={saveRule} className="b24-btn" style={{ background: '#10b981', color: '#fff', padding: '10px 20px', fontSize: 14 }}>
                  <Save size={16} /> Save Automation
                </button>
              )}
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
