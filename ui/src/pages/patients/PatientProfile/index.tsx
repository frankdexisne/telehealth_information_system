import { Grid, Loader, Tabs, Title, rem, Button, Modal } from "@mantine/core";
import {
  IconInfoCircle,
  IconListCheck,
  IconAddressBook,
  IconLink,
} from "@tabler/icons-react";
import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import PersonalDetails from "./PersonalDetails";
import DemographicDetails from "./DemographicDetails";
import { useParams } from "react-router-dom";
import usePatient from "../../../hooks/use-patient";
import { useDisclosure } from "@mantine/hooks";
import PatientBinding from "./PatientBinding";
import Swal from "sweetalert2";
import { PATIENT_BIND } from "../../../interfaces/PermissionList";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Encounters from "./Encounters";

interface FilterMappingProps {
  lname: string;
  fname: string;
  mname: string;
  gender: "male" | "female";
  address?: string;
}

const PatientProfile = () => {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const permissions = useSelector((state: RootState) => state.auth.permissions);

  const [mappingFIlter, setMappingFilter] = useState<FilterMappingProps>({
    lname: "",
    fname: "",
    mname: "",
    gender: "male",
    address: "",
  });

  const { data, isFetching, isError, refetch } = usePatient({
    id: +id!,
  });
  const iconStyle = { width: rem(24), height: rem(24) };

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <h1>Unable to load data</h1>;
  }

  const { patient_profile, demographics } = data;

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <ProfileHeader
            name={patient_profile?.name}
            hpercode={patient_profile?.hpercode}
            contact_no={patient_profile?.contact_no}
            gender={patient_profile?.gender}
            dob={patient_profile?.dob}
          />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex flex-col items-end"
        >
          <Title className="text-blue-500 text-2xl">Patient Information</Title>

          {permissions.includes(PATIENT_BIND) && (
            <Button
              leftSection={<IconLink />}
              w={180}
              onClick={() => {
                setMappingFilter({
                  lname: patient_profile.lname,
                  fname: patient_profile.fname,
                  mname: patient_profile.mname,
                  gender: patient_profile.gender,
                  address: patient_profile.address,
                });
                open();
              }}
            >
              Patient Binding
            </Button>
          )}
        </Grid.Col>
      </Grid>
      <Tabs defaultValue="personal_details" className="mt-3">
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="personal_details"
            leftSection={<IconInfoCircle style={iconStyle} />}
          >
            Personal Details
          </Tabs.Tab>
          <Tabs.Tab
            value="demographics"
            leftSection={<IconAddressBook style={iconStyle} />}
          >
            Demographics
          </Tabs.Tab>
          <Tabs.Tab
            value="consultations"
            leftSection={<IconListCheck style={iconStyle} />}
          >
            Encounters
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal_details">
          <PersonalDetails
            personalData={{
              lname: patient_profile?.lname,
              fname: patient_profile?.fname,
              mname: patient_profile?.mname,
              suffix: patient_profile.suffix,
              dob: patient_profile?.dob,
              gender: patient_profile?.gender,
              is_pregnant: patient_profile?.is_pregnant,
              occupation: patient_profile?.occupation,
              civil_status: patient_profile?.civil_status,
              patcstat: patient_profile?.patcstat,
              contact_no: patient_profile?.contact_no,
              informant: patient_profile?.informant,
              patempstat: patient_profile?.patempstat,
            }}
            hideBackButton
          />
        </Tabs.Panel>
        <Tabs.Panel value="demographics">
          <DemographicDetails
            demographicData={{
              patstr: demographics?.patstr,
              brg: demographics?.brg,
              ctycode: demographics?.ctycode,
              provcode: demographics?.provcode,
              regcode: demographics?.regcode,
              patzip: "",
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="consultations">
          <Encounters />
        </Tabs.Panel>
      </Tabs>

      {permissions.includes(PATIENT_BIND) && (
        <Modal
          opened={opened}
          onClose={close}
          title="MAP/BIND TO HOMIS"
          size="80%"
          centered
        >
          <PatientBinding
            id={+id!}
            gender={mappingFIlter.gender}
            lname={mappingFIlter.lname}
            fname={mappingFIlter.fname}
            mname={mappingFIlter.mname}
            address={mappingFIlter.address}
            onCancel={() => close()}
            hasAddress={demographics !== null}
            onBinded={() =>
              Swal.fire({
                title: "Success",
                text: "Patient is already bind to iHOMIS",
                icon: "success",
              }).then(() => refetch())
            }
            showMapButton={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default PatientProfile;
