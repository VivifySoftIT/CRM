import React from 'react';
import { Inbox, Send, FileEdit, Star, AlertOctagon, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SidebarFolders({ activeFolder, onSelectFolder, unreadCounts }) {
  const { isDark } = useTheme();

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Inbox': return Inbox;
      case 'Send': return Send;
      case 'FileEdit': return FileEdit;
      case 'Star': return Star;
      case 'AlertOctagon': return AlertOctagon;
      case 'Trash2': return Trash2;
      default: return Inbox;
    }
  };

  const folders = [
    { id: 'Inbox', label: 'Inbox', icon: 'Inbox' },
    { id: 'Sent', label: 'Sent', icon: 'Send' },
    { id: 'Drafts', label: 'Drafts', icon: 'FileEdit' },
    { id: 'Starred', label: 'Starred', icon: 'Star' },
    { id: 'Spam', label: 'Spam', icon: 'AlertOctagon' },
    { id: 'Trash', label: 'Trash', icon: 'Trash2' }
  ];

  return (
    <div style={{ width: 240, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', padding: '24px 16px', background: 'var(--card-bg)' }}>
       <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, paddingLeft: 12 }}>Folders</h3>
       
       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
         {folders.map(folder => {
           const Icon = getIcon(folder.icon);
           const isActive = activeFolder === folder.id;
           const count = unreadCounts[folder.id] || 0;

           return (
             <button
               key={folder.id}
               onClick={() => onSelectFolder(folder.id)}
               style={{
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10,
                 background: isActive ? (isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff') : 'transparent',
                 color: isActive ? '#3b82f6' : 'var(--text-primary)',
                 border: 'none', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
               }}
               onMouseEnter={e => { if(!isActive) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'; }}
               onMouseLeave={e => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
             >
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <Icon size={16} />
                 <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 700 }}>{folder.label}</span>
               </div>
               {count > 0 && (
                 <span style={{ background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 20 }}>
                   {count}
                 </span>
               )}
             </button>
           );
         })}
       </div>
    </div>
  );
}
