import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Monitor, Shield } from 'lucide-react';

const NOTIF_TYPES = [
  { id: 'lead_new', label: 'New Lead Assigned', desc: 'Alert when a new lead is assigned to you.', email: true, app: true, sms: false },
  { id: 'deal_won', label: 'Deal Won', desc: 'Celebratory alert when any deal is closed as won.', email: true, app: true, sms: true },
  { id: 'task_due', label: 'Task Due Reminder', desc: 'Reminder for tasks approaching their due date.', email: true, app: true, sms: false },
  { id: 'meeting_invite', label: 'Meeting Invitation', desc: 'When you are invited to a new meeting.', email: true, app: true, sms: false },
  { id: 'payment_fail', label: 'Payment Failed', desc: 'Critical alert for any failed payment transactions.', email: true, app: true, sms: true },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState(NOTIF_TYPES);

  const toggleNotif = (id, field) => {
    setSettings(prev => prev.map(n => 
      n.id === id ? { ...n, [field]: !n[field] } : n
    ));
  };

  const headerLabelStyle = { fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Notifications</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Configure how and when you want to be alerted.</p>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', shadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 80px 80px 80px', background: 'var(--bg-darker)', alignItems: 'center' }}>
          <p style={{ ...headerLabelStyle, textAlign: 'left', margin: 0 }}>Notification Event</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Mail size={14} style={{ color: 'var(--text-muted)' }} />
            <p style={headerLabelStyle}>Email</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Monitor size={14} style={{ color: 'var(--text-muted)' }} />
            <p style={headerLabelStyle}>In-App</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Smartphone size={14} style={{ color: 'var(--text-muted)' }} />
            <p style={headerLabelStyle}>SMS</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {settings.map((item) => (
            <div key={item.id} style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 80px 80px 80px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>{item.desc}</p>
              </div>
              {['email', 'app', 'sms'].map((type) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => toggleNotif(item.id, type)}
                    style={{
                      width: '44px', height: '22px', borderRadius: '99px', border: 'none', position: 'relative',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: item[type] ? 'var(--success)' : 'var(--bg-darker)',
                      boxShadow: item[type] ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      left: item[type] ? '24px' : '2px'
                    }} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ padding: '32px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1.5px solid var(--card-border)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'grid', placeItems: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>Quiet Hours</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>Mute non-critical alerts during these hours.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--card-border)', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}><option>10:00 PM</option></select>
                <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)' }}>TO</span>
                <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--card-border)', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}><option>08:00 AM</option></select>
              </div>
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1.5px solid var(--card-border)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>Push Notifications</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>Get instant alerts on your mobile device.</p>
              <button style={{ padding: '10px 20px', background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                Link Device
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ padding: '12px 32px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '14px', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)', cursor: 'pointer' }}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
