import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Download, Search, RefreshCw, Eye, Pencil, Trash2,
  X, Check, UserCircle2, ChevronLeft, ChevronRight,
  Phone, Mail, Building2, Calendar, Shield, Upload,
  Users, UserCheck, UserX, LayoutGrid
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const INIT_STAFF = [
  { id:1, name:'Arjun Sharma',    email:'arjun@grandomni.com',  phone:'9876543210', dept:'Front Desk',   designation:'Manager',      status:'Active',   joined:'2022-03-15', avatar:'AS', color:'#6366f1' },
  { id:2, name:'Priya Nair',      email:'priya@grandomni.com',  phone:'9123456780', dept:'Housekeeping', designation:'Supervisor',   status:'Active',   joined:'2021-07-20', avatar:'PN', color:'#10b981' },
  { id:3, name:'Rahul Mehta',     email:'rahul@grandomni.com',  phone:'9988776655', dept:'Maintenance',  designation:'Technician',   status:'Active',   joined:'2023-01-10', avatar:'RM', color:'#f59e0b' },
  { id:4, name:'Sneha Kapoor',    email:'sneha@grandomni.com',  phone:'9871234560', dept:'Admin',        designation:'HR Executive', status:'Inactive', joined:'2020-11-05', avatar:'SK', color:'#ec4899' },
  { id:5, name:'Vikram Singh',    email:'vikram@grandomni.com', phone:'9765432100', dept:'Front Desk',   designation:'Receptionist', status:'Active',   joined:'2022-08-22', avatar:'VS', color:'#8b5cf6' },
  { id:6, name:'Meena Pillai',    email:'meena@grandomni.com',  phone:'9654321098', dept:'Housekeeping', designation:'Staff',        status:'Active',   joined:'2023-05-18', avatar:'MP', color:'#06b6d4' },
  { id:7, name:'Deepak Joshi',    email:'deepak@grandomni.com', phone:'9543210987', dept:'Maintenance',  designation:'Supervisor',   status:'Inactive', joined:'2021-02-14', avatar:'DJ', color:'#f97316' },
  { id:8, name:'Anita Reddy',     email:'anita@grandomni.com',  phone:'9432109876', dept:'Admin',        designation:'Manager',      status:'Active',   joined:'2019-09-30', avatar:'AR', color:'#14b8a6' },
];

const DEPTS    = ['All Departments','Front Desk','Housekeeping','Maintenance','Admin'];
const STATUSES = ['All Status','Active','Inactive'];
const DEPT_OPTS  = ['Front Desk','Housekeeping','Maintenance','Admin'];
const DESIG_OPTS = ['Manager','Supervisor','Receptionist','Technician','HR Executive','Staff'];
const DEPT_META  = {
  'Front Desk':   { bg:'rgba(99,102,241,0.12)',  color:'#6366f1' },
  'Housekeeping': { bg:'rgba(16,185,129,0.12)',  color:'#10b981' },
  'Maintenance':  { bg:'rgba(245,158,11,0.12)',  color:'#d97706' },
  'Admin':        { bg:'rgba(236,72,153,0.12)',  color:'#ec4899' },
};
let nextId = 9;

// ── Shared input style ────────────────────────────────────────────────────────
const base = {
  padding:'9px 12px', borderRadius:'10px', border:'1.5px solid var(--card-border)',
  fontSize:'13px', color:'var(--text-primary)', background:'var(--input-bg)',
  outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s',
};
const focus = e => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; };
const blur  = e => { e.target.style.borderColor='var(--card-border)'; e.target.style.boxShadow='none'; };

// ── Primitives ────────────────────────────────────────────────────────────────
const Lbl = ({ children }) => (
  <label style={{ display:'block', fontSize:'11px', fontWeight:'800', color:'var(--text-muted)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:'6px' }}>{children}</label>
);
const FInput = ({ label, error, ...p }) => (
  <div>
    <Lbl>{label}</Lbl>
    <input {...p} style={{ ...base, width:'100%', borderColor: error?'#ef4444':'var(--card-border)' }} onFocus={focus} onBlur={blur} />
    {error && <p style={{ fontSize:'11px', color:'#ef4444', marginTop:'4px' }}>{error}</p>}
  </div>
);
const FSelect = ({ label, children, ...p }) => (
  <div>
    <Lbl>{label}</Lbl>
    <select {...p} style={{ ...base, width:'100%', cursor:'pointer' }}>{children}</select>
  </div>
);

const Avatar = ({ initials, color, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0,
    background:`linear-gradient(135deg,${color}bb,${color})`,
    display:'grid', placeItems:'center', boxShadow:`0 2px 8px ${color}40` }}>
    <span style={{ fontSize:size>44?14:11, fontWeight:'900', color:'white', letterSpacing:'0.02em' }}>{initials}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span style={{ fontSize:'11px', fontWeight:'800', padding:'4px 10px', borderRadius:'20px',
    display:'inline-flex', alignItems:'center', gap:'5px',
    background: status==='Active'?'rgba(16,185,129,0.1)':'rgba(100,116,139,0.1)',
    color: status==='Active'?'#10b981':'#64748b' }}>
    <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:status==='Active'?'#10b981':'#94a3b8' }}/>
    {status}
  </span>
);

const DeptBadge = ({ dept }) => {
  const m = DEPT_META[dept] || { bg:'rgba(100,116,139,0.1)', color:'#64748b' };
  return <span style={{ fontSize:'11px', fontWeight:'700', padding:'4px 10px', borderRadius:'8px', background:m.bg, color:m.color, whiteSpace:'nowrap' }}>{dept}</span>;
};

const IconBtn = ({ icon, color='#6366f1', bg='rgba(99,102,241,0.08)', title, onClick }) => (
  <button onClick={onClick} title={title} style={{ width:'30px', height:'30px', borderRadius:'8px', border:`1px solid ${color}25`,
    background:bg, display:'grid', placeItems:'center', cursor:'pointer', color, flexShrink:0, transition:'all 0.15s' }}
    onMouseOver={e => e.currentTarget.style.opacity='0.75'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
    {icon}
  </button>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ show, message, type }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity:0, y:32, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:32 }}
        style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:9999,
          background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'white',
          padding:'12px 18px', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px',
          boxShadow:'0 20px 40px rgba(0,0,0,0.3)', fontSize:'13px', fontWeight:'600',
          border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width:'24px', height:'24px', borderRadius:'7px', background:type==='error'?'#ef4444':'#10b981', display:'grid', placeItems:'center', flexShrink:0 }}>
          {type==='error'?<X size={12} color="white"/>:<Check size={12} color="white"/>}
        </div>
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
const ConfirmModal = ({ show, name, onConfirm, onCancel }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(8px)', zIndex:9000, display:'grid', placeItems:'center' }}>
        <motion.div initial={{ scale:0.92, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92 }}
          style={{ background:'var(--card-bg)', borderRadius:'22px', padding:'32px', maxWidth:'380px', width:'90%',
            boxShadow:'0 40px 80px rgba(0,0,0,0.25)', border:'1px solid var(--card-border)' }}>
          <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'rgba(239,68,68,0.1)', display:'grid', placeItems:'center', marginBottom:'18px' }}>
            <Trash2 size={22} color="#ef4444"/>
          </div>
          <h3 style={{ fontSize:'17px', fontWeight:'800', color:'var(--text-primary)', marginBottom:'8px' }}>Delete Staff Member?</h3>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'24px', lineHeight:1.6 }}>
            <strong style={{ color:'var(--text-primary)' }}>{name}</strong> will be permanently removed. This cannot be undone.
          </p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={onCancel} style={{ flex:1, padding:'11px', borderRadius:'11px', border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-primary)', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex:1, padding:'11px', borderRadius:'11px', border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'white', fontWeight:'700', cursor:'pointer', fontSize:'13px', boxShadow:'0 4px 12px rgba(239,68,68,0.3)' }}>Delete</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Staff Form Modal ──────────────────────────────────────────────────────────
const StaffModal = ({ mode, initial, allEmails, onClose, onSubmit }) => {
  const empty = { name:'', email:'', phone:'', dept:'Front Desk', designation:'Receptionist', joined:'', status:'Active' };
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    else if (mode==='add' && allEmails.includes(form.email.toLowerCase())) e.email = 'Email already exists';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Enter valid 10-digit number';
    if (!form.joined) e.joined = 'Joining date is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="b24-modal-overlay">
      <motion.div initial={{ scale:0.95, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }}
        className="b24-modal" style={{ maxWidth:500 }}>

        <div className="b24-modal-header">
          <h3 className="b24-modal-title">{mode==='add'?'Add New Staff':'Edit Staff'}</h3>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}>
            <X size={16}/>
          </button>
        </div>

        <div className="b24-modal-body" style={{ maxHeight:'62vh', overflowY:'auto' }}>
          <div className="b24-row b24-row-2">
            <div className="b24-field">
              <label className="b24-label">Full Name <span className="required">*</span></label>
              <input className={`b24-input${errors.name?' error':''}`} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Arjun Sharma"/>
              {errors.name && <span className="b24-error">{errors.name}</span>}
            </div>
            <div className="b24-field">
              <label className="b24-label">Phone <span className="required">*</span></label>
              <input className={`b24-input${errors.phone?' error':''}`} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit number"/>
              {errors.phone && <span className="b24-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="b24-field">
            <label className="b24-label">Email Address <span className="required">*</span></label>
            <input type="email" className={`b24-input${errors.email?' error':''}`} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="staff@grandomni.com"/>
            {errors.email && <span className="b24-error">{errors.email}</span>}
          </div>

          <div className="b24-row b24-row-2">
            <div className="b24-field">
              <label className="b24-label">Department</label>
              <select className="b24-select" value={form.dept} onChange={e=>set('dept',e.target.value)}>
                {DEPT_OPTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="b24-field">
              <label className="b24-label">Designation</label>
              <select className="b24-select" value={form.designation} onChange={e=>set('designation',e.target.value)}>
                {DESIG_OPTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="b24-field">
            <label className="b24-label">Joining Date <span className="required">*</span></label>
            <input type="date" className={`b24-input${errors.joined?' error':''}`} value={form.joined} onChange={e=>set('joined',e.target.value)}/>
            {errors.joined && <span className="b24-error">{errors.joined}</span>}
          </div>

          <div className="b24-field">
            <label className="b24-label">Account Status</label>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:4, border:'1px solid var(--input-border)', background:'var(--card-bg)' }}>
              <span style={{ fontSize:13, color:'var(--text-primary)', fontWeight:600 }}>{form.status}</span>
              <div onClick={()=>set('status',form.status==='Active'?'Inactive':'Active')} style={{ cursor:'pointer' }}>
                <div style={{ width:40, height:22, borderRadius:99, position:'relative', background:form.status==='Active'?'#2563eb':'var(--card-border)', transition:'background 0.2s' }}>
                  <motion.div animate={{ x:form.status==='Active'?20:2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
                    style={{ position:'absolute', top:2, width:18, height:18, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
                </div>
              </div>
            </div>
          </div>

          <div className="b24-field">
            <label className="b24-label">Profile Image (optional)</label>
            <label style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:4, border:'1px dashed var(--input-border)', cursor:'pointer', background:'var(--card-bg)' }}
              onMouseOver={e=>e.currentTarget.style.borderColor='#2563eb'}
              onMouseOut={e=>e.currentTarget.style.borderColor='var(--input-border)'}>
              <Upload size={14} color='#2563eb'/>
              <span style={{ fontSize:13, color:'var(--text-secondary)' }}>Click to upload photo</span>
              <input type="file" accept="image/*" style={{ display:'none' }}/>
            </label>
          </div>
        </div>

        <div className="b24-modal-footer">
          <button className="b24-btn b24-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="b24-btn b24-btn-primary" onClick={()=>{ if(validate()) onSubmit(form); }}>
            <Check size={13}/>{mode==='add'?'Create Staff':'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── View Drawer ───────────────────────────────────────────────────────────────
const ViewDrawer = ({ staff, onClose, onEdit }) => (
  <AnimatePresence>
    {staff && (
      <>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', backdropFilter:'blur(4px)', zIndex:7000 }}/>
        <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', stiffness:300, damping:30 }}
          style={{ position:'fixed', right:0, top:0, bottom:0, width:'340px', background:'var(--card-bg)',
            boxShadow:'-20px 0 60px rgba(0,0,0,0.15)', zIndex:7001, display:'flex', flexDirection:'column',
            border:'1px solid var(--card-border)' }}>
          <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)' }}>Staff Profile</h3>
            <button onClick={onClose} style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--bg-darker)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-muted)' }}>
              <X size={14}/>
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'22px' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', marginBottom:'24px',
              padding:'22px', borderRadius:'16px', background:'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))',
              border:'1px solid rgba(99,102,241,0.12)' }}>
              <Avatar initials={staff.avatar} color={staff.color} size={60}/>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:'16px', fontWeight:'800', color:'var(--text-primary)' }}>{staff.name}</p>
                <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginTop:'3px' }}>{staff.designation}</p>
                <div style={{ marginTop:'8px' }}><StatusBadge status={staff.status}/></div>
              </div>
            </div>
            {[
              { icon:<Mail size={14}/>,      label:'Email',      value:staff.email },
              { icon:<Phone size={14}/>,     label:'Phone',      value:staff.phone },
              { icon:<Building2 size={14}/>, label:'Department', value:staff.dept },
              { icon:<Shield size={14}/>,    label:'Role',       value:staff.designation },
              { icon:<Calendar size={14}/>,  label:'Joined',     value:new Date(staff.joined).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 0', borderBottom:'1px solid var(--card-border)' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:'var(--bg-darker)', display:'grid', placeItems:'center', flexShrink:0, color:'var(--text-muted)' }}>{row.icon}</div>
                <div>
                  <p style={{ fontSize:'10px', fontWeight:'800', color:'var(--text-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{row.label}</p>
                  <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', marginTop:'2px' }}>{row.value}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'18px' }}>
              <Lbl>Notes</Lbl>
              <textarea placeholder="Add notes..." style={{ ...base, width:'100%', minHeight:'72px', resize:'vertical', fontFamily:'inherit' }} onFocus={focus} onBlur={blur}/>
            </div>
          </div>
          <div style={{ padding:'14px 22px', borderTop:'1px solid var(--card-border)' }}>
            <button onClick={()=>onEdit(staff)} style={{ width:'100%', padding:'11px', borderRadius:'12px', border:'none',
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:'700', cursor:'pointer', fontSize:'13px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
              <Pencil size={13}/> Edit Staff
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const Staff = () => {
  const [staff, setStaff]         = useState(INIT_STAFF);
  const [search, setSearch]       = useState('');
  const [deptF, setDeptF]         = useState('All Departments');
  const [statusF, setStatusF]     = useState('All Status');
  const [modal, setModal]         = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [selected, setSelected]   = useState([]);  const [page, setPage]           = useState(1);
  const [perPage, setPerPage]     = useState(10);
  const [toast, setToast]         = useState({ show:false, message:'', type:'success' });

  const showToast = (message, type='success') => {
    setToast({ show:true, message, type });
    setTimeout(() => setToast(t=>({...t,show:false})), 3000);
  };

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone.includes(q))
      && (deptF==='All Departments' || s.dept===deptF)
      && (statusF==='All Status' || s.status===statusF);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page-1)*perPage, page*perPage);

  const handleAdd = form => {
    const colors = ['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#f97316','#14b8a6'];
    const initials = form.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    setStaff(s=>[...s,{...form,id:nextId++,avatar:initials,color:colors[nextId%colors.length]}]);
    setModal(null); showToast('Staff member added successfully');
  };
  const handleEdit = form => {
    setStaff(s=>s.map(x=>x.id===modal.data.id?{...x,...form}:x));
    setModal(null); setViewStaff(null); showToast('Staff updated successfully');
  };
  const handleDelete = () => {
    setStaff(s=>s.filter(x=>x.id!==delTarget.id));
    setDelTarget(null); showToast('Staff member deleted','error');
  };
  const toggleStatus = id => {
    setStaff(s=>s.map(x=>x.id===id?{...x,status:x.status==='Active'?'Inactive':'Active'}:x));
    showToast('Status updated');
  };
  const toggleSel = id => setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const toggleAll = () => setSelected(s=>s.length===paginated.length?[]:paginated.map(x=>x.id));

  const exportCSV = () => {
    const rows=[['Name','Email','Phone','Department','Designation','Status','Joined'],
      ...filtered.map(s=>[s.name,s.email,s.phone,s.dept,s.designation,s.status,s.joined])];
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n'));
    a.download='staff.csv'; a.click();
  };

  const allEmails = staff.map(s=>s.email.toLowerCase());
  const stats = [
    { label:'Total Staff',  value:staff.length,                               icon:<Users size={18}/>,      color:'#6366f1', bg:'rgba(99,102,241,0.1)' },
    { label:'Active',       value:staff.filter(s=>s.status==='Active').length, icon:<UserCheck size={18}/>,  color:'#10b981', bg:'rgba(16,185,129,0.1)' },
    { label:'Inactive',     value:staff.filter(s=>s.status==='Inactive').length,icon:<UserX size={18}/>,    color:'#64748b', bg:'rgba(100,116,139,0.1)' },
    { label:'Departments',  value:4,                                           icon:<LayoutGrid size={18}/>, color:'#f59e0b', bg:'rgba(245,158,11,0.1)'  },
  ];

  return (
    <div style={{ minHeight:'100%' }}>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'22px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'grid', placeItems:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.4)', flexShrink:0 }}>
              <UserCircle2 size={18} color="white"/>
            </div>
            <h1 style={{ fontSize:'22px', fontWeight:'900', color:'var(--text-primary)', letterSpacing:'-0.6px' }}>Staff Management</h1>
          </div>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)', paddingLeft:'46px' }}>Manage hotel staff accounts and details</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', borderRadius:'10px',
            border:'1.5px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-primary)',
            fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow:'var(--card-shadow)', whiteSpace:'nowrap' }}>
            <Download size={14}/> Export CSV
          </button>
          <button onClick={()=>setModal('add')} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px', borderRadius:'10px',
            border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white',
            fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow:'0 4px 14px rgba(99,102,241,0.35)', whiteSpace:'nowrap' }}>
            <Plus size={15}/> Add Staff
          </button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'20px' }}>
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'16px',
              padding:'16px 18px', boxShadow:'var(--card-shadow)', display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'13px', background:s.bg, display:'grid', placeItems:'center', flexShrink:0, color:s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize:'22px', fontWeight:'900', color:'var(--text-primary)', lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-secondary)', marginTop:'3px' }}>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter bar — single row */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'14px',
        padding:'12px 16px', marginBottom:'16px', boxShadow:'var(--card-shadow)',
        display:'flex', alignItems:'center', gap:'10px' }}>

        {/* Search */}
        <div style={{ position:'relative', flex:'1', minWidth:0 }}>
          <Search size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            placeholder="Search by name, email or phone..."
            style={{ ...base, width:'100%', paddingLeft:'34px' }} onFocus={focus} onBlur={blur}/>
        </div>

        {/* Dept filter */}
        <select value={deptF} onChange={e=>{setDeptF(e.target.value);setPage(1);}}
          style={{ ...base, width:'160px', flexShrink:0, cursor:'pointer' }}>
          {DEPTS.map(d=><option key={d}>{d}</option>)}
        </select>

        {/* Status filter */}
        <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}}
          style={{ ...base, width:'130px', flexShrink:0, cursor:'pointer' }}>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>

        {/* Reset */}
        <button onClick={()=>{setSearch('');setDeptF('All Departments');setStatusF('All Status');setPage(1);}} title="Reset"
          style={{ width:'36px', height:'36px', borderRadius:'10px', border:'1.5px solid var(--card-border)', background:'var(--card-bg)',
            display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-secondary)', flexShrink:0 }}>
          <RefreshCw size={14}/>
        </button>

      </div>

      {/* Table card */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'20px', boxShadow:'var(--card-shadow)', overflow:'hidden' }}>

        {paginated.length === 0 ? (
          <div style={{ padding:'72px 20px', textAlign:'center' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'18px', background:'var(--bg-darker)', display:'grid', placeItems:'center', margin:'0 auto 14px', color:'var(--text-muted)' }}>
              <UserCircle2 size={26}/>
            </div>
            <p style={{ fontSize:'15px', fontWeight:'800', color:'var(--text-primary)', marginBottom:'6px' }}>No staff found</p>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'20px' }}>Try adjusting your filters or add a new staff member</p>
            <button onClick={()=>setModal('add')} style={{ padding:'10px 22px', borderRadius:'11px', border:'none',
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:'700', cursor:'pointer', fontSize:'13px',
              display:'inline-flex', alignItems:'center', gap:'7px', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
              <Plus size={14}/> Add Staff
            </button>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'820px' }}>
              <thead>
                <tr>
                  {['Staff Member','Phone','Department','Designation','Status','Joined','Actions'].map((h,i) => (
                    <th key={h} style={{
                      padding:'13px 18px', textAlign:'left', fontSize:'10px', fontWeight:'900',
                      color:'var(--text-muted)', letterSpacing:'0.09em', whiteSpace:'nowrap',
                      background:'var(--bg-darker)', borderBottom:'1px solid var(--card-border)',
                      ...(i===0?{borderRadius:'0'}:{}),
                    }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                    style={{ borderBottom:'1px solid var(--card-border)', transition:'background 0.15s', cursor:'default' }}
                    onMouseOver={e=>e.currentTarget.style.background='rgba(99,102,241,0.04)'}
                    onMouseOut={e=>e.currentTarget.style.background='transparent'}>

                    {/* Staff Member */}
                    <td style={{ padding:'15px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <Avatar initials={s.avatar} color={s.color} size={38}/>
                        <div>
                          <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-primary)', lineHeight:1.3 }}>{s.name}</p>
                          <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'1px' }}>{s.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td style={{ padding:'15px 18px' }}>
                      <span style={{ fontSize:'12px', color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:'5px',
                        background:'var(--bg-darker)', padding:'5px 10px', borderRadius:'8px', fontWeight:'600' }}>
                        <Phone size={11} color="var(--text-muted)"/>{s.phone}
                      </span>
                    </td>

                    {/* Department */}
                    <td style={{ padding:'15px 18px' }}><DeptBadge dept={s.dept}/></td>

                    {/* Designation */}
                    <td style={{ padding:'15px 18px' }}>
                      <span style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-primary)',
                        background:'var(--bg-darker)', padding:'5px 10px', borderRadius:'8px' }}>{s.designation}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding:'15px 18px' }}><StatusBadge status={s.status}/></td>

                    {/* Joined */}
                    <td style={{ padding:'15px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <Calendar size={11} color="var(--text-muted)"/>
                        <span style={{ fontSize:'12px', color:'var(--text-secondary)', fontWeight:'600', whiteSpace:'nowrap' }}>
                          {new Date(s.joined).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding:'15px 18px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={()=>setViewStaff(s)} title="View"
                          style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'6px 11px', borderRadius:'8px',
                            border:'1px solid rgba(99,102,241,0.2)', background:'rgba(99,102,241,0.07)',
                            color:'#6366f1', fontSize:'11px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>
                          <Eye size={12}/> View
                        </button>
                        <button onClick={()=>setModal({mode:'edit',data:s})} title="Edit"
                          style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'6px 11px', borderRadius:'8px',
                            border:'1px solid rgba(245,158,11,0.2)', background:'rgba(245,158,11,0.07)',
                            color:'#d97706', fontSize:'11px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>
                          <Pencil size={12}/> Edit
                        </button>
                        <button onClick={()=>setDelTarget(s)} title="Delete"
                          style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.2)',
                            background:'rgba(239,68,68,0.07)', display:'grid', placeItems:'center', cursor:'pointer', color:'#ef4444', flexShrink:0 }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{ padding:'12px 18px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>Rows:</span>
              <select value={perPage} onChange={e=>{setPerPage(Number(e.target.value));setPage(1);}}
                style={{ ...base, padding:'5px 10px', width:'auto', fontSize:'12px' }}>
                {[10,25,50].map(n=><option key={n}>{n}</option>)}
              </select>
              <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>
                {(page-1)*perPage+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}
              </span>
            </div>
            <div style={{ display:'flex', gap:'5px' }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', cursor:page===1?'not-allowed':'pointer', display:'grid', placeItems:'center', color:'var(--text-secondary)', opacity:page===1?0.4:1 }}>
                <ChevronLeft size={13}/>
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)} style={{ width:'30px', height:'30px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700',
                  background:page===n?'linear-gradient(135deg,#6366f1,#8b5cf6)':'var(--card-bg)',
                  color:page===n?'white':'var(--text-secondary)',
                  boxShadow:page===n?'0 2px 8px rgba(99,102,241,0.3)':'none',
                  outline:page===n?'none':'1px solid var(--card-border)' }}>{n}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--card-bg)', cursor:page===totalPages?'not-allowed':'pointer', display:'grid', placeItems:'center', color:'var(--text-secondary)', opacity:page===totalPages?0.4:1 }}>
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(modal==='add' || modal?.mode==='edit') && (
          <StaffModal
            mode={modal==='add'?'add':'edit'}
            initial={modal?.data}
            allEmails={allEmails}
            onClose={()=>setModal(null)}
            onSubmit={modal==='add'?handleAdd:handleEdit}
          />
        )}
      </AnimatePresence>

      <ViewDrawer staff={viewStaff} onClose={()=>setViewStaff(null)} onEdit={s=>{setViewStaff(null);setModal({mode:'edit',data:s});}}/>
      <ConfirmModal show={!!delTarget} name={delTarget?.name} onConfirm={handleDelete} onCancel={()=>setDelTarget(null)}/>
      <Toast show={toast.show} message={toast.message} type={toast.type}/>
    </div>
  );
};

export default Staff;
