import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsSidebar from '../../../components/settings/SettingsSidebar';

// Lazy loading the setting components for performance
const GeneralSettings = lazy(() => import('../../../components/settings/GeneralSettings'));
const UsersRoles = lazy(() => import('../../../components/settings/UsersRoles'));
const Permissions = lazy(() => import('../../../components/settings/Permissions'));
const ModulesFields = lazy(() => import('../../../components/settings/ModulesFields'));
const Pipelines = lazy(() => import('../../../components/settings/Pipelines'));
const EmailSettings = lazy(() => import('../../../components/settings/EmailSettings'));
const NotificationSettings = lazy(() => import('../../../components/settings/NotificationSettings'));
const Integrations = lazy(() => import('../../../components/settings/Integrations'));
const SecuritySettings = lazy(() => import('../../../components/settings/SecuritySettings'));
const DataManagement = lazy(() => import('../../../components/settings/DataManagement'));

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':      return <GeneralSettings />;
      case 'users':        return <UsersRoles />;
      case 'permissions':  return <Permissions />;
      case 'modules':      return <ModulesFields />;
      case 'pipelines':    return <Pipelines />;
      case 'email':        return <EmailSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'integrations': return <Integrations />;
      case 'security':     return <SecuritySettings />;
      case 'data':         return <DataManagement />;
      default:             return <GeneralSettings />;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-page)', overflow: 'hidden'
    }}>
      {/* ── Top Navigation Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', background: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)', shrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px', height: '44px', background: 'var(--primary)',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', textDecoration: 'none', color: '#ffffff',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
          }}>
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
              CRM Settings
            </h1>
            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', margin: 0, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Configuration & Control Center
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            padding: '10px 20px', fontSize: '12px', fontWeight: '700',
            background: 'transparent', border: '1px solid var(--card-border)',
            borderRadius: '12px', color: 'var(--text-secondary)', transition: 'all 0.15s'
          }}>Documentation</button>
          <button style={{
            padding: '10px 24px', background: 'var(--primary)', color: '#ffffff',
            borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: 'none',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)', transition: 'all 0.15s'
          }}>Deploy Changes</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '24px', gap: '24px' }}>
        {/* Left Sidebar */}
        <aside style={{ width: '320px', flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Right Content Area */}
        <main className="custom-scrollbar" style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ maxWidth: '960px' }}
            >
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                  <div style={{
                    width: '32px', height: '32px', border: '3px solid var(--primary)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} />
                </div>
              }>
                {renderContent()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 99px; 
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
