import AppTanstackTable, {
  DefaultRowAction,
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import { useTable, useFilter } from "../../hooks";
import {
  FilterInput,
  FilterSelect,
  SelectOptionType,
} from "../../components/filters";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Grid, InputLabel, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import moment from "moment";
import PageHeader from "../../components/base/PageHeader";
import { useNavigate } from "react-router-dom";

interface TeleclerkLogRowData {
  id: number;
  log_datetime: string;
  platform_name: string;
  informant: string;
  inquiry: string;
  patient_lname?: string;
  patient_fname?: string;
  patient_mname?: string;
  patient_suffix?: string;
  patient_contact_no?: string;
  is_teleconsult: 1 | 0;
  regcode?: string;
  provcode?: string;
  ctycode?: string;
  brg?: string;
  patstr?: string;
  department_name?: string;
  rx?: string;
  remarks?: string;
  update?: string;
}

const TeleclerkLogs = () => {
  const navigate = useNavigate();
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const platforms = useSelector((state: RootState) => state.select.platforms);
  const {
    debouncedParameters,
    parameters,
    setParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, refetch } = useTable({
    endpoint: "teleclerk-logs",
    pageSize: 5,
    parameters: { ...debouncedParameters, log_date: selectedDate },
  });

  useEffect(() => {
    setParameters({
      log_date: moment().format("YYYY-MM-DD"),
    });
  }, [setParameters]);

  const columns: ColumnDefinition<TeleclerkLogRowData>[] = [
    {
      field: (row) => moment(row.log_datetime).format("HH:mm:ss"),
      header: "Time",
      FilterComponent: (
        <FilterInput
          name="log_time"
          type="time"
          value={parameters.log_time}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "platform_name",
      header: "Platform",
      FilterComponent: (
        <FilterSelect
          name="platform_id"
          placeholder="Platform"
          data={platforms as SelectOptionType[]}
          onChangeFilter={(value) => selectChangeHandler("platform_id", value)}
        />
      ),
    },
    {
      field: "informant",
      header: "Informant",
      FilterComponent: (
        <FilterInput
          name="informant"
          value={parameters.informant}
          onChange={inputChangeHandler}
        />
      ),
    },
    {
      field: "inquiry",
      header: "Inquiry",
    },
    {
      field: (row) =>
        row.is_teleconsult === 1 ? (
          <IconCheck color="green" />
        ) : (
          <IconX color="red" />
        ),
      header: "Is Teleconsult",
      FilterComponent: (
        <FilterSelect
          name="is_teleconsult"
          placeholder="Is Teleconsult"
          data={[
            { value: "0", label: "No" },
            { value: "1", label: "Yes" },
          ]}
          onChangeFilter={(value) =>
            selectChangeHandler("department_id", value)
          }
        />
      ),
    },
    {
      field: (row) => {
        if (row.department_name) {
          return row.department_name;
        }

        return "NOT DEFINED";
      },
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
      field: (row) => (
        <DefaultRowAction
          resource="teleclerk-logs"
          id={row.id}
          canDelete={true}
          canEdit={true}
          onEdit={() => {
            navigate("/inquiry/" + row.id);
          }}
          onDelete={() => refetch()}
        />
      ),
      header: "Action",
    },
  ];

  return (
    <>
      <Grid className="mb-3">
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <PageHeader title="Teleclerk Logs" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Grid>
            <Grid.Col
              span={{ base: 12, lg: 6 }}
              className="flex  items-center lg:justify-end justify-start"
            >
              <InputLabel>Filter by date</InputLabel>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                type="date"
                name="log_date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>

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

export default TeleclerkLogs;
