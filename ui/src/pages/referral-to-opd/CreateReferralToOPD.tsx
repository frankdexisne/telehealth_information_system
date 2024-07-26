import {
  TextInput,
  Button,
  Paper,
  Stepper,
  Title,
  Loader,
  Divider,
  InputLabel,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import PatientResult from "../patients/PatientCreate/PatientResult";
import PageHeader from "../../components/base/PageHeader";
import ProfileHeader from "../patients/PatientProfile/ProfileHeader";
import { usePatient } from "../../hooks";
import { IconCheck, IconSearch } from "@tabler/icons-react";
import ChiefComplaints from "../patients/PatientProfile/ChiefComplaints";
import ChiefComplaintWithLogForm from "../patients/PatientCreate/ChiefComplaintWithLogForm";
import AdditionalPatientFormData from "../patients/PatientCreate/AdditionaPatientFormData";
import {
  SearchViaHospNoType,
  SearchViaNameType,
} from "../../components/patients";

interface PatientSearchForm {
  hpercode: string;
  lname: string;
  fname: string;
  mname: string;
}

interface PatientSearchProps {
  onSearch: (payload: PatientSearchForm) => void;
}

const DemographicItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center">
      <InputLabel className="w-[30%]">{label}</InputLabel>
      <TextInput w="70%" variant="unstyled" value={value} fw="bold" />
    </div>
  );
};

const PatientInformation = ({ id }: { id: number }) => {
  const { data, isFetching } = usePatient({
    id: id,
  });

  if (isFetching) {
    return <Loader />;
  }

  const { patient_profile } = data;
  return (
    <>
      <ProfileHeader
        name={patient_profile?.name}
        hpercode={patient_profile?.hpercode}
        contact_no={patient_profile?.contact_no}
        gender={patient_profile?.gender}
        dob={patient_profile?.dob}
      />
      <Divider label="Demographics" my={10} />
      <DemographicItem label="Region" value="Bicol Region" />
      <DemographicItem label="Province" value="Albay" />
      <DemographicItem label="City" value="Legazpi City" />
      <DemographicItem label="Barangay" value="Maoyod" />
    </>
  );
};

const PatientSearch = ({ onSearch }: PatientSearchProps) => {
  const [searchBy, setSearchBy] = useState<"hospital_no" | "name" | null>(null);
  const form = useForm<PatientSearchForm>({
    mode: "controlled",
    initialValues: {
      hpercode: "",
      lname: "",
      fname: "",
      mname: "",
    },
  });

  form.watch("hpercode", ({ value }) => {
    const formValues = form.getValues();
    if (
      formValues.fname !== "" ||
      formValues.lname !== "" ||
      formValues.hpercode !== "" ||
      formValues.mname !== ""
    ) {
      if (value !== "") {
        setSearchBy("hospital_no");
      } else {
        setSearchBy("name");
      }
    } else {
      setSearchBy(null);
    }
  });

  const nameCallback = ({ value }: { value: string }) => {
    const formValues = form.getValues();
    if (
      formValues.fname !== "" ||
      formValues.lname !== "" ||
      formValues.hpercode !== "" ||
      formValues.mname !== ""
    ) {
      if (value !== "") {
        setSearchBy("name");
      } else {
        setSearchBy("hospital_no");
      }
    } else {
      setSearchBy(null);
    }
  };

  form.watch("lname", nameCallback);
  form.watch("fname", nameCallback);
  form.watch("mname", nameCallback);

  return (
    <form onSubmit={form.onSubmit((values) => onSearch(values))}>
      <TextInput
        withAsterisk={searchBy === "hospital_no"}
        disabled={searchBy === "name"}
        label="Hospital Number"
        placeholder="Hospital Number"
        key={form.key("hpercode")}
        {...form.getInputProps("hpercode")}
      />

      <div className="w-full flex py-1">
        <div className="w-[50%] pr-1">
          <TextInput
            disabled={searchBy === "hospital_no"}
            label="Lastname"
            placeholder="Lastname"
            key={form.key("lname")}
            {...form.getInputProps("lname")}
          />
        </div>
        <div className="w-[50%] pl-1">
          <TextInput
            disabled={searchBy === "hospital_no"}
            label="Firstname"
            placeholder="Firstname"
            key={form.key("fname")}
            {...form.getInputProps("fname")}
          />
        </div>
      </div>

      <div className="w-full flex py-1">
        <div className="w-[50%] pr-1">
          <TextInput
            disabled={searchBy === "hospital_no"}
            label="Middlename"
            placeholder="Middlename"
            key={form.key("mname")}
            {...form.getInputProps("mname")}
          />
        </div>
        <div className="w-[50%] flex items-end pl-1">
          <Button w="100%" type="submit">
            SEARCH PATIENT
          </Button>
        </div>
      </div>
    </form>
  );
};

const CreateReferralToOPD = () => {
  const [active, setActive] = useState(0);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [fromHOMIS, setFromHOMIS] = useState<boolean>(false);
  const [hpercode, setHpercode] = useState<string>();
  const [selectedId, setSelectedId] = useState<number>();
  const [searchFilter, setSeachFilter] = useState<
    PatientSearchForm | SearchViaHospNoType | SearchViaNameType
  >();
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <div>
      <div className="w-full flex">
        <div className="w-[50%]">
          <PageHeader title="NEW TELECONSULTATION PATIENT" />
        </div>
        <div className="w-[50%] flex justify-end items-center">
          {/* <Title size={18}>(Teleconsultation)</Title> */}
        </div>
      </div>
      <Paper shadow="xl" p="lg">
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="First step" description="Search Patient">
            <div className="flex justify-center">
              <div className="w-[50%]">
                <PatientSearch
                  onSearch={(payload) => {
                    setSeachFilter(payload);
                    nextStep();
                  }}
                />
              </div>
            </div>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Select Patient">
            {searchFilter && (
              <PatientResult
                filter={searchFilter}
                searched={searchFilter !== null}
                onCreate={() => {
                  nextStep();

                  setFromHOMIS(false);
                  setSelectedId(undefined);
                }}
                onSelect={(id) => {
                  nextStep();
                  setFromHOMIS(false);
                  setSelectedId(id);
                }}
                onSelectFromHOMIS={(hpercode) => {
                  setHpercode(hpercode);
                  setSelectedId(undefined);
                  setFromHOMIS(true);
                  nextStep();
                }}
                onSearch={() => {}}
              />
            )}
            <div className="flex justify-center py-3">
              <Button onClick={() => prevStep()} w={300} color="gray">
                SEARCH AGAIN
              </Button>
            </div>
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Completing Details">
            {!fromHOMIS && (
              <div className="w-full flex min-h-[500px]">
                <div className="w-[30%]">
                  <div className="mb-5" />
                  {selectedId && <PatientInformation id={selectedId} />}
                  <Divider my={20} />
                  <>
                    <Button
                      w="100%"
                      my={2}
                      leftSection={!isFollowUp ? <IconCheck /> : undefined}
                      color={!isFollowUp ? "green" : "blue"}
                      onClick={() => setIsFollowUp(false)}
                    >
                      NEW CHIEF COMPLAINT
                    </Button>
                    <Button
                      w="100%"
                      my={2}
                      color={isFollowUp ? "green" : "blue"}
                      leftSection={isFollowUp ? <IconCheck /> : undefined}
                      onClick={() => setIsFollowUp(true)}
                    >
                      FOLLOW UP
                    </Button>

                    <Divider my={10} />
                    <Button
                      color="gray"
                      w="100%"
                      mt={2}
                      leftSection={<IconSearch />}
                      onClick={() => setActive(0)}
                    >
                      SEARCH AGAIN
                    </Button>
                  </>
                </div>
                <div className="w-[70%] pl-5">
                  {isFollowUp && (
                    <>
                      <ChiefComplaints
                        patient_profile_id={selectedId!}
                        onCreate={() => {}}
                        showAction={true}
                        platform="facebook/messenger"
                        hideAddButton
                      />
                    </>
                  )}
                  {!isFollowUp && (
                    <>
                      <Title mt={20} mb={10} size={18}>
                        Patient Chief Complaint Details
                      </Title>
                      <ChiefComplaintWithLogForm
                        onBack={() => {}}
                        submitLabel="SUBMIT"
                        backLabel="CANCEL"
                        onSubmit={(payload) => console.log(payload)}
                        hideBackButton
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {fromHOMIS && (
              <>
                {hpercode && (
                  <AdditionalPatientFormData
                    hpercode={hpercode}
                    onSubmit={() => {}}
                    onCancel={() => {
                      setActive(0);
                    }}
                  />
                )}
              </>
            )}
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </Paper>
    </div>
  );
};

export default CreateReferralToOPD;
