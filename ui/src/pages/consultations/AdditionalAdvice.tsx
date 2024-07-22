import { useTable, useFilter } from "../../hooks";
import {
  FilterInput,
  FilterSelect,
  type SelectOptionType,
} from "../../components/filters";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import moment from "moment";
import { Button, Modal } from "@mantine/core";
import { IconCheck, IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface AdditionalAdviceRowData {
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  teleclerk: string;
  findings: string;
}

const AdditionalAdvice = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTransaction
  );
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const doctors = useSelector((state: RootState) => state.select.doctors);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedAdvice, setSelectedAdvice] = useState<AdditionalAdviceRowData>(
    {
      created_at: "",
      chief_complaint: "",
      patient_profile_name: "",
      gender: "male",
      dob: "",
      contact_no: "",
      transaction_code: "",
      teleclerk: "",
      findings: "",
    }
  );

  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();

  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "consultations/additional-advice-consultations",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<AdditionalAdviceRowData>[] = [
    {
      field: (row) => {
        return (
          <div>
            <Button
              variant="transparent"
              px={3}
              color="green"
              title="Mark as Complete"
            >
              <IconCheck />
            </Button>
            <Button
              px={3}
              variant="transparent"
              onClick={() => {
                setSelectedAdvice(row);
                open();
              }}
              title="View Findings"
            >
              {" "}
              <IconEye />
            </Button>
          </div>
        );
      },
      header: "Action",
      size: 50,
    },
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date and Time",
      size: 120,
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
      field: "doctor",
      header: "Doctor",
      FilterComponent: (
        <FilterSelect
          data={doctors as SelectOptionType[]}
          name="doctor_id"
          onChangeFilter={(value) => {
            selectChangeHandler("doctor_id", value);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "department",
      header: "Department",
      FilterComponent: (
        <FilterSelect
          data={departments as SelectOptionType[]}
          name="department_id"
          onChangeFilter={(value) => {
            selectChangeHandler("department_id", value);
            changePage(1);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <AppTanstackTable
        isError={isError}
        isFetching={isFetching}
        columns={columns}
        columnSearch={toggleFilter}
        data={data}
        pagination={pagination}
      />
      <Modal
        opened={opened}
        onClose={close}
        title="Consultation Findings"
        size="xl"
        centered
      >
        <h1 className="text-xl font-semibold text-blue-500 ">
          {selectedAdvice.patient_profile_name?.toString()?.toUpperCase()}
        </h1>
        <h2 className="mb-5 text-sm">
          <span>CHIEF COMPLAINT</span> :{" "}
          <span className="font-semibold">
            {selectedAdvice.chief_complaint.toString().toUpperCase()}
          </span>
        </h2>
        <div dangerouslySetInnerHTML={{ __html: selectedAdvice.findings }} />
      </Modal>
    </>
  );
};

export default AdditionalAdvice;
