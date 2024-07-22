import { Grid, ButtonGroup, Button } from "@mantine/core";
import { BaseDispositionFormProps } from ".";
import { TextInput } from "../../../../components/use-form-controls";
import { Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest } from "../../../../hooks";
import Swal from "sweetalert2";
import moment from "moment";

interface FaceToFaceFormData {
  time: string;
  date: string;
  reason: string;
  onSubmit: () => void;
}

const FaceToFace = ({
  encounter_id,
  onSubmit,
}: BaseDispositionFormProps & { onSubmit: () => void }) => {
  const { control, handleSubmit, register } = useForm<FaceToFaceFormData>();

  const patientScheduleHandler = (payload: FaceToFaceFormData) => {
    putRequest(
      `/patient-consultations/${encounter_id}/create-schedule`,
      payload
    ).then(() =>
      Swal.fire({
        title: "Success",
        text: "Schedule has been set",
        icon: "success",
      }).then(() => {
        onSubmit();
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(patientScheduleHandler)}>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <TextInput
            control={control}
            type="time"
            name="time"
            isRequired
            label="Time"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <TextInput
            control={control}
            type="date"
            name="date"
            isRequired
            label="Date"
            min={moment().format("YYYY-MM-DD")}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col>
          <Textarea
            placeholder="Indicate the reason"
            label="Reason for face to face"
            autosize
            minRows={3}
            {...register("reason", {
              required: {
                value: true,
                message: "Reason is required",
              },
            })}
          />
        </Grid.Col>
      </Grid>
      <ButtonGroup mt={10}>
        <Button type="submit">Set Schedule</Button>
      </ButtonGroup>
    </form>
  );
};

export default FaceToFace;
