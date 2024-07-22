import { Button } from "@mantine/core";
import { DefaultRowAction } from "../../../components/tables/AppTanstackTable";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import { FilterInput } from "../../../components/filters";
import { IconPlus } from "@tabler/icons-react";

import {
  ROLE_CREATE,
  ROLE_UPDATE,
  ROLE_DELETE,
} from "../../../interfaces/PermissionList";
import HasPermission from "../../../utils/has-permission";
import { Link } from "react-router-dom";

interface RoleRowData {
  id: number;
  name: string;
}

const Roles = () => {
  const { debouncedParameters, parameters, inputChangeHandler } = useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "roles",
    pageSize: 5,
    parameters: debouncedParameters,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const columns: ColumnDefinition<RoleRowData>[] = [
    {
      field: "name",
      header: "Name",
      FilterComponent: (
        <FilterInput
          name="name"
          value={parameters.name}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: (row) => (
        <DefaultRowAction
          resource="roles"
          id={row.id}
          canDelete={HasPermission(ROLE_DELETE)}
          canEdit={HasPermission(ROLE_UPDATE)}
          editLink={`/settings/roles/${row.id}/edit`}
          onDelete={() => refetch()}
        />
      ),
      header: "Action",
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
        toolbar={
          <div className="py-1 pl-1">
            {HasPermission(ROLE_CREATE) && (
              <Button component={Link} to="/settings/roles/create">
                <IconPlus className="mr-2" /> NEW ROLE
              </Button>
            )}
          </div>
        }
      />
    </>
  );
};

export default Roles;
