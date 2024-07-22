import { Button, Grid, Paper, Card, Avatar, Text, rem } from "@mantine/core";
import { IconArrowRight, IconLockCancel } from "@tabler/icons-react";
import MatchPatients from "../HomisPatients/MatchPatients";
import MalePatientAvatar from "../../../assets/male_patient_avatar.png";
import FemalePatientAvatar from "../../../assets/female_patient_avatar.png";
import { putRequest } from "../../../hooks";
interface PatientBindingProps {
  id: number;
  lname: string;
  fname: string;
  mname: string;
  onCancel: () => void;
  title?: string;
  address?: string;
  gender: "male" | "female";
  hasAddress?: boolean;
  showMapButton?: boolean;
  onBinded?: () => void;
}

const PatientBinding = ({
  id,
  lname,
  fname,
  mname,
  onCancel,
  address,
  gender,
  onBinded,
  hasAddress = false,
  showMapButton = false,
}: PatientBindingProps) => {
  const iconStyle = { width: rem(50), height: rem(50) };
  return (
    <div className="w-full">
      <Grid>
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Avatar
              src={
                gender.toString().toUpperCase() === "MALE"
                  ? MalePatientAvatar
                  : FemalePatientAvatar
              }
              size={120}
              radius={120}
              mx="auto"
            />
            <Text ta="center" fz="sm" fw={500} mt="md">
              {lname}, {fname} {mname}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              Telehealth Patient
            </Text>

            <Button
              variant="default"
              fullWidth
              mt="md"
              onClick={onCancel}
              leftSection={<IconLockCancel />}
            >
              Cancel Binding
            </Button>
          </Paper>
        </Grid.Col>
        <Grid.Col
          className="flex justify-center items-center"
          span={{ base: 12, lg: 1 }}
        >
          <IconArrowRight
            style={iconStyle}
            className="font-bold rotate-90 md:rotate-0"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card className="flex border shadow-lg  min-h-[300px]">
            <MatchPatients
              lname={lname}
              fname={fname}
              mname={mname}
              address={address}
              onSelect={(hpercode) =>
                putRequest(`/patients/${id}/${hpercode}/bind`, {}).then(() => {
                  if (onBinded) onBinded();
                })
              }
              hasAddress={hasAddress}
              showMapButton={showMapButton}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default PatientBinding;
