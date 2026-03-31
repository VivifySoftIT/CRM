import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Folder, File } from 'lucide-react';

const DOCS = [
  { id:1, name:'Booking Confirmation — Suite 301.pdf', type:'pdf',  size:'1.2 MB', date:'Mar 22, 2026', category:'Bookings'  },
  { id:2, name:'Invoice INV-2401.pdf',                 type:'pdf',  size:'0.4 MB', date:'Mar 22, 2026', category:'Invoices'  },
  { id:3, name:'Invoice INV-2398.pdf',                 type:'pdf',  size:'0.3 MB', date:'Mar 22, 2026', category:'Invoices'  },
  { id:4, name:'Hotel Welcome Guide 2026.pdf',         type:'pdf',  size:'3.1 MB', date:'Mar 20, 2026', category:'General'   },
  { id:5, name:'Spa Menu & Pricing.pdf',               type:'pdf',  size:'2.4 MB', date:'Mar 18, 2026', category:'Services'  },
  { id:6, name:'Room Service Menu.pdf',                type:'pdf',  size:'1.8 MB', date:'Mar 15, 2026', category:'Services'  },
  { id:7, name:'Loyalty Program Terms.pdf',            type:'pdf',  size:'0.9 MB', date:'Mar 10, 2026', category:'General'   },
];

const CATS = ['All','Bookings','Invoices','Services','General'];

export default function ClientDocuments() {
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('All');

  const filtered = DOCS.filter(d => (!search || d.name.toLowerCase().includes(search.toLowerCase())) && (cat==='All'||d.category===cat));

  const card = { 
    background:'var(--card-bg)', 
    borderRadius:18, 
    border:'1px solid var(--card-border)', 
    boxShadow:'var(--card-shadow)',
    transition: 'all 0.3s ease'
  };

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Documents</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Your booking confirmations, invoices, and hotel guides</p>
      </div>

      <div style={{ ...card, padding:'14px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'center', background:'var(--bg-darker)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:10, padding:'8px 14px', flex:1 }}>
          <Search size={15} color='var(--text-muted)'/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents..." style={{ background:'transparent', border:'none', color:'var(--text-primary)', outline:'none', fontSize:13, width:'100%' }}/>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding:'8px 16px', borderRadius:10, border:`1px solid ${cat===c?'var(--primary)':'var(--card-border)'}`, background:cat===c?'var(--primary)':'var(--card-bg)', color:cat===c?'var(--card-bg)':'var(--text-secondary)', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map((doc,i) => (
          <motion.div key={doc.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
            whileHover={{ x: 6, borderColor: 'var(--primary)', background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg-darker) 100%)' }}
            style={{ ...card, padding:'18px 24px', display:'flex', alignItems:'center', gap:18 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(239, 68, 68, 0.12)', display:'grid', placeItems:'center', flexShrink:0, boxShadow: '0 0 10px rgba(239, 68, 68, 0.15)' }}>
              <FileText size={20} color='var(--danger)'/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{doc.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{doc.category} · {doc.size} · {doc.date}</div>
            </div>
            <button style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--primary)', background:'rgba(99, 102, 241, 0.12)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--primary)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
              <Download size={16}/>
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ ...card, padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>
            <Folder size={40} style={{ margin:'0 auto 12px', opacity:0.3, display:'block' }}/>
            <p style={{ fontSize:14, fontWeight:600, margin:0 }}>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
