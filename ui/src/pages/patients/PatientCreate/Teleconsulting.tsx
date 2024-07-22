import { PatientSearch } from "../../../components/patients";
import PatientResult from "./PatientResult";
import { Grid, Paper, Title, Modal } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import PatientProfiling from "./PatientProfiling";
import moment from "moment";
import CreateConsultationDetail from "./CreateConsultationDetail";
import { postRequest } from "../../../hooks";
import { ChieftComplaintFormData } from "../../../types/chief-complaint";

export interface PatientFilter {
  hpercode?: string;
  fname?: string;
  mname?: string;
  lname?: string;
}
const Teleconsulting = () => {
  const [
    createPatient,
    { open: openCreatePatient, close: closeCreatePatient },
  ] = useDisclosure(false);
  const [patientId, setPatientId] = useState<number>();
  const [isProceed, setIsProceed] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<string>("facebook/messenger");
  const [patient, setPatient] = useState<PatientFilter>({
    hpercode: undefined,
    fname: undefined,
    mname: undefined,
    lname: undefined,
  });

  const saveChiefComplaintHandler = (payload: ChieftComplaintFormData) => {
    const plaformIds = {
      call: 1,
      "facebook/messenger": 2,
      radio: 3,
      viber: 4,
    };

    const platformId = 2;

    const formData = {
      ...payload,
      log_date: moment().format("YYYY-MM-DD"),
      log_time: moment().format("HH:mm"),
      informant: "Test",
      platform_id: platformId,
    };

    postRequest(`/patient-chief-complaints/${patientId}`, formData).then(() => {
      setPatientId(undefined);
      setIsProceed(false);
      setSelectedPlatform("facebook/messenger");
    });
  };
  return (
    <>
      {!isProceed && (
        <Grid>
          <Grid.Col span={3}>
            <Paper p="lg" shadow="xl">
              <Title size={18} mb={4}>
                Search Patient
              </Title>
              <PatientSearch
                type="teleconsult"
                onSubmit={(payload) => {
                  setPatient(payload);
                }}
              />
            </Paper>
          </Grid.Col>
          <Grid.Col span={9}>
            <PatientResult
              searched={
                patient.hpercode !== undefined ||
                patient.fname !== undefined ||
                patient.mname !== undefined ||
                patient.lname !== undefined
              }
              filter={patient}
              onCreate={() => {
                openCreatePatient();
              }}
              onSearch={() => {
                open();
              }}
              onSelect={(id) => {
                setPatientId(id);
                setIsProceed(true);
              }}
            />
          </Grid.Col>
        </Grid>
      )}
      {isProceed && patientId && (
        <CreateConsultationDetail
          id={patientId}
          onCancel={() => setIsProceed(false)}
          onSubmit={saveChiefComplaintHandler}
          platform="facebook/messenger"
        />
      )}

      <Modal
        opened={createPatient}
        onClose={closeCreatePatient}
        size="calc(100vw - 3rem)"
        title={<h3 className="text-2xl">New Patient Profile</h3>}
      >
        <PatientProfiling
          onSuccess={() => {
            close();
          }}
          lname={patient?.lname || ""}
          fname={patient?.fname || ""}
          mname={patient?.mname || ""}
          logData={{
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm"),
            informant: "Test",
          }}
          platform="facebook/messenger"
        />
      </Modal>
    </>
  );
};

export default Teleconsulting;
