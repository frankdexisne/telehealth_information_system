import { useForm } from "react-hook-form";
import { TextInput, ApiSelect } from "../../../components/use-form-controls";
import { Button, ButtonGroup } from "@mantine/core";
import { postRequest, errorProvider } from "../../../hooks/use-http";
import { AxiosResponse } from "axios";
import ProfileHeader from "../PatientProfile/ProfileHeader";
import { useHomisPatient } from "../../../hooks";
import moment from "moment";
import { useEffect, useState } from "react";

interface AdditionalPatientReferralFormData {
  date: string;
  contact_no: string;
  occupation: string;
  informant: string;
  patempstat: string;
  chief_complaint: string;
  patient_condition_id: number;
  consultation_status_id: number;
}

interface AdditionalPatientReferralFormDataProps {
  hpercode: string | null;
  onCancel: () => void;
  onSubmit: (res: AxiosResponse) => void;
}

const AdditionalPatientReferralFormData = ({
  hpercode,
  onCancel,
  onSubmit,
}: AdditionalPatientReferralFormDataProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [disableDepartment, setDisableDepartment] = useState<boolean>(true);
  const { control, handleSubmit, setError, watch } =
    useForm<AdditionalPatientReferralFormData>();
  const additionalFormHandler = (
    payload: AdditionalPatientReferralFormData
  ) => {
    setSubmitting(true);
    postRequest("/patients/" + hpercode + "/clone-to-telehealth", payload)
      .then((res) => {
        setSubmitting(false);
        onSubmit(res);
      })
      .catch((error) => {
        setSubmitting(false);
        errorProvider<AdditionalPatientReferralFormData>(
          error,
          function (_errors: AdditionalPatientReferralFormData) {
            Object.keys(_errors).map((field) => {
              setError(field as keyof AdditionalPatientReferralFormData, {
                type: "custom",
                message:
                  _errors[
                    field as keyof AdditionalPatientReferralFormData
                  ]?.toString(),
              });
            });
          }
        );
      });
  };

  const { data } = useHomisPatient({
    hpercode: hpercode!,
  });

  const watchDate = watch("date");

  useEffect(() => {
    console.log(watchDate);
    if (watchDate !== undefined && watchDate !== null) {
      setDisableDepartment(false);
      console.log("enable");
    } else {
      setDisableDepartment(true);
      console.log("disable");
    }
  }, [watchDate]);

  return (
    <form onSubmit={handleSubmit(additionalFormHandler)}>
      <ProfileHeader
        name={`${data?.hperson?.patlast}, ${data?.hperson.patfirst} ${data?.hperson.patmiddle}`}
        hpercode={hpercode}
        contact_no="NOT SET"
        gender={data?.patsex === "M" ? "male" : "female"}
        dob={data?.patbdate?.toString()?.replace("00:00:00", "")}
      />
      <div className="mb-5" />

      <TextInput
        name="contact_no"
        label="Contact Number"
        control={control}
        isRequired
      />
      <TextInput
        name="informant"
        label="FB Informant"
        control={control}
        isRequired
      />
      <TextInput
        type="date"
        name="date"
        label="Schedule Date"
        control={control}
        isRequired
        min={moment().format("YYYY-MM-DD")}
      />
      <ApiSelect
        api="selects/departments?is_doctor=1"
        control={control}
        name="department_id"
        label="Department"
        disabled={disableDepartment}
      />
      <ButtonGroup className="mt-3">
        <Button color="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Submit
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default AdditionalPatientReferralFormData;
