import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Rocket, Mail, MessageSquare, Share2, Calendar, Target, DollarSign, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CAMPAIGN_TYPES } from '../../data/mockCampaigns';

export default function CreateCampaignForm({ onClose, onSave, campaignToEdit }) {
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Email Campaign',
    status: 'Planned',
    startDate: '',
    endDate: '',
    budget: '',
    targetAudience: '',
    content: '',
    owner: 'Sarah Doe',
    expectedRevenue: '',
    expectedResponse: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (campaignToEdit) {
      setFormData({
        ...campaignToEdit,
        startDate: campaignToEdit.startDate.split('T')[0],
        endDate: campaignToEdit.endDate.split('T')[0],
        targetAudience: Array.isArray(campaignToEdit.targetAudience) ? campaignToEdit.targetAudience.join(', ') : campaignToEdit.targetAudience
      });
    }
  }, [campaignToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    const submittedData = {
      ...formData,
      budget: parseFloat(formData.budget),
      targetAudience: formData.targetAudience.split(',').map(s => s.trim()).filter(Boolean),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    
    onSave(submittedData);
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4 };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        style={{ 
          background: modalBg, width: '100%', maxWidth: 880, maxHeight: '90vh',
          borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', display: 'grid', placeItems: 'center', color: '#fff' }}>
              <Rocket size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{campaignToEdit ? 'Edit Campaign' : 'Create New Campaign'}</h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>Define your marketing goals and audience</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
          
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div>
              <label style={labelStyle}>Campaign Name *</label>
              <input 
                name="name" value={formData.name} onChange={handleChange} 
                className={`b24-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Q4 Growth Acceleration" style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label style={labelStyle}>Campaign Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Schedule & Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: 32, borderRadius: 20, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${border}` }}>
            <div>
              <label style={labelStyle}><Calendar size={12} style={{marginRight:6}}/> Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="b24-input" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}><Calendar size={12} style={{marginRight:6}}/> End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="b24-input" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}><DollarSign size={12} style={{marginRight:6}}/> Planned Budget</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="b24-input" placeholder="0.00" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Audience & Goals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={labelStyle}><Target size={12} style={{marginRight:6}}/> Target Audience (comma separated)</label>
              <input name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="b24-input" placeholder="Tech CEOs, Marketing Managers..." style={{ width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}>Expected Revenue</label>
              <input type="number" name="expectedRevenue" value={formData.expectedRevenue} onChange={handleChange} className="b24-input" placeholder="$0.00" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Content Block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Campaign Content</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {formData.type === 'Email Campaign' && <span style={{ fontSize: 10, fontWeight: 900, background: '#3b82f615', color: '#3b82f6', padding: '2px 8px', borderRadius: 4 }}>RICH TEXT EDITOR ACTIVE</span>}
                {formData.type === 'SMS Campaign' && <span style={{ fontSize: 10, fontWeight: 900, background: '#f59e0b15', color: '#f59e0b', padding: '2px 8px', borderRadius: 4 }}>{formData.content.length}/160 CHARS</span>}
              </div>
            </div>
            <textarea 
              name="content" value={formData.content} onChange={handleChange}
              placeholder={formData.type === 'SMS Campaign' ? 'Enter short SMS message...' : 'Enter your email body or social post content...'}
              className="b24-textarea" style={{ width: '100%', minHeight: 180, resize: 'none' }}
            />
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'flex-end', gap: 12, background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ padding: '12px 24px', borderRadius: 12 }}>Cancel</button>
          <button onClick={handleSubmit} className="b24-btn b24-btn-primary" style={{ padding: '12px 32px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={18} /> {campaignToEdit ? 'Update Campaign' : 'Launch Campaign'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
