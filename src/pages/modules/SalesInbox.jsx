import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PenTool, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_EMAILS } from '../../data/mockEmails';

import SidebarFolders from '../../components/sales-inbox/SidebarFolders';
import EmailList from '../../components/sales-inbox/EmailList';
import EmailDetail from '../../components/sales-inbox/EmailDetail';
import ComposeEmailModal from '../../components/sales-inbox/ComposeEmailModal';

export default function SalesInbox() {
  const { isDark } = useTheme();

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('crm_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [activeEmailId, setActiveEmailId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_emails', JSON.stringify(emails));
  }, [emails]);

  const unreadCounts = useMemo(() => {
    const counts = {};
    emails.forEach(e => {
      if (e.status === 'Unread') {
        counts[e.folder] = (counts[e.folder] || 0) + 1;
      }
    });
    return counts;
  }, [emails]);

  const filteredEmails = useMemo(() => {
    return emails
      .filter(e => {
        if (activeFolder === 'Starred') return e.isStarred;
        return e.folder === activeFolder;
      })
      .filter(e => {
        const text = searchTerm.toLowerCase();
        return e.subject.toLowerCase().includes(text) || 
               e.from.toLowerCase().includes(text) ||
               e.body.toLowerCase().includes(text);
      })
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [emails, activeFolder, searchTerm]);

  const activeEmailContext = useMemo(() => {
    return emails.find(e => e.id === activeEmailId);
  }, [emails, activeEmailId]);

  const handleSelectEmail = (id) => {
    setActiveEmailId(id);
    // Mark as read immediately
    setEmails(prev => prev.map(e => e.id === id && e.status === 'Unread' ? { ...e, status: 'Read' } : e));
  };

  const handleToggleStar = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e));
  };

  const handleDelete = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'Trash' } : e));
    if (activeEmailId === id) setActiveEmailId(null);
  };

  const handleSend = (emailPayload) => {
    const newEmail = {
      ...emailPayload,
      id: `msg-${Date.now()}`,
      status: 'Read',
      folder: 'Sent',
      isStarred: false,
      relatedContact: emailPayload.to[0],
      relatedDeal: null,
      createdAt: new Date().toISOString()
    };
    setEmails(prev => [newEmail, ...prev]);
    setIsComposeOpen(false);
    setReplyToEmail(null);
  };

  const openReply = (email) => {
    setReplyToEmail(email);
    setIsComposeOpen(true);
  };

  return (
    <div style={{ padding: '0px', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden' }}>
      
      {/* Top Banner Area */}
      <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', zIndex: 10 }}>
         <div>
           <h1 style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Sales Inbox</h1>
           <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>Manage communications and link cases directly to CRM records</p>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           <div style={{ position: 'relative', width: 340 }}>
             <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
             <input 
               type="text"
               placeholder="Search emails, contacts, subjects..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="b24-input"
               style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--card-bg)' }}
             />
           </div>
           <button 
             onClick={() => { setReplyToEmail(null); setIsComposeOpen(true); }}
             className="b24-btn b24-btn-primary"
             style={{ padding: '12px 24px', borderRadius: 12, background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
           >
             <PenTool size={16} /> Compose
           </button>
         </div>
      </div>

      {/* 3-Panel Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', borderTop: '1px solid var(--card-border)' }}>
        
        {/* Left: Folders */}
        <SidebarFolders 
          activeFolder={activeFolder} 
          onSelectFolder={(folder) => { setActiveFolder(folder); setActiveEmailId(null); }}
          unreadCounts={unreadCounts}
        />

        {/* Middle: Email List */}
        <EmailList 
          emails={filteredEmails}
          activeEmailId={activeEmailId}
          onSelectEmail={handleSelectEmail}
          onToggleStar={handleToggleStar}
        />

        {/* Right: Email Detail */}
        <EmailDetail 
          email={activeEmailContext}
          onDelete={handleDelete}
          onReply={openReply}
          onToggleStar={handleToggleStar}
        />

      </div>

      <AnimatePresence>
        {isComposeOpen && (
          <ComposeEmailModal 
            onClose={() => { setIsComposeOpen(false); setReplyToEmail(null); }}
            onSend={handleSend}
            replyToEmail={replyToEmail}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
