import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, MapPin, Navigation, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_CONTACTS, MOCK_DEALS } from '../../data/mockVisits';

export default function VisitFormModal({ onClose, onSave, visitToEdit }) {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    contactName: '',
    dealName: '',
    location: '',
    visitDate: '',
    duration: 60,
    notes: '',
    owner: 'John Sales'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visitToEdit) {
      setFormData({
        title: visitToEdit.title || '',
        contactName: visitToEdit.contactName || '',
        dealName: visitToEdit.dealName || '',
        location: visitToEdit.location || '',
        visitDate: visitToEdit.visitDate ? visitToEdit.visitDate.substring(0, 16) : '',
        duration: visitToEdit.duration || 60,
        notes: visitToEdit.notes || '',
        owner: visitToEdit.owner || 'John Sales'
      });
    }
  }, [visitToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title required';
    if (!formData.contactName) newErrors.contactName = 'Contact required';
    if (!formData.location.trim()) newErrors.location = 'Location required';
    if (!formData.visitDate) newErrors.visitDate = 'Date & Time required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    // Simulate Geocoding
    const mockLat = 37.0 + (Math.random() * 10);
    const mockLng = -122.0 + (Math.random() * 6);

    onSave({
      ...formData,
      visitDate: new Date(formData.visitDate).toISOString(),
      latitude: visitToEdit?.latitude || mockLat, // keep old or gen new
      longitude: visitToEdit?.longitude || mockLng
    });
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const textTitle = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: textMuted, marginBottom: 8, paddingLeft: 4 };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{ 
          background: modalBg, width: '100%', maxWidth: 700, maxHeight: '90vh',
          border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: 24, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: modalBg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
               <Navigation size={22} strokeWidth={2.5} />
             </div>
             <div>
               <h2 style={{ fontSize: 20, fontWeight: 900, color: textTitle, margin: 0 }}>
                 {visitToEdit ? 'Reschedule Visit' : 'Schedule Visit'}
               </h2>
               <p style={{ fontSize: 13, fontWeight: 600, color: textMuted, margin: '2px 0 0 0' }}>Plan a field meeting or site visit</p>
             </div>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}><X size={20}/></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             <div style={{ gridColumn: '1 / -1' }}>
               <label style={labelStyle}>Visit Title *</label>
               <input name="title" value={formData.title} onChange={handleChange} className={`b24-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Quarterly Review" style={{ width: '100%' }} />
             </div>
             
             <div>
               <label style={labelStyle}>Contact *</label>
               <select name="contactName" value={formData.contactName} onChange={handleChange} className={`b24-select ${errors.contactName ? 'error' : ''}`} style={{ width: '100%' }}>
                 <option value="">Select Contact</option>
                 {MOCK_CONTACTS.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <label style={labelStyle}>Related Deal</label>
               <select name="dealName" value={formData.dealName} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                 <option value="">Select Deal (Optional)</option>
                 {MOCK_DEALS.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 24, borderRadius: 16, border: `1px solid ${border}`, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
             <div style={{ gridColumn: '1 / -1' }}>
               <label style={labelStyle}><span style={{display:'flex', alignItems:'center', gap:8}}><MapPin size={14}/> Full Address *</span></label>
               <input name="location" value={formData.location} onChange={handleChange} className={`b24-input ${errors.location ? 'error' : ''}`} placeholder="123 Market St, San Francisco, CA" style={{ width: '100%' }} />
             </div>

             <div>
               <label style={labelStyle}><span style={{display:'flex', alignItems:'center', gap:8}}><CalendarIcon size={14}/> Date & Time *</span></label>
               <input type="datetime-local" name="visitDate" value={formData.visitDate} onChange={handleChange} className={`b24-input ${errors.visitDate ? 'error' : ''}`} style={{ width: '100%' }} />
             </div>
             
             <div>
               <label style={labelStyle}>Duration (Minutes) *</label>
               <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="b24-input" min="15" step="15" style={{ width: '100%' }} />
             </div>
           </div>

           <div>
             <label style={labelStyle}>Visit Agenda / Notes</label>
             <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange} className="b24-textarea" placeholder="What is the objective of this visit?" style={{ width: '100%', resize: 'none' }} />
           </div>

        </div>

        <div style={{ padding: 24, borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'flex-end', gap: 12, background: isDark ? 'rgba(255,255,255,0.01)' : '#f9fafb' }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ padding: '10px 24px', borderRadius: 10 }}>Cancel</button>
          <button onClick={handleSubmit} className="b24-btn b24-btn-primary" style={{ padding: '10px 32px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> Save Visit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
