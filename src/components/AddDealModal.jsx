import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, DollarSign, Building2, User, Calendar, Tag, AlertCircle, RefreshCw, Loader2, Target
} from 'lucide-react';
import { SuccessToast } from './AddContactModal'; // Reusing toast UI or copy pasting

export const STAGES = [
  { id: 'new',        label: 'New',       prob: 20 },
  { id: 'contacted',  label: 'Contacted', prob: 40 },
  { id: 'qualified',  label: 'Qualified', prob: 60 },
  { id: 'proposal',   label: 'Proposal',  prob: 80 },
  { id: 'converted',  label: 'Converted', prob: 100 }
];

const OWNERS = ['John Sales', 'Sarah Doe', 'Mike Ross'];

function Field({ label, required, error, hint, children }) {
  return (
    <div className="b24-field" style={{ marginBottom: 0 }}>
      <label className="b24-label">
        {label}{required && <span style={{ color: '#e53935', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <span className="b24-error" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: '#e53935' }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
      {hint && !error && <span className="b24-hint" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</span>}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, color = '#2563eb' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontWeight: 800, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 16, paddingBottom: 10,
      borderBottom: '1px solid var(--card-border)'
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        background: `${color}18`, display: 'grid', placeItems: 'center'
      }}>
        <Icon size={14} color={color} />
      </span>
      {title}
    </div>
  );
}

const INIT_FORM = {
  name: '', amount: '', stage: 'new',
  contact: '', account: '',
  closeDate: '', owner: OWNERS[0],
  probability: 20, notes: '', isAutoProb: true
};

export default function AddDealModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(INIT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { 
      setForm(INIT_FORM); 
      setErrors({}); 
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (k, v) => {
    setForm(prev => {
      let updates = { [k]: v };
      
      // Auto probability mapping
      if (k === 'stage' && prev.isAutoProb) {
         const stageObj = STAGES.find(s => s.id === v);
         if(stageObj) updates.probability = stageObj.prob;
      }
      
      // Turn off auto if manual edit
      if (k === 'probability') {
        updates.isAutoProb = false;
        // ensure bounds
        if(Number(v) < 0) updates.probability = 0;
        if(Number(v) > 100) updates.probability = 100;
      }
      
      return { ...prev, ...updates };
    });
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Deal name is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Valid amount is required';
    if (!form.stage) errs.stage = 'Stage is required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const newDeal = {
      id: Date.now(),
      name: form.name.trim(),
      amount: Number(form.amount),
      stage: form.stage,
      contact: form.contact.trim() || 'No Contact',
      account: form.account.trim() || 'No Company',
      closeDate: form.closeDate || 'TBD',
      owner: form.owner,
      probability: Number(form.probability) || 0,
      notes: form.notes
    };

    onAdd(newDeal);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1101, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px', pointerEvents: 'none'
            }}
          >
             <div style={{
               pointerEvents: 'auto', background: 'var(--card-bg)', borderRadius: 16, width: '100%', maxWidth: 640,
               maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)'
             }}>
               {/* ── Header ── */}
               <div style={{
                 padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 background: 'var(--bg-darker)', borderRadius: '16px 16px 0 0'
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'grid', placeItems: 'center' }}>
                     <Target size={20} color="#2563eb" />
                   </div>
                   <div>
                     <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Add New Deal</h2>
                     <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Create a new opportunity in your pipeline</p>
                   </div>
                 </div>
                 <button onClick={() => !loading && onClose()} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, width: 36, height: 36, padding: 0, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                   <X size={18} />
                 </button>
               </div>

               {/* ── Scrollable Body ── */}
               <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                 
                 {/* Section 1: Deal Info */}
                 <div>
                    <SectionHeading icon={Target} title="Deal Info" color="#2563eb" />
                    <div style={{ display: 'grid', gap: 14 }}>
                      <Field label="Deal Name" required error={errors.name}>
                        <div style={{ position: 'relative' }}>
                          <input className={`b24-input ${errors.name ? 'error' : ''}`} placeholder="e.g., Enterprise Site License" value={form.name} onChange={e => set('name', e.target.value)} />
                        </div>
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="Deal Amount (₹)" required error={errors.amount}>
                          <div style={{ position: 'relative' }}>
                             <DollarSign size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                             <input type="number" step="1000" className={`b24-input ${errors.amount ? 'error' : ''}`} style={{ paddingLeft: 34 }} placeholder="100000" value={form.amount} onChange={e => set('amount', e.target.value)} />
                          </div>
                        </Field>
                        <Field label="Deal Stage" required error={errors.stage}>
                           <select className="b24-select" value={form.stage} onChange={e => set('stage', e.target.value)}>
                             {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                           </select>
                        </Field>
                      </div>
                    </div>
                 </div>

                 {/* Section 2: Contact & Company */}
                 <div>
                    <SectionHeading icon={User} title="Contact & Company" color="#8b5cf6" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Contact Name">
                         <div style={{ position: 'relative' }}>
                           <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                           <input className="b24-input" style={{ paddingLeft: 34 }} placeholder="e.g. John Doe" value={form.contact} onChange={e => set('contact', e.target.value)} />
                         </div>
                      </Field>
                      <Field label="Company Name">
                         <div style={{ position: 'relative' }}>
                           <Building2 size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                           <input className="b24-input" style={{ paddingLeft: 34 }} placeholder="e.g. Acme Corp" value={form.account} onChange={e => set('account', e.target.value)} />
                         </div>
                      </Field>
                    </div>
                 </div>

                 {/* Section 3 & 4 combined contextually for UI balance */}
                 <div>
                    <SectionHeading icon={Calendar} title="Timeline & Ownership" color="#10b981" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Expected Close Date">
                         <input type="date" className="b24-input" value={form.closeDate} onChange={e => set('closeDate', e.target.value)} />
                      </Field>
                      <Field label="Deal Owner">
                         <select className="b24-select" value={form.owner} onChange={e => set('owner', e.target.value)}>
                           {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                         </select>
                      </Field>
                    </div>
                 </div>

                 {/* Section 5: Additional Info */}
                 <div>
                    <SectionHeading icon={Tag} title="Additional Information" color="#eab308" />
                    <div style={{ display: 'grid', gap: 14 }}>
                       <Field label="Probability (%)" hint={form.isAutoProb ? "Auto-calculated based on stage." : "Manual override."}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <input type="number" min="0" max="100" className="b24-input" style={{ width: 100 }} value={form.probability} onChange={e => set('probability', e.target.value)} />
                           {!form.isAutoProb && (
                             <button type="button" onClick={() => setForm(f => ({...f, isAutoProb: true, probability: STAGES.find(s=>s.id===f.stage)?.prob || 20 }))} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                               <RefreshCw size={12} /> Reset to Auto
                             </button>
                           )}
                         </div>
                       </Field>
                       <Field label="Internal Notes">
                         <textarea className="b24-textarea" placeholder="Add any background context..." rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
                       </Field>
                    </div>
                 </div>

               </div>

               {/* ── Footer ── */}
               <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 12, justifyContent: 'flex-end', background: 'var(--bg-page)', borderRadius: '0 0 16px 16px' }}>
                 <button className="b24-btn b24-btn-secondary" onClick={() => !loading && onClose()} disabled={loading} style={{ padding: '10px 20px' }}>Cancel</button>
                 <button className="b24-btn b24-btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px' }}>
                   {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={16} /></motion.div> : "Create Deal"}
                 </button>
               </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
