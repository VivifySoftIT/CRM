import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Download, Upload, Filter, X,
  CheckSquare, Square, Building2, MapPin, 
  Globe, Phone, Edit2, Trash2, RefreshCw, Check
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  { id: 1, name: 'Acme Corp', industry: 'Technology', website: 'acme.com', phone: '+1-555-0101', location: 'New York, USA', owner: 'John Sales', revenue: 5000000, employees: 250, date: '2025-12-01', tags: ['Enterprise', 'VIP'] },
  { id: 2, name: 'Globex Inc', industry: 'Manufacturing', website: 'globex.io', phone: '+1-555-0102', location: 'London, UK', owner: 'Sarah Doe', revenue: 12000000, employees: 800, date: '2025-11-15', tags: ['Partner'] },
  { id: 3, name: 'Initech', industry: 'Software', website: 'initech.net', phone: '+1-555-0103', location: 'Austin, USA', owner: 'Mike Ross', revenue: 3500000, employees: 120, date: '2026-01-20', tags: ['Startup'] },
  { id: 4, name: 'Umbrella Corp', industry: 'Medical', website: 'umbrella.co', phone: '+1-555-0104', location: 'Racoon City, USA', owner: 'Alice Vance', revenue: 50000000, employees: 5000, date: '2026-02-10', tags: ['Enterprise'] },
];

const TAG_COLORS = {
  'Enterprise': { bg: 'rgba(37,99,235,0.1)', text: '#2563eb' },
  'Startup': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  'Partner': { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  'VIP': { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

const ALL_INDUSTRIES = ['Technology', 'Manufacturing', 'Software', 'Medical', 'Finance'];
const ALL_OWNERS = ['John Sales', 'Sarah Doe', 'Mike Ross', 'Alice Vance'];

// ─── Add/Edit Drawer ─────────────────────────────────────────────────────────
function AccountDrawer({ account, onClose, onSave }) {
  const [form, setForm] = useState(account || {
    name: '', industry: '', website: '', phone: '', location: '', owner: 'John Sales', revenue: '', employees: '', tags: []
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 500,
          background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)',
          zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(0,0,0,0.12)'
        }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
            {account ? 'Edit Account' : 'Add New Account'}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Account Name *</label>
              <input type="text" placeholder="e.g. Acme Corporation" value={form.name} onChange={e => set('name', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Industry</label>
                <select value={form.industry} onChange={e => set('industry', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}>
                  <option value="">Select Industry</option>
                  {ALL_INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Revenue ($)</label>
                <input type="number" placeholder="5000000" value={form.revenue} onChange={e => set('revenue', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Website</label>
                <input type="text" placeholder="www.acme.com" value={form.website} onChange={e => set('website', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Phone</label>
                <input type="tel" placeholder="+1-555-0101" value={form.phone} onChange={e => set('phone', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Location</label>
              <textarea placeholder="e.g. New York, USA" value={form.location} onChange={e => set('location', e.target.value)} rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical' }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Account Owner</label>
              <select value={form.owner} onChange={e => set('owner', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 14 }}>
                {ALL_OWNERS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 12 }}>
          <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="b24-btn b24-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Check size={16} /> {account ? 'Update Account' : 'Create Account'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Accounts Page ──────────────────────────────────────────────────────
export default function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [search, setSearch] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const processed = useMemo(() => {
    return accounts.filter(c =>
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) || 
       c.website.toLowerCase().includes(search.toLowerCase()) || 
       c.location.toLowerCase().includes(search.toLowerCase())) &&
      (!filterOwner || c.owner === filterOwner) &&
      (!filterIndustry || c.industry === filterIndustry)
    ).sort((a,b) => b.id - a.id);
  }, [accounts, search, filterOwner, filterIndustry]);

  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(processed.length / PER_PAGE);

  const toggleSelection = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const saveAccount = form => {
    if (drawer && drawer !== 'add') {
      setAccounts(prev => prev.map(c => c.id === drawer.id ? { ...c, ...form } : c));
    } else {
      setAccounts(prev => [{ ...form, id: Date.now(), date: new Date().toISOString().split('T')[0], tags: [] }, ...prev]);
    }
    setDrawer(null);
  };

  const deleteAccount = (id, e) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(a => a.id !== id));
      setSelected(selected.filter(x => x !== id));
    }
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.7px' }}>Accounts</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{processed.length} total companies</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b24-btn b24-btn-secondary"><Upload size={16} /> Import</button>
            <button className="b24-btn b24-btn-secondary"><Download size={16} /> Export</button>
            <button className="b24-btn b24-btn-primary" onClick={() => setDrawer('add')}><Plus size={16} /> Add Account</button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search by company name, website, or location..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '11px 12px 11px 42px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <button className="b24-btn b24-btn-secondary" onClick={() => setShowFilter(v => !v)}>
            <Filter size={16} /> Filters {(filterOwner || filterIndustry) && <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, borderRadius: 99, padding: '1px 6px', marginLeft: 4 }}>!</span>}
          </button>
          <button className="b24-btn b24-btn-secondary"><RefreshCw size={16} /></button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Industry</label>
                  <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}>
                    <option value="">All Industries</option>
                    {ALL_INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Owner</label>
                  <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}>
                    <option value="">All Owners</option>
                    {ALL_OWNERS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button className="b24-btn b24-btn-secondary" style={{ alignSelf: 'flex-end', height: 36 }} onClick={() => { setFilterOwner(''); setFilterIndustry(''); }}><X size={14} /> Clear</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div style={{ padding: '0 32px 32px', flex: 1 }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '14px 16px', width: 40 }}><Square size={18} color="var(--text-muted)" /></th>
                {['Account Name', 'Industry', 'Contact Info', 'Owner', 'Revenue', 'Location', ''].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/accounts/${a.id}`)}
                  className="hover:bg-slate-50/50 transition-colors">
                  <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelection(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                      {selected.includes(a.id) ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} />}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 13, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        {a.name.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{a.name}</span>
                        <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                          {a.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', padding: '1px 6px', borderRadius: 4, background: TAG_COLORS[tag]?.bg || 'rgba(0,0,0,0.1)', color: TAG_COLORS[tag]?.text || '#000' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                       <Building2 size={13} color="#2563eb" /> {a.industry}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={12}/> {a.website}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12}/> {a.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: '#8b5cf6', color: '#fff', fontSize: 9, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{a.owner.charAt(0)}</div>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{a.owner}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', fontWeight: 800 }}>
                    ${parseInt(a.revenue).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                      <MapPin size={12} /> {a.location}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400" onClick={() => setDrawer(a)}><Edit2 size={14} /></button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500" onClick={(e) => deleteAccount(a.id, e)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
             <div style={{ padding: '16px 20px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Showing {paginated.length} of {processed.length} accounts</span>
                <div style={{ display: 'flex', gap: 4 }}>
                   {Array.from({ length: totalPages }).map((_, i) => (
                     <button key={i} onClick={() => setPage(i+1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--card-border)', background: page === i+1 ? '#2563eb' : 'transparent', color: page === i+1 ? '#fff' : 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}>{i+1}</button>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>

      {drawer && <AccountDrawer account={drawer === 'add' ? null : drawer} onClose={() => setDrawer(null)} onSave={saveAccount} />}
    </div>
  );
}
