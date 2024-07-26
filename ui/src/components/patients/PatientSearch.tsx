import TextInput from "../use-form-controls/TextInput";
import { useForm } from "react-hook-form";
import { Button } from "@mantine/core";

export interface SearchViaNameType {
  lname: string;
  fname: string;
  mname: string;
}

export interface SearchViaHospNoType {
  hpercode: string;
}

export interface PatientSearchProps {
  enableSearch: boolean;
  onSubmit: (payload: SearchViaNameType | SearchViaHospNoType) => void;
}

export interface PatientSearchForm {
  hpercode?: string;
  lname?: string;
  fname?: string;
  mname?: string;
}

interface PatientSearchFormProps {
  type: "teleserve-reffered" | "teleconsult";
  onSubmit: (payload: PatientSearchForm) => void;
}

const PatientSearch = ({ onSubmit }: PatientSearchFormProps) => {
  const { control, handleSubmit, watch } = useForm<PatientSearchForm>();

  const formSubmitHandler = (payload: PatientSearchForm) => {
    onSubmit(payload);
  };

  const hpercode = watch("hpercode");
  const lname = watch("lname");
  const fname = watch("fname");
  const mname = watch("mname");

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
      <TextInput
        type="number"
        label="Hospital Number"
        name="hpercode"
        control={control}
        disabled={!!lname || !!fname || !!mname}
      />
      <TextInput
        label="Lastname"
        name="lname"
        control={control}
        disabled={!!hpercode}
      />
      <TextInput
        label="Firstname"
        name="fname"
        control={control}
        disabled={!!hpercode}
      />
      <TextInput
        label="Middlename"
        name="mname"
        control={control}
        disabled={!!hpercode}
      />
      <Button w="100%" mt={10} type="submit">
        Search
      </Button>
    </form>
  );
};

export default PatientSearch;
