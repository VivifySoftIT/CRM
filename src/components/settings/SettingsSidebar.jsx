import React from 'react';
import { 
  Settings, Users, Shield, LayoutGrid, GitMerge, 
  Mail, Bell, Zap, Lock, Database, Search, ChevronRight 
} from 'lucide-react';

export const SETTINGS_CATEGORIES = [
  { id: 'general', label: 'General Settings', icon: Settings, desc: 'Org name, logo, & localization' },
  { id: 'users', label: 'Users & Roles', icon: Users, desc: 'Manage team and access levels' },
  { id: 'permissions', label: 'Permissions', icon: Shield, desc: 'RBAC & module access' },
  { id: 'modules', label: 'Modules & Fields', icon: LayoutGrid, desc: 'Customize CRM data structure' },
  { id: 'pipelines', label: 'Pipelines', icon: GitMerge, desc: 'Deals stages & probability' },
  { id: 'email', label: 'Email Settings', icon: Mail, desc: 'SMTP & email templates' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'In-app & email alerts' },
  { id: 'integrations', label: 'Integrations', icon: Zap, desc: 'Connect 3rd party apps' },
  { id: 'security', label: 'Security', icon: Lock, desc: 'MFA & password policies' },
  { id: 'data', label: 'Data Management', icon: Database, desc: 'Import, export & backups' },
];

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)',
      display: 'flex', flexDirection: 'column', height: '100%',
      outline: '4px solid rgba(226, 232, 240, 0.4)'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
          <input 
            type="text" 
            placeholder="Search settings..." 
            style={{
              width: '100%', padding: '10px 12px 10px 40px', background: 'var(--card-bg)',
              border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '13px',
              outline: 'none', color: 'var(--text-primary)', transition: 'all 0.2s'
            }}
          />
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SETTINGS_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px', borderRadius: '16px', transition: 'all 0.15s',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? 'var(--primary)' : 'transparent',
                boxShadow: isActive ? '0 8px 16px rgba(79, 70, 229, 0.25)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{
                shrink: 0, padding: '8px', borderRadius: '12px', display: 'grid', placeItems: 'center',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-darker)',
                color: isActive ? '#ffffff' : 'var(--text-muted)'
              }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px', fontWeight: '700', margin: 0,
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {cat.label}
                </p>
                <p style={{
                  fontSize: '11px', lineHeight: 1.25, marginTop: '2px',
                  color: isActive ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {cat.desc}
                </p>
              </div>
              {isActive && (
                <div style={{ alignSelf: 'center' }}>
                  <ChevronRight size={14} color="#ffffff" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
        <div style={{ padding: '16px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '16px', color: '#ffffff' }}>
          <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '6px' }}>
            Developer Gateway
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '12px', fontWeight: '800' }}>API v2.4 Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
