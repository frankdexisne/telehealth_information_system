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
import { LogData } from ".";
import { plaformType } from "../../../components/patients";
import { postRequest } from "../../../hooks";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
interface TeleserviceFormProps {
  log_datetime: string;
  inquiry: string;
}

type MergeTeleserviceFormData = TeleserviceFormProps & DemographicFormData;

const TeleserviceForm = ({
  logData,
  platform,
}: {
  logData: LogData;
  platform: plaformType;
}) => {
  const navigate = useNavigate();
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
      <Switch
        label="With Patient Details and Demographic"
        size="md"
        className="my-3"
        onChange={(event) => setWithPatient(event.currentTarget.checked)}
      />
      <Grid>
        <Grid.Col span={{ base: 12, lg: 9 }}>
          <TextInput
            name="inquiry"
            control={control}
            label="Inquiry"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <Select
            control={control}
            name="department_id"
            label="Department"
            data={departments}
            isRequired={withPatient}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <TextInput name="remarks" control={control} label="Remarks" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <TextInput name="update" control={control} label="Update" />
        </Grid.Col>
      </Grid>

      {withPatient && (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, lg: 3 }}>
              <TextInput
                name="patient_lname"
                control={control}
                label="Lastname"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3 }}>
              <TextInput
                name="patient_fname"
                control={control}
                label="Firstname"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3 }}>
              <TextInput
                name="patient_mname"
                control={control}
                label="Middlename"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3 }}>
              <Select
                control={control}
                name="suffix"
                label="Suffix"
                data={suffixes}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <Select
                control={control}
                name="regcode"
                label="Region"
                isRequired
                data={regions}
                defaultValue="05"
                value="05"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="Province"
                control={control}
                name="provcode"
                api={`selects/provinces?regcode=${selectedRegion || "05"}`}
                isRequired
                defaultValue="0505"
                value="0505"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="City"
                control={control}
                name="ctycode"
                api={`selects/cities?provcode=${selectedProvince || "0505"}`}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <ApiSelect
                label="Barangay"
                control={control}
                name="brg"
                api={`selects/barangays?ctycode=${selectedCity}`}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
              <TextInput name="patstr" control={control} label="Street" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <TextInput name="patzip" control={control} label="Zipcode" />
            </Grid.Col>
          </Grid>
        </>
      )}

      <Switch
        label="Not Respond"
        size="md"
        className={`my-3 ${withPatient ? "hidden" : ""}`}
        onChange={(event) => setNotRespond(event.currentTarget.checked)}
      />

      <div className="mt-2">
        <Button type="submit">SUBMIT</Button>
      </div>
    </form>
  );
};

export default TeleserviceForm;
