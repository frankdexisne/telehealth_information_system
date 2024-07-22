import { Avatar, Text, Group } from "@mantine/core";
import { IconPhoneCall, IconId, IconUser } from "@tabler/icons-react";
import classes from "./ProfileHeader.module.css";
import MalePatientAvatar from "../../../assets/male_patient_avatar.png";
import FemalePatientAvatar from "../../../assets/female_patient_avatar.png";
import moment from "moment";

interface ProfileHeaderProps {
  name: string;
  hpercode: string | null;
  contact_no: string;
  gender: "male" | "female";
  dob: string;
}

const ProfileHeader = ({
  name,
  hpercode,
  contact_no,
  gender,
  dob,
}: ProfileHeaderProps) => {
  const birthday = moment(dob);
  const currentDate = moment();
  const age = moment.duration(currentDate.diff(birthday)).years();
  return (
    <div>
      <Group wrap="nowrap">
        <Avatar
          src={
            gender.toString().toUpperCase() === "MALE"
              ? MalePatientAvatar
              : FemalePatientAvatar
          }
          size={94}
          radius="lg"
        />
        <div>
          <Text fz="lg" fw={500} className={classes.name}>
            {name.toString().toUpperCase()}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconId stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {hpercode ? hpercode : "-- NO HOSPITAL NUMBER --"}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {contact_no}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {gender && gender.toUpperCase()} & {age} year(s) old
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  );
};

export default ProfileHeader;
