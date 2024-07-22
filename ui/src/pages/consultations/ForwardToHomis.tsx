import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";

import { useTable, useFilter } from "../../hooks";
import { FilterInput, FilterSelect } from "../../components/filters";
import { Button } from "@mantine/core";
import { IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ForwardToHomisRowData {
  id: number;
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  teleclerk: string;
  sent: 1 | 0;
}

export interface BaseConsultationProps {
  toggleFilter: boolean;
}

const ForwardToHomis = () => {
  const navigate = useNavigate();
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTransaction
  );
  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "consultations/forward-to-homis",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<ForwardToHomisRowData>[] = [
    {
      field: (row) => {
        return (
          <div className="w-[70px]">
            <Button
              variant="transparent"
              px={3}
              color="green"
              title="Complete Details and Map"
              onClick={() => navigate("/sent-to-homis/" + row.id)}
            >
              <IconArrowRight />
            </Button>
          </div>
        );
      },
      header: "Action",
      size: 60,
    },
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date and Time",
      size: 120,
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
      size: 300,
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
      field: (row) =>
        row.sent === 1 ? <IconCheck color="green" /> : <IconX color="red" />,
      header: "Is Bind",
      FilterComponent: (
        <FilterSelect
          data={[
            {
              value: "1",
              label: "YES",
            },
            {
              value: "0",
              label: "No",
            },
          ]}
          name="sent"
          onChangeFilter={(value) => {
            selectChangeHandler("sent", value);
            changePage(1);
          }}
        />
      ),
    },
  ];

  return (
    <AppTanstackTable
      isError={isError}
      isFetching={isFetching}
      columns={columns}
      columnSearch={toggleFilter}
      data={data}
      pagination={pagination}
    />
  );
};

export default ForwardToHomis;
