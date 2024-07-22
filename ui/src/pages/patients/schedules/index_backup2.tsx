import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { Grid, Paper, Title, Badge, Group, Avatar } from "@mantine/core";
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

const Schedules = () => {
  const [selected, setSelected] = useState<Date[]>([new Date()]);

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

  return (
    <div>
      <Title size={24} className="text-blue-500 mb-3">
        Patient Schedule
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 2 }}>
          <Paper p="lg" shadow="xl">
            <Calendar
              getDayProps={(date) => ({
                selected: selected.some((s) => dayjs(date).isSame(s, "date")),
                onClick: () => handleSelect(date),
              })}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 10 }} className="px-4">
          {selected.length === 0 && (
            <div className="min-h-[200px] items-center justify-center flex">
              <h1 className="text-lg text-slate-500">--Please select date--</h1>
            </div>
          )}
          {selected.length > 0 && (
            <>
              <AppTanstackTable
                data={data}
                columns={columns}
                pagination={pagination}
                isFetching={isFetching}
              />
            </>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Schedules;
