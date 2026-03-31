import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation2, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockVisits';

export default function VisitsMap({ visits, onViewDetails }) {
  const { isDark } = useTheme();
  
  // Mock bounding box centering on SF/Silicon Valley area roughly where our mock data is 
  // Normally you pass lat/lng arrays to google-map-react. For this mock, we map lat/lng to arbitrary percentages.
  
  const [activePin, setActivePin] = useState(null);

  const getPercentagePos = (lat, lng) => {
     // Extremely rough normalization for the 4 mock pins
     // LAT: 34 (LA) to 47 (Seattle). 
     // LNG: -118 (LA) to -122 (SV)
     
     // Normalize to percentages based on these arbitrary bounds to fit them nicely on a canvas
     const latMin = 33; const latMax = 48;
     const lngMin = -124; const lngMax = -116;

     const y = 100 - (((lat - latMin) / (latMax - latMin)) * 100); // Invert Y for latitude
     const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;

     return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 700, background: isDark ? '#1a2234' : '#e2e8f0', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
      
      {/* Map Background Simulation */}
      <div style={{ position: 'absolute', inset: 0, opacity: isDark ? 0.3 : 0.6, backgroundImage: `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z" fill="${isDark ? '%23334155' : '%23cbd5e1'}" fill-opacity="0.4" fill-rule="evenodd"/></svg>')` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, var(--card-bg) 150%)' }} />
      
      {/* Map Controls */}
      <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
        <button className="b24-btn b24-btn-secondary" style={{ width: 40, height: 40, padding: 0, display: 'grid', placeItems: 'center', borderRadius: 10, background: 'var(--card-bg)' }}><Crosshair size={18}/></button>
        <button className="b24-btn b24-btn-secondary" style={{ width: 40, height: 40, padding: 0, display: 'grid', placeItems: 'center', borderRadius: 10, background: 'var(--card-bg)' }}><ZoomIn size={18}/></button>
        <button className="b24-btn b24-btn-secondary" style={{ width: 40, height: 40, padding: 0, display: 'grid', placeItems: 'center', borderRadius: 10, background: 'var(--card-bg)' }}><ZoomOut size={18}/></button>
      </div>

      {/* Pins Layout */}
      <div style={{ position: 'absolute', inset: '10%' }}> {/* 10% padding boundary */}
        {visits.map(visit => {
          const { top, left } = getPercentagePos(visit.latitude, visit.longitude);
          const st = STATUS_COLORS[visit.status];
          const isActive = activePin === visit.id;

          return (
            <div key={visit.id} style={{ position: 'absolute', top, left, transform: 'translate(-50%, -100%)', zIndex: isActive ? 20 : 10 }}>
              
              {/* The Pin */}
              <motion.div 
                whileHover={{ scale: 1.2, y: -5 }} animate={isActive ? { scale: 1.2, y: -5 } : { scale: 1, y: 0 }}
                onClick={() => setActivePin(isActive ? null : visit.id)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                 <div style={{ width: 32, height: 32, borderRadius: '50% 50% 50% 0', background: st.bg, border: `2px solid ${st.text}`, transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: st.text, transform: 'rotate(45deg)' }} />
                 </div>
              </motion.div>

              {/* Pin Popup */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 16, width: 280, background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', cursor: 'default' }}
                  >
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: st.text, background: st.bg, padding: '2px 8px', borderRadius: 20, marginBottom: 8, display: 'inline-block' }}>{visit.status}</span>
                      <h4 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{visit.title}</h4>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                         <MapPin size={14} color="#3b82f6" style={{flexShrink:0}}/> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{visit.location}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                         <Navigation2 size={14} color="#10b981" /> {visit.latitude.toFixed(4)}, {visit.longitude.toFixed(4)}
                      </div>

                      <button 
                        onClick={() => onViewDetails(visit)}
                        className="b24-btn b24-btn-primary" 
                        style={{ width: '100%', padding: '10px', borderRadius: 10, marginTop: 4, background: '#3b82f6' }}
                      >
                        Open Details
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )
        })}
      </div>

    </div>
  );
}
