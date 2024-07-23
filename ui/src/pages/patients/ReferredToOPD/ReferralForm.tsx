import { useForm } from "react-hook-form";
import {
  ApiSelect,
  TextInput,
  Select,
} from "../../../components/use-form-controls";
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

interface AdditionalPatientFormData {
  contact_no: string;
  occupation: string;
  informant: string;
  log_date: string;
  log_time: string;
  platform_id: number;
  patempstat: string;
  chief_complaint: string;
  patient_condition_id: number;
  consultation_status_id: number;
  regcode: string;
  provcode: string;
  ctycode: string;
  schedule_datetime: string;
}

interface ScheduleDate {
  date: string;
  scheduled: number;
  daily_limit: null | number;
}

const ReferralForm = () => {
  const regions = useSelector((state: RootState) => state.select.regions);
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, setValue, watch } = useForm();

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
          .catch((err) => setLoading(false));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedMonth, selectedDepartment]);

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

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

      {/* <ApiSelect
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
      </Grid> */}
      <Modal
        size="xl"
        title="Appointment Information"
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        centered
      >
        <form>
          {/* <Divider
            label={<Text size="sm">Demographic</Text>}
            labelPosition="left"
            mb={5}
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <Select
                control={control}
                name="regcode"
                label="Region"
                isRequired
                data={regions}
                // value={data?.demographic.regcode}
                // defaultValue="05"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="Province"
                control={control}
                name="provcode"
                api={`selects/provinces?regcode=${selectedRegion || "05"}`}
                isRequired
                // value={data?.demographic?.provcode}
                // value="0505"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="City"
                control={control}
                name="ctycode"
                api={`selects/cities?provcode=${selectedProvince || "0505"}`}
                isRequired
                // value={data?.demographic?.ctycode}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="Barangay"
                control={control}
                name="bgycode"
                api={`selects/barangays?ctycode=${selectedCity}`}
                isRequired
                // value={data?.demographic?.brg}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
              <TextInput name="patstr" control={control} label="Street" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <TextInput name="patzip" control={control} label="Zipcode" />
            </Grid.Col>
          </Grid> */}
          {/* <Divider
            label={<Text size="sm">Appointment Detail</Text>}
            labelPosition="left"
            my={10}
          /> */}
          {/* <TextInput
            name="contact_no"
            label="Contact Number"
            control={control}
            isRequired
          />
          <TextInput
            name="occupation"
            label="Occupation"
            control={control}
            isRequired
          />
          <Select
            control={control}
            name="patempstat"
            label="Employment Status"
            isRequired
            data={[
              { value: "EMPLO", label: "EMPLOYED" },
              { value: "UNEMP", label: "UNEMPLOYED" },
            ]}
          /> */}
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
            {/* <Button color="gray" onClick={onCancel}>
              Cancel
            </Button> */}
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
