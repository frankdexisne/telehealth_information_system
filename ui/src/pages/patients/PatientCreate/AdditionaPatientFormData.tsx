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
} from "@mantine/core";
import { postRequest, errorProvider } from "../../../hooks/use-http";
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ProfileHeader from "../PatientProfile/ProfileHeader";
import { useHomisPatient } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";

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
}

interface AdditionalPatientFormDataProps {
  hpercode: string | null;
  onCancel: () => void;
  onSubmit: (res: AxiosResponse) => void;
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
  onCancel,
  onSubmit,
}: AdditionalPatientFormDataProps) => {
  const regions = useSelector((state: RootState) => state.select.regions);
  const patientConditions = useSelector(
    (state: RootState) => state.select.patient_conditions
  );
  const consultationStatuses = useSelector(
    (state: RootState) => state.select.consultation_statuses
  );

  const additionalFormHandler = (payload: AdditionalPatientFormData) => {
    postRequest("/patients/" + hpercode + "/clone-to-telehealth", payload)
      .then((res) => onSubmit(res))
      .catch((error) => {
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

  const { data } = useHomisPatient({
    hpercode: hpercode!,
  });

  const { control, handleSubmit, setError, watch } =
    useForm<AdditionalPatientFormData>();

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  console.log(data);

  return (
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
        <DemographicItem label="Province" value={data?.demographic?.provname} />
        <DemographicItem label="City" value={data?.demographic?.ctyname} />
        <DemographicItem label="Barangay" value={data?.demographic?.bgyname} />
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
        <form onSubmit={handleSubmit(additionalFormHandler)}>
          {/* 
      <div className="mb-5" /> */}
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
                api={`selects/barangays?ctycode=${selectedCity}`}
                isRequired
                value={data?.demographic?.brg}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
              <TextInput
                name="patstr"
                control={control}
                label="Street"
                isRequired
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <TextInput
                name="patzip"
                control={control}
                label="Zipcode"
                isRequired
              />
            </Grid.Col>
          </Grid>
          <Divider
            label={<Text size="sm">Consultation Detail</Text>}
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

          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <TextInput
                name="chief_complaint"
                control={control}
                label="Chief Complaint"
                isRequired
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <Select
                control={control}
                name="patient_condition_id"
                label="Patient Codition"
                isRequired
                data={patientConditions}
                value="1"
                defaultValue="1"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <Select
                control={control}
                name="consultation_status_id"
                label="Consultation Status"
                isRequired
                data={consultationStatuses}
                value="1"
                defaultValue="1"
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
      </div>
    </div>
  );
};

export default AdditionalPatientFormData;
