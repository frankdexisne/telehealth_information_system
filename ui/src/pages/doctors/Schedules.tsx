import { useTable, useFilter } from "../../hooks";
import { FilterInput } from "../../components/filters";

import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ScheduleRowData {
  created_at: string;
  patient_profile_name: string;
  reason: string;
}

const Schedules = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTeleConsulting
  );
  const { parameters, debouncedParameters, inputChangeHandler } = useFilter();
  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "doctors/schedules",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<ScheduleRowData>[] = [
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date and Time",
      size: 140,
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
      field: "reason",
      header: "Reason",
      size: 200,
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

export default Schedules;
