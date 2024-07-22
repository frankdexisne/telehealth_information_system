import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import {
  Grid,
  Paper,
  Title,
  Badge,
  Group,
  Avatar,
  TextInput,
  Text,
  Chip,
} from "@mantine/core";
import { useState } from "react";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable } from "../../../hooks";
import moment from "moment";
import MalePatientAvatar from "../../../assets/male_patient_avatar.png";
import FemalePatientAvatar from "../../../assets/female_patient_avatar.png";
import { Link } from "react-router-dom";

export interface PatientScheduleRowData {
  id: number;
  patient_profile_id: number;
  lname: string;
  fname: string;
  mname: string;
  chief_complaint: string;
  dob: string;
  gender: "male" | "female";
  department_name: string | null;
  is_follow_up: 1 | 0;
}

interface ScheduleDateProps {
  date: string;
  onSelect: (selectedDate: string) => void;
  isActive?: boolean;
}

const ScheduleDate = ({
  date,
  onSelect,
  isActive = false,
}: ScheduleDateProps) => {
  return (
    <Paper
      shadow="xl"
      p="lg"
      radius={10}
      w={200}
      className={`flex justify-center flex-col items-center border-2 ${
        isActive && `bg-blue-500 text-white  border-blue-500`
      }`}
      onClick={() => {
        onSelect(date);
      }}
      style={{ cursor: "pointer" }}
    >
      <Title size={20}>{moment(date).format("MMMM")}</Title>
      <Title size={40}>{moment(date).format("DD")}</Title>
      <Title size={20}>{moment(date).format("YYYY")}</Title>
    </Paper>
  );
};

const Schedules = () => {
  const [selected, setSelected] = useState<Date[]>([new Date()]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const handleSelect = (date: Date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
    if (isSelected) {
      setSelected([date]);
    } else if (selected.length < 3) {
      setSelected([date]);
    }
  };

  const { data, pagination, isFetching } = useTable({
    endpoint: "patient-schedules/get-schedules",
    pageSize: 5,
    parameters: {
      date: moment(selected[0]).format("YYYY-MM-DD"),
    },
  });

  const columns: ColumnDefinition<PatientScheduleRowData>[] = [
    {
      field: (row) => (
        <Group wrap="nowrap">
          <Avatar
            src={
              row.gender.toString().toUpperCase() === "MALE"
                ? MalePatientAvatar
                : FemalePatientAvatar
            }
            size={28}
            radius="lg"
          />
          <Link
            to={`/patients/${row.patient_profile_id}/view`}
            className="underline text-blue-500"
          >
            {row.lname + ", " + row.fname + " " + row.mname}
          </Link>
        </Group>
      ),
      header: "Patient Name",
      size: 150,
    },
    {
      field: (row) => row.gender?.toUpperCase(),
      header: "Gender",
      size: 50,
    },
    {
      field: (row) => {
        const birthday = moment(row.dob);
        const currentDate = moment();
        const age = moment.duration(currentDate.diff(birthday)).years();
        return age + " year(s) old";
      },
      header: "Age",
      size: 50,
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
    },

    {
      field: (row) => {
        if (row.department_name) return row.department_name;

        return "--NOT YET ASSIGN--";
      },
      header: "Department",
    },
    {
      field: "reason",
      header: "Reason",
    },
    {
      field: (row) =>
        row.is_follow_up === 0 ? (
          <Badge color="green">NEW</Badge>
        ) : (
          <Badge>Follow Up</Badge>
        ),
      header: "Status",
      size: 50,
    },
  ];

  const dates = [
    "2024-06-17",
    "2024-06-18",
    "2024-06-19",
    "2024-06-20",
    "2024-06-22",
    "2024-06-23",
    "2024-06-24",
    "2024-06-25",
  ];

  return (
    <div>
      <Grid>
        <Grid.Col span={6} className="flex items-end">
          <Title size={24} className="text-blue-500 mb-3">
            Patient Schedule
          </Title>
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput type="month" defaultValue={moment().format("YYYY-MM")} />
        </Grid.Col>
      </Grid>
      <div className="p-3 w-full overflow-x-scroll flex gap-2 mb-5">
        {dates.map((date: string) => (
          <div className="w-[400px]">
            <ScheduleDate
              date={date}
              isActive={date === selectedDate}
              onSelect={(date) => setSelectedDate(date)}
            />
          </div>
        ))}
      </div>
      <div className="px-3">
        <Chip.Group defaultValue="0">
          <Group>
            <Chip value="0">All</Chip>
            <Chip value="1">Surgery</Chip>
            <Chip value="2">Internal Medicine</Chip>
            <Chip value="3">OB-Gyne</Chip>
          </Group>
        </Chip.Group>
      </div>

      <Grid mt={10}>
        <Grid.Col span={12} className="px-4">
          <>
            <AppTanstackTable
              data={data}
              columns={columns}
              pagination={pagination}
              isFetching={isFetching}
            />
          </>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Schedules;
