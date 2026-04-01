import { useState } from 'react';
import { FileText, FileImage, File, Download, Eye, Search, Upload, MoreVertical } from 'lucide-react';
import { useStaffTheme } from '../../context/useStaffTheme';

const DOCS = [
  { id:1, name:'Q1 Sales Report.pdf',      type:'pdf', size:'2.4 MB', date:'Mar 28, 2026', owner:'Emma Staff'  },
  { id:2, name:'Acme Corp Contract.docx',  type:'doc', size:'1.1 MB', date:'Mar 25, 2026', owner:'John Admin'  },
  { id:3, name:'Product Demo Slides.pptx', type:'ppt', size:'5.8 MB', date:'Mar 20, 2026', owner:'Emma Staff'  },
  { id:4, name:'Invoice INV-2042.pdf',      type:'pdf', size:'0.3 MB', date:'Mar 18, 2026', owner:'Finance'     },
  { id:5, name:'Brand Assets.zip',          type:'zip', size:'12 MB',  date:'Mar 15, 2026', owner:'Design Team' },
  { id:6, name:'Client Onboarding.pdf',     type:'pdf', size:'1.7 MB', date:'Mar 10, 2026', owner:'Emma Staff'  },
  { id:7, name:'Meeting Notes Mar.docx',    type:'doc', size:'0.5 MB', date:'Mar 05, 2026', owner:'Emma Staff'  },
  { id:8, name:'Company Logo.png',          type:'img', size:'0.8 MB', date:'Feb 28, 2026', owner:'Design Team' },
];
const TYPE = {
  pdf: { Icon:FileText,  bg:'#450a0a', bgL:'#fef2f2', color:'#fca5a5', colorL:'#dc2626' },
  doc: { Icon:FileText,  bg:'#1e3a5f', bgL:'#eff6ff', color:'#93c5fd', colorL:'#2563eb' },
  ppt: { Icon:File,      bg:'#431407', bgL:'#fff7ed', color:'#fdba74', colorL:'#ea580c' },
  zip: { Icon:File,      bg:'#2e1065', bgL:'#faf5ff', color:'#c084fc', colorL:'#7c3aed' },
  img: { Icon:FileImage, bg:'#052e16', bgL:'#f0fdf4', color:'#4ade80', colorL:'#16a34a' },
};

export default function StaffDocuments() {
  const { t, isDark } = useStaffTheme();
  const [search, setSearch] = useState('');
  const filtered = DOCS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'20px', background: t.bg, minHeight:'100%', transition:'background 0.2s' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontSize:'24px', fontWeight:900, color: t.text, margin:0 }}>Documents</h2>
          <p style={{ fontSize:'14px', color: t.textSecondary, margin:'4px 0 0' }}>{filtered.length} files available</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#2563eb', color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(37,99,235,0.3)' }}>
          <Upload size={16}/> Upload File
        </button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'8px', background: t.input, border:`1px solid ${t.inputBorder}`, borderRadius:'12px', padding:'10px 16px', maxWidth:'320px' }}>
        <Search size={15} color={t.textMuted}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
          style={{ background:'transparent', border:'none', outline:'none', fontSize:'14px', color: t.text, width:'100%' }}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px' }}>
        {filtered.map(doc => {
          const tp = TYPE[doc.type] || TYPE.doc;
          const Icon = tp.Icon;
          return (
            <div key={doc.id} style={{ background: t.card, borderRadius:'16px', border:`1px solid ${t.cardBorder}`, padding:'18px', boxShadow: t.cardShadow, transition:'all 0.15s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.boxShadow='0 4px 16px rgba(59,130,246,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor= t.cardBorder; e.currentTarget.style.boxShadow= t.cardShadow; }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background: isDark ? tp.bg : tp.bgL, display:'grid', placeItems:'center' }}>
                  <Icon size={22} color={isDark ? tp.color : tp.colorL}/>
                </div>
                <button style={{ width:'28px', height:'28px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, display:'grid', placeItems:'center', cursor:'pointer', color: t.textMuted }}>
                  <MoreVertical size={14}/>
                </button>
              </div>
              <p style={{ fontSize:'14px', fontWeight:700, color: t.text, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={doc.name}>{doc.name}</p>
              <p style={{ fontSize:'12px', color: t.textMuted, margin:'4px 0 0' }}>{doc.size} · {doc.date}</p>
              <p style={{ fontSize:'12px', color: t.textMuted, margin:'2px 0 0' }}>by {doc.owner}</p>
              <div style={{ display:'flex', gap:'8px', marginTop:'14px', paddingTop:'14px', borderTop:`1px solid ${t.divider}` }}>
                <button style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'7px', borderRadius:'8px', border:'none', background: isDark?'#1e3a5f':'#eff6ff', color: isDark?'#60a5fa':'#2563eb', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>
                  <Eye size={13}/> Preview
                </button>
                <button style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'7px', borderRadius:'8px', border:`1px solid ${t.cardBorder}`, background: t.bgSecondary, color: t.textSecondary, fontSize:'12px', fontWeight:700, cursor:'pointer' }}>
                  <Download size={13}/> Download
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px', color: t.textMuted }}>
            <FileText size={40} color={t.textMuted}/><p style={{ fontSize:'14px', margin:'12px 0 0' }}>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
