import React, { useState } from 'react';
import { Shield, Check, Lock, Info } from 'lucide-react';

const MODULES = [
  'Leads', 'Contacts', 'Accounts', 'Deals', 'Tasks', 'Meetings', 'Calls', 'Campaigns', 'Invoices', 'Quotes'
];

const ROLES = ['Admin', 'Manager', 'Sales', 'Support'];

export default function Permissions() {
  const [activeRole, setActiveRole] = useState('Sales');
  const [perms, setPerms] = useState(() => {
    const p = {};
    ROLES.forEach(r => {
      p[r] = {};
      MODULES.forEach(m => {
        p[r][m] = { view: true, create: r !== 'Support', edit: r !== 'Support', delete: r === 'Admin' };
      });
    });
    return p;
  });

  const togglePerm = (module, action) => {
    setPerms(prev => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [module]: {
          ...prev[activeRole][module],
          [action]: !prev[activeRole][module][action]
        }
      }
    }));
  };

  const headerStyle = { padding: '16px 24px', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Permissions (RBAC)</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Define access levels across the system.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-darker)', padding: '4px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '800',
                cursor: 'pointer', transition: 'all 0.15s',
                background: activeRole === role ? 'var(--card-bg)' : 'transparent',
                color: activeRole === role ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeRole === role ? 'var(--card-shadow)' : 'none'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', shadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', background: 'rgba(79, 70, 229, 0.03)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', height: '36px', background: 'rgba(79, 70, 229, 0.1)', 
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' 
          }}>
            <Shield size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWidth: '800', margin: 0, color: 'var(--text-primary)' }}>Editing permissions for "{activeRole}"</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} /> Changes are applied system-wide instantly.
            </p>
          </div>
          {activeRole === 'Admin' && (
            <div style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
              <Lock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Global Master
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ ...headerStyle, textAlign: 'left' }}>Module Name</th>
                <th style={{ ...headerStyle, textAlign: 'center' }}>View</th>
                <th style={{ ...headerStyle, textAlign: 'center' }}>Create</th>
                <th style={{ ...headerStyle, textAlign: 'center' }}>Edit</th>
                <th style={{ ...headerStyle, textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map(module => {
                const p = perms[activeRole][module] || {};
                const isAdmin = activeRole === 'Admin';
                return (
                  <tr key={module} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.1s' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '800', color: 'var(--text-primary)', fontSize: '14px' }}>{module}</td>
                    {['view', 'create', 'edit', 'delete'].map(action => (
                      <td key={action} style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          disabled={isAdmin}
                          onClick={() => togglePerm(module, action)}
                          style={{
                            width: '40px', height: '40px', borderRadius: '12px', border: 'none',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s', cursor: isAdmin ? 'not-allowed' : 'pointer',
                            background: p[action] ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-darker)',
                            color: p[action] ? 'var(--success)' : 'var(--text-muted)',
                            opacity: isAdmin ? 0.6 : 1
                          }}
                        >
                          {p[action] ? <Check size={20} strokeWidth={3} /> : <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />}
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button style={{ padding: '10px 24px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          <button style={{ padding: '10px 24px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '13px', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)', cursor: 'pointer' }}>Update Role Permissions</button>
        </div>
      </div>
    </div>
  );
}
