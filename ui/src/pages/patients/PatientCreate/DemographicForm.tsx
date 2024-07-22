import { Grid, Group, Button } from "@mantine/core";
import {
  ApiSelect,
  Select,
  TextInput,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface DemographicFormData {
  patstr: string;
  brg: string;
  ctycode: string;
  provcode: string;
  regcode: string;
  patzip: string;
}

interface DemographicFormProps {
  values?: DemographicFormData;
  onBack?: () => void;
  hideBackButton?: boolean;
  onSubmit: (payload: DemographicFormData) => void;
  submitLabel?: string;
  submitPosition?: "left" | "center" | "right";
  showSubmit?: boolean;
}

const DemographicForm = ({
  values,
  onBack,
  hideBackButton = false,
  onSubmit,
  submitLabel = "Next Step",
  submitPosition = "center",
  showSubmit = true,
}: DemographicFormProps) => {
  const regions = useSelector((state: RootState) => state.select.regions);
  const { control, handleSubmit, watch, setValue } =
    useForm<DemographicFormData>();

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  const demographicHandler = (data: DemographicFormData) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (values) {
      Object.keys(values).map((key) => {
        setValue(
          key as keyof DemographicFormData,
          values[key as keyof DemographicFormData]
        );
      });
    }
  }, [values, setValue]);

  useEffect(() => {
    setValue("regcode", "05");
    setValue("provcode", "0505");
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(demographicHandler)}>
      <Grid>
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
      <Group justify={submitPosition} mt="xl">
        {!hideBackButton && <Button onClick={onBack}>Previos step</Button>}
        {showSubmit && <Button type="submit">{submitLabel}</Button>}
      </Group>
    </form>
  );
};

export default DemographicForm;
