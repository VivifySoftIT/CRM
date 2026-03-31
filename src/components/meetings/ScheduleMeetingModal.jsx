import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Video, CheckSquare } from 'lucide-react';

const mockContacts = [{ id: 'c1', name: 'John Doe' }, { id: 'c2', name: 'Jane Smith' }, { id: 'c3', name: 'Acme Corp' }];
const mockDeals = [{ id: 'd1', name: 'Q4 Enterprise Deal' }, { id: 'd2', name: 'Website Redesign' }];

export default function ScheduleMeetingModal({ isOpen, onClose, onSave, meeting = null }) {
  const [formData, setFormData] = useState({
    title: '', description: '', participants: [], users: [], relatedContact: '', relatedDeal: '',
    date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', duration: 60, locationType: 'Online',
    meetingLink: '', address: '', status: 'Scheduled', owner: 'John Sales'
  });
  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (meeting) { setFormData(meeting); }
    else {
      setFormData({
        title: '', description: '', participants: [], users: [], relatedContact: '', relatedDeal: '',
        date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', duration: 60, locationType: 'Online',
        meetingLink: '', address: '', status: 'Scheduled', owner: 'John Sales'
      });
    }
  }, [meeting, isOpen]);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const startParts = formData.startTime.split(':');
      const endParts = formData.endTime.split(':');
      const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      if (endMins > startMins) {
        setFormData(prev => ({ ...prev, duration: endMins - startMins }));
        setErrors(prev => ({ ...prev, time: null }));
      } else {
        setErrors(prev => ({ ...prev, time: 'End time must be after start time' }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleParticipantToggle = (contact) => {
    setFormData(prev => {
      const exists = prev.participants.find(p => p.id === contact.id);
      if (exists) return { ...prev, participants: prev.participants.filter(p => p.id !== contact.id) };
      return { ...prev, participants: [...prev.participants, contact] };
    });
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Meeting Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (errors.time) newErrors.time = errors.time;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ ...formData, id: meeting?.id || Date.now().toString() });
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
            <h2 className="b24-modal-title">
              {meeting ? 'Edit Meeting' : 'Schedule Meeting'}
            </h2>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="b24-modal-body custom-scrollbar" style={{ flex: 1, padding: '24px' }}>
            <form id="meetingForm" onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              
              {/* Sec 1: Info */}
              <div className="b24-field">
                <label className="b24-label">Meeting Title <span className="required">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={`b24-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Q1 Roadmap Review" />
                {errors.title && <div className="b24-error">{errors.title}</div>}
              </div>

              <div className="b24-field">
                <label className="b24-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="b24-textarea" placeholder="Meeting agenda..." rows={2} />
              </div>

              {/* Sec 2: Participants */}
              <div className="b24-field">
                <label className="b24-label">Invite Contacts</label>
                <div style={{ position: 'relative' }}>
                  <div className="b24-input" style={{ minHeight: '38px', height: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }} onClick={() => setShowDropdown(true)}>
                    {formData.participants.map(p => (
                      <span key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 12, fontWeight: 700 }}>
                        {p.name}
                        <X size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleParticipantToggle(p); }} />
                      </span>
                    ))}
                    {!formData.participants.length && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Click to add participants...</span>}
                  </div>
                  
                  {showDropdown && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowDropdown(false)} />
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, boxShadow: 'var(--card-shadow)', zIndex: 11, maxHeight: 180, overflowY: 'auto' }}>
                        {mockContacts.filter(c => !formData.participants.find(p => p.id === c.id)).map(c => (
                          <div key={c.id} onClick={() => handleParticipantToggle(c)} style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)', borderBottom: '1px solid var(--card-border)' }}>
                            {c.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sec 3: Related Records */}
               <div className="b24-row b24-row-2">
                 <div className="b24-field">
                  <label className="b24-label">Related Contact</label>
                  <select name="relatedContact" value={formData.relatedContact} onChange={handleChange} className="b24-select">
                    <option value="">None</option>
                    {mockContacts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="b24-field">
                  <label className="b24-label">Related Deal</label>
                  <select name="relatedDeal" value={formData.relatedDeal} onChange={handleChange} className="b24-select">
                    <option value="">None</option>
                    {mockDeals.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Sec 4: Schedule */}
               <h3 className="b24-section-title"><Calendar size={14} color="#2563eb" /> Schedule</h3>
               <div className="b24-row b24-row-3">
                <div className="b24-field">
                  <label className="b24-label">Date <span className="required">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="b24-input" />
                </div>
                <div className="b24-field">
                  <label className="b24-label">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="b24-input" />
                </div>
                 <div className="b24-field">
                  <label className="b24-label">End Time <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({formData.duration}m)</span></label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={`b24-input ${errors.time ? 'error' : ''}`} />
                  {errors.time && <div className="b24-error">{errors.time}</div>}
                </div>
              </div>

               <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

              {/* Sec 5: Location */}
              <h3 className="b24-section-title"><MapPin size={14} color="#7c3aed" /> Location</h3>
              <div className="b24-radio-group" style={{ marginBottom: 16 }}>
                <label className="b24-radio">
                  <input type="radio" name="locationType" value="Online" checked={formData.locationType === 'Online'} onChange={handleChange} /> Online
                </label>
                <label className="b24-radio">
                  <input type="radio" name="locationType" value="Offline" checked={formData.locationType === 'Offline'} onChange={handleChange} /> Offline
                </label>
              </div>

               {formData.locationType === 'Online' ? (
                <div className="b24-field">
                  <label className="b24-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Video size={12} color="var(--text-muted)"/> Meeting Link
                  </label>
                  <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} className="b24-input" placeholder="https://zoom.us/j/..." />
                </div>
              ) : (
                <div className="b24-field">
                  <label className="b24-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={12} color="var(--text-muted)"/> Address
                  </label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="b24-input" placeholder="Conference Room..." />
                </div>
              )}

             <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

               {/* Sec 6 & 7: Ownership & Status */}
               <div className="b24-row b24-row-2">
                 <div className="b24-field">
                  <label className="b24-label">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="b24-select">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Postponed">Postponed</option>
                  </select>
                </div>
                <div className="b24-field">
                  <label className="b24-label">Organizer</label>
                  <select name="owner" value={formData.owner} onChange={handleChange} className="b24-select">
                    <option value="John Sales">John Sales</option>
                    <option value="Alice Admin">Alice Admin</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Footer actions */}
          <div className="b24-modal-footer">
            <button onClick={onClose} className="b24-btn b24-btn-secondary">
              Cancel
            </button>
            <button form="meetingForm" type="submit" className="b24-btn b24-btn-primary">
              <CheckSquare size={14} /> Save Meeting
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
