import { Stepper } from "@mantine/core";
import { useState } from "react";
import PatientInformationForm, {
  ProfilingFormData,
} from "./PatientInformationForm";
import DemographicForm, { DemographicFormData } from "./DemographicForm";
import ChiefComplaintForm, {
  ChieftComplaintFormData,
} from "./ChiefComplaintForm";
import LogForm, { LogFormData } from "./LogForm";
import { Loader } from "@mantine/core";
import { postRequest } from "../../../hooks";
import { LogData } from ".";
import { plaformType } from "../../../components/patients";
import moment from "moment";

interface FormDataProps {
  log: LogFormData;
  profile: ProfilingFormData;
  demographic: DemographicFormData;
  chief_complaint: ChieftComplaintFormData;
}

interface PatientProfilingProps {
  onSuccess: () => void;
  lname: string;
  fname: string;
  mname: string;
  logData: LogData;
  platform: plaformType;
}

const PatientProfiling = ({
  onSuccess,
  lname,
  fname,
  mname,
  logData,
  platform,
}: PatientProfilingProps) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [formData, setFormData] = useState<FormDataProps>({
    log: {
      log_date: moment().format("YYYY-MM-DD"),
      log_time: moment().format("HH:mm"),
      informant: "",
      platform: "facebook/messenger",
    },
    profile: {
      lname: lname,
      fname: fname,
      mname: mname,
      dob: "",
      gender: null,
      is_pregnant: 0,
      occupation: "",
      civil_status: "",
      contact_no: "",
      informant: logData.informant,
      patempstat: "",
      patcstat: "",
    },
    demographic: {
      patstr: "",
      brg: "",
      ctycode: "",
      provcode: "",
      regcode: "",
      patzip: "",
    },
    chief_complaint: {
      chief_complaint: "",
      patient_condition_id: 1,
      consultation_status_id: 1,
    },
  });

  const submitHandler = (payload: FormDataProps) => {
    const platformIds = {
      call: 1,
      "facebook/messenger": 2,
      radio: 3,
      viber: 4,
    };
    const data = {
      ...payload.profile,
      ...payload.demographic,
      ...payload.chief_complaint,
      log_date: logData.date,
      log_time: logData.time,
      platform_id: platformIds[platform],
    };
    postRequest("/patients", data).then(() => {
      onSuccess();
    });
  };

  return (
    <>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step
          label="First step"
          description="Log Details"
          allowStepClick={false}
          allowStepSelect={false}
        >
          <LogForm
            values={formData.log}
            onSubmit={(payload) => {
              setFormData({
                ...formData,
                log: payload,
              });
              nextStep();
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Second step"
          description="Patient Information"
          allowStepClick={false}
          allowStepSelect={false}
        >
          <PatientInformationForm
            values={formData.profile}
            onBack={() => prevStep()}
            onSubmit={(payload) => {
              setFormData({
                ...formData,
                profile: payload,
              });
              nextStep();
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Third step"
          description="Demographic"
          allowStepClick={false}
          allowStepSelect={false}
        >
          <DemographicForm
            values={formData.demographic}
            onBack={() => prevStep()}
            onSubmit={(payload) => {
              setFormData({
                ...formData,
                demographic: payload,
              });
              nextStep();
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Fourth step"
          description="Chief Complaint"
          allowStepClick={false}
          allowStepSelect={false}
        >
          <ChiefComplaintForm
            values={formData.chief_complaint}
            onBack={() => prevStep()}
            onSubmit={(payload) => {
              submitHandler({
                ...formData,
                chief_complaint: payload,
              });
              // nextStep();
            }}
          />
        </Stepper.Step>
        <Stepper.Completed>
          <div className="w-full h-[100px] flex justify-center items-center">
            <Loader className="mr-2" /> Submitting ...
          </div>
        </Stepper.Completed>
      </Stepper>
    </>
  );
};

export default PatientProfiling;
