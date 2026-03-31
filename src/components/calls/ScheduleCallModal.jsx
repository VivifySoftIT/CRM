import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, UserPlus, FileText, Clock, Bell } from 'lucide-react';

const mockContacts = [{ id: 'c1', name: 'John Doe' }, { id: 'c2', name: 'Jane Smith' }, { id: 'c3', name: 'Acme Corp' }];
const mockDeals = [{ id: 'd1', name: 'Q4 Enterprise Deal' }, { id: 'd2', name: 'Website Redesign' }];
const mockUsers = ['John Sales', 'Alice Admin', 'Mike Ross'];

export default function ScheduleCallModal({ isOpen, onClose, onSave, callParams = null }) {
  const [formData, setFormData] = useState({
    contactId: '',
    dealId: '',
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 15,
    reminder: '15 min',
    status: 'Scheduled',
    owner: 'John Sales',
    notes: '',
    type: 'Outgoing' // Assume scheduled calls are outgoing by default
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (callParams) {
      setFormData(prev => ({ ...prev, ...callParams }));
    } else {
      setFormData({
        contactId: '', dealId: '', purpose: '',
        date: new Date().toISOString().split('T')[0], startTime: '10:00', duration: 15,
        reminder: '15 min', status: 'Scheduled', owner: 'John Sales', notes: '', type: 'Outgoing'
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

    // Contact name map
    const contactMap = Object.fromEntries(mockContacts.map(c => [c.id, c.name]));

    onSave({
      ...formData,
      id: callParams?.id || `call_${Date.now()}`,
      contactName: contactMap[formData.contactId] || 'Unknown',
      // For scheduled calls, endTime is calculated dynamically for display, but let's record the status
      status: 'Scheduled'
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
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', maxWidth: '580px' }}
        >
          {/* Header */}
          <div className="b24-modal-header">
            <h2 className="b24-modal-title flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              {callParams?.id ? 'Edit Scheduled Call' : 'Schedule Call'}
            </h2>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="b24-modal-body custom-scrollbar" style={{ flex: 1, padding: '24px' }}>
            <form id="scheduleCallForm" onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              
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

              <div className="b24-field">
                <label className="b24-label">Call Purpose <span className="required">*</span></label>
                <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className={`b24-input ${errors.purpose ? 'error' : ''}`} placeholder="e.g., Follow up on exact requirements" />
                {errors.purpose && <div className="b24-error">{errors.purpose}</div>}
              </div>

              <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Time Details */}
              <h3 className="b24-section-title"><Clock size={14} color="#f59e0b" /> Date & Time</h3>
              <div className="b24-row b24-row-2">
                <div className="b24-field">
                  <label className="b24-label">Date <span className="required">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className={`b24-input ${errors.date ? 'error' : ''}`} />
                  {errors.date && <div className="b24-error">{errors.date}</div>}
                </div>
                 <div className="b24-field">
                  <label className="b24-label">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="b24-input" />
                </div>
              </div>

              <div className="b24-row b24-row-2">
                <div className="b24-field">
                  <label className="b24-label">Duration (Mins)</label>
                  <select name="duration" value={formData.duration} onChange={handleChange} className="b24-select">
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">1 Hour</option>
                  </select>
                </div>
                <div className="b24-field">
                  <label className="b24-label flex items-center gap-1"><Bell size={12} /> Reminder</label>
                  <select name="reminder" value={formData.reminder} onChange={handleChange} className="b24-select">
                    <option value="None">None</option>
                    <option value="5 min">5 Minutes Before</option>
                    <option value="15 min">15 Minutes Before</option>
                    <option value="1 hour">1 Hour Before</option>
                  </select>
                </div>
              </div>

              <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Notes */}
              <div className="b24-field">
                <label className="b24-label">Preparation Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="b24-textarea" placeholder="Agenda or things to discuss..." rows={2} />
              </div>

              {/* Ownership */}
              <div className="b24-field" style={{ width: '50%' }}>
                <label className="b24-label">Call Owner</label>
                <select name="owner" value={formData.owner} onChange={handleChange} className="b24-select">
                  {mockUsers.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

            </form>
          </div>

          {/* Footer actions */}
          <div className="b24-modal-footer">
            <button onClick={onClose} className="b24-btn b24-btn-secondary">
              Cancel
            </button>
            <button form="scheduleCallForm" type="submit" className="b24-btn b24-btn-primary">
              <Calendar size={14} /> Schedule Call
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
