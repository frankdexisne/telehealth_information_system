import { useForm } from "react-hook-form";
import { ApiSelect, TextInput } from "../../../components/use-form-controls";
import { Divider, Grid, Text } from "@mantine/core";
import Day from "./Day";
import moment from "moment";
const ReferralForm = () => {
  const { control } = useForm();
  return (
    <form>
      <ApiSelect
        control={control}
        label="Department"
        name="department_id"
        api="selects/departments?is_doctor=1"
      />
      <TextInput
        type="month"
        control={control}
        label="Month"
        name="month_year"
      />
      <Divider
        my={15}
        label={<Text>Available Dates</Text>}
        labelPosition="left"
      />
      <Grid>
        <Grid.Col span={2}>
          <Day date={new Date()} scheduled={10} dailyLimit={20} />
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default ReferralForm;
