import PageHeader from "../../components/base/PageHeader";
import { PatientSearch } from "../../components/patients";
import PatientResult from "../patients/PatientCreate/PatientResult";
import { Grid } from "@mantine/core";
import { FilterType } from "../patients/PatientCreate";
import { useState } from "react";
const CreateReferralToOPD = () => {
  const [patientId, setPatientId] = useState<number>();
  const [patientFilter, setPatientFilter] = useState<FilterType | null>(null);
  const [showPatientResult, setShowPatientResult] = useState<boolean>(false);
  return (
    <>
      <PageHeader title="Create Referral to OPD" />
      <Grid>
        <Grid.Col span={3}>
          <PatientSearch
            type="teleserve-reffered"
            onSubmit={(payload) => {
              setPatientFilter(payload);
              setShowPatientResult(true);
            }}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          {showPatientResult && (
            <PatientResult
              searched={patientFilter !== null}
              filter={patientFilter!}
              onCreate={open}
              onSearch={() => {}}
              onSelect={(id) => {}}
            />
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};

export default CreateReferralToOPD;
