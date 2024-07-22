import FullCalendar from "@fullcalendar/react";
import type { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
const Schedules = () => {
  const { data } = useQuery({
    queryKey: ["scheduleData"],
    queryFn: async () => {
      return await api.get("/patient-schedules");
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleEventClick = (info: EventClickArg) => {
    console.log("Event clicked:", info.event);
  };

  return (
    <div className="h-screen">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={data?.data || []}
        eventClick={handleEventClick}
        height={700}
      />
    </div>
  );
};

export default Schedules;
