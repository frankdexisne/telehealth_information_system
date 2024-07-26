import { Grid, Group, Button } from "@mantine/core";
import { TextInput, Select } from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface ProfilingFormData {
  lname: string;
  fname: string;
  mname: string;
  suffix?: string;
  dob: string;
  gender: "male" | "female" | null;
  is_pregnant: 1 | 0;
  occupation: string;
  civil_status: string;
  contact_no: string;
  patempstat: string;
  patcstat: string;
  informant: string;
}

interface PatientInformationFormProps {
  values: ProfilingFormData;
  onBack?: () => void;
  hideBackButton?: boolean;
  onSubmit: (payload: ProfilingFormData) => void;
  submitLabel?: string;
  submitPosition?: "left" | "center" | "right";
  showSubmit?: boolean;
}

const PatientInformationForm = ({
  values,
  onBack,
  hideBackButton = false,
  onSubmit,
  submitLabel = "Next step",
  submitPosition = "center",
  showSubmit = true,
}: PatientInformationFormProps) => {
  const civilStatuses = useSelector(
    (state: RootState) => state.select.civil_statuses
  );
  const suffixes = useSelector((state: RootState) => state.select.suffixes);
  const [disableIsPregnant, setDisableIsPregnant] = useState(true);
  const { control, handleSubmit, watch, setValue } =
    useForm<ProfilingFormData>();

  const profilingHandler = (data: ProfilingFormData) => {
    onSubmit(data);
  };

  useEffect(() => {
    Object.keys(values).map((key) => {
      setValue(
        key as keyof ProfilingFormData,
        key === "gender"
          ? values[key as keyof ProfilingFormData]?.toString().toLowerCase()
          : values[key as keyof ProfilingFormData]
      );
    });
  }, [values, setValue]);

  const dob = watch("dob");
  const gender = watch("gender");

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
    <form onSubmit={handleSubmit(profilingHandler)}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
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
        <Grid.Col span={{ base: 12, md: 12, lg: 2 }}>
          <Select
            control={control}
            name="suffix"
            label="Suffix"
            data={suffixes}
          />
        </Grid.Col>
      </Grid>

      <Grid>
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
      </Grid>

      <Grid>
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

      <Group justify={submitPosition} mt="xl">
        {!hideBackButton && (
          <Button color="gray" onClick={onBack}>
            Previos step
          </Button>
        )}
        {showSubmit && <Button type="submit">{submitLabel}</Button>}
      </Group>
    </form>
  );
};

export default PatientInformationForm;
