import {
  Grid,
  Paper,
  TextInput,
  Title,
  Card,
  Badge,
  Text,
  Divider,
  Loader,
} from "@mantine/core";
import PageHeader from "../../../components/base/PageHeader";
import moment from "moment";
import { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import Day from "../ReferredToOPD/Day";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { postRequest, useTable } from "../../../hooks";
import { MonthPicker } from "@mantine/dates";

interface DepartmentItemProps {
  id: number;
  departmentName: string;
  scheduled: number;
  active?: boolean;
  onSelect: (id: number) => void;
}

const DepartmentItem = ({
  id,
  departmentName,
  scheduled,
  active = false,
  onSelect,
}: DepartmentItemProps) => {
  return (
    <Card
      bg={active ? "blue" : "white"}
      c={active ? "white" : "black"}
      className="flex w-full cursor-pointer"
      p="xs"
      my={5}
      onClick={() => onSelect(id)}
      withBorder
    >
      <div className="flex justify-between items-center ">
        <div className="w-full flex flex-row items-center space-x-2">
          <div className="basis-1/8">
            {active ? <IconCheck /> : <IconX color="white" />}
          </div>
          <Title size={16} className="basis-3/4">
            {departmentName}
          </Title>
        </div>
        <Title size={16}>
          <Badge
            c={active ? "blue" : "white"}
            color={active ? "white" : "blue"}
          >
            {scheduled}
          </Badge>
        </Title>
      </div>
    </Card>
    // </Paper>
  );
};

interface PatientListProps {
  schedule_date: Date;
  department_id: number;
}

interface PatientScheduleRowData {
  id: number;
  schedule_datetime: string;
  reason: string;
  department_id: number;
  appointmentable: {
    id: number;
    name: string;
    gender: "male" | "female";
    dob: string;
  };
}

const PatientList = ({ schedule_date, department_id }: PatientListProps) => {
  const { data, pagination, isFetching } = useTable({
    endpoint: "patient-schedules/department-patients/by-schedule-date",
    pageSize: 5,
    parameters: {
      schedule_date: moment(schedule_date).format("YYYY-MM-DD"),
      department_id,
    },
  });

  const columns: ColumnDefinition<PatientScheduleRowData>[] = [
    {
      field: (row) => moment(row.schedule_datetime).format("HH:mm:ss"),
      header: "Schedule Time",
    },
    {
      field: "appointmentable.name",
      header: "Name",
    },

    {
      field: "reason",
      header: "Reason",
    },
  ];

  return (
    <AppTanstackTable
      data={data}
      columns={columns}
      pagination={pagination}
      isFetching={isFetching}
      columnSearch={false}
    />
  );
};

interface DepartmentRowData {
  id: number;
  name: string;
  daily_limit: null | number;
  scheduled: number;
}

const DepartmentList = ({
  monthYear,
  onSelect,
}: {
  monthYear: string;
  onSelect: (departmentId: number) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number>();

  const { data, isFetching, isFetched } = useTable({
    endpoint: "patient-schedules/get-departments-by-month",
    pageSize: 50,
    parameters: {
      monthYear: monthYear,
    },
  });

  return (
    <div>
      {data.map(({ id, name, scheduled }: DepartmentRowData) => (
        <DepartmentItem
          id={id}
          departmentName={name}
          scheduled={scheduled}
          active={selectedId === id}
          onSelect={(id) => {
            setSelectedId(id);
            onSelect(id);
          }}
        />
      ))}
    </div>
  );
};

const ScheduleDatesList = ({
  monthYear,
  departmentId,
  onSelectDate,
  activeDate,
}: {
  monthYear: string;
  departmentId: number;
  onSelectDate: (date: string) => void;
  activeDate: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dates, setDates] = useState([]);
  // const { data, isFetching, isFetched } = useTable({
  //   endpoint: "patient-schedules/get-scheduled-dates-by-department-and-month",
  //   pageSize: 31,
  //   parameters: {
  //     monthYear: monthYear,
  //     department_id: departmentId,
  //   },
  // });

  useEffect(() => {
    const fetchDatesTimeout = setTimeout(() => {
      postRequest(
        "patient-schedules/get-scheduled-dates-by-department-and-month",
        {
          monthYear,
          department_id: departmentId,
        }
      ).then((res) => {
        // console.log(res);
        setDates(res.data);
      });
    }, 500);

    return () => {
      clearTimeout(fetchDatesTimeout);
    };
  }, [monthYear, departmentId]);

  return (
    <div className="w-full flex overflow-x-scroll space-x-2 px-2 pb-4 scrollbars min-h-[200px]">
      {dates.map((item) => {
        const currentDate = new Date(item.schedule_date);
        console.log(currentDate, selectedDate);
        return (
          <div className="min-w-[160px] w-[160px]">
            <Day
              date={currentDate}
              scheduled={item.scheduled}
              dailyLimit={0}
              hideAction
              onSelect={(date) => {
                setSelectedDate(date);
                onSelectDate(moment(date).format("YYYY-MM-DD"));
              }}
              active={moment(currentDate).format("YYYY-MM-DD") === activeDate}
            />
          </div>
        );
      })}
    </div>
  );
};

const Schedules = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM")
  );
  const [selectedDepartment, setSelectedDepartment] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeDate, setActiveDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  return (
    <div>
      <PageHeader title="Patient OPD Appointment" />
      <Grid>
        <Grid.Col span={3}>
          <Paper p="md" withBorder shadow="xs" mih={300} className="h-full">
            {/* <TextInput
              type="month"
              placeholder="Please select month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            /> */}
            <div className="w-full flex justify-center items-center">
              <MonthPicker
                value={new Date(selectedMonth)}
                size="md"
                fw="bolder"
                className="bg-slate-100 p-3 rounded-xl"
                onChange={(e) => setSelectedMonth(moment(e).format("YYYY-MM"))}
              />
            </div>
            <Divider my={10} label="Departments" />
            <DepartmentList
              monthYear={selectedMonth}
              onSelect={(id: number) => {
                if (id) setSelectedDepartment(id);
              }}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={9}>
          <Paper shadow="xs" p="md" withBorder mih={500}>
            {selectedDepartment && selectedMonth && (
              <ScheduleDatesList
                departmentId={selectedDepartment}
                monthYear={selectedMonth}
                onSelectDate={(date) => {
                  setSelectedDate(new Date(date));
                  setActiveDate(date);
                }}
                activeDate={activeDate}
              />
            )}
            {/* <div className="w-full flex overflow-x-scroll space-x-2 px-2 pb-4 scrollbars">
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                  onSelect={(date) => {
                    console.log("test", date);
                    setSelectedDate(date);
                  }}
                  active={true}
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
              <div className="min-w-[160px] w-[160px]">
                <Day
                  date={new Date()}
                  scheduled={10}
                  dailyLimit={0}
                  hideAction
                />
              </div>
            </div> */}
            <Divider
              my={7}
              label={<Text>Scheduled Patients</Text>}
              labelPosition="left"
            />
            <div>
              {selectedDate && selectedDepartment && (
                <PatientList
                  schedule_date={selectedDate}
                  department_id={selectedDepartment}
                />
              )}
            </div>

            {!selectedDate && !selectedDepartment && (
              <div className="min-h-[200px] flex justify-center items-center">
                <Text size="xl" c="gray" fw="bold">
                  PLEASE SELECT DEPARTMENT FOLLOWED BY DATE
                </Text>
              </div>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Schedules;
