import {
  Button,
  Grid,
  Paper,
  Avatar,
  Group,
  Text,
  ActionIcon,
  Loader,
  Title,
  Pagination,
} from "@mantine/core";
import { useTable, useFilter } from "../../../hooks";
import {
  IconId,
  IconPhoneCall,
  IconUser,
  IconArrowRight,
  IconUserPlus,
  IconSearch,
} from "@tabler/icons-react";
import MalePatientAvatar from "../../../assets/male_patient_avatar.png";
import FemalePatientAvatar from "../../../assets/female_patient_avatar.png";
import classes from "../PatientProfile/ProfileHeader.module.css";
import moment from "moment";
import { useEffect } from "react";

export interface DepartmentRowData {
  id: number;
  name: string;
  is_doctor: 1 | 0;
  daily_limit: null | number;
}

export interface ProfileHeaderProps {
  name: string;
  hpercode: string | null;
  contact_no: string;
  gender: "male" | "female";
  dob: string;
}

interface PatientRowProps {
  row: ProfileHeaderProps;
  onSelect: (row: ProfileHeaderProps) => void;
}

const PatientRow = ({ row, onSelect }: PatientRowProps) => {
  const { gender, name, hpercode, contact_no, dob } = row;
  const birthday = moment(dob);
  const currentDate = moment();
  const age = moment.duration(currentDate.diff(birthday)).years();
  return (
    <Paper my={5}>
      <Grid>
        <Grid.Col span={2} className="flex justify-center items-center">
          <Avatar
            src={
              gender?.toString().toUpperCase() === "MALE"
                ? MalePatientAvatar
                : FemalePatientAvatar
            }
            size={70}
            radius="lg"
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Text fz="md" fw={500} className={classes.name}>
            {name?.toString().toUpperCase()}
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
              {contact_no ? contact_no : "-- NO CONTACT NUMBER --"}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {gender && gender?.toUpperCase()} & {age} year(s) old
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={2} className="flex items-center justify-center">
          <ActionIcon onClick={() => onSelect(row)}>
            <IconArrowRight />
          </ActionIcon>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

interface TeleServerPatientResultProps {
  hpercode?: string | null;
  lname?: string | null;
  fname?: string | null;
  mname?: string | null;
  onClear?: () => void;
  onSelect: (row: ProfileHeaderProps) => void;
}

const TeleservicePatientResult = ({
  hpercode,
  lname,
  fname,
  mname,
  onClear,
  onSelect,
}: TeleServerPatientResultProps) => {
  const { debouncedParameters, setParameters } = useFilter();
  const { data, pagination, isFetched, isFetching } = useTable({
    endpoint: "patients/teleserve-search",
    pageSize: 5,
    parameters: debouncedParameters,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hpercode) setParameters((prev) => ({ ...prev, hpercode }));
      if (fname) setParameters((prev) => ({ ...prev, fname }));
      if (lname) setParameters((prev) => ({ ...prev, lname }));
      if (mname) setParameters((prev) => ({ ...prev, mname }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [hpercode, lname, fname, mname]);

  const clearFilter = () => {
    setParameters({});
    if (onClear) {
      onClear();
    }
  };

  return (
    <>
      {isFetching && <Loader />}

      {isFetched && data.length === 0 && (
        <div className="flex justify-center flex-col items-center mt-[20px]">
          <Title size={24} className="text-slate-500">
            --NO RECORD FOUND--
          </Title>
          <Button.Group>
            <Button w={200} leftSection={<IconUserPlus />}>
              NEW PATIENT
            </Button>
            <Button
              color="gray"
              leftSection={<IconSearch />}
              onClick={clearFilter}
            >
              SEARCH AGAIN
            </Button>
          </Button.Group>
        </div>
      )}

      {isFetched &&
        data.map((item: ProfileHeaderProps) => (
          <PatientRow
            row={item}
            onSelect={(row: ProfileHeaderProps) => onSelect(row)}
          />
        ))}

      {isFetched && (
        <div className="flex w-full justify-center mt-[20px]">
          <Pagination
            value={pagination.page}
            total={pagination.lastPage}
            onChange={pagination.onPageChange}
            className="mr-3 mb-2"
          />
        </div>
      )}
    </>
  );
};

export default TeleservicePatientResult;
