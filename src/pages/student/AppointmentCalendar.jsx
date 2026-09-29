import React, { useState, useEffect } from 'react';
import CalendarView from '../../components/common/CalendarView';
import LoadingState from '../../components/common/LoadingState';
import { appointmentService } from '../../services/appointmentService';

const CURRENT_STUDENT_ID = 'STU-001';

const AppointmentCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const appts = appointmentService.getByStudent(CURRENT_STUDENT_ID) || [];
      // Map appointments to the format expected by CalendarView
      const mappedEvents = appts
        .filter(a => a.status === 'Scheduled') // Only show active ones on calendar
        .map(a => ({
          date: a.date,
          title: a.type,
          time: a.time
        }));
      setEvents(mappedEvents);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Appointment Calendar</h3>
      
      {loading ? (
        <LoadingState message="Loading calendar..." />
      ) : (
        <CalendarView events={events} />
      )}
    </div>
  );
};

export default AppointmentCalendar;