import { useTable, useFilter } from "../../hooks";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import { FilterInput } from "../../components/filters";

interface DepartmentRowData {
  id: number;
  name: string;
  consulted: number;
  unconsulted: number;
}

interface TeleconsultationStatusProps {
  yearMonth: string;
}

const TeleconsultationStatus = ({ yearMonth }: TeleconsultationStatusProps) => {
  const { parameters, debouncedParameters, inputChangeHandler } = useFilter();

  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "reports",
    pageSize: 10,
    parameters: { year_month: yearMonth, ...debouncedParameters },
  });

  const columns: ColumnDefinition<DepartmentRowData>[] = [
    {
      field: "name",
      header: "Department",
      FilterComponent: (
        <FilterInput
          name="name"
          value={parameters.name}
          placeholder="Search department"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "consulted",
      header: "Consulted",
    },
    {
      field: "unconsulted",
      header: "Unattended",
    },
  ];

  return (
    <AppTanstackTable
      isError={isError}
      isFetching={isFetching}
      columns={columns}
      columnSearch={true}
      data={data}
      pagination={pagination}
    />
  );
};

export default TeleconsultationStatus;
