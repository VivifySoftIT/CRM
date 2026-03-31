import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, LifeBuoy, User, Box, 
  ShieldAlert, UserCheck, Paperclip, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../data/mockCases';

export default function CreateCaseModal({ onClose, onSubmit, caseToEdit }) {
  const { isDark } = useTheme();
  
  const MOCK_CONTACTS = ['Jane Smith', 'Acme Corp', 'John Doe', 'Diana Prince', 'Charlie Brown'];
  const MOCK_DEALS = ['Annual Maintenance', 'Website Redesign', 'Enterprise Implementation'];
  const MOCK_USERS = ['Alice Admin', 'Bob Manager', 'Sarah Executive', 'John Sales'];
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    contactName: '',
    relatedDeal: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Alice Admin',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (caseToEdit) {
      setFormData({
        ...caseToEdit,
        attachments: caseToEdit.attachments || []
      });
    }
  }, [caseToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.contactName) newErrors.contactName = 'Customer contact is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const overlayBg = 'rgba(0, 0, 0, 0.4)';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const textTitle = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  const sectionLabel = {
    display: 'block', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4
  };
  
  const sectionHeader = (icon, title) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
      <div style={{ color: '#3b82f6' }}>{icon}</div>
      <h3 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: textTitle }}>{title}</h3>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, backdropFilter: 'blur(4px)', background: overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{ 
          background: modalBg, width: '100%', maxWidth: 850, maxHeight: '90vh',
          border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          borderRadius: 30, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: 24, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, background: modalBg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' }}>
              <LifeBuoy size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: textTitle, margin: 0 }}>
                {caseToEdit ? 'Edit Support Case' : 'Create Support Case'}
              </h2>
              <p style={{ fontSize: 12, fontWeight: 700, color: textMuted, margin: '4px 0 0 0' }}>Log details to help resolve the underlying issue quickly</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color={textMuted} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            
            {/* Left Column: Core Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Section 1: Customer Info */}
              <div>
                {sectionHeader(<User size={18} />, "Customer Data")}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={sectionLabel}>Contact Name *</label>
                    <select
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className={`b24-select ${errors.contactName ? 'error' : ''}`}
                      style={{ width: '100%' }}
                    >
                      <option value="">Search & Select Contact</option>
                      {MOCK_CONTACTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.contactName && <p style={{ color: '#ef4444', fontSize: 10, fontWeight: 900, marginTop: 4, marginLeft: 4, textTransform: 'uppercase' }}>{errors.contactName}</p>}
                  </div>
                  <div>
                    <label style={sectionLabel}>Related Deal (Optional)</label>
                    <select
                      name="relatedDeal"
                      value={formData.relatedDeal}
                      onChange={handleChange}
                      className="b24-select"
                      style={{ width: '100%' }}
                    >
                      <option value="">No Deal Linked</option>
                      {MOCK_DEALS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Case Info */}
              <div>
                {sectionHeader(<Box size={18} />, "Issue Details")}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={sectionLabel}>Subject (Case Title) *</label>
                    <input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., Cannot access billing dashboard"
                      className={`b24-input ${errors.subject ? 'error' : ''}`}
                      style={{ width: '100%' }}
                    />
                    {errors.subject && <p style={{ color: '#ef4444', fontSize: 10, fontWeight: 900, marginTop: 4, marginLeft: 4, textTransform: 'uppercase' }}>{errors.subject}</p>}
                  </div>
                  <div>
                    <label style={sectionLabel}>Full Description *</label>
                    <textarea 
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please explicitly detail the bug / request..."
                      className={`b24-textarea ${errors.description ? 'error' : ''}`}
                      style={{ width: '100%', resize: 'none' }}
                    />
                    {errors.description && <p style={{ color: '#ef4444', fontSize: 10, fontWeight: 900, marginTop: 4, marginLeft: 4, textTransform: 'uppercase' }}>{errors.description}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Routing & Priority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Section 3: Priority & Status */}
              <div>
                 {sectionHeader(<ShieldAlert size={18} />, "Routing Settings")}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={sectionLabel}>Priority Ranking</label>
                      <select name="priority" value={formData.priority} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                        {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={sectionLabel}>Current Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                 </div>
              </div>

              {/* Section 4: Assignment */}
              <div>
                {sectionHeader(<UserCheck size={18} />, "Assignment")}
                <div>
                  <label style={sectionLabel}>Assign Case To</label>
                  <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                    {MOCK_USERS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Section 5: Attachments Mock */}
              <div>
                {sectionHeader(<Paperclip size={18} />, "Attachments")}
                <div 
                  style={{ border: `2px dashed ${border}`, borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Paperclip size={20} style={{ color: textMuted, marginBottom: 8 }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: textTitle }}>Drop files here or click to upload</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textMuted, marginTop: 4 }}>JPG, PNG, PDF up to 10MB</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: 24, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, zIndex: 10, background: isDark ? 'rgba(255,255,255,0.01)' : '#f9fafb' }}>
          <button 
            onClick={onClose} 
            className="b24-btn b24-btn-secondary"
            style={{ padding: '10px 24px', borderRadius: 12 }}
          >
            Cancel
          </button>
          <button 
            disabled={isSubmitting}
            onClick={handleSave}
            className="b24-btn b24-btn-primary"
            style={{ padding: '10px 32px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Saving Case...</span>
            ) : (
              <><Save size={18} /> {caseToEdit ? 'Save Changes' : 'Create Case'}</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
