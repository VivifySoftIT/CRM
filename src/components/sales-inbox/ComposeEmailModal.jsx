import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Send, Paperclip, Minimize2, Maximize2, 
  Bold, Italic, Link as LinkIcon, List as ListIcon, Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ComposeEmailModal({ onClose, onSend, replyToEmail = null }) {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
    attachments: []
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (replyToEmail) {
      setFormData(prev => ({
        ...prev,
        to: replyToEmail.from.includes('<') ? replyToEmail.from.split('<')[1].replace('>', '') : replyToEmail.from,
        subject: replyToEmail.subject.startsWith('Re:') ? replyToEmail.subject : `Re: ${replyToEmail.subject}`,
        body: `\n\n\n--- On ${new Date(replyToEmail.createdAt).toLocaleString()} ${replyToEmail.from.split('<')[0]} wrote:\n> ${replyToEmail.body.replace(/\n/g, '\n> ')}`
      }));
    }
  }, [replyToEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if(!formData.to.trim()) newErrors.to = "Recipient is required";
    else if(!/^\S+@\S+\.\S+$/.test(formData.to.trim())) newErrors.to = "Invalid email format";
    if(!formData.subject.trim()) newErrors.subject = "Subject is required";
    if(!formData.body.trim()) newErrors.body = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if(!validate()) return;
    onSend({
      from: "John Sales <john.sales@omnicrm.com>",
      to: [formData.to],
      subject: formData.subject,
      body: formData.body,
      attachments: formData.attachments
    });
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('compose-body');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.body.substring(start, end);

    let insertion = '';
    switch(format) {
      case 'bold': insertion = `**${selectedText || 'bold text'}**`; break;
      case 'italic': insertion = `*${selectedText || 'italic text'}*`; break;
      case 'list': insertion = `\n- ${selectedText || 'List item'}`; break;
      case 'link': insertion = `[${selectedText || 'link text'}](url)`; break;
      default: return;
    }

    const newContent = formData.body.substring(0, start) + insertion + formData.body.substring(end);
    setFormData(prev => ({ ...prev, body: newContent }));
  };

  const modalBg = isDark ? '#1f2937' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const textTitle = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  if (isMinimized) {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 32, zIndex: 100, width: 300, background: modalBg, border: `1px solid ${border}`, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => setIsMinimized(false)}>
        <span style={{ fontSize: 13, fontWeight: 800, color: textTitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {formData.subject || 'New Message'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}><Maximize2 size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={14} /></button>
        </div>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: 'none', borderBottom: `1px solid ${border}`, background: 'transparent', color: textTitle, fontSize: 14, outline: 'none' };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
      style={{ position: 'fixed', bottom: 0, right: 80, zIndex: 100, width: '100%', maxWidth: 640, height: 600, background: modalBg, border: `1px solid ${border}`, borderBottom: 'none', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '12px 20px', background: isDark ? '#111827' : '#f8fafc', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: textTitle }}>New Message</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setIsMinimized(true)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}><Minimize2 size={16} /></button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={16} /></button>
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
         <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
           <input name="to" value={formData.to} onChange={handleChange} placeholder="Recipients" style={inputStyle} />
           <button onClick={() => setShowCC(!showCC)} style={{ position: 'absolute', right: 16, background: 'transparent', border: 'none', color: textMuted, fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>Cc/Bcc</button>
         </div>
         {errors.to && <span style={{ color: '#ef4444', fontSize: 11, padding: '4px 16px' }}>{errors.to}</span>}
         
         {showCC && <input name="cc" value={formData.cc} onChange={handleChange} placeholder="Cc" style={inputStyle} />}

         <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" style={inputStyle} />
         {errors.subject && <span style={{ color: '#ef4444', fontSize: 11, padding: '4px 16px' }}>{errors.subject}</span>}

         {/* Toolbar */}
         <div style={{ padding: '8px 16px', borderBottom: `1px solid ${border}`, display: 'flex', gap: 6, background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' }}>
           {[
             { icon: Bold, act: 'bold' }, { icon: Italic, act: 'italic' },
             { icon: ListIcon, act: 'list' }, { icon: LinkIcon, act: 'link' }
           ].map((Action, i) => (
             <button key={i} type="button" onClick={() => insertFormatting(Action.act)} style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: textMuted }}>
               <Action.icon size={14} />
             </button>
           ))}
         </div>

         <textarea 
           id="compose-body" name="body" value={formData.body} onChange={handleChange}
           style={{ flex: 1, width: '100%', resize: 'none', padding: 16, background: 'transparent', border: 'none', color: textTitle, fontSize: 14, fontFamily: 'sans-serif', outline: 'none' }}
         />
         {errors.body && <span style={{ color: '#ef4444', fontSize: 11, padding: '4px 16px' }}>{errors.body}</span>}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={handleSend}
              className="b24-btn b24-btn-primary"
              style={{ padding: '10px 24px', borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Send <Send size={14} />
            </button>
            <button style={{ padding: '10px', borderRadius: 10, background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
               <Paperclip size={18} />
            </button>
            <button style={{ padding: '10px', borderRadius: 10, background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
               <ImageIcon size={18} />
            </button>
         </div>
         <button onClick={() => onDelete(email.id)} style={{ padding: '10px', borderRadius: 10, background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
         </button>
      </div>

    </motion.div>
  );
}
