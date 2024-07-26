import { useForm } from "react-hook-form";
import { TextInput, Select } from "../../../components/use-form-controls";
import { Button, ButtonGroup } from "@mantine/core";
import { AxiosResponse, AxiosError } from "axios";
import { postRequest, errorProvider } from "../../../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
interface ScheduleFormProps {
  onSubmit: (response: AxiosResponse) => void;
  onCancel: () => void;
}

interface PatientScheduleFormData {
  model_id: number;
  model_type: string;
  schedule_datetime: string;
  reason: string;
}

const ScheduleForm = ({ onSubmit, onCancel }: ScheduleFormProps) => {
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, handleSubmit, setError } = useForm<PatientScheduleFormData>({
    defaultValues: {
      reason: "REFFERED TO OPD",
    },
  });

  const saveScheduleHandler = (payload: PatientScheduleFormData) => {
    postRequest(`/patient-schedules`, payload)
      .then(successHandler)
      .catch(catchHandler);
  };

  const successHandler = (response: AxiosResponse) => {
    onSubmit(response);
    // queryClient.invalidateQueries({
    //   predicate: (query) => query.queryKey.includes(`tableData:departments`),
    // });
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<PatientScheduleFormData>(
      error,
      function (_errors: PatientScheduleFormData) {
        Object.keys(_errors).map((field) => {
          setError(field as keyof PatientScheduleFormData, {
            type: "custom",
            message:
              _errors[field as keyof PatientScheduleFormData]?.toString(),
          });
        });
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(saveScheduleHandler)}>
      <TextInput name="inquiry" control={control} label="Inquiry" isRequired />

      <TextInput name="remarks" control={control} label="Remarks" />

      <Select
        control={control}
        name="department_id"
        label="Department"
        data={departments}
      />
      <TextInput name="update" control={control} label="Update" />

      <TextInput
        type="datetime-local"
        name="schedule_datetime"
        control={control}
        label="Schedule Date & Time"
        isRequired
      />

      <TextInput
        disabled={true}
        control={control}
        name="reason"
        label="Reason"
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

export default ScheduleForm;
