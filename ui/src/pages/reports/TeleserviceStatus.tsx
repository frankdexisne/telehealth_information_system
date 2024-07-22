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

interface TeleserveStatusProps {
  yearMonth: string;
}

const TeleserviceStatus = ({ yearMonth }: TeleserveStatusProps) => {
  const { parameters, debouncedParameters, inputChangeHandler } = useFilter();

  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "reports/teleserve-status",
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
      field: "teleserve",
      header: "Teleserve",
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

export default TeleserviceStatus;
