import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Download, Trash2, Upload, Search, Plus, File, Image, FileSpreadsheet } from 'lucide-react';

const DOCS = [
  { id:1, name:'Johnson-Smith Wedding Contract.pdf', type:'pdf',   size:'2.4 MB', folder:'Contracts',  date:'2026-03-20', uploader:'Admin' },
  { id:2, name:'Q1 Revenue Report.xlsx',             type:'excel', size:'1.1 MB', folder:'Reports',    date:'2026-03-18', uploader:'Manager' },
  { id:3, name:'Room 301 Inspection Photos.zip',     type:'image', size:'8.2 MB', folder:'Rooms',      date:'2026-03-15', uploader:'Maintenance' },
  { id:4, name:'Staff Handbook 2026.pdf',            type:'pdf',   size:'3.7 MB', folder:'HR',         date:'2026-03-10', uploader:'HR' },
  { id:5, name:'TechFlow Conference Agreement.pdf',  type:'pdf',   size:'1.8 MB', folder:'Contracts',  date:'2026-03-08', uploader:'Admin' },
  { id:6, name:'February Occupancy Report.xlsx',     type:'excel', size:'0.9 MB', folder:'Reports',    date:'2026-03-01', uploader:'Manager' },
  { id:7, name:'Hotel Floor Plan.pdf',               type:'pdf',   size:'5.2 MB', folder:'Operations', date:'2026-02-20', uploader:'Admin' },
  { id:8, name:'Guest Feedback Summary.pdf',         type:'pdf',   size:'1.3 MB', folder:'Reports',    date:'2026-02-15', uploader:'Manager' },
];

const FOLDERS = ['All','Contracts','Reports','Rooms','HR','Operations'];
const TYPE_ICON = { pdf: FileText, excel: FileSpreadsheet, image: Image, default: File };
const TYPE_COLOR = { pdf:'#dc2626', excel:'#059669', image:'#7c3aed', default:'#2563eb' };

export default function Documents() {
  const [docs, setDocs]     = useState(DOCS);
  const [folder, setFolder] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = docs.filter(d => (folder==='All'||d.folder===folder) && (!search||d.name.toLowerCase().includes(search.toLowerCase())));

  const card = { background:'var(--card-bg)', borderRadius:10, border:'1px solid var(--card-border)', boxShadow:'var(--card-shadow)' };

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100%' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Documents</h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>{docs.length} files stored</p>
        </div>
        <button className="b24-btn b24-btn-primary"><Upload size={13}/> Upload File</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20 }}>
        {/* Folder sidebar */}
        <div style={{ ...card, padding:'14px', height:'fit-content' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Folders</div>
          {FOLDERS.map(f => (
            <button key={f} onClick={()=>setFolder(f)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:6, border:'none', background:folder===f?'#eff6ff':'transparent', color:folder===f?'#2563eb':'var(--text-secondary)', cursor:'pointer', fontSize:13, fontWeight:folder===f?700:500, marginBottom:2, transition:'all 0.12s' }}>
              <Folder size={14} color={folder===f?'#2563eb':'var(--text-muted)'}/>{f}
              <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-muted)' }}>{f==='All'?docs.length:docs.filter(d=>d.folder===f).length}</span>
            </button>
          ))}
        </div>

        {/* File list */}
        <div>
          <div style={{ ...card, padding:'10px 14px', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
            <Search size={13} color='var(--text-muted)'/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files..." style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, flex:1 }}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map((doc,i) => {
              const Icon = TYPE_ICON[doc.type] || TYPE_ICON.default;
              const color = TYPE_COLOR[doc.type] || TYPE_COLOR.default;
              return (
                <motion.div key={doc.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                  style={{ ...card, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:8, background:`${color}15`, display:'grid', placeItems:'center', flexShrink:0 }}>
                    <Icon size={18} color={color}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{doc.folder} · {doc.size} · {doc.date} · {doc.uploader}</div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ width:28, height:28, borderRadius:4, border:'1px solid #bfdbfe', background:'#eff6ff', display:'grid', placeItems:'center', cursor:'pointer', color:'#2563eb' }}><Download size={12}/></button>
                    <button onClick={()=>setDocs(ds=>ds.filter(d=>d.id!==doc.id))} style={{ width:28, height:28, borderRadius:4, border:'1px solid #fecaca', background:'#fef2f2', display:'grid', placeItems:'center', cursor:'pointer', color:'#dc2626' }}><Trash2 size={12}/></button>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ ...card, padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>
                <FileText size={40} style={{ margin:'0 auto 12px', opacity:0.3 }}/><p>No files found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
