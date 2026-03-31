import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { STAGES } from './DealCard';

export default function StatusDropdown({ currentStageId, onStageChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stageId, e) => {
    e.stopPropagation(); // prevent drag
    setOpen(false);
    if (stageId !== currentStageId) {
      onStageChange(stageId);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }} onPointerDown={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: currentStage.bg,
          color: currentStage.color,
          border: `1px solid ${currentStage.color}40`,
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        className="hover:opacity-80"
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentStage.color }} />
        {currentStage.label}
        <ChevronDown size={14} style={{ opacity: 0.7 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 6,
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 50,
              minWidth: 160,
              padding: '6px'
            }}
          >
            {STAGES.map(stage => {
              const active = stage.id === currentStageId;
              return (
                <button
                  key={stage.id}
                  onClick={(e) => handleSelect(stage.id, e)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '8px 12px',
                    borderRadius: 6, border: 'none',
                    background: active ? stage.bg : 'transparent',
                    color: active ? stage.color : 'var(--text-primary)',
                    fontSize: 12, fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                    {stage.label}
                  </div>
                  {active && <Check size={14} color={stage.color} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
