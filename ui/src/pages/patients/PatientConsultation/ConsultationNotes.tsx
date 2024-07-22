import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import { FilterSelectApi } from "../../../components/filters";
import { Button, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import DispositionForms from "./DispositionForms";
import moment from "moment";

interface ConsultationNotesProps {
  encounter_id: number;
  is_active?: number;
  onSubmit?: () => void;
}

interface ConsultationNotesRowData {
  findings_date: string;
  findings: string;
  doctor: string;
  department_name: string;
}

const ConsultationNotes = ({
  encounter_id,
  is_active = 1,
  onSubmit,
}: ConsultationNotesProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { debouncedParameters, selectChangeHandler } = useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "patient-consultations",
    pageSize: 5,
    parameters: {
      ...debouncedParameters,
      encounter_id: encounter_id,
    },
  });
  const columns: ColumnDefinition<ConsultationNotesRowData>[] = [
    {
      field: (row) => moment(row.findings_date).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date",
    },
    {
      field: (row) => (
        <div dangerouslySetInnerHTML={{ __html: row.findings }} />
      ),
      header: "Notes",
      size: 350,
    },
    {
      field: "doctor",
      header: "Doctor",
      size: 250,
    },
    {
      field: "department_name",
      header: "Department",
      size: 150,
      FilterComponent: (
        <FilterSelectApi
          name="department_id"
          api="departments"
          onChangeFilter={(value) =>
            selectChangeHandler("department_id", value)
          }
        />
      ),
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-end">
        {is_active === 1 && (
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
            className="mb-3"
          >
            {" "}
            ADD CONSULATION NOTES
          </Button>
        )}
      </div>
      <AppTanstackTable
        isFetching={isFetching}
        columns={columns}
        columnSearch={true}
        data={data}
        pagination={pagination}
      />

      <Modal
        opened={opened}
        onClose={close}
        title={<h1 className="text-blue-500 text-2xl">CONSULTATION NOTES</h1>}
        size="90%"
        centered
      >
        <div>
          <DispositionForms
            encounter_id={encounter_id}
            onSubmit={() => {
              refetch();
              if (onSubmit) onSubmit();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationNotes;
