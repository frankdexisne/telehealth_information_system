import { Grid, Paper, Title } from "@mantine/core";
import { PatientSearch } from "../../../components/patients";
import PatientResult from "./PatientResult";
import { PatientFilter } from "./Teleconsulting";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const Referral = () => {
  const [
    createPatient,
    { open: openCreatePatient, close: closeCreatePatient },
  ] = useDisclosure(false);
  const [patient, setPatient] = useState<PatientFilter>({
    hpercode: undefined,
    fname: undefined,
    mname: undefined,
    lname: undefined,
  });
  const [patientId, setPatientId] = useState<number>();
  const [isProceed, setIsProceed] = useState<boolean>(false);

  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper shadow="xl" p="lg">
          <Title size={18} mb={5}>
            Patient Search
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
  );
};

export default Referral;
