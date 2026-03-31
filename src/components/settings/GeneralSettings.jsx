import React, { useState } from 'react';
import { Upload, Clock, DollarSign, Languages } from 'lucide-react';

export default function GeneralSettings() {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const labelStyle = { 
    display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
    marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' 
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    border: '1.5px solid var(--card-border)', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', background: 'var(--bg-darker)', boxSizing: 'border-box',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>General Settings</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage your organization's basic identity and localization.</p>
      </div>

      <div style={{ 
        background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)',
        padding: '32px', boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' 
        }}>
          {/* Organization Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Organization Name</label>
              <input 
                type="text" 
                defaultValue="VivifyCRM Solutions"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <Clock size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Timezone
              </label>
              <select style={inputStyle}>
                <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                <option>(GMT+00:00) London, Dublin, Edinburgh</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>
                  <DollarSign size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Currency
                </label>
                <select style={inputStyle}>
                  <option>USD ($)</option>
                  <option>INR (₹)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  <Languages size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Language
                </label>
                <select style={inputStyle}>
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed var(--card-border)', borderRadius: '20px', padding: '32px',
            background: 'var(--bg-darker)', transition: 'all 0.2s', textAlign: 'center'
          }}>
            {logoPreview ? (
              <div style={{ position: 'relative' }}>
                <img src={logoPreview} alt="Logo" style={{ height: '96px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }} />
                <button 
                  onClick={() => setLogoPreview(null)}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)',
                    color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%',
                    display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', shadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ 
                width: '64px', height: '64px', background: 'rgba(79, 70, 229, 0.1)', 
                color: 'var(--primary)', borderRadius: '16px', display: 'grid', placeItems: 'center', marginBottom: '16px' 
              }}>
                <Upload size={32} />
              </div>
            )}
            <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Organization Logo</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '20px' }}>PNG, JPG or SVG. Max 2MB.</p>
            <label style={{ 
              padding: '10px 20px', background: '#ffffff', border: '1px solid var(--card-border)',
              borderRadius: '12px', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)',
              cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}>
              Choose File
              <input type="file" style={{ display: 'none' }} onChange={handleLogoChange} accept="image/*" />
            </label>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--card-border)', paddingTop: '24px' }}>
          <button style={{ 
            padding: '12px 24px', borderRadius: '12px', border: '1.5px solid var(--card-border)',
            background: 'transparent', fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)', transition: 'all 0.15s'
          }}>Reset</button>
          <button style={{ 
            padding: '12px 32px', borderRadius: '12px', border: 'none',
            background: 'var(--primary)', color: '#ffffff', fontSize: '14px', fontWeight: '900',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)', cursor: 'pointer', transition: 'all 0.15s'
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
