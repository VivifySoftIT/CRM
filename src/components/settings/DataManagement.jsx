import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, ShieldCheck, FileText, BarChart, Server, CheckCircle2 } from 'lucide-react';

export default function DataManagement() {
  const [activeTask, setActiveTask] = useState(null);

  const startTask = (task) => {
    setActiveTask(task);
    setTimeout(() => setActiveTask(null), 3000);
  };

  const cardStyle = {
    background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)',
    padding: '32px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: '20px'
  };

  const buttonStyle = {
    padding: '12px 24px', borderRadius: '12px', border: '1.5px solid var(--card-border)',
    background: 'var(--bg-darker)', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    transition: 'all 0.15s'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Data Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Import, export, and manage your CRM backups.</p>
        </div>
        <div style={{ padding: '6px 16px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} /> Total: 2.4 GB / 50 GB
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Import / Export */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Download size={18} style={{ color: 'var(--primary)' }} /> Data Exchange
          </h3>
          <button 
            onClick={() => startTask('import')}
            style={{
              padding: '32px', border: '2.5px dashed var(--card-border)', borderRadius: '20px', 
              background: 'var(--bg-darker)', display: 'flex', flexDirection: 'column', alignItems: 'center', 
              gap: '12px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
              <Upload size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Import Wizard</p>
              <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '4px' }}>Supports CSV & XLSX</p>
            </div>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button onClick={() => startTask('csv')} style={buttonStyle}>
              <FileText size={20} style={{ color: 'var(--success)' }} />
              <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Export CSV</span>
            </button>
            <button onClick={() => startTask('excel')} style={buttonStyle}>
              <BarChart size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Backups */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={18} style={{ color: 'var(--primary)' }} /> Backup & Storage
          </h3>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', gap: '12px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--success)', margin: 0 }}>Automatic Backups: ENABLED</p>
              <p style={{ fontSize: '11px', color: 'rgba(16, 185, 129, 0.7)', lineHeight: 1.5, margin: '4px 0 0', fontWeight: '700' }}>Snapshots are taken daily at 02:00 AM UTC.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { date: 'Today, 02:00 AM', size: '1.2 GB' },
              { date: 'Yesterday, 02:00 AM', size: '1.18 GB' }
            ].map((b, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-darker)', borderRadius: '14px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{b.date}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)' }}>{b.size}</span>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '12px', background: 'var(--primary)', color: '#ffffff', border: 'none',
            borderRadius: '12px', fontSize: '13px', fontWeight: '900', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)',
            cursor: 'pointer', transition: 'all 0.15s'
          }}>
            Trigger Manual Backup
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ background: 'rgba(239, 68, 68, 0.03)', borderRadius: '32px', padding: '32px', border: '1.5px solid rgba(239, 68, 68, 0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'grid', placeItems: 'center' }}>
            <Trash2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Danger Zone</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Irreversible actions affecting your entire organization container.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {['Purge All Data', 'Close Organization'].map(label => (
            <div key={label} style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '2px 0 0' }}>Irreversible Action</p>
              </div>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Initialize</button>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification Simulation */}
      {activeTask && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', background: '#0f172a', color: '#ffffff', 
          padding: '16px 24px', borderRadius: '16px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000, animation: 'slideUp 0.3s ease-out', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', display: 'grid', placeItems: 'center', color: '#ffffff' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '900', margin: 0 }}>Request Success</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Initializing your {activeTask} task...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
