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
import { useEffect, useState } from "react";
import { plaformType } from "../../../components/patients";
import { postRequest, putRequest } from "../../../hooks";
import { useNavigate, useParams } from "react-router-dom";
interface TeleserviceFormProps {
  inquiry?: string;
  platform_id?: number;
  informant?: string;
  log_date?: string;
  log_time?: string;
  department_id?: string;
  remarks?: string;
  update?: string;
}

type MergeTeleserviceFormData = TeleserviceFormProps & DemographicFormData;
const TeleserviceForm = ({
  logData,
  inquiry,
  platform_id,
  informant,
  log_date,
  log_time,
  department_id,
  remarks,
  update,
}: {
  logData: any;
  platform: plaformType;
  inquiry: string;
  platform_id: number;
  informant: string;
  log_date: string;
  log_time: string;
  department_id: string;
  remarks: string;
  update: string;
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [notRespond, setNotRespond] = useState<boolean>(false);
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, handleSubmit, setValue } =
    useForm<MergeTeleserviceFormData>();

  const submitTeleservice = (payload: MergeTeleserviceFormData) => {
    const data = {
      ...payload,
      log_datetime: logData.date + " " + logData.time,
      not_respond: notRespond ? 1 : 0,
    };
    setSubmitting(true);
    if (id) {
      putRequest("/teleclerk-logs/" + id, data).then(() => {
        navigate("/teleclerk");
        setSubmitting(false);
      });
    } else {
      postRequest("/teleclerk-logs", data).then(() => {
        navigate("/teleclerk");
        setSubmitting(false);
      });
    }
  };

  useEffect(() => {
    if (platform_id) setValue("platform_id", platform_id);
    if (inquiry) setValue("inquiry", inquiry);
    if (informant) setValue("informant", informant);
    if (log_date) setValue("log_date", log_date);
    if (log_time) setValue("log_time", log_time);
    if (department_id) setValue("department_id", department_id);
    if (remarks) setValue("remarks", remarks);
    if (update) setValue("update", update);
  }, [
    platform_id,
    inquiry,
    informant,
    log_date,
    log_time,
    department_id,
    remarks,
    update,
  ]);

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
              <Button type="submit" loading={submitting}>
                SUBMIT
              </Button>
            </div>
          </Grid.Col>
        </>
      </Grid>
    </form>
  );
};

export default TeleserviceForm;
