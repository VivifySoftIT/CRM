import React, { useState } from 'react';
import { Mail, Shield, Plus, MoreHorizontal, CheckCircle2, CloudLightning } from 'lucide-react';

export default function EmailSettings() {
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.sendgrid.net',
    port: '587',
    username: 'apikey',
    fromName: 'VivifyCRM Support',
    fromEmail: 'support@vivifycrm.com'
  });

  const labelStyle = { 
    display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
    marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' 
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: '1.5px solid var(--card-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--bg-darker)', boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Email Settings</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Configure your SMTP server and default email identity.</p>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', shadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-darker)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>SMTP Integration</p>
              <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--success)', textTransform: 'uppercase', margin: 0, marginTop: '2px' }}>Status: Connected</p>
            </div>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '10px', background: '#ffffff', border: '1.5px solid var(--card-border)', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Test Connection
          </button>
        </div>

        <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>SMTP Host</label>
              <input type="text" value={smtpConfig.host} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Port</label>
                <input type="text" value={smtpConfig.port} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" value={smtpConfig.username} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Sender Name</label>
              <input type="text" value={smtpConfig.fromName} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sender Email</label>
              <input type="email" value={smtpConfig.fromEmail} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ padding: '32px', borderTop: '1px solid var(--card-border)', background: 'rgba(79, 70, 229, 0.02)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} /> Default Signature
            </h3>
            <textarea 
              style={{ ...inputStyle, height: '120px', resize: 'none', background: '#ffffff' }}
              defaultValue={`Best Regards,\n\n{{sender_name}}\nVivifyCRM Solutions\nhttps://vivifycrm.com`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudLightning size={16} style={{ color: 'var(--primary)' }} /> Quick Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Welcome Email', 'Lead Followup', 'Invoice Reminder'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--card-border)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>{t}</span>
                  <MoreHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
              <button style={{ 
                width: '100%', padding: '12px', border: '2px dashed var(--card-border)', borderRadius: '12px', background: 'transparent',
                fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s', marginTop: '4px'
              }}>
                <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Create New Template
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--card-border)' }}>
          <button style={{ padding: '10px 24px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Discard</button>
          <button style={{ padding: '10px 24px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '13px', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)', cursor: 'pointer' }}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
}
