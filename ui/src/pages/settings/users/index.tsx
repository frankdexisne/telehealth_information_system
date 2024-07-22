import { Button, Modal } from "@mantine/core";
import { DefaultRowAction } from "../../../components/tables/AppTanstackTable";
import {
  IconUserMinus,
  IconUserEdit,
  IconUserPlus,
  IconLink,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import FormHomisLink from "./FormHomisLink";
import UserForm, { UserFormData } from "./UserForm";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import {
  FilterInput,
  FilterSelect,
  SelectOptionType,
} from "../../../components/filters";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  USER_CREATE,
  USER_UPDATE,
  USER_DELETE,
} from "../../../interfaces/PermissionList";
import HasPermission from "../../../utils/has-permission";

export interface UserRowData {
  id: number;
  name: string;
  email: string;
  department_id: number;
  designation_id: number;
  department_name: string;
  designation_name: string;
  role_name: string;
  role_id: number;
  hpersonal_code: string | number;
}

const defaultValues = {
  name: "",
  email: "",
  department_id: null,
  designation_id: null,
  role_id: null,
};

const Users = () => {
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const designations = useSelector(
    (state: RootState) => state.select.designations
  );
  const roles = useSelector((state: RootState) => state.select.roles);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedLink, { open: openLink, close: closeLink }] =
    useDisclosure(false);
  const [selectedRow, setSelectedRow] = useState<UserFormData>(defaultValues);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    debouncedParameters,
    parameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, refetch, changePage } = useTable({
    endpoint: "users",
    pageSize: 5,
    parameters: debouncedParameters,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const columns: ColumnDefinition<UserRowData>[] = [
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
      field: "email",
      header: "Email",
      FilterComponent: (
        <FilterInput
          name="email"
          value={parameters.email}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "department_name",
      header: "Department",
      FilterComponent: (
        <FilterSelect
          name="department_id"
          placeholder="Department"
          data={departments as SelectOptionType[]}
          onChangeFilter={(value) =>
            selectChangeHandler("department_id", value)
          }
        />
      ),
    },
    {
      field: "designation_name",
      header: "Designation",
      FilterComponent: (
        <FilterSelect
          name="designation_id"
          placeholder="Designation"
          data={designations as SelectOptionType[]}
          onChangeFilter={(value) =>
            selectChangeHandler("designation_id", value)
          }
        />
      ),
    },
    {
      field: "role_name",
      header: "Role",
      FilterComponent: (
        <FilterSelect
          name="role_id"
          placeholder="Role"
          data={roles as SelectOptionType[]}
          onChangeFilter={(value) => selectChangeHandler("role_id", value)}
        />
      ),
    },
    {
      field: "hpersonal_code",
      header: "Homis user-code",
    },
    {
      field: (row) =>
        row.hpersonal_code ? (
          <IconCheck color="green" />
        ) : (
          <IconX color="red" />
        ),
      header: "IS BIND",
      FilterComponent: (
        <FilterSelect
          name="is_bind"
          placeholder="IS BIND"
          data={[
            { value: "1", label: "YES" },
            { value: "0", label: "NO" },
          ]}
          onChangeFilter={(value) => {
            selectChangeHandler("is_bind", value);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: (row) => (
        <DefaultRowAction
          resource="users"
          id={row.id}
          onEdit={() => {
            setSelectedRow({
              id: row.id,
              name: row.name,
              email: row.email,
              department_id: row.department_id,
              designation_id: row.designation_id,
              role_id: row.role_id,
            });
            open();
          }}
          onDelete={() => refetch()}
          EditIcon={<IconUserEdit />}
          DeleteIcon={<IconUserMinus />}
          canDelete={HasPermission(USER_DELETE)}
          canEdit={HasPermission(USER_UPDATE)}
        >
          {HasPermission(USER_UPDATE) && (
            <Button
              variant="transparent"
              px={3}
              color="green"
              title="Link"
              onClick={() => {
                setSelectedId(row.id);
                openLink();
              }}
            >
              <IconLink />
            </Button>
          )}
        </DefaultRowAction>
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
            {HasPermission(USER_CREATE) && (
              <Button
                onClick={() => {
                  open();
                }}
              >
                <IconUserPlus className="mr-2" /> NEW USER
              </Button>
            )}
          </div>
        }
      />

      <Modal opened={opened} onClose={close} title="User">
        <UserForm
          values={selectedRow}
          onSubmit={() => {
            close();
          }}
          onCancel={() => close()}
        />
      </Modal>

      <Modal opened={openedLink} onClose={closeLink} title="Link to HOMIS">
        <FormHomisLink
          id={selectedId}
          onSubmit={() => {
            refetch();
            closeLink();
          }}
          onCancel={() => closeLink()}
        />
      </Modal>
    </>
  );
};

export default Users;
