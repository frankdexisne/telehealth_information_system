import { useParams } from "react-router-dom";
import {
  Loader,
  Tabs,
  Grid,
  rem,
  Group,
  Text,
  Button,
  Badge,
  Alert,
} from "@mantine/core";
import { useEncounter, putRequest } from "../../../hooks";
import ProfileHeader from "../PatientProfile/ProfileHeader";
import Attachments from "../PatientProfile/Attachments";
import {
  IconNotes,
  IconFile3d,
  IconUsersGroup,
  IconUser,
  IconLock,
  IconInfoCircle,
} from "@tabler/icons-react";
import ConsultationNotes from "./ConsultationNotes";
import classes from "../PatientProfile/ProfileHeader.module.css";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const PatientConsultation = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data, isFetched, refetch } = useEncounter({
    id: +id!,
  });

  if (isFetched) {
    const {
      patient_profile,
      patient_chief_complaint,
      data: encounter,
      patient_consultations,
    } = data;

    const lockHandler = () => {
      Swal.fire({
        title: "Lock this consultation?",
        text: "This record will be mark as completed, and unable to revert",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, lock it!",
      }).then((result) => {
        if (result.isConfirmed) {
          putRequest(`/encounters/${id}/lock-consultation`, {}).then(() => {
            refetch();
          });
        }
      });
    };

    return (
      <div>
        <Grid>
          <Grid.Col
            span={{ base: 12, md: 4, lg: 4 }}
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
          <Grid.Col
            pt={30}
            span={{ base: 12, md: 4, lg: 4 }}
            className="sm:pt-[-25px]"
          >
            <Group
              wrap="nowrap"
              gap={10}
              mt={5}
              className="flex lg:justify-start justify-center"
            >
              <IconUsersGroup
                stroke={1.5}
                size="1rem"
                className={classes.icon}
              />
              <Text fz="xs" c="dimmed">
                Civil Status:{" "}
                {patient_profile?.civil_status.toString()?.toUpperCase()}
              </Text>
            </Group>
            <Group
              wrap="nowrap"
              gap={10}
              mt={5}
              className="flex lg:justify-start justify-center"
            >
              <IconUser stroke={1.5} size="1rem" className={classes.icon} />
              <Text fz="xs" c="dimmed">
                Occupation:{" "}
                {patient_profile?.occupation.toString()?.toUpperCase()}
              </Text>
            </Group>
            <Group
              wrap="nowrap"
              gap={10}
              mt={5}
              className="flex lg:justify-start justify-center"
            >
              <IconUser stroke={1.5} size="1rem" className={classes.icon} />
              <Text fz="xs" c="dimmed">
                INFORMANT:{" "}
                {patient_profile?.informant?.toString()?.toUpperCase()}
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col
            pt={30}
            span={{ base: 12, md: 4, lg: 4 }}
            className="flex lg:justify-end justify-center"
          >
            {user.hpersonal_code === null && (
              <Alert
                variant="light"
                color="orange"
                title="iHOMIS Integration"
                icon={<IconInfoCircle />}
              >
                <h3 className="text-xs">
                  The Lock Consultation button is currently not displayed in
                  this area due to the account being unlinked from HOMIS. Please
                  contact the system administrator to bind the account.
                </h3>
              </Alert>
            )}
            {user.hpersonal_code !== null && (
              <>
                {encounter.is_active === 1 &&
                  patient_consultations.length > 0 && (
                    <Button onClick={lockHandler} leftSection={<IconLock />}>
                      LOCK CONSULTATION
                    </Button>
                  )}
                {encounter.is_active === 0 && (
                  <Badge color="green" size="xl">
                    LOCKED
                  </Badge>
                )}
              </>
            )}
          </Grid.Col>
        </Grid>

        <Grid my={6}>
          <Grid.Col span={12}>
            <h1 className="text-blue-500 text-lg font-bold md:text-start text-center">
              <span className="text-black">PATIENT CHIEF COMPLAINT</span> :{" "}
              {patient_chief_complaint?.chief_complaint
                ?.toString()
                ?.toUpperCase() || null}
            </h1>
          </Grid.Col>
        </Grid>

        <Tabs defaultValue="notes">
          <Tabs.List className="mb-3">
            <Tabs.Tab
              value="notes"
              leftSection={<IconNotes style={iconStyle} />}
            >
              Consultation Notes
            </Tabs.Tab>
            <Tabs.Tab
              value="attachments"
              leftSection={<IconFile3d style={iconStyle} />}
            >
              Attachments
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="notes">
            <ConsultationNotes
              encounter_id={+id!}
              is_active={encounter.is_active}
              onSubmit={() => refetch()}
            />
          </Tabs.Panel>
          <Tabs.Panel value="attachments">
            <Attachments chief_complaint_id={patient_chief_complaint.id} />
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  }

  return <Loader />;
};

export default PatientConsultation;
