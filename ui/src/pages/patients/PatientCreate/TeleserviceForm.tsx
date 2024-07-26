import {
  TextInput,
  Select,
  ApiSelect,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { Button, Grid, Switch } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { DemographicFormData } from "./DemographicForm";
import { useState } from "react";
import { plaformType } from "../../../components/patients";
import { postRequest } from "../../../hooks";
import { useNavigate } from "react-router-dom";
interface TeleserviceFormProps {
  log_datetime: string;
  inquiry: string;
}

type MergeTeleserviceFormData = TeleserviceFormProps & DemographicFormData;
const TeleserviceForm = ({
  logData,
}: {
  logData: any;
  platform: plaformType;
}) => {
  const navigate = useNavigate();
  const [notRespond, setNotRespond] = useState<boolean>(false);
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, handleSubmit } = useForm<MergeTeleserviceFormData>();

  const submitTeleservice = (payload: MergeTeleserviceFormData) => {
    const data = {
      ...payload,
      log_datetime: logData.date + " " + logData.time,
      not_respond: notRespond ? 1 : 0,
    };
    postRequest("/teleclerk-logs", data).then(() => {
      navigate("/teleclerk");
    });
  };

  return (
    <form onSubmit={handleSubmit(submitTeleservice)}>
      <Grid>
        <Grid.Col span={6}>
          <ApiSelect
            label="Platform"
            control={control}
            name="platform_id"
            api={`selects/platforms`}
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            name="informant"
            control={control}
            label="Informant"
            isRequired
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            type="date"
            name="log_date"
            control={control}
            label="Log Date"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            type="time"
            name="log_time"
            control={control}
            label="Time"
            isRequired
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              name="inquiry"
              control={control}
              label="Inquiry"
              isRequired
            />

            <TextInput name="remarks" control={control} label="Remarks" />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              control={control}
              name="department_id"
              label="Department"
              data={departments}
            />
            <TextInput name="update" control={control} label="Update" />
          </Grid.Col>

          <Grid.Col span={12}>
            <Switch
              label="Not Respond"
              size="md"
              onChange={(event) => setNotRespond(event.currentTarget.checked)}
            />

            <div className="mt-2">
              <Button type="submit">SUBMIT</Button>
            </div>
          </Grid.Col>
        </>
      </Grid>
    </form>
  );
};

export default TeleserviceForm;
