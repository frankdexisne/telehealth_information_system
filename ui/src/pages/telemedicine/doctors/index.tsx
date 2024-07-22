import { DefaultRowAction } from "../../../components/tables/AppTanstackTable";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import useTable from "../../../hooks/use-table";
import FilterInput from "../../../components/filters/FilterInput";
import useFilter from "../../../hooks/use-filter";
import { IconUserPlus } from "@tabler/icons-react";
import { Button, ButtonGroup } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface DepartmentRowData {
  id: number;
  name: string;
  facility: string;
}

const Doctors = ({ defaultEmpty = true }: { defaultEmpty?: boolean }) => {
  const navigate = useNavigate();
  const { parameters, debouncedParameters, inputChangeHandler } = useFilter();

  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "telemedicine-doctors",
    pageSize: 10,
    parameters: debouncedParameters,
  });
  const columns: ColumnDefinition<DepartmentRowData>[] = [
    {
      field: "name",
      header: "Name",
      FilterComponent: (
        <FilterInput
          name="name"
          value={parameters.name}
          placeholder="Search by Name"
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "facility",
      header: "Facility Name",
      FilterComponent: (
        <FilterInput
          name="facility"
          value={parameters.name}
          placeholder="Search by Facility"
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: (row) => (
        <DefaultRowAction
          resource="departments"
          id={row.id}
          editLink={`/settings/departments/${row.id}/edit`}
          onDelete={() => refetch()}
        />
      ),
      header: "Action",
    },
  ];

  return (
    <AppTanstackTable
      isFetching={isFetching}
      columns={columns}
      columnSearch={true}
      data={data}
      pagination={pagination}
      EmptyContent={
        !defaultEmpty ? (
          <div className="w-full flex flex-col justify-center gap-4">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-300">
                --NO RECORD FOUND--
              </h2>
            </div>
            <div className="w-full flex justify-center">
              <ButtonGroup>
                <Button
                  w={250}
                  onClick={() => navigate("/tele-medicine/create-doctor")}
                >
                  <IconUserPlus /> NEW DOCTOR
                </Button>
              </ButtonGroup>
            </div>
          </div>
        ) : null
      }
    />
  );
};

export default Doctors;
