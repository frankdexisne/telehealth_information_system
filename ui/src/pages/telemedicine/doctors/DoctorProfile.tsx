import TextInput from "../../../components/use-form-controls/TextInput";
import { Textarea } from "@mantine/core";
import { Select } from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { ButtonGroup, Button } from "@mantine/core";

interface DoctorProfileFormProps {
  name: string;
  facility: string;
  address: string;
}

interface DoctorProfileProps {
  onSubmit: (payload: DoctorProfileFormProps) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const DoctorProfile = ({
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
}: DoctorProfileProps) => {
  const { control, handleSubmit } = useForm<DoctorProfileFormProps>();

  const profileSubmitHandler = (payload: DoctorProfileFormProps) => {
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(profileSubmitHandler)}>
      <TextInput control={control} name="name" label="Doctor Name" isRequired />
      <TextInput
        control={control}
        name="facility"
        label="Facility name"
        isRequired
      />
      <TextInput
        control={control}
        name="facility"
        label="Facility name"
        isRequired
      />

      <TextInput control={control} name="address" label="Address" isRequired />

      <Select
        label="Purpose of Call"
        data={[
          {
            value: "1",
            label: "Transfer Referral",
          },
          {
            value: "2",
            label: "Case Management",
          },
        ]}
        control={control}
        name="purpose"
      />

      <Textarea label="Notes" rows={7} />
      <ButtonGroup mt={10}>
        <Button onClick={onCancel} color="gray">
          {cancelLabel ? cancelLabel : "Cancel"}
        </Button>
        <Button type="submit">{submitLabel ? submitLabel : "Submit"}</Button>
      </ButtonGroup>
    </form>
  );
};

export default DoctorProfile;
