import useTable from "../../../hooks/use-table";
import moment from "moment";
import { IconPlus } from "@tabler/icons-react";
import {
  Button,
  Paper,
  Pagination,
  Loader,
  Badge,
  Modal,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { putRequest } from "../../../hooks/use-http";
import { plaformType } from "../../../components/patients";
import { CHIEF_COMPLAINT_CREATE } from "../../../interfaces/PermissionList";
import HasPermission from "../../../utils/has-permission";
import { useDisclosure } from "@mantine/hooks";
import LogForm from "../PatientCreate/LogForm";
import { useNavigate } from "react-router-dom";

export interface ChiefComplaintRowData {
  id: number;
  patient_profile_id: number;
  chief_complaint: string;
  created_at: string;
  is_active: 1 | 0;
  is_follow_up: 1 | 0;
}

interface ChiefComplaintItemProps {
  id: number;
  chief_complaint: string;
  created_at: string;
  is_lock: 1 | 0;
  is_follow_up: 1 | 0;
  onSelect: (id: number) => void;
  showAction: boolean;
  onCreateFollowUp: (id: number) => void;
  platform?: plaformType;
}

const ChiefComplaintItem = ({
  id,
  chief_complaint,
  created_at,
  is_lock,
  onSelect,
  showAction = false,
  onCreateFollowUp,
}: ChiefComplaintItemProps) => {
  const followUpHandler = () => {
    onCreateFollowUp(id);
  };

  return (
    <Paper
      shadow="xs"
      p="md"
      my="sm"
      className="felx items-center justify-center border"
      onClick={() => onSelect(id)}
    >
      <div className="w-full flex">
        <div className="w-[70%]">
          <h1 className="text-xl text-blue-500">
            {chief_complaint?.toString()?.toUpperCase()}
          </h1>
          <span>{moment(created_at).format("MM/DD/YYYY HH:mm:ss")}</span>
        </div>
        <div className="w-[30%]">
          {showAction && is_lock === 1 && (
            <Button
              variant="transparent"
              onClick={followUpHandler}
              leftSection={<IconPlus />}
            >
              FOLLOW UP
            </Button>
          )}
          {is_lock === 0 && (
            <Badge color="green" size="md">
              Active
            </Badge>
          )}
        </div>
      </div>
    </Paper>
  );
};

interface ChiefComplaintsProps {
  patient_profile_id: number;
  onCreate?: () => void;
  showAction?: boolean;
  homisLink?: boolean;
  platform?: plaformType;
  hideAddButton?: boolean;
}

const ChiefComplaints = ({
  patient_profile_id,
  showAction = false,
  onCreate,
  platform,
  hideAddButton = false,
}: ChiefComplaintsProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>();
  const [opened, { open, close }] = useDisclosure(false);
  const { data, pagination, isFetching } = useTable({
    endpoint: "encounters",
    pageSize: 10,
    parameters: {
      patient_profile_id: patient_profile_id,
    },
  });

  return (
    <>
      <div className="w-full flex mt-2 mb-2">
        <div className="w-[50%]">
          <Title size={20} c="blue" my={10}>
            TELEHEALTH CONSULTATION HISTORY
          </Title>
        </div>
        <div className="w-[50%] flex justify-end">
          {" "}
          {!hideAddButton &&
            showAction &&
            HasPermission(CHIEF_COMPLAINT_CREATE) && (
              <Button size="xs" onClick={onCreate}>
                ADD CHIEF COMPLAINT
              </Button>
            )}
        </div>
      </div>

      {isFetching && <Loader />}

      {!isFetching && data?.length === 0 && (
        <div className="w-full flex justify-center my-5">
          <h1 className="text-slate-500 font-semibold text-xl">
            --- NO RECORD FOUND ---
          </h1>
        </div>
      )}

      {!isFetching &&
        data?.map((chiefComplaint: ChiefComplaintRowData) => (
          <ChiefComplaintItem
            id={chiefComplaint.id}
            chief_complaint={chiefComplaint.chief_complaint}
            created_at={chiefComplaint.created_at}
            is_lock={chiefComplaint.is_active === 0 ? 1 : 0}
            is_follow_up={chiefComplaint.is_follow_up}
            onSelect={(id) => console.log(id)}
            showAction={showAction}
            onCreateFollowUp={(id) => {
              setSelectedId(id);
              open();
            }}
            platform={platform}
          />
        ))}
      <div className="mt-3 flex w-full justify-center">
        <Pagination
          value={pagination.page}
          total={pagination.lastPage}
          onChange={pagination.onPageChange}
          className="mr-3 mb-2"
        />
      </div>
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={close}
        title="Provide Follow Up Log"
      >
        <LogForm
          onSubmit={(data) => {
            putRequest(
              `patient-chief-complaints/${selectedId}/follow-up`,
              data
            ).then(() => {
              navigate("/teleclerk");
            });
          }}
          submitLabel="CREATE FOLLOW UP WITH LOGS"
        />
      </Modal>
    </>
  );
};

export default ChiefComplaints;
