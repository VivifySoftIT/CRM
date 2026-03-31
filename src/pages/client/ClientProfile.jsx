import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Lock, Check, X, Star } from 'lucide-react';

const INIT = { name:'Alex Morgan', email:'alex.morgan@email.com', phone:'+1 650-555-0192', address:'San Francisco, CA', nationality:'American', dob:'1990-06-15', memberSince:'Jan 2024', tier:'Gold' };

export default function ClientProfile() {
  const [profile, setProfile] = useState(INIT);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState(INIT);
  const [pwModal, setPwModal] = useState(false);
  const [saved, setSaved]     = useState(false);

  const save = () => { setProfile(form); setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const card = { 
    background: 'var(--card-bg)', 
    borderRadius: 18, 
    border: '1px solid var(--card-border)', 
    boxShadow: 'var(--card-shadow)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ maxWidth:680 }}>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', margin:0 }}>My Profile</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 0' }}>Manage your personal information and preferences</p>
      </div>

      {/* Profile header */}
      <div style={{ ...card, padding:'28px', marginBottom:20, display:'flex', alignItems:'center', gap:24, background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg-darker) 100%)' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary), #818cf8)', display:'grid', placeItems:'center', color:'#fff', fontSize:28, fontWeight:900, flexShrink:0, boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}>
          {profile.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{profile.name}</h2>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'4px 0 8px', display:'flex', alignItems:'center', gap:6 }}>
            <Mail size={13}/>{profile.email}
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(59, 130, 246, 0.15)', color:'var(--primary)' }}>Verified Guest</span>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(245, 158, 11, 0.1)', color:'var(--warning)', display:'flex', alignItems:'center', gap:4 }}>
              <Star size={10} fill='var(--warning)'/> {profile.tier} Member
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>Since {profile.memberSince}</span>
          </div>
        </div>
        <button onClick={() => { setEditing(true); setForm(profile); }}
          style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--input-border)', background:'var(--input-bg)', color:'var(--text-primary)', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition: 'all 0.2s' }}>
          <Edit2 size={15}/> Edit Profile
        </button>
      </div>

      {/* Details */}
      <div style={{ ...card, padding:'22px 24px', marginBottom:18 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px' }}>Personal Information</h3>
        {editing ? (
          <div>
            <div className="b24-row b24-row-2">
              <div className="b24-field"><label className="b24-label">Full Name</label><input className="b24-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="b24-field"><label className="b24-label">Phone</label><input className="b24-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
            </div>
            <div className="b24-field"><label className="b24-label">Email</label><input type="email" className="b24-input" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
            <div className="b24-row b24-row-2">
              <div className="b24-field"><label className="b24-label">Address</label><input className="b24-input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/></div>
              <div className="b24-field"><label className="b24-label">Nationality</label><input className="b24-input" value={form.nationality} onChange={e=>setForm(f=>({...f,nationality:e.target.value}))}/></div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={save} style={{ padding:'9px 20px', borderRadius:8, border:'none', background:'var(--primary)', color:'var(--card-bg)', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Check size={13}/> Save</button>
              <button onClick={() => setEditing(false)} className="b24-btn b24-btn-secondary"><X size={13}/> Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { icon: User,   label:'Full Name',    value: profile.name        },
              { icon: Mail,   label:'Email',        value: profile.email       },
              { icon: Phone,  label:'Phone',        value: profile.phone       },
              { icon: MapPin, label:'Address',      value: profile.address     },
              { icon: User,   label:'Nationality',  value: profile.nationality },
              { icon: User,   label:'Date of Birth',value: profile.dob         },
            ].map((item,i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ padding:'14px 18px', borderRadius:12, background:'var(--input-bg)', border:'1px solid var(--card-border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <Icon size={14} color='var(--primary)'/><span style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing: '0.01em' }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>{item.value}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security */}
      <div style={{ ...card, padding:'22px 24px' }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 14px' }}>Security</h3>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderRadius:8, background:'var(--input-bg)', border:'1px solid #f1f5f9' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:'rgba(59, 130, 246, 0.1)', display:'grid', placeItems:'center' }}>
              <Lock size={16} color='var(--primary)'/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>Password</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>Last changed 30 days ago</div>
            </div>
          </div>
          <button onClick={() => setPwModal(true)} style={{ padding:'8px 16px', borderRadius:7, border:'1px solid #e2e8f0', background:'var(--card-bg)', color:'var(--text-primary)', fontWeight:600, fontSize:12, cursor:'pointer' }}>
            Change Password
          </button>
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          style={{ position:'fixed', bottom:24, right:24, background:'var(--success)', color:'var(--card-bg)', padding:'11px 18px', borderRadius:8, fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
          <Check size={14}/> Profile updated
        </motion.div>
      )}

      {pwModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={() => setPwModal(false)}>
          <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
            style={{ background:'var(--card-bg)', borderRadius:16, padding:28, maxWidth:380, width:'100%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Change Password</h3>
              <button onClick={() => setPwModal(false)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={16}/></button>
            </div>
            {['Current Password','New Password','Confirm New Password'].map(l => (
              <div key={l} className="b24-field"><label className="b24-label">{l}</label><input type="password" className="b24-input" placeholder="••••••••"/></div>
            ))}
            <button onClick={() => setPwModal(false)} style={{ marginTop:8, width:'100%', padding:'11px', borderRadius:8, border:'none', background:'var(--primary)', color:'var(--card-bg)', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Update Password
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
