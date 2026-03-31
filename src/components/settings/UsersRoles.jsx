import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Search, CheckCircle2, XCircle } from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'John Sales', email: 'john@vivify.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Miller', email: 'sarah@vivify.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Mike Ross', email: 'mike@vivify.com', role: 'Sales', status: 'Inactive' },
  { id: 4, name: 'Rachel Zane', email: 'rachel@vivify.com', role: 'Support', status: 'Active' },
];

export default function UsersRoles() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Users & Roles</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage your team members and their access levels.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
          background: 'var(--primary)', color: '#ffffff', borderRadius: '12px',
          fontSize: '14px', fontWeight: '800', border: 'none', shadow: '0 8px 16px rgba(79, 70, 229, 0.25)',
          cursor: 'pointer', transition: 'all 0.15s'
        }}>
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', shadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px', background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)', borderRadius: '12px', fontSize: '14px',
                outline: 'none', color: 'var(--text-primary)', transition: 'all 0.2s'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)', fontWeight: '800', fontSize: '13px'
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '14px' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{user.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '800',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: user.role === 'Admin' ? 'rgba(79, 70, 229, 0.1)' : user.role === 'Manager' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-darker)',
                      color: user.role === 'Admin' ? 'var(--primary)' : user.role === 'Manager' ? 'var(--success)' : 'var(--text-secondary)'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.status === 'Active' ? (
                        <><CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--success)' }}>Active</span></>
                      ) : (
                        <><XCircle size={14} style={{ color: 'var(--text-muted)' }} /> <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>Inactive</span></>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.15s' }}>
                        <Edit2 size={16} />
                      </button>
                      <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.15s' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
