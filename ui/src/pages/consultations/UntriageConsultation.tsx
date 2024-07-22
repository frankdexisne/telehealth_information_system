import { useTable, useFilter } from "../../hooks";
import { FilterInput, FilterSelect } from "../../components/filters";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import moment from "moment";
import { Button, Modal } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import AssigningDepartmentDetail from "./AssigningDepartmentDetail";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface UntriageConsultationRowData {
  id: number;
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  teleclerk: string;
}

const UntriageConsultation = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTeleAnchor
  );
  const [selectedId, setSelectedId] = useState<number>();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, refetch, changePage } = useTable({
    endpoint: "consultations/un-triage-consultations",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<UntriageConsultationRowData>[] = [
    {
      field: (row) => (
        <div className="w-[100px]">
          <Button
            variant="transparent"
            leftSection={<IconArrowRight />}
            onClick={() => {
              setSelectedId(row.id);
              open();
            }}
          >
            Assign
          </Button>
        </div>
      ),
      header: "Action",
    },
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date and Time",
      size: 140,
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
      size: 250,
    },
    {
      field: "patient_profile_name",
      header: "Patient Name",
      FilterComponent: (
        <FilterInput
          name="name"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
          value={parameters.name}
        />
      ),
      size: 200,
    },
    {
      field: (row) => row.gender.toString().toUpperCase(),
      header: "Gender",
      FilterComponent: (
        <FilterSelect
          data={[
            {
              value: "male",
              label: "Male",
            },
            {
              value: "female",
              label: "Female",
            },
          ]}
          name="gender"
          onChangeFilter={(value) => {
            selectChangeHandler("gender", value);
            changePage(1);
          }}
        />
      ),
      size: 120,
    },
    {
      field: (row) => moment().diff(row.dob, "years"),
      header: "Age",
      size: 60,
    },
    {
      field: "contact_no",
      header: "Contact No",
      size: 100,
    },
    {
      field: "transaction_code",
      header: "Trans-Code",
      size: 120,
    },
  ];

  return (
    <>
      <AppTanstackTable
        isFetching={isFetching}
        columns={columns}
        columnSearch={toggleFilter}
        data={data}
        pagination={pagination}
      />
      <Modal
        opened={opened}
        onClose={close}
        title="Assign to Department"
        centered
        size="xl"
      >
        {selectedId && (
          <AssigningDepartmentDetail
            id={selectedId}
            onSubmit={() => {
              close();
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default UntriageConsultation;
