import { ActionIcon, Badge, Button, Group } from "@mantine/core";
import { DefaultRowAction } from "../../../components/tables/AppTanstackTable";
import { TextInput } from "../../../components/use-form-controls";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../../hooks";
import { FilterInput } from "../../../components/filters";
import {
  IconCalendarPlus,
  IconCheck,
  IconEdit,
  IconLock,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { postRequest } from "../../../hooks";
import Swal from "sweetalert2";

export interface EncounterRowData {
  id: number;
  chief_complaint: string;
  created_at: string;
  is_active: 1 | 0;
  is_follow_up: 1 | 0;
  schedule_datetime: string | null;
}

interface DateFieldProps {
  row: EncounterRowData;
  onSubmit: () => void;
}

interface FormSchedule {
  schedule_datetime: string;
}

const DateField = ({ row, onSubmit }: DateFieldProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { control, handleSubmit, setValue } = useForm<FormSchedule>();
  const setScheduleDateHandler = (payload: FormSchedule) => {
    postRequest(`/encounters/${row.id}/set-schedule`, payload).then((res) => {
      Swal.fire({
        title: "Success",
        text: "Already set schedule",
        icon: "success",
      }).then(() => onSubmit());
    });
  };

  useEffect(() => {
    if (row.schedule_datetime) {
      setValue(
        "schedule_datetime",
        moment(row.schedule_datetime).format("YYYY-MM-DDTHH:mm")
      );
      console.log("here");
    }
  }, [row.schedule_datetime]);

  if (row.is_active === 1) {
    if (opened)
      return (
        <form onSubmit={handleSubmit(setScheduleDateHandler)}>
          <div className="flex w-[300px]">
            <div className="w-[280px]">
              <TextInput
                type="datetime-local"
                fz={8}
                control={control}
                name="schedule_datetime"
              />
            </div>
            <div className="flex items-center ml-2">
              <ActionIcon color="green" mr={3} type="submit">
                <IconCheck />
              </ActionIcon>
              <ActionIcon color="red" onClick={close}>
                <IconX />
              </ActionIcon>
            </div>
          </div>
        </form>
      );

    if (row.schedule_datetime) {
      return (
        // <TextInput
        //   control={control}
        //   name="schedule_datetitme"
        //   type="datetime-local"
        //   fz={8}
        //   rightSection={<IconEdit />}
        //   // value={moment().format("YYYY-MM-DDTHH:mm")}
        //   // onChange={(e) => console.log(e.target.value)}
        // />
        row.schedule_datetime
      );
    }
    return (
      <ActionIcon onClick={open}>
        <IconCalendarPlus />
      </ActionIcon>
    );
  }
};

const Encounters = () => {
  const { id } = useParams();
  const { debouncedParameters, parameters, inputChangeHandler } = useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "encounters",
    pageSize: 5,
    parameters: { patient_profile_id: id, ...debouncedParameters },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const columns: ColumnDefinition<EncounterRowData>[] = [
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Encoded At",
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
      FilterComponent: (
        <FilterInput
          name="chief_complaint"
          value={parameters.chief_complaint}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: (row) => {
        if (row.is_follow_up === 1) {
          return <IconCheck color="green" />;
        }

        return <IconX color="gray" />;
      },
      header: "FOLLOW UP",
    },
    {
      field: (row) =>
        row.is_active === 1 ? (
          <IconCheck color="green" />
        ) : (
          <IconLock color="gray" />
        ),
      header: "Active",
    },
    {
      field: (row) => {
        return <DateField row={row} onSubmit={() => refetch()} />;
      },
      size: 300,
      header: "Schedule",
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

export default Encounters;
