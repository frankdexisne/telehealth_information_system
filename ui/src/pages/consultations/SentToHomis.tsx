import { useParams } from "react-router-dom";
import useSentToHomis from "../../hooks/use-sent-to-homis";
import { Alert, Loader } from "@mantine/core";
import ProfileHeader from "../patients/PatientProfile/ProfileHeader";
import DemographicForm, {
  DemographicFormData,
} from "../patients/PatientCreate/DemographicForm";
import MatchPatients from "../patients/HomisPatients/MatchPatients";
import { useState } from "react";
import { postRequest, putRequest } from "../../hooks/use-http";
import Swal from "sweetalert2";
import { IconCircleCheck } from "@tabler/icons-react";
const SentToHomis = () => {
  const [hasMatch, setHasMatch] = useState(true);
  const { id } = useParams();
  const { data, isFetching, isError } = useSentToHomis({
    id: +id!,
  });

  if (isError) {
    return <div>Error rendering data</div>;
  }

  if (isFetching) {
    return <Loader />;
  }

  const { patient_chief_complaint, patient_profile, encounter, demographic } =
    data;

  const demographicSubmitHandler = (payload: DemographicFormData) => {
    postRequest(
      "/patient-chief-complaints/" +
        encounter.id +
        "/completing-data/demographic",
      payload
    ).then(() => {
      Swal.fire({
        title: "Success",
        text: "Already forward to iHOMIS",
        icon: "success",
      });
    });
  };

  return (
    <div>
      <div className="w-full flex">
        <div className="w-[50%]">
          <ProfileHeader
            name={patient_profile?.name}
            hpercode={patient_profile?.hpercode}
            contact_no={patient_profile?.contact_no}
            gender={patient_profile?.gender}
            dob={patient_profile?.dob}
          />
        </div>
        <div className="w-[50%] flex flex-col items-end justify-start">
          <h1 className="text-2xl text-blue-500 font-bold">MERGING TO HOMIS</h1>
        </div>
      </div>
      <div className={!hasMatch ? "hidden" : ""}>
        {patient_profile.hpercode === null && (
          <h1 className="text-2xl text-blue-500 mt-5">
            PLEASE SELECT THE COUNTER-PART PATIENT FROM HOMIS
          </h1>
        )}

        {patient_profile.hpercode !== null && (
          <Alert
            variant="light"
            color="green"
            title="Success"
            icon={<IconCircleCheck />}
            className="mb-3 mt-5"
          >
            Patient is already bind to iHOMIS
          </Alert>
        )}
        {patient_profile.hpercode === null && (
          <>
            <MatchPatients
              lname={patient_profile.lname}
              fname={patient_profile.fname}
              mname={patient_profile.mname}
              showMapButton={patient_profile?.hpercode === null}
              getResultCount={(count) => setHasMatch(count > 0)}
              onSelect={(hpercode) => {
                Swal.fire({
                  title: "Proceed Binding",
                  text: "Do you want to continue?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, bind this patient!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    putRequest(
                      `/patients/${patient_profile.id}/${hpercode}/bind`,
                      {
                        encounter_id: encounter.id,
                      }
                    ).then(() => {
                      Swal.fire({
                        title: "Success",
                        text: "Patient is already bind to iHOMIS record",
                        icon: "success",
                      });
                    });
                  }
                });
              }}
            />
          </>
        )}
      </div>
      {patient_profile.hpercode === null && (
        <div className={!hasMatch ? "w-full flex" : "hidden"}>
          <div className="w-full mt-10">
            <h1 className="text-2xl text-blue-500 mb-5">
              PLEASE PROVIDE PATIENT DEMOGRAPHIC
            </h1>
            <h1 className="text-sm text-blue-500 font-semibold mb-3">
              <span className="text-black">CHIEF COMPLAINT:</span>{" "}
              {patient_chief_complaint.chief_complaint
                ?.toString()
                ?.toUpperCase()}
            </h1>
            <h2>
              TELEHEALTH REGISTERED ADDRESS:{" "}
              <small>{patient_profile.address}</small>
            </h2>
            <DemographicForm
              onSubmit={demographicSubmitHandler}
              onBack={() => console.log("backed")}
              hideBackButton={true}
              submitLabel="Submit and Merge"
              values={{
                regcode: demographic?.regcode,
                provcode: demographic?.provcode,
                ctycode: demographic?.ctycode,
                brg: demographic?.brg,
                patstr: demographic?.patstr,
                patzip: demographic?.patzip,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SentToHomis;
