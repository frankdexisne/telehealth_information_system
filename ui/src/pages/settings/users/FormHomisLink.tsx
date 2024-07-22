import { ApiSelect } from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { AxiosResponse, AxiosError } from "axios";
import { errorProvider, putRequest } from "../../../hooks";
import { Button, ButtonGroup } from "@mantine/core";

export interface UserFormLinkData {
  hpersonal_code: string;
}

interface UserFormLinkProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
  id: number | null;
}

const FormHomisLink = ({ id, onCancel, onSubmit }: UserFormLinkProps) => {
  const { control, handleSubmit, setError } = useForm<UserFormLinkData>();

  const linkUserHandler = (payload: UserFormLinkData) => {
    putRequest(`/users/${id}/link`, payload)
      .then((response) => onSubmit(response))
      .catch(catchHandler);
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<UserFormLinkData>(error, function (_errors) {
      Object.keys(_errors).map((field) => {
        setError(field as keyof UserFormLinkData, {
          type: "custom",
          message: _errors[field as keyof UserFormLinkData].toString(),
        });
      });
    });
  };
  return (
    <form onSubmit={handleSubmit(linkUserHandler)}>
      <ApiSelect
        api="/selects/hpersonals"
        label="HOMIS User"
        name="hpersonal_code"
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
  );
};

export default FormHomisLink;
