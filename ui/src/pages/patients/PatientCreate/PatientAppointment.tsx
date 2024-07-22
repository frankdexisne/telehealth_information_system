import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DatesSetArg } from "@fullcalendar/core";
import { useEffect, useState, useRef, LegacyRef } from "react";
import { ActionIcon, Modal, Grid, Drawer, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { PatientSearch } from "../../../components/patients";
import ReactDOM from "react-dom/client";
import PatientResult from "./PatientResult";
import "./PatientAppointmentStyle.css";

interface Event {
  title: string;
  date: string;
}

const CustomDayRender = (eventInfo) => {
  return <div>{eventInfo.event.title} - HERE</div>;
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const DayCellContentComponent = (info) => {
  return (
    <div>
      <Title size={20} c="blue" fw="bolder">
        {info.dayNumberText}
      </Title>
      {!info.isPast && (
        <ActionIcon>
          <IconPlus />
        </ActionIcon>
      )}
    </div>
  );
};

const PatientAppointment = () => {
  const [creating, { open: openCreating, close: closeCreating }] =
    useDisclosure(false);
  const [filter, setFilter] = useState({
    hpercode: undefined,
    lname: undefined,
    fname: undefined,
    mname: undefined,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedSearchPatient,
    { open: openSearchPatient, close: closeSearchPatient },
  ] = useDisclosure(false);
  const calendarRef = useRef<FullCalendar>();
  const [events, setEvents] = useState<Event[]>([
    { title: "Daily Event 1", date: "2024-07-15" },
    { title: "Daily Event 2", date: "2024-07-16" },
  ]);
  const date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth() + 1, 0)
  );
  const handleDatesSet = (dateInfo: DatesSetArg) => {
    setEndDate(dateInfo.end);
    setStartDate(dateInfo.start);
  };

  useEffect(() => {}, [startDate, endDate]);

  const handleNewEvent = () => {
    openSearchPatient();
    // if (calendarRef !== undefined) {
    //   const calendarApi = calendarRef.current.getApi();
    //   const newEvent = {
    //     title: "New Event",
    //     start: new Date(), // current date
    //     allDay: true,
    //   };
    //   calendarApi.addEvent(newEvent);
    // }
  };

  const handleCustomButtonClick = (date) => {
    alert(`Button clicked for date: ${date}`);
    // Add custom logic here for the specific date
  };

  const handleDayRender = (info) => {
    const date = info.dateStr; // Get the date string in ISO format (YYYY-MM-DD)
    console.log(date);
    // if (date === "2024-07-15") {
    //   // Replace with your specific date
    //   info.el.innerHTML = ""; // Clear existing content if needed

    //   // Render the CustomDayComponent instead of adding raw HTML
    //   const customComponent = (
    //     <CustomDayRender
    //       key={date}
    //       date={date}
    //       onClick={handleCustomButtonClick}
    //     />
    //   );

    //   // Mount the custom component into the day element
    //   ReactDOM.render(customComponent, info.el);
    // }
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={events}
        height="85vh"
        datesSet={handleDatesSet}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "customAddEventButton dayGridMonth,dayGridWeek,dayGridDay",
        }}
        customButtons={{
          customAddEventButton: {
            text: "Add Schedule",
            click: handleNewEvent,
          },
        }}
        eventContent={renderEventContent}
        dayCellContent={DayCellContentComponent}
        eventSources={[
          [
            { id: "1", title: "Event 1", start: "2024-07-08" },
            { id: "1", title: "Event 1", start: "2024-07-15" },
            { id: "2", title: "Event 2", start: "2024-07-16" },
          ],
        ]}
      />
      <Modal
        opened={opened}
        onClose={close}
        size="50%"
        centered
        title="New Schedule"
      ></Modal>

      <Drawer
        opened={openedSearchPatient}
        onClose={() => {
          closeSearchPatient();
          closeCreating();
        }}
        position="right"
        size="100%"
      >
        <div className="h-[70vh] w-full flex flex-col items-center justify-center">
          {!creating && (
            <>
              <Title order={3} size={32} mb={20} fw={700} c="blue">
                SEARCH PATIENT
              </Title>
              <Grid>
                <Grid.Col span={4}>
                  <PatientSearch
                    type="teleserve-reffered"
                    onSubmit={(filter) => {
                      setFilter(filter);
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={8} className="pt-8">
                  <PatientResult
                    filter={filter}
                    onCreate={() => {
                      openCreating();
                    }}
                    onSearch={() => {}}
                    onSelect={() => {}}
                    searched={Object.keys(filter).length > 0}
                    referral={false}
                  />
                </Grid.Col>
              </Grid>
            </>
          )}
          {creating && (
            <>
              <Title order={3} size={32} mb={20} fw={700} c="blue">
                NEW PATIENT
              </Title>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default PatientAppointment;
