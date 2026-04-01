import { useState } from 'react';
import { Search, Users, Briefcase, Mail, Building2, Eye, Lock } from 'lucide-react';
import { useStaffTheme } from '../../context/useStaffTheme';

const CLIENTS = [
  { id:1, name:'Alice Johnson', email:'alice@acmecorp.com',  company:'Acme Corp',      deals:3, status:'Active'   },
  { id:2, name:'Bob Smith',     email:'bob@urbanstay.co',    company:'Urban Stay',     deals:1, status:'Active'   },
  { id:3, name:'Sarah Connor',  email:'sarah@riviera.com',   company:'Riviera Resort', deals:2, status:'Inactive' },
  { id:4, name:'Mike Ross',     email:'mike@nexusgroup.io',  company:'Nexus Group',    deals:4, status:'Active'   },
  { id:5, name:'Emma Wilson',   email:'emma@pinnacle.co',    company:'Pinnacle Co',    deals:1, status:'Active'   },
  { id:6, name:'David Lee',     email:'david@bluesky.inc',   company:'BlueSky Inc',    deals:2, status:'Inactive' },
  { id:7, name:'Priya Sharma',  email:'priya@orionsys.com',  company:'Orion Systems',  deals:3, status:'Active'   },
  { id:8, name:'James Carter',  email:'james@apexsol.com',   company:'Apex Solutions', deals:5, status:'Active'   },
];
const AV_COLORS = ['#3b82f6','#8b5cf6','#f43f5e','#10b981','#f59e0b','#06b6d4','#ec4899','#6366f1'];

export default function StaffClients() {
  const { t } = useStaffTheme();
  const [search, setSearch] = useState('');
  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const card = { background: t.card, borderRadius:'16px', border:`1px solid ${t.cardBorder}`, boxShadow: t.cardShadow };

  return (
    <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'20px', background: t.bg, minHeight:'100%', transition:'background 0.2s' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontSize:'24px', fontWeight:900, color: t.text, margin:0 }}>Clients</h2>
          <p style={{ fontSize:'14px', color: t.textSecondary, margin:'4px 0 0' }}>{filtered.length} clients · limited access view</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', background: t.badge.Medium.bg, border:`1px solid ${t.badge.Medium.border}`, color: t.badge.Medium.color, fontSize:'13px', fontWeight:600 }}>
          <Lock size={13}/> Read-only access
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'8px', background: t.input, border:`1px solid ${t.inputBorder}`, borderRadius:'12px', padding:'10px 16px', maxWidth:'320px' }}>
        <Search size={15} color={t.textMuted}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
          style={{ background:'transparent', border:'none', outline:'none', fontSize:'14px', color: t.text, width:'100%' }}/>
      </div>

      <div style={card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
            <thead>
              <tr style={{ background: t.tableHead, borderBottom:`1px solid ${t.divider}` }}>
                {['Name','Email','Company','Assigned Deals','Status','Action'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:800, color: t.textMuted, letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding:'60px', textAlign:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', color: t.textMuted }}>
                    <Users size={36} color={t.textMuted}/><p style={{ margin:0, fontSize:'14px' }}>No clients found</p>
                  </div>
                </td></tr>
              )}
              {filtered.map((c, i) => {
                const as = t.badge[c.status];
                return (
                  <tr key={c.id} style={{ borderBottom:`1px solid ${t.divider}` }}
                    onMouseEnter={e => e.currentTarget.style.background = t.tableHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'36px', height:'36px', borderRadius:'10px', background: AV_COLORS[i%AV_COLORS.length], display:'grid', placeItems:'center', color:'white', fontWeight:900, fontSize:'12px', flexShrink:0 }}>
                          {c.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span style={{ fontSize:'14px', fontWeight:600, color: t.text }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 16px' }}><span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color: t.textSecondary }}><Mail size={13} color={t.textMuted}/>{c.email}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:500, color: t.text }}><Building2 size={13} color={t.textMuted}/>{c.company}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:700, color: t.text }}><Briefcase size={13} color="#3b82f6"/>{c.deals} deal{c.deals!==1?'s':''}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: as.bg, color: as.color, border:`1px solid ${as.border}` }}>{c.status}</span></td>
                    <td style={{ padding:'14px 16px' }}>
                      <button style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 14px', borderRadius:'8px', border:'none', background:'#1e3a5f', color:'#60a5fa', fontSize:'12px', fontWeight:700, cursor:'pointer' }}><Eye size={13}/> View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
