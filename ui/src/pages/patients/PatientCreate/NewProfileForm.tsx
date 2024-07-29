import { Grid, Divider, Text, Group, Button } from "@mantine/core";
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
import { postRequest } from "../../../hooks/use-http";
import { useNavigate } from "react-router-dom";

interface NewProfileFormData {
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
  is_pregnant: 1 | 0;
  patcstat: string;
  contact_no: string;
  occupation: string;
  employment_status_id: string;
  regcode: string;
  provcode: string;
  ctycode: string;
  brgcode: string;
  patstr: string;
  patzip: string;
  chief_complaint: string;
  patient_condition_id: string;
  consultation_status_id: string;
}

const NewProfileForm = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const civilStatuses = useSelector(
    (state: RootState) => state.select.civil_statuses
  );
  const regions = useSelector((state: RootState) => state.select.regions);
  const suffixes = useSelector((state: RootState) => state.select.suffixes);
  const patientConditions = useSelector(
    (state: RootState) => state.select.patient_conditions
  );
  const consultationStatuses = useSelector(
    (state: RootState) => state.select.consultation_statuses
  );
  const [disableIsPregnant, setDisableIsPregnant] = useState(true);
  const { control, watch, handleSubmit } = useForm<NewProfileFormData>();

  const dob = watch("dob");
  const gender = watch("gender");
  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  const createTeleconsultation = (payload: NewProfileFormData) => {
    setSubmitting(true);
    postRequest("/patients", payload)
      .then(() => {
        navigate("/teleclerk");
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (gender === "female") {
      const birthday = moment(dob);
      const currentDate = moment();
      const age = moment.duration(currentDate.diff(birthday)).years();
      setDisableIsPregnant(age < 10);
    } else {
      setDisableIsPregnant(true);
    }
  }, [dob, gender]);
  return (
    <div>
      <form onSubmit={handleSubmit(createTeleconsultation)}>
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
            <Select
              control={control}
              name="is_pregnant"
              label="Is Pregnant"
              isRequired={false}
              disabled={disableIsPregnant}
              data={[
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <Select
              control={control}
              name="patcstat"
              label="Civil Status"
              isRequired
              data={civilStatuses}
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
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              name="occupation"
              control={control}
              label="Occupation"
              isRequired
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
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
          </Grid.Col>
        </Grid>

        <Divider
          label={<Text>Demographics</Text>}
          labelPosition="left"
          mt={20}
        />

        <Grid className="bg-slate-100 p-5 rounded-lg">
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <Select
              control={control}
              name="regcode"
              label="Region"
              isRequired
              data={regions}
              defaultValue="05"
              value="05"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <ApiSelect
              label="Province"
              control={control}
              name="provcode"
              api={`selects/provinces?regcode=${selectedRegion || "05"}`}
              isRequired
              defaultValue="0505"
              value="0505"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <ApiSelect
              label="City"
              control={control}
              name="ctycode"
              api={`selects/cities?provcode=${selectedProvince || "0505"}`}
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <ApiSelect
              label="Barangay"
              control={control}
              name="brg"
              api={`selects/barangays?ctycode=${selectedCity}`}
              isRequired
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
            <TextInput name="patstr" control={control} label="Street" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
            <TextInput name="patzip" control={control} label="Zipcode" />
          </Grid.Col>
        </Grid>

        <Divider
          label={<Text>Consultation Detail</Text>}
          labelPosition="left"
          mt={20}
        />
        <Grid className="bg-slate-100 p-5 rounded-lg">
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
        <Group justify="center" mt="xl">
          <Button w={300} type="submit" loading={submitting}>
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default NewProfileForm;
