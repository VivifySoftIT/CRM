import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Save, Layout, Filter, Database, BarChart3, PieChart, Table as TableIcon, LineChart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const STEPS = [
  { id: 1, title: 'Select Module', icon: Database },
  { id: 2, title: 'Group & Visualization', icon: Layout },
  { id: 3, title: 'Save & Run', icon: BarChart3 }
];

const MODULES = [
  { id: 'leads', name: 'Leads', desc: 'Performance and quality tracking' },
  { id: 'deals', name: 'Deals & Pipeline', desc: 'Revenue and sales velocity' },
  { id: 'campaigns', name: 'Campaigns', desc: 'ROI and engagement metrics' },
  { id: 'activities', name: 'Activities', desc: 'Team productivity summary' }
];

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
  { id: 'pie', name: 'Pie Chart', icon: PieChart },
  { id: 'line', name: 'Line Chart', icon: LineChart },
  { id: 'table', name: 'Data Table', icon: TableIcon }
];

export default function ReportBuilder({ onClose, onSave }) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    module: 'deals',
    chartType: 'bar',
    groupBy: 'stage',
    filters: []
  });

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSave = () => {
    if (!config.name.trim()) {
      alert('Please enter a report name.');
      return;
    }
    onSave({ 
      ...config, 
      id: `custom-${Date.now()}`,
      category: config.module.charAt(0).toUpperCase() + config.module.slice(1)
    });
  };

  const modalBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ 
          background: modalBg, width: '100%', maxWidth: 700, borderRadius: 24, overflow: 'hidden', 
          display: 'flex', flexDirection: 'column', border: `1px solid ${border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Custom Report Builder</h2>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {STEPS.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: step >= s.id ? '#3b82f6' : 'var(--input-bg)', color: step >= s.id ? '#fff' : 'var(--text-muted)', fontSize: 11, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{s.id}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: step === s.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.title}</span>
                  {s.id < 3 && <ChevronRight size={14} color="var(--text-muted)" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        {/* Content */}
        <div style={{ padding: 40, minHeight: 400 }}>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <label style={labelStyle}>Select Data Module</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {MODULES.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => setConfig({ ...config, module: m.id })}
                    style={{ 
                      padding: 20, textAlign: 'left', borderRadius: 12, border: '2px solid', transition: 'all 0.2s',
                      borderColor: config.module === m.id ? '#3b82f6' : border,
                      background: config.module === m.id ? '#3b82f608' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div style={{ marginBottom: 32 }}>
                 <label style={labelStyle}>Chart Visualization Type</label>
                 <div style={{ display: 'flex', gap: 12 }}>
                    {CHART_TYPES.map(ct => (
                      <button 
                        key={ct.id} onClick={() => setConfig({ ...config, chartType: ct.id })}
                        style={{ 
                          flex: 1, padding: '16px 8px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                          border: '2.5px solid', borderColor: config.chartType === ct.id ? '#3b82f6' : border,
                          background: config.chartType === ct.id ? '#3b82f608' : 'transparent', color: config.chartType === ct.id ? '#3b82f6' : 'var(--text-muted)', transition: 'all 0.2s'
                        }}
                      >
                         <ct.icon size={24} />
                         <span style={{ fontSize: 11, fontWeight: 900 }}>{ct.name}</span>
                      </button>
                    ))}
                 </div>
               </div>

               <div>
                 <label style={labelStyle}>Primary Grouping Category</label>
                 <select 
                    value={config.groupBy} onChange={e => setConfig({ ...config, groupBy: e.target.value })}
                    className="b24-select" style={{ width: '100%', borderRadius: 10, padding: 12 }}
                 >
                    <option value="stage">By Stage / Status</option>
                    <option value="owner">By Owner / Representative</option>
                    <option value="source">By Lead Source / Channel</option>
                    <option value="month">Time Trend (Monthly)</option>
                 </select>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div style={{ marginBottom: 32 }}>
                 <label style={labelStyle}>Report Name</label>
                 <input 
                   autoFocus value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })}
                   placeholder="e.g. Q4 Sales Velocity Audit"
                   className="b24-input" style={{ width: '100%', padding: '14px 18px', borderRadius: 12, fontSize: 15 }} 
                 />
               </div>

               <div style={{ padding: 24, borderRadius: 16, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Configuration Summary</div>
                  <div style={{ display: 'flex', gap: 32 }}>
                     <div>
                       <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Module</div>
                       <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{config.module.toUpperCase()}</div>
                     </div>
                     <div>
                       <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Visualization</div>
                       <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{config.chartType.toUpperCase()}</div>
                     </div>
                     <div>
                       <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Aggregation</div>
                       <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>COUNT DISTINCT</div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' }}>
          <button 
             onClick={prev} disabled={step === 1}
             style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: step === 1 ? 'transparent' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} className="b24-btn b24-btn-secondary" style={{ padding: '10px 24px', borderRadius: 10 }}>Cancel</button>
            {step < 3 ? (
              <button onClick={next} className="b24-btn b24-btn-primary" style={{ padding: '10px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleSave} className="b24-btn b24-btn-primary" style={{ padding: '10px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, background: '#10b981' }}>
                <Save size={18} /> Save & Run
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
