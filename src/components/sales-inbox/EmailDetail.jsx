import React from 'react';
import { 
  Reply, Forward, Trash2, MoreVertical, Paperclip, 
  User, Briefcase, Star, MailOpen
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function EmailDetail({ email, onDelete, onReply, onToggleStar }) {
  const { isDark } = useTheme();

  if (!email) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
        <MailOpen size={48} color="var(--card-border)" style={{ marginBottom: 16 }} />
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)', margin: 0 }}>Select an email to read</h3>
      </div>
    );
  }

  const formatDate = (ds) => new Date(ds).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', overflowY: 'auto' }}>
      
      {/* Detail Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            {email.subject}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              onClick={() => onReply(email)}
              className="b24-btn b24-btn-secondary" style={{ padding: '6px 12px', borderRadius: 8 }}
            >
              <Reply size={14} /> Reply
            </button>
            <button className="b24-btn b24-btn-secondary" style={{ padding: '6px 12px', borderRadius: 8 }}>
              <Forward size={14} /> Forward
            </button>
            <button onClick={() => onDelete(email.id)} className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 8, color: '#ef4444' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>
              {email.from.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{email.from.split('<')[0].trim()}</span>
                 <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>&lt;{email.from.split('<')[1] || email.from}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginTop: 4 }}>
                 to {email.to.join(', ')}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
              {formatDate(email.createdAt)}
            </span>
            <button onClick={() => onToggleStar(email.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <Star size={18} color={email.isStarred ? '#fbbf24' : 'var(--text-muted)'} fill={email.isStarred ? '#fbbf24' : 'transparent'} />
            </button>
          </div>
        </div>
      </div>

      {/* CRM Context Ribbon */}
      {(email.relatedContact || email.relatedDeal) && (
        <div style={{ background: isDark ? 'rgba(59,130,246,0.05)' : '#eff6ff', borderBottom: '1px solid var(--card-border)', padding: '12px 32px', display: 'flex', gap: 24 }}>
           {email.relatedContact && (
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#3b82f6' }}>
               <User size={14} /> Contact: {email.relatedContact}
             </div>
           )}
           {email.relatedDeal && (
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#8b5cf6' }}>
               <Briefcase size={14} /> Deal: {email.relatedDeal}
             </div>
           )}
        </div>
      )}

      {/* Email Body */}
      <div style={{ padding: 32, flex: 1 }}>
         <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'sans-serif' }}>
           {email.body}
         </div>

         {/* Attachments */}
         {email.attachments && email.attachments.length > 0 && (
           <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--card-border)' }}>
             <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
               <Paperclip size={14} /> {email.attachments.length} Attachments
             </h4>
             <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
               {email.attachments.map((att, i) => (
                 <div key={i} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', cursor: 'pointer' }}>
                   <Paperclip size={14} color="#3b82f6" />
                   <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{att}</span>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>

    </div>
  );
}
