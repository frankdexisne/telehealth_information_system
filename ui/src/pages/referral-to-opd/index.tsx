import PageHeader from "../../components/base/PageHeader";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import { useFilter, useTable } from "../../hooks";
import { FilterInput } from "../../components/filters";
import { Button, Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { NavLink } from "react-router-dom";

export interface DepartmentRowData {
  id: number;
  name: string;
  is_doctor: 1 | 0;
  daily_limit: null | number;
  day: [];
}

const ReferralToOPD = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const { debouncedParameters, parameters, inputChangeHandler, setParameters } =
    useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: `patient-schedules/reffered/to-opd`,
    pageSize: 5,
    parameters: {
      ...debouncedParameters,
      schedule_datetime:
        parameters.schedule_datetime || selectedDate.format("YYYY-MM-DD"),
    },
  });

  const columns: ColumnDefinition<DepartmentRowData>[] = [
    {
      field: "schedule_datetime",
      header: "Date & Time",
      FilterComponent: (
        <FilterInput
          type="date"
          name="schedule_datetime"
          value={
            parameters.schedule_datetime || selectedDate.format("YYYY-MM-DD")
          }
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "appointmentable.name",
      header: "Patient Name",
      FilterComponent: (
        <FilterInput
          name="name"
          value={parameters.name}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "department.name",
      header: "Department",
    },
    {
      field: "user.name",
      header: "Encoded By",
    },
  ];

  return (
    <div>
      <Grid>
        <Grid.Col span={6}>
          <PageHeader title="Referral to OPD" />
        </Grid.Col>
        <Grid.Col span={6} className="flex justify-end">
          <Button component={NavLink} to="/referral-to-opd/create">
            REFFER A PATIENT
          </Button>
        </Grid.Col>
      </Grid>

      <AppTanstackTable
        data={data}
        columns={columns}
        pagination={pagination}
        isFetching={isFetching}
        columnSearch={true}
      />
    </div>
  );
};

export default ReferralToOPD;
