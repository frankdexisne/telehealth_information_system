import { useTable } from "../../../hooks";
import AppTanstackTable, {
  type ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { PatientRowData } from "../../patients";
import { BaseDepartmentStatusProps } from ".";
import moment from "moment";

const Closed = ({ id, year, month }: BaseDepartmentStatusProps) => {
  const { data, pagination, isFetching, isError } = useTable({
    endpoint: `dashboards/closed-consultations/${id}?year=${
      year || moment().format("YYYY")
    }&month=${month || moment().format("MM")}`,
    pageSize: 10,
  });
  const currentDate = moment();

  const columns: ColumnDefinition<PatientRowData>[] = [
    {
      field: "hpercode",
      header: "Hospital Number",
    },
    {
      field: (row) => row.lname + ", " + row.fname + " " + row.mname,
      header: "Name of Patient",
    },
    {
      field: "chief_complaint",
      header: "Chief Complaint",
    },
    {
      field: "contact_no",
      header: "Contact Number",
    },
    {
      field: (row) => {
        const birthday = moment(row.dob);
        return moment.duration(currentDate.diff(birthday)).years();
      },
      header: "Age",
    },
    {
      field: (row) => row.gender.toString().toUpperCase(),
      header: "Gender",
    },
  ];
  return (
    <div>
      <AppTanstackTable
        isError={isError}
        isFetching={isFetching}
        columns={columns}
        data={data}
        pagination={pagination}
      />
    </div>
  );
};

export default Closed;
