import { useState } from "react";
import { ActionIcon, Button, Modal, Tooltip } from "@mantine/core";
import { DefaultRowAction } from "../../../components/tables/AppTanstackTable";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import { FilterInput } from "../../../components/filters";
import {
  IconPlus,
  IconCheck,
  IconX,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import DepartmentForm, { DepartmentFormData } from "./DepartmentForm";
import ScheduleForm from "./ScheduleForm";
import HasPermission from "../../../utils/has-permission";
import {
  DEPARTMENT_CREATE,
  DEPARTMENT_UPDATE,
  DEPARTMENT_DELETE,
} from "../../../interfaces/PermissionList";

export interface DepartmentRowData {
  id: number;
  name: string;
  is_doctor: 1 | 0;
  daily_limit: null | number;
  day: [];
}

const defaultValues = {
  name: "",
  is_doctor: 0,
};

const Departments = () => {
  const { debouncedParameters, parameters, inputChangeHandler } = useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "departments",
    pageSize: 5,
    parameters: debouncedParameters,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSchedule, { open: openSchedule, close: closeSchedule }] =
    useDisclosure(false);
  const [selectedRow, setSelectedRow] =
    useState<DepartmentFormData>(defaultValues);
  const columns: ColumnDefinition<DepartmentRowData>[] = [
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
      field: (row) =>
        row.is_doctor === 1 ? (
          <IconCheck color="green" />
        ) : (
          <IconX color="red" />
        ),
      header: "Doctor",
    },
    {
      field: "daily_limit",
      header: "Daily Limit",
    },
    {
      field: (row) => row.day,
      header: "Schedule Days",
    },
    {
      field: (row) => (
        <DefaultRowAction
          resource="departments"
          id={row.id}
          canDelete={HasPermission(DEPARTMENT_DELETE)}
          canEdit={HasPermission(DEPARTMENT_UPDATE)}
          onEdit={() => {
            setSelectedRow({
              id: row.id,
              name: row.name,
            });
            open();
          }}
          onDelete={() => refetch()}
        >
          <Tooltip label="View Schedule">
            <ActionIcon variant="transparent" onClick={openSchedule}>
              <IconCalendarEvent />
            </ActionIcon>
          </Tooltip>
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
            {HasPermission(DEPARTMENT_CREATE) && (
              <Button
                onClick={() => {
                  open();
                }}
              >
                <IconPlus className="mr-2" /> NEW DEPARTMENT
              </Button>
            )}
          </div>
        }
      />
      <Modal opened={opened} onClose={close} title="Department">
        <DepartmentForm
          values={selectedRow}
          onSubmit={() => close()}
          onCancel={() => close()}
        />
      </Modal>

      <Modal
        opened={openedSchedule}
        onClose={closeSchedule}
        title="Schedule"
        size="lg"
      >
        <ScheduleForm onSubmit={() => close()} onCancel={() => close()} />
      </Modal>
    </>
  );
};

export default Departments;
