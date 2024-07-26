import { TextInput } from "../../../components/use-form-controls";
import { Button, ButtonGroup, Grid, Switch } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest, postRequest, errorProvider } from "../../../hooks";
import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

export interface ScheduleFormData {
  id?: number;
  name: string;
}

interface ScheduleFormProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
  values?: ScheduleFormData;
}

const defaultValues: ScheduleFormData = {
  name: "",
};

const ScheduleRow = ({
  item,
}: {
  item: { id: number; label: string; value: string };
}) => {
  const { control } = useForm();
  const [toggled, { open, close }] = useDisclosure(false);
  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 4 }} className="flex items-center">
        <Switch
          label={item.label}
          defaultChecked={toggled}
          onChange={() => {
            if (toggled) close();
            else open();
          }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <TextInput
          type="datetime-local"
          name={`start_at_${item.value}`}
          control={control}
          label="Start At"
          isRequired
          disabled={!toggled}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <TextInput
          type="datetime-local"
          name={`end_at_${item.value}`}
          control={control}
          label="End At"
          isRequired
          disabled={!toggled}
        />
      </Grid.Col>
    </Grid>
  );
};

const ScheduleForm = ({ values, onSubmit, onCancel }: ScheduleFormProps) => {
  const queryClient = useQueryClient();
  const { handleSubmit, setError, setValue } = useForm<ScheduleFormData>({
    defaultValues: defaultValues,
  });

  const saveUserHandler = (payload: ScheduleFormData) => {
    if (values?.id) {
      putRequest(`/departments/${values.id}`, payload)
        .then(successHandler)
        .catch(catchHandler);
    } else {
      postRequest(`/departments`, payload)
        .then(successHandler)
        .catch(catchHandler);
    }
  };

  const successHandler = (response: AxiosResponse) => {
    onSubmit(response);
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(`tableData:departments`),
    });
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<ScheduleFormData>(
      error,
      function (_errors: ScheduleFormData) {
        Object.keys(_errors).map((field) => {
          setError(field as keyof ScheduleFormData, {
            type: "custom",
            message: _errors[field as keyof ScheduleFormData]?.toString(),
          });
        });
      }
    );
  };

  useEffect(() => {
    if (values?.id) {
      Object.keys(values).map((field) => {
        const fieldValue = values[field as keyof ScheduleFormData]?.toString();

        setValue(field as keyof ScheduleFormData, fieldValue);
      });
    }
  }, [values, setValue]);

  const days = [
    {
      id: 1,
      label: "Monday",
      value: "mon",
    },
    {
      id: 2,
      label: "Tuesday",
      value: "tue",
    },
    {
      id: 3,
      label: "Wednesday",
      value: "wed",
    },
    {
      id: 4,
      label: "Thursday",
      value: "thru",
    },
    {
      id: 5,
      label: "Monday",
      value: "fri",
    },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(saveUserHandler)}>
        {days.map((item) => (
          <ScheduleRow item={item} />
        ))}

        <ButtonGroup className="mt-3 flex justify-center">
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </ButtonGroup>
      </form>
    </div>
  );
};

export default ScheduleForm;
