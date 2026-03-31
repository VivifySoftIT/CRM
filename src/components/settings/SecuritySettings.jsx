import React, { useState } from 'react';
import { Shield, Lock, ShieldCheck, Key, Eye, EyeOff, Smartphone, Clock, AlertTriangle, Monitor } from 'lucide-react';

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLen: 8,
    specialChar: true,
    uppercase: true,
    expiry: '90'
  });

  const labelStyle = { 
    display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
    marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' 
  };

  const inputStyle = {
    padding: '10px 14px', borderRadius: '12px',
    border: '1.5px solid var(--card-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--bg-darker)', boxSizing: 'border-box'
  };

  const cardStyle = {
    background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)',
    padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: '20px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Security</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage high-level authentication and access policies.</p>
        </div>
        <div style={{ padding: '6px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} /> Audit: Passing
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Password Policy */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} style={{ color: 'var(--primary)' }} /> Password Policy
            </h3>
            <div>
              <label style={labelStyle}>Min. Length</label>
              <input type="number" value={passwordPolicy.minLen} style={{ ...inputStyle, width: '100%' }} />
            </div>
            {[
              { label: 'Require Special Char', enabled: passwordPolicy.specialChar, key: 'specialChar' },
              { label: 'Require Uppercase', enabled: passwordPolicy.uppercase, key: 'uppercase' }
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-darker)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{item.label}</span>
                <button 
                  onClick={() => setPasswordPolicy(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{
                    width: '36px', height: '18px', borderRadius: '99px', border: 'none', position: 'relative',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: item.enabled ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#ffffff',
                    transition: 'all 0.2s', left: item.enabled ? '20px' : '2px'
                  }} />
                </button>
              </div>
            ))}
          </div>

          {/* MFA */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} style={{ color: 'var(--primary)' }} /> Authentication (2FA)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>Add an extra layer of security requiring an OTP upon login.</p>
            <button 
              onClick={() => setTwoFactor(!twoFactor)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer',
                background: twoFactor ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary)',
                color: twoFactor ? 'var(--success)' : '#ffffff',
                boxShadow: twoFactor ? 'none' : '0 8px 16px rgba(79, 70, 229, 0.25)'
              }}
            >
              {twoFactor ? 'Verified & Enabled' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sessions */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} /> Session Timeout
            </h3>
            <div>
              <label style={labelStyle}>Inactivity Purge</label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <p style={{ fontSize: '11px', color: 'var(--warning)', lineHeight: 1.5, margin: 0, fontWeight: '700' }}>Longer timeouts increase exposure risk on shared systems.</p>
            </div>
          </div>

          {/* Active Devices */}
          <div style={{ ...cardStyle, background: 'var(--bg-darker)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={16} style={{ color: 'var(--primary)' }} /> Active Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'MacBook Pro — Mumbai', status: 'Current' },
                { label: 'iPhone 15 — Pune', status: '2h ago' }
              ].map((s, i) => (
                <div key={i} style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '14px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{s.label}</span>
                  <span style={{ fontSize: '9px', fontWeight: '900', color: s.status === 'Current' ? 'var(--success)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{s.status}</span>
                </div>
              ))}
              <button style={{
                marginTop: '12px', padding: '10px', background: 'transparent', border: '1.5px dashed rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase',
                cursor: 'pointer'
              }}>
                Revoke Other Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
