import { IconCalendar, IconTrash } from "@tabler/icons-react";
import {
  Drawer,
  Loader,
  Paper,
  Anchor,
  ActionIcon,
  Title,
  Avatar,
  TextInput,
} from "@mantine/core";
import classes from "../classes";
import { useDisclosure } from "@mantine/hooks";
import StyledAppointmentsAppointment from "./StyledAppointmentsAppointment";
import { HoverCard, Text, Group, Stack, Grid } from "@mantine/core";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../../hooks";
import moment from "moment";
import MalePatientAvatar from "../../../assets/male_patient_avatar.png";
import FemalePatientAvatar from "../../../assets/female_patient_avatar.png";

interface FilterData {
  departmentId: number;
  departmentName: string;
  selectedDate: Date;
}

const PatientList = ({ data }: { data: FilterData }) => {
  const { data: patients, isFetching } = useQuery({
    queryKey: [
      `patient-schedules/get-department-patient-schedules`,
      data.selectedDate,
      data.departmentId,
    ],
    queryFn: async () => {
      return await getRequest(
        `patient-schedules/get-department-patient-schedules?date=${moment(
          data.selectedDate
        ).format("YYYY-MM-DD")}&department_id=${data.departmentId}`
      ).then((res) => res.data);
    },
  });

  if (isFetching) return <Loader />;

  return (
    <div>
      {data !== undefined && (
        <div className="flex mb-3 items-center">
          <Text size="sm" className="font-bold w-[50%]">
            {" "}
            Schedule Date: {moment(data.selectedDate).format("MMMM DD, YYYY")}
          </Text>
          <div className="w-[50%]">
            <TextInput placeholder="Search Patient" />
          </div>
        </div>
      )}

      {patients.map((patient, index) => (
        <Paper
          key={index}
          shadow="xl"
          p="sm"
          className="flex  border-2 border-slate-300 rounded-md"
        >
          <div className="w-[17%]">
            <Avatar
              src={
                patient.appointmentable.gender.toString().toUpperCase() ===
                "MALE"
                  ? MalePatientAvatar
                  : FemalePatientAvatar
              }
              size={40}
              radius="lg"
            />
          </div>
          <div className="flex flex-col w-[73%]">
            <Title size={18}>
              {patient.appointmentable.lname}, {patient.appointmentable.fname}{" "}
              {patient.appointmentable.mname}
            </Title>
            <Anchor href="#" c="blue" size="xs" style={{ lineHeight: 1 }}>
              Schedule Time:{" "}
              <b>{moment(patient.schedule_datetime).format("HH:mm")}</b>
            </Anchor>
          </div>
          <div className="flex justify-end w-[10%] ">
            <ActionIcon variant="transparent">
              <IconTrash color="red" />
            </ActionIcon>
          </div>
        </Paper>
      ))}
    </div>
  );
};

const ScheduleCard = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [filterData, setFilterData] = useState<FilterData>();

  return (
    <>
      <Group justify="center">
        <HoverCard
          width={320}
          shadow="md"
          withArrow
          openDelay={200}
          closeDelay={400}
        >
          <HoverCard.Target>
            <div className="w-full h-[75px] bg-blue-500 text-white font-semibold items-center justify-center flex">
              {data.title}(
              {data.departments
                .map((department) => department.scheduled)
                .reduce((a, b) => a + b, 0)}
              )
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Group>
              <IconCalendar />
              <Stack gap={5}>
                <Text size="md" fw={700} style={{ lineHeight: 1 }}>
                  Clinic Schedule
                </Text>
              </Stack>
            </Group>
            <Grid>
              <Grid.Col span={6}></Grid.Col>
            </Grid>

            <Group mt="md" gap="sm">
              {data.departments.map((department) => (
                <Text
                  key={department.id}
                  size="sm"
                  className="underline text-blue-500 cursor-pointer"
                  onClick={() => {
                    open();
                    setFilterData({
                      departmentId: +department.id,
                      departmentName: department.name,
                      selectedDate: data.startDate,
                    });
                  }}
                >
                  <b>{department.scheduled}</b> {department.name}
                </Text>
              ))}
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
      <Drawer
        opened={opened}
        onClose={close}
        title={`Scheduled Patient (${filterData?.departmentName})`}
        position="right"
        size="lg"
      >
        {filterData !== undefined && <PatientList data={filterData} />}
      </Drawer>
    </>
  );
};

const Appointment = ({ content, ...restProps }) => (
  <>
    <StyledAppointmentsAppointment
      {...restProps}
      className={classes.appointment}
      draggable={false}
      onClick={() => {
        console.log("Appointment clicked");
      }}
      children={content}
      data={restProps.data}
      resources={restProps.resources}
    />
  </>
);

export default Appointment;
