import Select from "../../../components/use-form-controls/Select";
import { Textarea, ButtonGroup, Button } from "@mantine/core";
import { useForm } from "react-hook-form";

interface ReferralFormProps {
  referral_type: string;
  reason: string;
}

interface ReferralProps {
  onSubmit: (payload: ReferralFormProps) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const Referral = ({
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
}: ReferralProps) => {
  const { control, handleSubmit, register } = useForm<ReferralFormProps>();

  const referalSubmitHandler = (payload: ReferralFormProps) => {
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(referalSubmitHandler)}>
      <Select
        control={control}
        name="referral_type"
        label="Referral Type"
        isRequired
      />
      <Textarea
        {...register("reason", {
          required: {
            value: true,
            message: "This field is required",
          },
        })}
      />
      <ButtonGroup>
        <Button onClick={onCancel} color="gray">
          {cancelLabel ? cancelLabel : "Cancel"}
        </Button>
        <Button type="submit">{submitLabel ? submitLabel : "Submit"}</Button>
      </ButtonGroup>
    </form>
  );
};

export default Referral;
