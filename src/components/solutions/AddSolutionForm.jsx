import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Save, BookOpen, Tag,
  Bold, Italic, Link as LinkIcon, List as ListIcon, 
  Heading1, Heading2, Image as ImageIcon, Eye
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AddSolutionForm({ onClose, onSubmit, solutionToEdit, categories }) {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    category: categories[0] || '',
    content: '',
    tags: [],
    status: 'Draft',
    author: 'Alice Admin',
    attachments: []
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (solutionToEdit) {
      setFormData({
        ...solutionToEdit,
        tags: solutionToEdit.tags || []
      });
    }
  }, [solutionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !formData.tags.includes(val)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev, tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('solution-content');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    let insertion = '';
    switch(format) {
      case 'bold': insertion = `<strong>${selectedText || 'bold text'}</strong>`; break;
      case 'italic': insertion = `<em>${selectedText || 'italic text'}</em>`; break;
      case 'h1': insertion = `<h3>${selectedText || 'Heading'}</h3>`; break;
      case 'h2': insertion = `<h4>${selectedText || 'Subheading'}</h4>`; break;
      case 'list': insertion = `<ul>\n<li>${selectedText || 'List item'}</li>\n</ul>`; break;
      case 'link': insertion = `<a href="url">${selectedText || 'link text'}</a>`; break;
      default: return;
    }

    const newContent = formData.content.substring(0, start) + insertion + formData.content.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const validate = () => {
    const newErrors = {};
    if(!formData.title.trim()) newErrors.title = "Required";
    if(!formData.category) newErrors.category = "Required";
    if(!formData.content.trim()) newErrors.content = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status) => {
    if(!validate()) return;
    onSubmit({ ...formData, status });
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const textTitle = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  const sectionLabelStyle = { display: 'block', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4 };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{ 
          background: modalBg, width: '100%', maxWidth: 1000, height: '90vh',
          border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: 24, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, background: modalBg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
              <BookOpen size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: textTitle, margin: 0 }}>
                {solutionToEdit ? 'Edit Solution Article' : 'Write Solution Article'}
              </h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: textMuted, margin: '2px 0 0 0' }}>Authoring as {formData.author}</p>
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

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', gap: 48 }}>
           
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                 <label style={sectionLabelStyle}>Article Title</label>
                 <input 
                   name="title" value={formData.title} onChange={handleChange}
                   placeholder="e.g. Setting up Two-Factor Authentication"
                   className={`b24-input ${errors.title ? 'error' : ''}`}
                   style={{ width: '100%', fontSize: 16, padding: '14px 16px', fontWeight: 700 }}
                 />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <label style={{ ...sectionLabelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Article Content (Supports Basic HTML)
                 </label>
                 
                 <div style={{ border: `1px solid ${errors.content ? '#ef4444' : border}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, background: isDark ? 'rgba(0,0,0,0.2)' : '#fff' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '8px 12px', borderBottom: `1px solid ${border}`, display: 'flex', gap: 4, background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                       {[
                         { icon: Bold, act: 'bold' }, { icon: Italic, act: 'italic' },
                         { icon: Heading1, act: 'h1' }, { icon: Heading2, act: 'h2' },
                         { icon: ListIcon, act: 'list' }, { icon: LinkIcon, act: 'link' }
                       ].map((Action, i) => (
                         <button
                           key={i} type="button" onClick={() => insertFormatting(Action.act)}
                           style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: textMuted }}
                           onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}
                           onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                         >
                           <Action.icon size={16} />
                         </button>
                       ))}
                    </div>
                    {/* Editor Space */}
                    <textarea 
                       id="solution-content" name="content" value={formData.content} onChange={handleChange}
                       placeholder="Write down the troubleshooting steps or guide..."
                       style={{ flex: 1, width: '100%', resize: 'none', padding: 16, background: 'transparent', border: 'none', color: textTitle, fontSize: 14, fontFamily: 'monospace', outline: 'none' }}
                    />
                 </div>
              </div>
           </div>

           <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              <div>
                <label style={sectionLabelStyle}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="b24-select" style={{ width: '100%' }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ ...sectionLabelStyle, display: 'flex', gap: 8 }}><Tag size={12}/> Search Tags</label>
                <input 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag & press Enter"
                  className="b24-input"
                  style={{ width: '100%', marginBottom: 12 }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {formData.tags.map(t => (
                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--input-bg)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: textMuted, border: `1px solid ${border}` }}>
                      {t}
                      <button onClick={() => handleRemoveTag(t)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: textMuted }}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={sectionLabelStyle}>Attachments</label>
                <div style={{ border: `2px dashed ${border}`, borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                   <ImageIcon size={20} color={textMuted} style={{ margin: '0 auto 8px' }} />
                   <div style={{ fontSize: 12, fontWeight: 700, color: textMuted }}>Upload Images / Docs</div>
                </div>
              </div>

           </div>

        </div>

        {/* Footer */}
        <div style={{ padding: 24, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, background: isDark ? 'rgba(255,255,255,0.01)' : '#f9fafb' }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ padding: '10px 24px', borderRadius: 10 }}>Cancel</button>
          <button 
            onClick={() => handleSave('Draft')}
            style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--input-bg)', color: textTitle, border: `1px solid ${border}`, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('Published')}
            className="b24-btn b24-btn-primary"
            style={{ padding: '10px 32px', borderRadius: 10, background: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Eye size={16} /> Publish Solution
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
}
