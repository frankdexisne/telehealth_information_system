import { Grid, Group, Button, Divider, Text } from "@mantine/core";
import {
  ApiSelect,
  TextInput,
  Select,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface LogFormData {
  log_date: string;
  log_time: string;
  platform: string;
  informant: string;
  regcode: string;
  provcode: string;
  ctycode: string;
}

interface LogFormProps {
  values?: LogFormData;
  onBack?: () => void;
  hideBackButton?: boolean;
  onSubmit: (payload: LogFormData) => void;
  submitLabel?: string;
  submitPosition?: "left" | "center" | "right";
  showSubmit?: boolean;
}

const LogForm = ({
  values,
  onBack,
  hideBackButton = false,
  onSubmit,
  submitLabel = "Next Step",
  submitPosition = "center",
  showSubmit = true,
}: LogFormProps) => {
  const regions = useSelector((state: RootState) => state.select.regions);
  const { control, handleSubmit, watch, setValue } = useForm<LogFormData>();

  const demographicHandler = (data: LogFormData) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (values) {
      Object.keys(values).map((key) => {
        setValue(key as keyof LogFormData, values[key as keyof LogFormData]);
      });
    }
  }, [values, setValue]);

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  return (
    <form onSubmit={handleSubmit(demographicHandler)}>
      <Divider
        label={<Text size="sm">Demographic</Text>}
        labelPosition="left"
        mb={5}
      />
      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <Select
            control={control}
            name="regcode"
            label="Region"
            isRequired
            data={regions}
            // defaultValue="05"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
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
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <ApiSelect
            label="City"
            control={control}
            name="ctycode"
            api={`selects/cities?provcode=${selectedProvince || "0505"}`}
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
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
        label={<Text size="sm">Log Detail</Text>}
        labelPosition="left"
        my={10}
      />
      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <ApiSelect
            label="Platform"
            control={control}
            name="platform_id"
            api={`selects/platforms`}
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <TextInput
            label="Informant"
            control={control}
            name="informant"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <TextInput
            type="date"
            label="Date"
            control={control}
            name="log_date"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <TextInput
            type="time"
            label="Time"
            control={control}
            name="log_time"
            isRequired
          />
        </Grid.Col>
      </Grid>

      <Group justify={submitPosition} mt="xl">
        {showSubmit && <Button type="submit">{submitLabel}</Button>}
      </Group>
    </form>
  );
};

export default LogForm;
