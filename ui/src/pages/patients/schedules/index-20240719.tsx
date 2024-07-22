import { DatePicker } from "@mantine/dates";
import { Grid, Paper, Select, Title } from "@mantine/core";
import PatientList from "./PatientList";
const Schedules = () => {
  return (
    <Paper shadow="xl" p="xl" className="min-h-[80vh]">
      <Grid>
        <Grid.Col span={8}>
          <Title size={24} className="text-blue-500 mb-10">
            Patient Schedule
          </Title>
          <PatientList />
        </Grid.Col>
        <Grid.Col
          span={4}
          className="flex justify-center flex-col items-center"
        >
          <div className="w-full h-[80px]">
            <Select data={[]} placeholder="Filter By Department" />
          </div>
          <DatePicker defaultValue={new Date()} size="md" />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default Schedules;
