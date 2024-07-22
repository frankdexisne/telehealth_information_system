import ProfileHeader from "../PatientProfile/ProfileHeader";
import ChiefComplaints from "../PatientProfile/ChiefComplaints";
import ChiefComplaintWithLogForm, {
  ChieftComplaintWithLogFormData,
} from "./ChiefComplaintWithLogForm";
import { useEffect, useState } from "react";
import { Grid, Loader, Paper, Button, Stepper } from "@mantine/core";
import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
import MatchPatients from "../HomisPatients/MatchPatients";
import DemographicForm from "./DemographicForm";
import { postRequest, putRequest, usePatient } from "../../../hooks";
import Swal from "sweetalert2";
import { plaformType } from "../../../components/patients";
import LogForm, { LogFormData } from "./LogForm";
import moment from "moment";

interface CreateConsultationDetailProps {
  id: number;
  onCancel: () => void;
  onSubmit: (payload: ChieftComplaintFormData) => void;
  platform: plaformType;
}

const CreateConsultationDetail = ({
  id,
  onCancel,
  onSubmit,
  platform,
}: CreateConsultationDetailProps) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { data, isFetching, isError, refetch } = usePatient({
    id: id,
  });
  const [hideBinding, setHidingBinding] = useState(false);
  const [hasDemographic, setHasDemographic] = useState(false);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    if (data && data?.demographics) {
      setHasDemographic(data?.demographics !== null);
    }
  }, [data]);

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <h1>Unable to load data</h1>;
  }

  const { patient_profile } = data;

  return (
    <>
      <Grid className="w-full">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper shadow="xs" p="xl">
            <ProfileHeader
              name={patient_profile?.name}
              hpercode={patient_profile?.hpercode}
              contact_no={patient_profile?.contact_no}
              gender={patient_profile?.gender}
              dob={patient_profile?.dob}
            />

            <Button
              onClick={onCancel}
              className="w-full mt-5"
              leftSection={<IconSearch />}
            >
              SEARCH AGAIN
            </Button>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          {!hasDemographic && !patient_profile.hpercode && (
            <Paper shadow="xs" p="xl" className="border flex flex-col">
              <div>
                <div className={hideBinding ? `hidden` : `flex`}>
                  <IconInfoCircle className="mr-2" />{" "}
                  <span className="text-lg font-semibold">
                    Note:{" "}
                    <span className="text-sm text-slate-700">
                      TIS detech that this patient has no Hospital number, this
                      means that the patient is not yet linked to iHOMIS, Please
                      check if this patient exist in iHOMIS and Bind to proceed
                      to create a follow up.
                    </span>
                  </span>
                </div>

                <div className={hideBinding ? `hidden` : ``}>
                  <MatchPatients
                    lname={patient_profile?.lname}
                    fname={patient_profile?.fname}
                    mname={patient_profile?.mname}
                    address={patient_profile?.address}
                    getResultCount={(count) => setHidingBinding(count === 0)}
                    onSelect={(hpercode) => {
                      putRequest(
                        `/patients/${patient_profile.id}/${hpercode}/bind`,
                        {}
                      ).then(() => {
                        Swal.fire({
                          title: "Success",
                          text: "Patient is already bind to iHOMIS record",
                          icon: "success",
                        }).then(() => {
                          refetch();
                        });
                      });
                    }}
                  />
                </div>

                {!hasDemographic && hideBinding && (
                  <div>
                    <span className="text-lg font-semibold">
                      Note:{" "}
                      <span className="text-sm text-slate-700">
                        Please provide demographic details
                      </span>
                    </span>
                    <DemographicForm
                      onSubmit={(data) => {
                        // console.log("data");
                        postRequest(
                          `/demographics/${patient_profile.id}`,
                          data
                        ).then(() => {
                          Swal.fire({
                            title: "Success",
                            text: "Demographic has been saved",
                            icon: "success",
                          }).then(() => {
                            setHasDemographic(true);
                          });
                        });
                      }}
                      submitLabel="Save and Proceed"
                      hideBackButton={true}
                    />
                  </div>
                )}
              </div>
            </Paper>
          )}

          {hasDemographic && !creating && (
            <ChiefComplaints
              patient_profile_id={id}
              onCreate={() => setCreating(true)}
              showAction={true}
              platform={platform}
            />
          )}

          {hasDemographic && creating && (
            <Paper shadow="xs" p="xl">
              <ChiefComplaintWithLogForm
                onBack={() => {
                  setCreating(false);
                }}
                submitLabel="CREATE"
                backLabel="CANCEL"
                onSubmit={onSubmit}
              />
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};

export default CreateConsultationDetail;
