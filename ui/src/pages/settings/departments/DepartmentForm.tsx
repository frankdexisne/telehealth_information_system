import { TextInput } from "../../../components/use-form-controls";
import { Button, ButtonGroup } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest, postRequest, errorProvider } from "../../../hooks";
import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface DepartmentFormData {
  id?: number;
  name: string;
}

interface DepartmentFormProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
  values?: DepartmentFormData;
}

const defaultValues: DepartmentFormData = {
  name: "",
};

const DepartmentForm = ({
  values,
  onSubmit,
  onCancel,
}: DepartmentFormProps) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, setError, setValue } =
    useForm<DepartmentFormData>({
      defaultValues: defaultValues,
    });

  const saveUserHandler = (payload: DepartmentFormData) => {
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
    errorProvider<DepartmentFormData>(
      error,
      function (_errors: DepartmentFormData) {
        Object.keys(_errors).map((field) => {
          setError(field as keyof DepartmentFormData, {
            type: "custom",
            message: _errors[field as keyof DepartmentFormData]?.toString(),
          });
        });
      }
    );
  };

  useEffect(() => {
    if (values?.id) {
      Object.keys(values).map((field) => {
        const fieldValue =
          values[field as keyof DepartmentFormData]?.toString();

        setValue(field as keyof DepartmentFormData, fieldValue);
      });
    }
  }, [values, setValue]);

  return (
    <div className="w-[400px]">
      <form onSubmit={handleSubmit(saveUserHandler)}>
        <TextInput
          name="name"
          control={control}
          label="Name of Department"
          isRequired
        />

        <ButtonGroup className="mt-3">
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </ButtonGroup>
      </form>
    </div>
  );
};

export default DepartmentForm;
