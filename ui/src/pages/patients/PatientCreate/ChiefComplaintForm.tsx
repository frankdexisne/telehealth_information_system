import { Grid, Group, Button } from "@mantine/core";
import { Select, TextInput } from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface ChieftComplaintFormData {
  chief_complaint: string;
  patient_condition_id: number;
  consultation_status_id: number;
}

interface ChiefComplaintFormProps {
  onBack: () => void;
  onSubmit: (payload: ChieftComplaintFormData) => void;
  values?: ChieftComplaintFormData;
  hideBackButton?: boolean;
  submitLabel?: string;
  backLabel?: string;
}

const ChiefComplaintForm = ({
  onBack,
  onSubmit,
  values,
  hideBackButton = false,
  submitLabel = "Next Step",
  backLabel = "Previos step",
}: ChiefComplaintFormProps) => {
  const patientConditions = useSelector(
    (state: RootState) => state.select.patient_conditions
  );
  const consultationStatuses = useSelector(
    (state: RootState) => state.select.consultation_statuses
  );
  const { control, handleSubmit, setValue } =
    useForm<ChieftComplaintFormData>();

  const chiefComplaintHandler = (payload: ChieftComplaintFormData) => {
    onSubmit(payload);
  };

  useEffect(() => {
    if (values) {
      Object.keys(values).map((key) => {
        setValue(
          key as keyof ChieftComplaintFormData,
          values[key as keyof ChieftComplaintFormData]
        );
      });
    }
  }, [values, setValue]);

  // useEffect(() => {
  //   setValue("patient_condition_id", 1);
  //   setValue("consultation_status_id", 1);
  // }, [setValue]);

  return (
    <form onSubmit={handleSubmit(chiefComplaintHandler)}>
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

      <Group justify="center" mt="xl">
        {!hideBackButton && (
          <Button color="gray" onClick={onBack}>
            {backLabel}
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </Group>
    </form>
  );
};

export default ChiefComplaintForm;
