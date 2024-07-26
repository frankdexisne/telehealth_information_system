import {
  Grid,
  Divider,
  Text,
  Button,
  Select as SelectCore,
  TextInput as TextInputCore,
  Loader,
  Title,
} from "@mantine/core";
import { useState, useEffect } from "react";
import {
  ApiSelect,
  TextInput,
  Select,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import moment from "moment";
import { postRequest, getRequest } from "../../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import Day from "./Day";
import Swal from "sweetalert2";

interface NewProfileData {
  log_date: string;
  log_time: string;
  platform_id: number;
  informant: string;
  lname: string;
  fname: string;
  mname: string;
  suffix: string;
  dob: string;
  gender: "male" | "female";
  contact_no: string;
  department_id: string;
  schedule_datetime?: string;
}

interface ScheduleDate {
  date: string;
  scheduled: number;
  daily_limit: null | number;
}

const NewProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM")
  );
  const [appointmentData, setAppointmentData] = useState<NewProfileData>();
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[]>([]);

  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const suffixes = useSelector((state: RootState) => state.select.suffixes);

  const { control, handleSubmit } = useForm<NewProfileData>();

  const createAppointment = (payload: NewProfileData) => {
    setAppointmentData({ ...payload });
    setIsSelectingDate(true);
  };

  const appointmentConfirmation = (date: string) => {
    Swal.fire({
      title: "Create Appontment",
      text: "This appointment will be created for this date",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          ...appointmentData,
          schedule_datetime: date + " 08:00:00",
          department_id: selectedDepartment,
        };
        postRequest("/patients/create-appointment", payload).then(() => {
          navigate("/teleclerk");
        });
      }
    });
  };

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
    <div>
      <form
        onSubmit={handleSubmit(createAppointment)}
        className={`${isSelectingDate && "hidden"}`}
      >
        <Divider label={<Text>Teleclerk Log</Text>} labelPosition="left" />
        <Grid className="bg-slate-100 p-5 rounded-lg">
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <ApiSelect
              label="Platform"
              control={control}
              name="platform_id"
              api={`selects/platforms`}
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              label="Informant"
              control={control}
              name="informant"
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              type="date"
              label="Date"
              control={control}
              name="log_date"
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              type="time"
              label="Time"
              control={control}
              name="log_time"
              isRequired
            />
          </Grid.Col>
        </Grid>
        <Divider
          label={<Text>Patient Details</Text>}
          labelPosition="left"
          mt={20}
        />
        <Grid className="bg-slate-100 p-5 rounded-lg">
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              name="lname"
              control={control}
              label="Lastname"
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              name="fname"
              control={control}
              label="Firstname"
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              name="mname"
              control={control}
              label="Middlename"
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <Select
              control={control}
              name="suffix"
              label="Suffix"
              data={suffixes}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              type="date"
              name="dob"
              control={control}
              label="Date of Birth"
              isRequired
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <Select
              control={control}
              name="gender"
              label="Gender"
              isRequired
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput
              type="number"
              name="contact_no"
              control={control}
              label="Contact Number"
              isRequired
            />
          </Grid.Col>
        </Grid>
        <div className="flex justify-center mt-10">
          <Button type="submit">SELECT APPOINTMENT DATE</Button>
        </div>
      </form>

      {isSelectingDate && (
        <Grid>
          <Grid.Col span={12} className="flex justify-center">
            <Title mt={20} size={24} c="blue">
              Selecting department and appointment date
            </Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInputCore
              type="month"
              label="Month"
              name="monthYear"
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
              min={moment().format("YYYY-MM")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <SelectCore
              data={departments}
              label="Department"
              searchable
              onChange={(value: string | null) => {
                if (value) setSelectedDepartment(value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
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
                        // setValue("schedule_datetime", date.date + " 08:00:00");
                        appointmentConfirmation(date.date);
                      }}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Grid.Col>
        </Grid>
      )}
    </div>
  );
};

export default NewProfile;
