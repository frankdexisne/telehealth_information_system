import { Loader, Paper } from "@mantine/core";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import appointments from "./appointments";
import TimeTableCell from "./components/TimeTableCell";
import DayScaleCell from "./components/DayScaleCell";
import Appointment from "./components/Appointment";
import AppointmentContent from "./components/AppointmentContent";
import { useEffect, useState } from "react";
import FlexibleSpace from "./components/FlexibleSpace";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../hooks/use-http";

const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  console.log(selectedDate);

  const onNavigate = (date: Date) => {
    console.log(moment(date).format("YYYY-MM"));
  };

  const { data, isLoading, isFetched } = useQuery({
    queryKey: [`patient-schedules/get-calendar-schedules`],
    queryFn: async () => {
      return await getRequest(`patient-schedules/get-calendar-schedules`).then(
        (res) => {
          return res.data.map((appointment) => ({
            ...appointment,
            startDate: new Date(appointment.startDate),
            endDate: new Date(appointment.endDate),
          }));
        }
      );
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
  console.log(data, appointments);
  return (
    <>
      {isLoading && <Loader />}
      {isFetched && (
        <Paper>
          <Scheduler data={data}>
            <ViewState
              defaultCurrentDate="2024-06-17"
              onCurrentDateChange={onNavigate}
            />
            <MonthView
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />
            <Appointments
              appointmentComponent={Appointment}
              appointmentContentComponent={AppointmentContent}
            />
            <Toolbar flexibleSpaceComponent={FlexibleSpace} />
            <DateNavigator />
          </Scheduler>
        </Paper>
      )}
    </>
  );
};

export default Schedules;
