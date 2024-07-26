import { useForm } from "react-hook-form";
import { ApiSelect, TextInput } from "../../../components/use-form-controls";
import {
  Divider,
  Grid,
  Text,
  Select as SelectCore,
  TextInput as TextInputCore,
  Loader,
  Modal,
  Button,
  ButtonGroup,
} from "@mantine/core";
import Day from "./Day";
import moment from "moment";
import { useState, useEffect } from "react";
import { getRequest } from "../../../hooks";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";

interface ScheduleDate {
  date: string;
  scheduled: number;
  daily_limit: null | number;
}

const ReferralForm = () => {
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, setValue } = useForm();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM")
  );
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedDepartment && selectedMonth) {
        setLoading(true);
        getRequest(
          `/patient-schedules/schedule-by-month/${selectedDepartment}/${selectedMonth}`
        )
          .then((res) => {
            setScheduleDates(res.data.dates);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedMonth, selectedDepartment]);

  return (
    <>
      <SelectCore
        data={departments}
        label="Department"
        searchable
        onChange={(value: string | null) => {
          if (value) setSelectedDepartment(value);
        }}
      />
      <TextInputCore
        type="month"
        label="Month"
        name="monthYear"
        onChange={(e) => setSelectedMonth(e.target.value)}
        min={moment().format("YYYY-MM")}
        value={selectedMonth}
      />
      <Divider
        my={15}
        label={<Text>Available Dates</Text>}
        labelPosition="left"
      />
      {loading && <Loader />}
      {!loading && (
        <Grid>
          {scheduleDates.map((date: ScheduleDate, index: number) => (
            <Grid.Col span={2}>
              <Day
                key={index}
                date={new Date(date.date)}
                scheduled={date.scheduled}
                dailyLimit={date.daily_limit || 0}
                onSelect={() => {
                  setValue("schedule_datetime", date.date + " 08:00:00");
                  open();
                }}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Modal
        size="xl"
        title="Appointment Information"
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        centered
      >
        <form>
          <Grid>
            <Grid.Col span={6}>
              <ApiSelect
                control={control}
                api="selects/platforms"
                name="platform_id"
                label="Platform"
                isRequired
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                name="informant"
                label="Informant"
                control={control}
                isRequired
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                type="date"
                name="log_date"
                label="Date"
                control={control}
                isRequired
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                type="time"
                name="log_time"
                label="Time"
                control={control}
                isRequired
              />
            </Grid.Col>
          </Grid>

          <ButtonGroup className="mt-5 flex justify-center">
            <Button type="submit" w="100%">
              Submit
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </>
  );
};

export default ReferralForm;
