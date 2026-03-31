import React from 'react';
import { motion } from 'framer-motion';
import { Star, Paperclip, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function EmailList({ emails, activeEmailId, onSelectEmail, onToggleStar }) {
  const { isDark } = useTheme();

  const formatDate = (dateString) => {
    const ds = new Date(dateString);
    const today = new Date();
    if (ds.toDateString() === today.toDateString()) {
      return ds.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return ds.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ width: 380, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {emails.length === 0 ? (
         <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700 }}>
           No conversations found.
         </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {emails.map((email, idx) => {
            const isUnread = email.status === 'Unread';
            const isActive = activeEmailId === email.id;

            return (
              <div 
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                style={{ 
                  padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px solid var(--card-border)',
                  borderLeft: `3px solid ${isActive ? '#3b82f6' : (isUnread ? '#10b981' : 'transparent')}`,
                  background: isActive ? (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc') : 'transparent'
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: '75%' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleStar(email.id); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      <Star size={14} color={email.isStarred ? '#fbbf24' : 'var(--text-muted)'} fill={email.isStarred ? '#fbbf24' : 'transparent'} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: isUnread ? 900 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.from.split('<')[0].trim()}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: isUnread ? 800 : 700, color: isUnread ? '#10b981' : 'var(--text-muted)' }}>
                    {formatDate(email.createdAt)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: isUnread ? 800 : 700, color: isUnread ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {email.subject}
                  </span>
                  {email.attachments && email.attachments.length > 0 && <Paperclip size={12} color="var(--text-muted)" />}
                </div>

                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email.body.substring(0, 60)}...
                </p>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
