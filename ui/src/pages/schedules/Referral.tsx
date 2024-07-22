import { ActionIcon, Grid, Loader, Paper, Title } from "@mantine/core";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import appointments from "./appointments";
import { CellBase } from "./components/TimeTableCell";
import DayScaleCell from "./components/DayScaleCell";
import Appointment from "./components/Appointment";
import AppointmentContent from "./components/AppointmentContent";
import { useState } from "react";
import FlexibleSpace from "./components/FlexibleSpace";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../hooks/use-http";
import { useDisclosure } from "@mantine/hooks";
import { PatientSearch } from "../../components/patients";
import PatientResult from "../patients/PatientCreate/PatientResult";

import { Drawer } from "@mantine/core";
import { IconEye, IconPlus } from "@tabler/icons-react";

const ScheduledItem = ({ scheduleDate }: { scheduleDate: string }) => {
  const { data } = useQuery({
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
  });

  return <div>{data.scheduled}</div>;
};

const Referral = () => {
  const [filter, setFilter] = useState<null | PatientFilter>({
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
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);

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
  return (
    <>
      {isLoading && <Loader />}
      {isFetched && (
        <Paper>
          <Scheduler data={appointments}>
            <ViewState
              defaultCurrentDate={moment().format("YYYY-MM-DD")}
              onCurrentDateChange={onNavigate}
            />
            <MonthView
              timeTableCellComponent={({
                startDate,
                formatDate,
                otherMonth,
              }) => (
                <CellBase
                  startDate={startDate}
                  formatDate={formatDate}
                  otherMonth={otherMonth}
                  showAddButton={false}
                />
              )}
              dayScaleCellComponent={DayScaleCell}
            />
            <Appointments
              appointmentComponent={(props) => (
                <Appointment
                  {...props}
                  onChange={(value) => console.log("value from main")}
                  content={
                    <div className="flex justify-center flex-col items-center pt-1">
                      <ScheduledItem
                        scheduleDate={moment(props.data.startDate)}
                      />
                      <div className="flex justify-center items-center gap-2 mt-1">
                        <ActionIcon
                          onClick={() => {
                            setAppointmentDate(props.data.startDate);
                            openSearchPatient();
                            setFilter({});
                          }}
                        >
                          <IconPlus />
                        </ActionIcon>
                        <ActionIcon onClick={open}>
                          <IconEye />
                        </ActionIcon>
                      </div>
                    </div>
                  }
                />
              )}
              appointmentContentComponent={AppointmentContent}
            />
            <Toolbar
              flexibleSpaceComponent={(props) => (
                <FlexibleSpace
                  onChange={(value) => console.log(value)}
                  {...props}
                />
              )}
            />
            <DateNavigator />
          </Scheduler>
        </Paper>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        title={`Scheduled Patient`}
        position="right"
        size="lg"
      ></Drawer>

      <Drawer
        opened={openedSearchPatient}
        onClose={() => {
          setFilter({});
          closeSearchPatient();
        }}
        position="right"
        size="100%"
      >
        <div className="h-[70vh] w-full flex flex-col items-center justify-center">
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
                onCreate={() => {}}
                onSearch={() => {}}
                onSelect={() => {}}
                searched={Object.keys(filter).length > 0}
                referral={false}
              />
            </Grid.Col>
          </Grid>
        </div>
      </Drawer>
    </>
  );
};

export default Referral;
