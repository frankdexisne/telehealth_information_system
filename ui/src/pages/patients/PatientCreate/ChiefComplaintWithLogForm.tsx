import { Grid, Group, Button, Divider, Text } from "@mantine/core";
import {
  Select,
  TextInput,
  ApiSelect,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import moment from "moment";

export interface ChieftComplaintFormData {
  platform_id: number;
  informant: string;
  log_date: string;
  log_time: string;
  chief_complaint: string;
  patient_condition_id: number;
  consultation_status_id: number;
  regcode?: string;
  provcode?: string;
  ctycode?: string;
  bgycode?: string;
}

interface ChiefComplaintWithLogFormProps {
  onBack: () => void;
  onSubmit: (payload: ChieftComplaintFormData) => void;
  values?: Partial<ChieftComplaintFormData>;
  hideBackButton?: boolean;
  submitLabel?: string;
  backLabel?: string;
}

const ChiefComplaintWithLogForm = ({
  onBack,
  onSubmit,
  values,
  hideBackButton = false,
  submitLabel = "Next Step",
  backLabel = "Previos step",
}: ChiefComplaintWithLogFormProps) => {
  const regions = useSelector((state: RootState) => state.select.regions);
  const patientConditions = useSelector(
    (state: RootState) => state.select.patient_conditions
  );
  const consultationStatuses = useSelector(
    (state: RootState) => state.select.consultation_statuses
  );
  const { control, handleSubmit, setValue, watch } =
    useForm<ChieftComplaintFormData>();

  const chiefComplaintHandler = (payload: ChieftComplaintFormData) => {
    onSubmit(payload);
  };

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  useEffect(() => {
    if (values) {
      Object.keys(values).map((key) => {
        setValue(
          key as keyof ChieftComplaintFormData,
          values[key as keyof ChieftComplaintFormData]
        );
      });
    }
    console.log(values);
  }, [values, setValue]);

  // useEffect(() => {
  //   setValue("patient_condition_id", 1);
  //   setValue("consultation_status_id", 1);
  // }, [setValue]);

  return (
    <form onSubmit={handleSubmit(chiefComplaintHandler)}>
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
            // defaultValue="0505"
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
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
          <ApiSelect
            label="Barangay"
            control={control}
            name="bgycode"
            api={`selects/barangays?ctycode=${selectedCity}`}
            isRequired
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
          <TextInput
            name="patstr"
            control={control}
            label="Street"
            // isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
          <TextInput
            name="patzip"
            control={control}
            label="Zipcode"
            // isRequired
          />
        </Grid.Col>
      </Grid>
      <Divider
        label={<Text size="sm">Consultation Detail</Text>}
        labelPosition="left"
        my={10}
      />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <ApiSelect
            control={control}
            api="selects/platforms"
            label="Platform"
            name="platform_id"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            name="informant"
            control={control}
            label="Informant"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            type="date"
            name="log_date"
            control={control}
            label="Log Date"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            type="time"
            name="log_time"
            control={control}
            label="Log Time"
            isRequired
          />
        </Grid.Col>
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
        <Button w={hideBackButton ? "100%" : undefined} type="submit">
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default ChiefComplaintWithLogForm;
