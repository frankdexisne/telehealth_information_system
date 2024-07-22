import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick
import { useState } from "react";

const Referral = () => {
  const [events, setEvents] = useState([
    { id: 1, title: "Initial Event", start: "2023-04-01" },
  ]);
  const handleDateClick = (arg) => {
    const newEventTitle = prompt("Enter event title:");
    if (newEventTitle) {
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title: newEventTitle,
          start: arg.date,
          allDay: arg.allDay,
        },
      ]);
    }
  };

  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        onDateClick={handleDateClick}
        dateClick={handleDateClick}
        height="auto"
        className="bg-white rounded-lg shadow p-4"
      />
    </div>
  );
};

export default Referral;
