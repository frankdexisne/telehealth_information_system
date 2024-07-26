import { Button, Grid, Tooltip, Center } from "@mantine/core";
import { DefaultRowAction } from "../../components/tables/AppTanstackTable";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import FilterInput from "../../components/filters/FilterInput";
import FilterSelect from "../../components/filters/FilterSelect";
import useTable from "../../hooks/use-table";
import useFilter from "../../hooks/use-filter";
import { ButtonGroup } from "@mantine/core";
import { IconEye, IconUserMinus, IconUnlink } from "@tabler/icons-react";
import HasPermission from "../../utils/has-permission";
import { IconUserPlus } from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  PATIENT_CREATE,
  PATIENT_UPDATE,
  PATIENT_DELETE,
} from "../../interfaces/PermissionList";
import PageHeader from "../../components/base/PageHeader";
import Faqs from "../../components/faqs";

export interface PatientRowData {
  id: number;
  hpercode: string;
  lname: string;
  fname: string;
  mname: string;
  contact_no: string;
  gender: "male" | "female";
  dob: string;
  address?: string;
}

const Patients = () => {
  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, refetch, changePage } = useTable({
    endpoint: "patients",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const navigate = useNavigate();

  const columns: ColumnDefinition<PatientRowData>[] = [
    {
      field: (row) => {
        if (!row.hpercode) {
          return (
            <Center>
              <Tooltip
                label="Not yet bind to iHOMIS"
                className="flex justify-center"
              >
                <IconUnlink color="orange" size={18} />
              </Tooltip>
            </Center>
          );
        }
        return <b>{row.hpercode}</b>;
      },
      header: "Hospital Number",
      FilterComponent: (
        <FilterInput
          name="hpercode"
          value={parameters.hpercode}
          placeholder="Search Hospital Number"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "lname",
      header: "Lastname",
      FilterComponent: (
        <FilterInput
          name="lname"
          value={parameters.lname}
          placeholder="Search lastname"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "fname",
      header: "Firstname",
      FilterComponent: (
        <FilterInput
          name="fname"
          value={parameters.fname}
          placeholder="Search firstname"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "mname",
      header: "Middle name",
      FilterComponent: (
        <FilterInput
          name="mname"
          value={parameters.mname}
          placeholder="Search Middle name"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: "contact_no",
      header: "Contact Number",
    },
    {
      field: (row) => moment(row.dob).format("MM/DD/YYYY"),
      header: "Date of Birth",
    },
    {
      field: (row) => row.gender?.toString().toUpperCase(),
      header: "Gender",
      FilterComponent: (
        <FilterSelect
          name="gender"
          placeholder="Search Middle name"
          data={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChangeFilter={(value) => {
            selectChangeHandler("gender", value);
            changePage(1);
          }}
        />
      ),
    },
    {
      field: (row) => {
        return (
          <DefaultRowAction
            resource="patients"
            id={row.id}
            editLink={`/patients/${row.id}/view`}
            onDelete={() => refetch()}
            EditIcon={<IconEye />}
            DeleteIcon={<IconUserMinus />}
            canDelete={HasPermission(PATIENT_DELETE)}
            canEdit={HasPermission(PATIENT_UPDATE)}
          />
        );
      },
      header: "Action",
    },
  ];

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <PageHeader title="Patient List" />
          <Faqs module="patients" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex pr-5 justify-end items-start"
        >
          <div className="pl-1">
            <Button
              onClick={() => {
                navigate("/patients/create");
              }}
            >
              <IconUserPlus className="mr-2" /> Search / New Patient
            </Button>
          </div>
        </Grid.Col>
      </Grid>

      <AppTanstackTable
        isFetching={isFetching}
        columns={columns}
        columnSearch={true}
        data={data}
        pagination={pagination}
        EmptyContent={
          <div className="w-full flex flex-col justify-center gap-4">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-300">
                --NO RECORD FOUND--
              </h2>
            </div>
            {HasPermission(PATIENT_CREATE) && (
              <div className="w-full flex justify-center">
                <ButtonGroup>
                  <Button w={250} component={NavLink} to="/patients/create">
                    <IconUserPlus /> NEW PATIENT
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default Patients;
