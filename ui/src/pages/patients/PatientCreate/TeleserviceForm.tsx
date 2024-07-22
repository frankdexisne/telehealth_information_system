import {
  TextInput,
  Select,
  ApiSelect,
} from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import {
  Button,
  Grid,
  Switch,
  TextInput as TextInputCore,
  Title,
  Modal,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { DemographicFormData } from "./DemographicForm";
import { useState } from "react";
import { LogData } from ".";
import { plaformType } from "../../../components/patients";
import { postRequest } from "../../../hooks";
import Swal from "sweetalert2";
import TeleservicePatientResult from "./TeleservicePatientResult";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconX } from "@tabler/icons-react";
import { ProfileHeaderProps } from "./TeleservicePatientResult";
import { useDisclosure } from "@mantine/hooks";
import ScheduleForm from "./ScheduleForm";
interface TeleserviceFormProps {
  log_datetime: string;
  inquiry: string;
}

type MergeTeleserviceFormData = TeleserviceFormProps & DemographicFormData;
interface SearchProps {
  hpercode: string | null;
  lname: string | null;
  fname: string | null;
  mname: string | null;
}
const TeleserviceForm = ({
  logData,
  platform,
}: {
  logData: LogData;
  platform: plaformType;
}) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState<SearchProps>({
    hpercode: null,
    lname: null,
    fname: null,
    mname: null,
  });
  const [withPatient, setWithPatient] = useState<boolean>(false);
  const [notRespond, setNotRespond] = useState<boolean>(false);
  const suffixes = useSelector((state: RootState) => state.select.suffixes);
  const regions = useSelector((state: RootState) => state.select.regions);
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const { control, handleSubmit, watch } = useForm<MergeTeleserviceFormData>();

  const selectedRegion = watch("regcode");
  const selectedProvince = watch("provcode");
  const selectedCity = watch("ctycode");

  const submitTeleservice = (payload: MergeTeleserviceFormData) => {
    const platformIds = {
      call: 1,
      "facebook/messenger": 2,
      radio: 3,
      viber: 4,
    };

    const data = {
      ...payload,
      log_date: logData.date,
      log_time: logData.time,
      informant: logData.informant,
      platform_id: platformIds[platform],
      log_datetime: logData.date + " " + logData.time,
      not_respond: notRespond ? 1 : 0,
    };
    postRequest("/teleclerk-logs", data).then(() => {
      Swal.fire({
        title: "Success",
        text: "Teleservice successfully save",
        icon: "success",
      }).then(() => {
        navigate("/teleclerk");
      });
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
              isRequired={withPatient}
            />
            <TextInput name="update" control={control} label="Update" />
          </Grid.Col>

          <Grid.Col span={12}>
            <Switch
              label="Not Respond"
              size="md"
              className={`${withPatient ? "hidden" : ""}`}
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
