import { TextInput, ApiSelect } from "../../../components/use-form-controls";
import { Button, ButtonGroup } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest, postRequest, errorProvider } from "../../../hooks";
import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface UserFormData {
  id?: number;
  name: string;
  email: string;
  department_id: number | null;
  designation_id: number | null;
  role_id: number | null;
}

interface UserFormProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
  values?: UserFormData;
}

const defaultValues: UserFormData = {
  name: "",
  email: "",
  department_id: null,
  designation_id: null,
  role_id: null,
};

const UserForm = ({ values, onSubmit, onCancel }: UserFormProps) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, setError, setValue } = useForm<UserFormData>({
    defaultValues: defaultValues,
  });

  const saveUserHandler = (payload: UserFormData) => {
    if (values?.id) {
      putRequest(`/users/${values.id}`, payload)
        .then(successHandler)
        .catch(catchHandler);
    } else {
      postRequest(`/users`, payload).then(successHandler).catch(catchHandler);
    }
  };

  const successHandler = (response: AxiosResponse) => {
    onSubmit(response);
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(`tableData:users`),
    });
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<UserFormData>(error, function (_errors) {
      Object.keys(_errors).map((field) => {
        setError(field as keyof UserFormData, {
          type: "custom",
          message: _errors[field as keyof UserFormData]?.toString(),
        });
      });
    });
  };

  useEffect(() => {
    if (values?.id) {
      Object.keys(values).map((field) => {
        const fieldValue = values[field as keyof UserFormData]?.toString();

        setValue(field as keyof UserFormData, fieldValue);
      });
    }
  }, [values, setValue]);

  return (
    <div className="w-[400px]">
      <form onSubmit={handleSubmit(saveUserHandler)}>
        <TextInput
          name="name"
          control={control}
          label="Name of User"
          isRequired
        />
        <TextInput
          name="email"
          type="email"
          control={control}
          label="Email Address"
          isRequired
        />
        {!values?.id && (
          <>
            <TextInput
              type="password"
              name="password"
              control={control}
              label="Password"
              isRequired={values?.id ? false : true}
            />
            <TextInput
              type="password"
              name="password_confirmation"
              control={control}
              label="Confirm Password"
              isRequired={values?.id ? false : true}
            />
          </>
        )}

        <ApiSelect
          api="/selects/departments"
          label="Department"
          name="department_id"
          control={control}
          isRequired
        />
        <ApiSelect
          api="/selects/designations"
          label="Designation"
          name="designation_id"
          control={control}
          isRequired
        />
        <ApiSelect
          api="/selects/roles"
          label="Role"
          name="role_id"
          control={control}
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

export default UserForm;
