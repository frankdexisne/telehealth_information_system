import { useTable, useFilter } from "../../hooks";
import {
  FilterInput,
  FilterSelect,
  SelectOptionType,
} from "../../components/filters";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import moment from "moment";
import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { putRequest } from "../../hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface NewConsultationRowData {
  id: number;
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  doctor: string;
}

const NewConsultations = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTeleConsulting
  );
  const teleclerks = useSelector((state: RootState) => state.select.teleclerks);
  const navigate = useNavigate();

  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "doctors/new-consultations",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const confirmHandler = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This consultation will be assigned to you",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        putRequest(`/encounters/${id}/assign-consultation`, {}).then(() => {
          navigate(`/patients/consultation-detail/${id}`);
        });
      }
    });
  };

  const columns: ColumnDefinition<NewConsultationRowData>[] = [
    {
      field: (row) => (
        <div className="w-[100px]">
          <Button
            variant="transparent"
            leftSection={<IconArrowRight />}
            onClick={() => {
              confirmHandler(row.id);
            }}
          >
            Assign
          </Button>
        </div>
      ),
      header: "Action",
    },
    {
      field: (row) => moment(row.created_at).format("MM/DD/YYYY HH:mm:ss"),
      header: "Date and Time",
      size: 140,
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
      size: 250,
    },
    {
      field: "patient_profile_name",
      header: "Patient Name",
      FilterComponent: (
        <FilterInput
          name="name"
          onChange={(event) => {
            inputChangeHandler(event);
            changePage(1);
          }}
          value={parameters.name}
        />
      ),
      size: 200,
    },
    {
      field: (row) => row.gender.toString().toUpperCase(),
      header: "Gender",
      FilterComponent: (
        <FilterSelect
          data={[
            {
              value: "male",
              label: "Male",
            },
            {
              value: "female",
              label: "Female",
            },
          ]}
          name="gender"
          onChangeFilter={(value) => {
            selectChangeHandler("gender", value);
            changePage(1);
          }}
        />
      ),
      size: 120,
    },
    {
      field: (row) => moment().diff(row.dob, "years"),
      header: "Age",
      size: 60,
    },
    {
      field: "contact_no",
      header: "Contact No",
      size: 100,
    },
    {
      field: "transaction_code",
      header: "Trans-Code",
      size: 120,
    },
    {
      field: "teleclerk",
      header: "Teleclerk",
      FilterComponent: (
        <FilterSelect
          data={teleclerks as SelectOptionType[]}
          name="teleclerk"
          onChangeFilter={(value) => {
            selectChangeHandler("teleclerk", value);
            changePage(1);
          }}
        />
      ),
      size: 120,
    },
  ];

  return (
    <AppTanstackTable
      isError={isError}
      isFetching={isFetching}
      columns={columns}
      columnSearch={toggleFilter}
      data={data}
      pagination={pagination}
    />
  );
};

export default NewConsultations;
