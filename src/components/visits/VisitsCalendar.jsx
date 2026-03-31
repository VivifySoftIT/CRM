import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../data/mockVisits';

export default function VisitsCalendar({ visits, onViewDetails }) {
  const { isDark } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const calendarData = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const startDay = startDayOfMonth(month, year);
    
    let grid = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(null);
        } else if (dayCounter > days) {
          week.push(null);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }
      grid.push(week);
      if (dayCounter > days) break;
    }
    return grid;
  }, [currentDate]);

  const getVisitsForDay = (day) => {
    if (!day) return [];
    return visits.filter(v => {
      const vDate = new Date(v.visitDate);
      return vDate.getDate() === day && 
             vDate.getMonth() === currentDate.getMonth() &&
             vDate.getFullYear() === currentDate.getFullYear();
    }).sort((a,b) => new Date(a.visitDate) - new Date(b.visitDate));
  };

  const isToday = (day) => {
    if (!day) return false;
    const t = new Date();
    return day === t.getDate() && currentDate.getMonth() === t.getMonth() && currentDate.getFullYear() === t.getFullYear();
  };

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--card-border)', background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
         <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
           {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
         </h2>
         <div style={{ display: 'flex', gap: 8 }}>
           <button onClick={handlePrevMonth} className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 8 }}><ChevronLeft size={16}/></button>
           <button onClick={() => setCurrentDate(new Date())} className="b24-btn b24-btn-secondary" style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>Today</button>
           <button onClick={handleNextMonth} className="b24-btn b24-btn-secondary" style={{ padding: 6, borderRadius: 8 }}><ChevronRight size={16}/></button>
         </div>
      </div>

      {/* Days of Week */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--card-border)' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ padding: '12px 0', textAlign: 'center', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 600 }}>
        {calendarData.map((week, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, borderBottom: i < calendarData.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
            {week.map((day, j) => {
              const dayVisits = getVisitsForDay(day);
              return (
                <div key={j} style={{ borderRight: j < 6 ? '1px solid var(--card-border)' : 'none', padding: 8, background: isToday(day) ? (isDark ? 'rgba(59,130,246,0.05)' : '#eff6ff') : 'transparent', minHeight: 120, display: 'flex', flexDirection: 'column' }}>
                  {day && (
                     <>
                       <div style={{ 
                         textAlign: 'center', marginBottom: 8, width: 24, height: 24, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: isToday(day) ? '#3b82f6' : 'transparent', color: isToday(day) ? '#fff' : 'var(--text-muted)', fontSize: 12, fontWeight: isToday(day) ? 900 : 700 
                       }}>
                         {day}
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                         {dayVisits.map(v => {
                           const st = STATUS_COLORS[v.status];
                           return (
                             <motion.div 
                               key={v.id}
                               whileHover={{ scale: 1.02 }}
                               onClick={() => onViewDetails(v)}
                               style={{ 
                                 padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                                 background: st.bg, borderLeft: `3px solid ${st.border}`,
                                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                               }}
                             >
                                <div style={{ fontSize: 10, fontWeight: 900, color: st.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {new Date(v.visitDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                                  {v.contactName}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  <MapPin size={9} /> {v.location.split(',')[0]}
                                </div>
                             </motion.div>
                           )
                         })}
                       </div>
                     </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

    </div>
  );
}
