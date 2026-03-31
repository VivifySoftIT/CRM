import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return '#3b82f6'; // blue-500
    case 'Completed': return '#10b981'; // emerald-500
    case 'Cancelled': return '#ef4444'; // red-500
    case 'Postponed': return '#f59e0b'; // amber-500
    default: return '#64748b'; // slate-500
  }
};

export default function CalendarView({ meetings, onEdit, onDateClick, onEventDrop }) {
  const calendarRef = useRef(null);

  // Map our frontend meetings to FullCalendar event objects
  const events = meetings.map(meeting => {
    // Combine date + time
    const startObj = new Date(`${meeting.date}T${meeting.startTime}`);
    
    // Calculate end time
    const endObj = new Date(startObj.getTime() + meeting.duration * 60000);

    return {
      id: meeting.id,
      title: meeting.title,
      start: startObj,
      end: endObj,
      backgroundColor: getStatusColor(meeting.status),
      borderColor: getStatusColor(meeting.status),
      extendedProps: {
        ...meeting
      }
    };
  });

  const handleEventClick = (info) => {
    const meetingData = info.event.extendedProps;
    onEdit(meetingData);
  };

  const handleDateClick = (info) => {
    onDateClick(info.dateStr); 
  };

  const handleEventDrop = (info) => {
    const { event } = info;
    const newDate = event.start.toISOString().split('T')[0];
    const newStartTime = event.start.toTimeString().substring(0, 5);
    
    onEventDrop(event.id, newDate, newStartTime);
  };

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 14, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 16, height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      <style>{`
        .fc {
          height: 100%;
          font-family: inherit;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: rgba(203, 213, 225, 0.5); /* slate-300 with opacity */
        }
        .dark .fc-theme-standard td, .dark .fc-theme-standard th {
          border-color: rgba(51, 65, 85, 0.5); /* slate-700 with opacity */
        }
        .fc-col-header-cell-cushion {
          padding: 12px 0 !important;
          color: #64748b; /* slate-500 */
          font-weight: 600;
        }
        .dark .fc-col-header-cell-cushion {
          color: #94a3b8; /* slate-400 */
        }
        .fc-daygrid-day-number {
          color: #475569; /* slate-600 */
          padding: 8px !important;
          font-weight: 500;
        }
        .dark .fc-daygrid-day-number {
          color: #cbd5e1; /* slate-300 */
        }
        .fc-event {
          border-radius: 6px;
          padding: 2px 4px;
          border: none !important;
          font-size: 0.75rem;
          font-weight: 500;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .fc-event:hover {
          transform: translateY(-1px);
        }
        .fc-event-time {
          font-weight: 600;
        }
        .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #0f172a; /* slate-900 */
        }
        .dark .fc-toolbar-title {
          color: #f8fafc; /* slate-50 */
        }
        .fc-button-primary {
          background-color: #f1f5f9 !important; /* slate-100 */
          border-color: #cbd5e1 !important; /* slate-300 */
          color: #475569 !important; /* slate-600 */
          text-transform: capitalize;
          font-weight: 500 !important;
          border-radius: 8px !important;
        }
        .fc-button-primary:hover {
          background-color: #e2e8f0 !important; /* slate-200 */
          color: #0f172a !important; /* slate-900 */
        }
        .fc-button-primary:not(:disabled).fc-button-active, 
        .fc-button-primary:not(:disabled):active {
          background-color: #3b82f6 !important; /* blue-500 */
          border-color: #2563eb !important; /* blue-600 */
          color: white !important;
        }
        .dark .fc-button-primary {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: #94a3b8 !important;
        }
        .dark .fc-button-primary:hover {
          background-color: #334155 !important;
          color: #f1f5f9 !important;
        }
        .dark .fc-button-primary:not(:disabled).fc-button-active {
           background-color: #3b82f6 !important;
           border-color: #2563eb !important;
           color: white !important;
        }
        .fc-day-today {
          background-color: rgba(59, 130, 246, 0.05) !important; /* blue transparent */
        }
      `}</style>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        height="100%"
      />
    </div>
  );
}
