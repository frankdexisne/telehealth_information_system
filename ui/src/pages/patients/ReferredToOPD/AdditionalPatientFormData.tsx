import { useForm } from "react-hook-form";
import {
  TextInput,
  Select,
  ApiSelect,
} from "../../../components/use-form-controls";
import {
  Button,
  ButtonGroup,
  Grid,
  Divider,
  InputLabel,
  TextInput as TextInputCore,
  Title,
  Text,
  Modal,
  Select as SelectCore,
  Loader,
} from "@mantine/core";
import {
  getRequest,
  postRequest,
  errorProvider,
} from "../../../hooks/use-http";
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ProfileHeader from "../PatientProfile/ProfileHeader";
import { useHomisPatient } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import Day from "./Day";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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

interface AdditionalPatientFormDataProps {
  hpercode: string | null;
  department_id: number;
  onCancel: () => void;
  onSubmit: (res: AxiosResponse) => void;
}

interface ScheduleDate {
  date: string;
  scheduled: number;
  daily_limit: null | number;
}

const DemographicItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center">
      <InputLabel className="w-[30%]">{label}</InputLabel>
      <TextInputCore w="70%" variant="unstyled" value={value} fw="bold" />
    </div>
  );
};

const AdditionalPatientFormData = ({
  hpercode,
  department_id,
  onCancel,
}: AdditionalPatientFormDataProps) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const regions = useSelector((state: RootState) => state.select.regions);
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );

  const { data } = useHomisPatient({
    hpercode: hpercode!,
  });

  const onSubmitHandler = (payload: AdditionalPatientFormData) => {
    console.log(payload);
  };

  const additionalFormHandler = (payload: AdditionalPatientFormData) => {
    setSubmitting(true);
    postRequest("/patients/" + hpercode + "/clone-to-telehealth-appointment", {
      ...payload,
      department_id,
    })
      .then(() => {
        navigate("/teleclerk");
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
        errorProvider<AdditionalPatientFormData>(
          error,
          function (_errors: AdditionalPatientFormData) {
            Object.keys(_errors).map((field) => {
              setError(field as keyof AdditionalPatientFormData, {
                type: "custom",
                message:
                  _errors[field as keyof AdditionalPatientFormData]?.toString(),
              });
            });
          }
        );
      });
  };

  const { control, watch, setValue, handleSubmit, setError } =
    useForm<AdditionalPatientFormData>();

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM")
  );
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

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
      <div className="w-full flex min-h-[500px]">
        <div className="w-[30%]">
          <div className="mb-5" />
          <ProfileHeader
            name={`${data?.hperson?.patlast}, ${data?.hperson.patfirst} ${data?.hperson.patmiddle}`}
            hpercode={hpercode}
            contact_no="NOT SET"
            gender={data?.patsex === "M" ? "male" : "female"}
            dob={data?.patbdate?.toString()?.replace("00:00:00", "")}
          />
          <Divider label="Demographics" my={10} />
          <DemographicItem label="Region" value={data?.demographic?.regname} />
          <DemographicItem
            label="Province"
            value={data?.demographic?.provname}
          />
          <DemographicItem label="City" value={data?.demographic?.ctyname} />
          <DemographicItem
            label="Barangay"
            value={data?.demographic?.bgyname}
          />
          <Divider my={20} />
          <div className="flex justify-center mt-15">
            <Title size={20} fw="bolder" className="text-slate-500">
              Migrating HOMIS Patient to Telehealth
            </Title>
          </div>
          <Button
            w="100%"
            mt={20}
            color="gray"
            leftSection={<IconSearch />}
            onClick={onCancel}
          >
            <div className="w-full">SEARCH AGAIN</div>
          </Button>
        </div>
        <div className="w-[70%] pl-5">
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
            value={selectedMonth}
            min={moment().format("YYYY-MM")}
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
        </div>
      </div>

      <Modal
        size="xl"
        title="Appointment Information"
        opened={opened}
        onClose={close}
      >
        <form onSubmit={handleSubmit(additionalFormHandler)}>
          <Divider
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
                value={data?.demographic.regcode}
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
                value={data?.demographic?.provcode}
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
                value={data?.demographic?.ctycode}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="Barangay"
                control={control}
                name="bgycode"
                api={`selects/barangays?ctycode=${selectedCity || "050506"}`}
                isRequired
                value={data?.demographic?.brg}
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
          </Grid>
          <Divider
            label={<Text size="sm">Appointment Detail</Text>}
            labelPosition="left"
            my={10}
          />
          <TextInput
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
          />
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

export default AdditionalPatientFormData;
