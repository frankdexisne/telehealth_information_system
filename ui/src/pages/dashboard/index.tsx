import {
  Paper,
  Text,
  Grid,
  Title,
  Checkbox,
  Button,
  Modal,
  TextInput,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarUser,
  IconChecklist,
  IconEye,
  IconInfoCircle,
  IconProgress,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTable } from "../../hooks";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import DepartmentStatus from "./DepartmentStatus";

interface DepartmentRowData {
  id: number;
  name: string;
  closed: number;
  ongoing: number;
  pending: number;
}

interface IconWithLabelProps {
  Component: JSX.ElementType;
  label: string;
  count: number;
}

const IconWithLabel = ({ Component, label, count }: IconWithLabelProps) => {
  return (
    <Paper shadow="xs" p="xl" className="w-full">
      <Grid>
        <Grid.Col
          span={{ base: 12, lg: 9 }}
          className={`flex flex-col justify-center items-center `}
        >
          <Component />
          <Text>{label}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <h1 className="text-4xl font-bold">{count}</h1>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

const Dashboard = () => {
  const role = useSelector((state: RootState) => state.auth.user.role_name);
  const hpersonal_code = useSelector(
    (state: RootState) => state.auth.user.hpersonal_code
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    null | number
  >(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM")
  );

  const { data, pagination, isFetching, isError } = useTable({
    endpoint: "dashboards",
    pageSize: 10,
    parameters: {
      year_month: selectedMonth,
    },
  });

  const [untriaged, setUntriaged] = useState<number>(0);
  const [triaged, setTriaged] = useState<number>(0);
  const [active, setActive] = useState<number>(0);
  const [closed, setClosed] = useState<number>(0);

  const columns: ColumnDefinition<DepartmentRowData>[] = [
    {
      field: (row) => (
        <Button
          variant="transparent"
          onClick={() => {
            open();
            setSelectedDepartment(row.name);
            setSelectedDepartmentId(row.id);
          }}
        >
          <IconEye />
        </Button>
      ),
      header: "Action",
    },
    {
      field: "name",
      header: "Department",
    },
    {
      field: "pending",
      header: "Triaged",
    },
    {
      field: "ongoing",
      header: "Active",
    },
    {
      field: "closed",
      header: "Closed",
    },
  ];

  useEffect(() => {
    const calculateTimeout = setTimeout(() => {
      if (data) {
        setUntriaged(0);
        setTriaged(
          data
            ?.map((item: DepartmentRowData) => +item.pending)
            ?.reduce((prev: number, newValue: number) => prev + newValue)
        );
        setActive(
          data
            ?.map((item: DepartmentRowData) => +item.ongoing)
            ?.reduce((prev: number, newValue: number) => prev + newValue)
        );
        setClosed(
          data
            ?.map((item: DepartmentRowData) => +item.closed)
            ?.reduce((prev: number, newValue: number) => prev + newValue)
        );
      }
    }, 500);

    return () => clearTimeout(calculateTimeout);
  }, [data]);

  return (
    <div>
      {!hpersonal_code && (
        <Alert
          variant="light"
          color="orange"
          title="iHOMIS Integration"
          icon={<IconInfoCircle />}
        >
          Looks like your account is not yet bind to iHOMIS, Please contact
          system administrator for account binding.
        </Alert>
      )}
      <Grid className="mt-3">
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex flex-col w-[50%]">
          <Title className="text-blue-500 text-xl">Department Status</Title>
          {(role === "doctor" || role === "administrator") && (
            <Checkbox
              onChange={(e) => {
                console.log(e.currentTarget.checked);
              }}
              label="Show my status (Current Doctor)"
              className="mt-2"
            />
          )}
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex w-[50%] justify-end items-center"
        >
          <TextInput
            label="Filtered Month"
            type="month"
            value={moment(selectedMonth).format("YYYY-MM")}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
            }}
            w={300}
          />
        </Grid.Col>
      </Grid>

      <Grid mt={5} mb={20}>
        <Grid.Col span={{ base: 12, lg: 3 }} className="flex justify-center">
          <IconWithLabel
            Component={IconCalendarUser}
            label="Untriaged"
            count={untriaged}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 3 }} className="flex justify-center">
          <IconWithLabel
            Component={IconCalendarUser}
            label="Triaged"
            count={triaged}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 3 }} className="flex justify-center">
          <IconWithLabel
            Component={IconProgress}
            label="Active"
            count={active}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 3 }} className="flex justify-center">
          <IconWithLabel
            Component={IconChecklist}
            label="Closed"
            count={closed}
          />
        </Grid.Col>
      </Grid>
      <AppTanstackTable
        isError={isError}
        isFetching={isFetching}
        columns={columns}
        columnSearch={false}
        data={data}
        pagination={pagination}
      />
      <Modal
        opened={opened}
        onClose={close}
        size="calc(100vw - 3rem)"
        title={
          <h3 className="text-2xl">{selectedDepartment} Consultation(s)</h3>
        }
      >
        <DepartmentStatus
          id={selectedDepartmentId}
          year={parseInt(selectedMonth.split("-")[0])}
          month={parseInt(selectedMonth.split("-")[1])}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
