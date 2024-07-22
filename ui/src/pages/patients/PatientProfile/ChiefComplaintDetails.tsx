import { useParams } from "react-router-dom";
import { useChiefComplaint } from "../../../hooks";
import ProfileHeader from "./ProfileHeader";
import { Loader, Grid, Tabs, rem } from "@mantine/core";
import { IconFile3d, IconPrescription } from "@tabler/icons-react";
import Attachments from "./Attachments";
import Perscriptions from "./Perscriptions";

const ChiefComplaintDetails = () => {
  const iconStyle = { width: rem(24), height: rem(24) };
  const { id } = useParams();
  const chiefComplaintId = id ? parseInt(id) : undefined;

  const { data, isFetched } = useChiefComplaint({
    id: +chiefComplaintId!,
  });

  if (isFetched) {
    const { patient_profile, data: patient_chief_complaint } = data;

    return (
      <div>
        <Grid>
          <Grid.Col
            span={{ base: 12, md: 6, lg: 6 }}
            className="flex lg:justify-start justify-center"
          >
            <ProfileHeader
              name={patient_profile?.name}
              hpercode={patient_profile?.hpercode}
              contact_no={patient_profile?.contact_no}
              gender={patient_profile?.gender}
              dob={patient_profile?.dob}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}></Grid.Col>
        </Grid>

        <Grid my={6}>
          <Grid.Col span={12}>
            <h1 className="text-blue-500 text-lg font-bold md:text-start text-center">
              PATIENT CHIEF COMPLAINT :{" "}
              {patient_chief_complaint?.chief_complaint
                .toString()
                .toUpperCase() || null}
            </h1>
          </Grid.Col>
        </Grid>
        <Tabs defaultValue="consultations">
          <Tabs.List className="mb-3">
            <Tabs.Tab
              value="attachments"
              leftSection={<IconFile3d style={iconStyle} />}
            >
              Attachments
            </Tabs.Tab>
            <Tabs.Tab
              value="prescriptions"
              leftSection={<IconPrescription style={iconStyle} />}
            >
              Prescriptions
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="attachments">
            <Attachments chief_complaint_id={patient_chief_complaint?.id} />
          </Tabs.Panel>
          <Tabs.Panel value="prescriptions">
            <Perscriptions chief_complaint_id={patient_chief_complaint?.id} />
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  }

  return <Loader />;
};

export default ChiefComplaintDetails;
