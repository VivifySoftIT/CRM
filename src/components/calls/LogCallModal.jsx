import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, CheckCircle, Clock } from 'lucide-react';

const mockContacts = [{ id: 'c1', name: 'John Doe' }, { id: 'c2', name: 'Jane Smith' }, { id: 'c3', name: 'Acme Corp' }];
const mockDeals = [{ id: 'd1', name: 'Q4 Enterprise Deal' }, { id: 'd2', name: 'Website Redesign' }];
const mockUsers = ['John Sales', 'Alice Admin', 'Mike Ross'];

export default function LogCallModal({ isOpen, onClose, onSave, callParams = null }) {
  const [formData, setFormData] = useState({
    contactId: '',
    dealId: '',
    purpose: '',
    type: 'Outgoing',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 15, // in minutes
    status: 'Completed',
    notes: '',
    owner: 'John Sales'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (callParams) {
      setFormData(prev => ({ ...prev, ...callParams }));
    } else {
      setFormData({
        contactId: '', dealId: '', purpose: '', type: 'Outgoing',
        date: new Date().toISOString().split('T')[0], startTime: '10:00', duration: 15,
        status: 'Completed', notes: '', owner: 'John Sales'
      });
      setErrors({});
    }
  }, [callParams, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.contactId) newErrors.contactId = 'Contact is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Call purpose is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const contactMap = Object.fromEntries(mockContacts.map(c => [c.id, c.name]));

    onSave({
      ...formData,
      id: callParams?.id || `call_${Date.now()}`,
      contactName: contactMap[formData.contactId] || 'Unknown',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="b24-modal-overlay">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0 }}
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="b24-modal"
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', maxWidth: '640px' }}
        >
          {/* Header */}
          <div className="b24-modal-header">
            <h2 className="b24-modal-title flex items-center gap-2">
              <PhoneCall size={18} className="text-emerald-500" />
              {callParams?.id ? 'Edit Call Log' : 'Log a Call'}
            </h2>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="b24-modal-body custom-scrollbar" style={{ flex: 1, padding: '24px' }}>
            <form id="logCallForm" onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              
              {/* Call Info */}
              <div className="b24-row b24-row-2">
                <div className="b24-field">
                  <label className="b24-label">Contact <span className="required">*</span></label>
                  <select name="contactId" value={formData.contactId} onChange={handleChange} className={`b24-select ${errors.contactId ? 'error' : ''}`}>
                    <option value="">Select Contact...</option>
                    {mockContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.contactId && <div className="b24-error">{errors.contactId}</div>}
                </div>
                <div className="b24-field">
                  <label className="b24-label">Related Deal <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                  <select name="dealId" value={formData.dealId} onChange={handleChange} className="b24-select">
                    <option value="">None</option>
                    {mockDeals.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="b24-row b24-row-2">
                <div className="b24-field">
                  <label className="b24-label">Call Type</label>
                  <div className="b24-radio-group">
                    <label className="b24-radio">
                      <input type="radio" name="type" value="Outgoing" checked={formData.type === 'Outgoing'} onChange={handleChange} /> Outgoing
                    </label>
                    <label className="b24-radio">
                      <input type="radio" name="type" value="Incoming" checked={formData.type === 'Incoming'} onChange={handleChange} /> Incoming
                    </label>
                  </div>
                </div>
               
                <div className="b24-field">
                  <label className="b24-label">Call Purpose <span className="required">*</span></label>
                  <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className={`b24-input ${errors.purpose ? 'error' : ''}`} placeholder="e.g. Discussed pricing" />
                  {errors.purpose && <div className="b24-error">{errors.purpose}</div>}
                </div>
              </div>

              <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Time Details */}
              <h3 className="b24-section-title"><Clock size={14} color="#f59e0b" /> Date & Time</h3>
              <div className="b24-row b24-row-3">
                <div className="b24-field" style={{ gridColumn: 'span 2' }}>
                  <label className="b24-label">Date <span className="required">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className={`b24-input ${errors.date ? 'error' : ''}`} />
                  {errors.date && <div className="b24-error">{errors.date}</div>}
                </div>
                 <div className="b24-field">
                  <label className="b24-label">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="b24-input" />
                </div>
              </div>
              <div className="b24-field" style={{ width: '50%' }}>
                  <label className="b24-label flex items-center gap-1">Duration (Mins)</label>
                  <input type="number" name="duration" min="1" value={formData.duration} onChange={handleChange} className="b24-input" />
              </div>

              <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Outcome */}
              <h3 className="b24-section-title"><CheckCircle size={14} color="#10b981" /> Outcome</h3>
              
              <div className="b24-row b24-row-2">
                 <div className="b24-field">
                  <label className="b24-label">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="b24-select">
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
                <div className="b24-field">
                  <label className="b24-label">Call Owner</label>
                  <select name="owner" value={formData.owner} onChange={handleChange} className="b24-select">
                    {mockUsers.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="b24-field">
                <label className="b24-label">Call Summary / Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="b24-textarea" placeholder="Record what was discussed..." rows={3} />
              </div>

            </form>
          </div>

          {/* Footer actions */}
          <div className="b24-modal-footer">
            <button onClick={onClose} className="b24-btn b24-btn-secondary">
              Cancel
            </button>
            <button form="logCallForm" type="submit" className="b24-btn b24-btn-primary" style={{ background: '#10b981' }}>
              <PhoneCall size={14} /> Log Call
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
