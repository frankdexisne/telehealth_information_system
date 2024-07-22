import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import { FilterInput } from "../../../components/filters";

export interface DepartmentRowData {
  id: number;
  name: string;
  is_doctor: 1 | 0;
  daily_limit: null | number;
  day: [];
}

const PatientList = () => {
  const { debouncedParameters, parameters, inputChangeHandler } = useFilter();
  const { data, pagination, isFetching } = useTable({
    endpoint: "departments",
    pageSize: 5,
    parameters: { pageSize: 10, ...debouncedParameters },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const columns: ColumnDefinition<DepartmentRowData>[] = [
    {
      field: "name",
      header: "Patient Name",
      FilterComponent: (
        <FilterInput
          name="name"
          value={parameters.name}
          onChange={inputChangeHandler}
        />
      ),
    },
  ];

  return (
    <>
      <AppTanstackTable
        data={data}
        columns={columns}
        pagination={pagination}
        isFetching={isFetching}
        columnSearch={true}
      />
    </>
  );
};

export default PatientList;
