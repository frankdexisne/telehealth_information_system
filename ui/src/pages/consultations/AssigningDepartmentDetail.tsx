import { Grid, Loader, Group, Text, Button, ButtonGroup } from "@mantine/core";
import { IconUsersGroup, IconUser } from "@tabler/icons-react";
import { useEncounter, putRequest } from "../../hooks";
import ProfileHeader from "../patients/PatientProfile/ProfileHeader";
import classes from "../patients/PatientProfile/ProfileHeader.module.css";
import { useForm } from "react-hook-form";
import { ApiSelect } from "../../components/use-form-controls";

interface AssigningDepartmentDetailProps {
  id: number;
  excludeId?: number;
  onSubmit: () => void;
}

interface AssigningFormProps {
  department_id: number;
}

const AssigningDepartmentDetail = ({
  id,
  excludeId,
  onSubmit,
}: AssigningDepartmentDetailProps) => {
  const { control, handleSubmit } = useForm<AssigningFormProps>();
  const { data, isFetching } = useEncounter({
    id: id,
  });

  if (isFetching) {
    return <Loader />;
  }

  const assigningFormHandler = (payload: AssigningFormProps) => {
    putRequest(`encounters/${id}/triage-to-department`, payload).then(() => {
      onSubmit();
    });
  };

  const { patient_profile, patient_chief_complaint } = data;

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
          <ProfileHeader
            name={patient_profile?.name}
            hpercode={patient_profile?.hpercode}
            contact_no={patient_profile?.contact_no}
            gender={patient_profile?.gender}
            dob={patient_profile?.dob}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 6 }}>
          <Group wrap="nowrap" gap={10} mt={30}>
            <IconUsersGroup stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              Civil Status:{" "}
              {patient_profile?.civil_status.toString()?.toUpperCase()}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={10} mt={5}>
            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              Occupation:{" "}
              {patient_profile?.occupation.toString()?.toUpperCase()}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={10} mt={5}>
            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              INFORMANT: {patient_profile?.informant?.toString()?.toUpperCase()}
            </Text>
          </Group>
        </Grid.Col>
      </Grid>
      <Grid my={6}>
        <Grid.Col span={12}>
          <h1 className="text-blue-500 text-lg font-bold md:text-start text-center">
            <span className="text-black">PATIENT CHIEF COMPLAINT</span> :{" "}
            {patient_chief_complaint?.chief_complaint
              .toString()
              .toUpperCase() || null}
          </h1>
        </Grid.Col>
      </Grid>
      <Grid my={6}>
        <Grid.Col span={12}>
          <form onSubmit={handleSubmit(assigningFormHandler)}>
            <ApiSelect
              api={`/selects/departments?is_doctor=1&exclude=${excludeId}`}
              label="Department"
              name="department_id"
              control={control}
              isRequired
            />
            <ButtonGroup className="mt-3">
              <Button type="submit">Submit</Button>
            </ButtonGroup>
          </form>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default AssigningDepartmentDetail;
