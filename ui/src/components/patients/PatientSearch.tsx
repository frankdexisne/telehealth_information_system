import TextInput from "../use-form-controls/TextInput";
import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Tabs, rem, Paper } from "@mantine/core";
import { IconUser, IconNumber } from "@tabler/icons-react";

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

const ViaHospitalNumberSearch = ({
  enableSearch,
  onSubmit,
}: PatientSearchProps) => {
  const { control, handleSubmit } = useForm<SearchViaHospNoType>({
    defaultValues: {
      hpercode: "",
    },
  });

  const searchHandler = (payload: SearchViaHospNoType) => {
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(searchHandler)} className="w-full">
      <TextInput
        control={control}
        label="Hospital Number"
        name="hpercode"
        required
      />
      {enableSearch && (
        <ButtonGroup className="mt-2">
          <Button type="submit" className="w-full">
            Search
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
};

const ViaNameSearch = ({ enableSearch, onSubmit }: PatientSearchProps) => {
  const { control, handleSubmit } = useForm<SearchViaNameType>({
    defaultValues: {
      lname: "",
      mname: "",
      fname: "",
    },
  });

  const searchHandler = (payload: SearchViaNameType) => {
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(searchHandler)} className="w-full">
      <TextInput control={control} label="Lastname" name="lname" />
      <TextInput control={control} label="Firstname" name="fname" />
      <TextInput control={control} label="Middlename" name="mname" />

      {enableSearch && (
        <ButtonGroup className="mt-2">
          <Button className="w-full" type="submit">
            Search
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
};

interface PatientMainProps {
  enableSearch: boolean;
  onSubmit: (payload: SearchViaNameType | SearchViaHospNoType) => void;
}

// const PatientSearch = ({ enableSearch, onSubmit }: PatientMainProps) => {
//   const iconStyle = { width: rem(12), height: rem(12) };
//   return (
//     <Paper radius="md" withBorder p={7} bg="var(--mantine-color-body)">
//       <Tabs defaultValue="hospital_number">
//         <Tabs.List>
//           <Tabs.Tab
//             value="hospital_number"
//             leftSection={<IconNumber style={iconStyle} />}
//           >
//             Hospital Number
//           </Tabs.Tab>
//           <Tabs.Tab
//             value="patient_name"
//             leftSection={<IconUser style={iconStyle} />}
//           >
//             Patient Name
//           </Tabs.Tab>
//         </Tabs.List>

//         <Tabs.Panel value="hospital_number">
//           <ViaHospitalNumberSearch
//             enableSearch={enableSearch}
//             onSubmit={onSubmit}
//           />
//         </Tabs.Panel>

//         <Tabs.Panel value="patient_name">
//           <ViaNameSearch enableSearch={enableSearch} onSubmit={onSubmit} />
//         </Tabs.Panel>
//       </Tabs>
//     </Paper>
//   );
// };

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

const PatientSearch = ({ type, onSubmit }: PatientSearchFormProps) => {
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
