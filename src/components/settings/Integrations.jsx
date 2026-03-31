import React, { useState } from 'react';
import { Mail, MessageSquare, Slack, CreditCard, Key, Plus, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

const CONNECTORS = [
  { id: 'gmail', name: 'Gmail', icon: Mail, desc: 'Sync your emails and track conversations.', connected: true, accent: '#EA4335' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, desc: 'Send automated alerts via official API.', connected: false, accent: '#25D366' },
  { id: 'slack', name: 'Slack', icon: Slack, desc: 'Get real-time deal alerts in your channels.', connected: true, accent: '#4A154B' },
  { id: 'stripe', name: 'Stripe', icon: CreditCard, desc: 'Process payments and track invoices.', connected: false, accent: '#635BFF' },
];

export default function Integrations() {
  const [connectors, setConnectors] = useState(CONNECTORS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Integrations</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Connect your favorite tools to streamline your workflow.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
          background: 'var(--primary)', color: '#ffffff', borderRadius: '12px',
          fontSize: '14px', fontWeight: '800', border: 'none', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)',
          cursor: 'pointer', transition: 'all 0.15s'
        }}>
          <Zap size={18} /> Browse Marketplace
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {connectors.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.id} style={{
              background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)',
              padding: '24px', display: 'flex', gap: '16px', transition: 'all 0.2s', boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: c.accent, color: '#ffffff', flexShrink: 0, boxShadow: `0 8px 16px ${c.accent}30`
              }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{c.name}</h3>
                  {c.connected ? (
                    <span style={{ 
                      fontSize: '9px', fontWeight: '900', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>Connected</span>
                  ) : (
                    <span style={{ 
                      fontSize: '9px', fontWeight: '900', color: 'var(--text-muted)', background: 'var(--bg-darker)',
                      padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>Disconnected</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5, height: '36px', overflow: 'hidden' }}>{c.desc}</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {c.connected ? (
                    <>
                      <button style={{ padding: 0, border: 'none', background: 'transparent', color: 'var(--primary)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Configure</button>
                      <button style={{ padding: 0, border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Disconnect</button>
                    </>
                  ) : (
                    <button style={{ 
                      padding: '8px 12px', background: 'var(--bg-darker)', color: 'var(--text-primary)',
                      borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '11px', fontWeight: '800',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      Connect <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        background: '#0f172a', borderRadius: '32px', padding: '40px', color: '#ffffff',
        position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary)', opacity: 0.15, filter: 'blur(80px)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
              <Key size={18} />
              <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Developer Portal</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 12px', letterSpacing: '-0.5px' }}>REST API Access</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Build custom integrations and automate your workflows with our robust REST API. 
              Generate secure access tokens with granular scopes for your data.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ 
                padding: '12px 24px', background: '#ffffff', color: '#0f172a', border: 'none',
                borderRadius: '12px', fontSize: '13px', fontWeight: '900', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center'
              }}>
                Manage API Keys <Plus size={16} />
              </button>
              <button style={{ padding: 0, background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontWeight: '900', textDecoration: 'underline', cursor: 'pointer' }}>
                API Documentation
              </button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Latency', val: '42ms' },
              { label: 'Requests', val: '1.2M' },
              { label: 'Uptime', val: '99.9%' }
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.1em' }}>{stat.label}</p>
                <p style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
