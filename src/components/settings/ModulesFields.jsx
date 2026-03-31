import React, { useState } from 'react';
import { LayoutGrid, Plus, Globe, Package, Briefcase, Users, Phone, Mail, FileText, CheckCircle2, XCircle, Search } from 'lucide-react';

const INITIAL_MODULES = [
  { id: 'leads', label: 'Leads', icon: Package, enabled: true, fields: 12 },
  { id: 'contacts', label: 'Contacts', icon: Users, enabled: true, fields: 15 },
  { id: 'accounts', label: 'Accounts', icon: Globe, enabled: true, fields: 10 },
  { id: 'deals', label: 'Deals', icon: Briefcase, enabled: true, fields: 18 },
  { id: 'calls', label: 'Calls', icon: Phone, enabled: true, fields: 8 },
  { id: 'emails', label: 'Emails', icon: Mail, enabled: true, fields: 6 },
  { id: 'quotes', label: 'Quotes', icon: FileText, enabled: false, fields: 14 },
];

export default function ModulesFields() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState('visibility');

  const toggleModule = (id) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const cardStyle = {
    padding: '24px', borderRadius: '24px', border: '1px solid var(--card-border)',
    transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '16px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Modules & Fields</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Toggle and customize your core data modules.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-darker)', padding: '4px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <button 
            onClick={() => setActiveTab('visibility')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '800',
              cursor: 'pointer', transition: 'all 0.15s',
              background: activeTab === 'visibility' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'visibility' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'visibility' ? 'var(--card-shadow)' : 'none'
            }}
          >
            Module Visibility
          </button>
          <button 
            onClick={() => setActiveTab('fields')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '800',
              cursor: 'pointer', transition: 'all 0.15s',
              background: activeTab === 'fields' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'fields' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'fields' ? 'var(--card-shadow)' : 'none'
            }}
          >
            Field Customization
          </button>
        </div>
      </div>

      {activeTab === 'visibility' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {modules.map(module => {
            const Icon = module.icon;
            return (
              <div key={module.id} style={{
                ...cardStyle,
                background: module.enabled ? 'var(--card-bg)' : 'var(--bg-darker)',
                opacity: module.enabled ? 1 : 0.8,
                boxShadow: module.enabled ? 'var(--card-shadow)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', 
                    background: module.enabled ? 'rgba(79, 70, 229, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: module.enabled ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <button onClick={() => toggleModule(module.id)} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    {module.enabled ? <CheckCircle2 style={{ color: 'var(--success)' }} size={24} /> : <XCircle style={{ color: 'var(--text-muted)', opacity: 0.3 }} size={24} />}
                  </button>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{module.label}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWidth: '500' }}>{module.fields} standard & custom fields</p>
                </div>
                <button style={{
                  width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                  fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: module.enabled ? 'rgba(79, 70, 229, 0.05)' : 'var(--bg-darker)',
                  color: module.enabled ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: module.enabled ? 'pointer' : 'not-allowed', transition: 'all 0.15s'
                }}>
                  Manage Structure
                </button>
              </div>
            );
          })}
          <button style={{
            ...cardStyle,
            border: '2px dashed var(--card-border)', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', textAlign: 'center'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-darker)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <Plus size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Create Custom Module</span>
          </button>
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', shadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input type="text" placeholder="Search fields..." style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--card-bg)', border: '1.5px solid var(--card-border)', borderRadius: '12px', fontSize: '13px', outline: 'none' }} />
            </div>
            <select style={{ padding: '10px 16px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--card-bg)', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', outline: 'none' }}>
              {modules.filter(m => m.enabled).map(m => <option key={m.id} value={m.id}>{m.label} Module</option>)}
            </select>
          </div>
          <div style={{ padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Plus size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Field Customization Engine</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', margin: '8px auto 24px', lineHeight: 1.6 }}>Initialize the data customizer to start managing schema and custom attributes.</p>
            <button style={{ padding: '12px 32px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '13px', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)', cursor: 'pointer' }}>
              Initialize Customizer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
