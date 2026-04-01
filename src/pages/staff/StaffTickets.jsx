import { useState } from 'react';
import { Search, Eye, Edit2, ChevronLeft, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { useStaffTheme } from '../../context/useStaffTheme';

const TICKETS = [
  { id:'TKT-1042', client:'Acme Corp',     subject:'Login issue on portal',       priority:'High',   status:'Open',        updated:'2h ago' },
  { id:'TKT-1041', client:'Vertex Ltd',     subject:'Invoice not generated',       priority:'Medium', status:'In Progress', updated:'4h ago' },
  { id:'TKT-1040', client:'BlueSky Inc',    subject:'Data export failing',         priority:'High',   status:'Open',        updated:'6h ago' },
  { id:'TKT-1039', client:'Nexus Group',    subject:'Password reset not working',  priority:'Low',    status:'Closed',      updated:'1d ago' },
  { id:'TKT-1038', client:'Orion Systems',  subject:'Dashboard loading slow',      priority:'Medium', status:'In Progress', updated:'1d ago' },
  { id:'TKT-1037', client:'Pinnacle Co',    subject:'Email notifications missing', priority:'Low',    status:'Closed',      updated:'2d ago' },
  { id:'TKT-1036', client:'Apex Solutions', subject:'API integration broken',      priority:'High',   status:'Open',        updated:'2d ago' },
  { id:'TKT-1035', client:'Zenith Corp',    subject:'Report download error',       priority:'Medium', status:'Closed',      updated:'3d ago' },
];
const PAGE_SIZE = 5;

export default function StaffTickets() {
  const { t } = useStaffTheme();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = TICKETS.filter(t2 => {
    const q = search.toLowerCase();
    return (statusF === 'All' || t2.status === statusF) && (!q || t2.id.toLowerCase().includes(q) || t2.client.toLowerCase().includes(q) || t2.subject.toLowerCase().includes(q));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const card = { background: t.card, borderRadius:'16px', border:`1px solid ${t.cardBorder}`, boxShadow: t.cardShadow };

  return (
    <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'20px', background: t.bg, minHeight:'100%', transition:'background 0.2s' }}>
      <div>
        <h2 style={{ fontSize:'24px', fontWeight:900, color: t.text, margin:0 }}>My Tickets</h2>
        <p style={{ fontSize:'14px', color: t.textSecondary, margin:'4px 0 0' }}>{filtered.length} tickets assigned to you</p>
      </div>

      <div style={{ ...card, padding:'16px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background: t.input, border:`1px solid ${t.inputBorder}`, borderRadius:'10px', padding:'8px 14px', flex:1, minWidth:'200px' }}>
          <Search size={15} color={t.textMuted} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ID, client or subject..."
            style={{ background:'transparent', border:'none', outline:'none', fontSize:'14px', color: t.text, width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {['All','Open','In Progress','Closed'].map(s => (
            <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
              style={{ padding:'7px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, background: statusF===s ? '#2563eb' : t.bgSecondary, color: statusF===s ? 'white' : t.textSecondary }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
            <thead>
              <tr style={{ background: t.tableHead, borderBottom:`1px solid ${t.divider}` }}>
                {['Ticket ID','Client Name','Subject','Priority','Status','Last Updated','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:800, color: t.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={7} style={{ padding:'60px', textAlign:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', color: t.textMuted }}>
                    <AlertCircle size={32} color={t.textMuted} /><p style={{ margin:0, fontSize:'14px' }}>No tickets found</p>
                  </div>
                </td></tr>
              )}
              {paged.map((tk) => {
                const ps = t.badge[tk.priority]; const ss = t.badge[tk.status];
                return (
                  <tr key={tk.id} style={{ borderBottom:`1px solid ${t.divider}` }}
                    onMouseEnter={e => e.currentTarget.style.background = t.tableHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'13px', fontWeight:700, color:'#3b82f6' }}>{tk.id}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'13px', fontWeight:600, color: t.text }}>{tk.client}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'13px', color: t.textSecondary }}>{tk.subject}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: ps.bg, color: ps.color, border:`1px solid ${ps.border}` }}>{tk.priority}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background: ss.bg, color: ss.color, border:`1px solid ${ss.border}` }}>{tk.status}</span></td>
                    <td style={{ padding:'14px 16px' }}><span style={{ fontSize:'12px', color: t.textMuted, display:'flex', alignItems:'center', gap:'4px' }}><Clock size={12}/>{tk.updated}</span></td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', borderRadius:'8px', border:'none', background:'#1e3a5f', color:'#60a5fa', fontSize:'12px', fontWeight:700, cursor:'pointer' }}><Eye size={13}/> View</button>
                        <button style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, color: t.textSecondary, fontSize:'12px', fontWeight:700, cursor:'pointer' }}><Edit2 size={13}/> Update</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderTop:`1px solid ${t.divider}` }}>
          <p style={{ fontSize:'13px', color: t.textMuted, margin:0 }}>Showing {filtered.length===0?0:(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</p>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:'32px', height:'32px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, display:'grid', placeItems:'center', cursor:page===1?'not-allowed':'pointer', opacity:page===1?0.4:1, color: t.textSecondary }}><ChevronLeft size={15}/></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)} style={{ width:'32px', height:'32px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background:page===n?'#2563eb': t.bgSecondary, color:page===n?'white': t.textSecondary, fontSize:'13px', fontWeight:700, cursor:'pointer' }}>{n}</button>
            ))}
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:'32px', height:'32px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, display:'grid', placeItems:'center', cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?0.4:1, color: t.textSecondary }}><ChevronRight size={15}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
