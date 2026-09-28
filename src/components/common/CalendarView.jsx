
import Card from './Card';

/**
 * Basic Calendar UI Shell for viewing schedules
 * @param {Object} props
 * @param {Array} props.events - [{ date: '2026-09-28', title: 'Session', time: '09:00' }]
 */
const CalendarView = ({ events = [] }) => {
  return (
    <Card title="Schedule Overview">
      <div className="p-4 border rounded bg-light text-center text-muted">
        <i className="bi bi-calendar3 display-4 mb-3 d-block"></i>
        {events.length > 0 ? (
          <ul className="list-unstyled text-start w-50 mx-auto">
            {events.map((ev, i) => (
              <li key={i} className="mb-2 p-2 border-bottom border-secondary-subtle d-flex justify-content-between">
                <span className="fw-bold">{ev.date}</span>
                <span>{ev.title} ({ev.time})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 fst-italic">No upcoming events scheduled.</p>
        )}
      </div>
    </Card>
  );
};

export default CalendarView;