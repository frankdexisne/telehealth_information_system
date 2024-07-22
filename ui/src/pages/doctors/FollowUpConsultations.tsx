import { useTable, useFilter } from "../../hooks";
import {
  FilterInput,
  FilterSelect,
  SelectOptionType,
} from "../../components/filters";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface FollowUpConsultationRowData {
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  doctor: string;
}

export interface BaseConsultationProps {
  toggleFilter: boolean;
}

const FollowUpConsultations = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTeleConsulting
  );
  const teleclerks = useSelector((state: RootState) => state.select.teleclerks);

  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "doctors/follow-up-consultations",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<FollowUpConsultationRowData>[] = [
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
    {
      field: "teleclerk",
      header: "Teleclerk",
      FilterComponent: (
        <FilterSelect
          data={teleclerks as SelectOptionType[]}
          name="teleclerk"
          onChangeFilter={(value) => {
            selectChangeHandler("teleclerk", value);
            changePage(1);
          }}
        />
      ),
      size: 120,
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

export default FollowUpConsultations;
