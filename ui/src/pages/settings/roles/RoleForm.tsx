import { TextInput } from "../../../components/use-form-controls";
import { Button, ButtonGroup } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest, postRequest, errorProvider } from "../../../hooks";
import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface RoleFormData {
  id?: number;
  name: string;
}

interface RoleFormProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
  values?: RoleFormData;
}

const defaultValues: RoleFormData = {
  name: "",
};

const RoleForm = ({ values, onSubmit, onCancel }: RoleFormProps) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, setError, setValue } = useForm<RoleFormData>({
    defaultValues: defaultValues,
  });

  const saveUserHandler = (payload: RoleFormData) => {
    if (values?.id) {
      putRequest(`/roles/${values.id}`, payload)
        .then(successHandler)
        .catch(catchHandler);
    } else {
      postRequest(`/roles`, payload).then(successHandler).catch(catchHandler);
    }
  };

  const successHandler = (response: AxiosResponse) => {
    onSubmit(response);
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(`tableData:roles`),
    });
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<RoleFormData>(error, function (_errors: RoleFormData) {
      Object.keys(_errors).map((field) => {
        setError(field as keyof RoleFormData, {
          type: "custom",
          message: _errors[field as keyof RoleFormData]?.toString(),
        });
      });
    });
  };

  useEffect(() => {
    if (values?.id) {
      Object.keys(values).map((field) => {
        const fieldValue = values[field as keyof RoleFormData]?.toString();

        setValue(field as keyof RoleFormData, fieldValue);
      });
    }
  }, [values, setValue]);

  return (
    <div className="w-[400px]">
      <form onSubmit={handleSubmit(saveUserHandler)}>
        <TextInput
          name="name"
          control={control}
          label="Name of Role"
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

export default RoleForm;
