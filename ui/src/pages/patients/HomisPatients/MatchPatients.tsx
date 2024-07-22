import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { useTable } from "../../../hooks";
import moment from "moment";
import { Button, ButtonGroup, Loader, Alert, ActionIcon } from "@mantine/core";
import DemographicForm from "../PatientCreate/DemographicForm";
import { IconArrowsRightLeft, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import HasPermission from "../../../utils/has-permission";
import { PATIENT_BIND } from "../../../interfaces/PermissionList";
import { ADMINISTRATOR } from "../../../interfaces/RoleList";

interface MatchPatientsProps {
  lname: string;
  fname: string;
  mname: string;
  address?: string;
  onSelect?: (hpercode: string) => void;
  hasAddress?: boolean;
  showMapButton?: boolean;
  getResultCount?: (count: number) => void;
}

interface MatchPatientsRowData {
  hpercode: string;
  patlast: string;
  patfirst: string;
  patmiddle: string;
  patbdate: string;
  patsex: "M" | "F";
}

const MatchPatients = ({
  lname,
  fname,
  mname,
  address,
  onSelect,
  hasAddress = false,
  showMapButton = false,
  getResultCount,
}: MatchPatientsProps) => {
  const [settingDemographic, setSettingDemographic] = useState(false);
  const [processing, setProcessing] = useState(false);
  const hpersonal_code = useSelector(
    (state: RootState) => state.auth.user.hpersonal_code
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, pagination, isFetching, isError } = useTable({
    endpoint: "hpersons",
    pageSize: 10,
    parameters: {
      lname,
      fname,
      mname,
    },
  });

  useEffect(() => {
    if (getResultCount) {
      getResultCount(data?.length);
    }
  }, [data, getResultCount]);

  const columns: ColumnDefinition<MatchPatientsRowData>[] = [
    {
      field: "hpercode",
      header: "Hospital Number",
    },

    {
      field: "patlast",
      header: "Lastname",
    },
    {
      field: "patfirst",
      header: "Firstname",
    },
    {
      field: "patmiddle",
      header: "Middlename",
    },
    {
      field: (row) => moment(row.patbdate).format("MM/DD/YYYY"),
      header: "Date of Birth",
    },
    {
      field: (row) => (row.patsex === "M" ? "MALE" : "FEMALE"),
      header: "Gender",
    },
    {
      field: (row) => {
        return (
          <>
            {hpersonal_code !== null && (
              <ActionIcon
                onClick={() => {
                  if (onSelect) onSelect(row.hpercode);
                }}
                size="sm"
              >
                <IconArrowsRightLeft />
              </ActionIcon>
            )}
          </>
        );
      },
      header: "Bind",
    },
  ];

  if (processing) {
    return (
      <div className="w-full h-[240px] flex flex-col justify-center items-center">
        <Loader />
        <h1 className="mt-3 text-md text-blue-500">BINDING DATA TO HOMIS...</h1>
      </div>
    );
  }

  if (settingDemographic) {
    return (
      <div className="w-full flex flex-col justify-center">
        <h2 className="text-xl text-blue-500 font-bold">
          COMPLETE THE DEMOGRAPHIC DATA
        </h2>
        <small>
          TIS REGISTERED ADDRESS: <span className="font-bold">{address}</span>
        </small>
        <DemographicForm
          submitPosition="center"
          submitLabel="SUBMIT AND BIND"
          onSubmit={() => {
            setProcessing(true);
          }}
          hideBackButton={true}
        />
      </div>
    );
  }

  return (
    <>
      {!hpersonal_code && (
        <Alert
          variant="light"
          color="orange"
          title="iHOMIS Integration"
          icon={<IconInfoCircle />}
          className="mb-3"
        >
          {HasPermission(PATIENT_BIND)
            ? `Looks like your account is not yet bind to iHOMIS, Please contact
          system administrator for account binding.`
            : `You are not allow bind patient to iHOMIS`}
        </Alert>
      )}
      <div className="mt-2" />
      <AppTanstackTable
        isFetching={isFetching}
        columns={columns}
        data={data}
        pagination={pagination}
        isError={isError}
        EmptyContent={
          <div className="w-full flex flex-col justify-center gap-4">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-300">
                NO MATCH FOUND
              </h2>
            </div>
            <div className="w-full flex justify-center">
              {hpersonal_code !== null &&
                (HasPermission(PATIENT_BIND) ||
                  user.role_name === ADMINISTRATOR) && (
                  <ButtonGroup>
                    <Button
                      w={250}
                      onClick={() => {
                        if (hasAddress) {
                          setProcessing(true);
                        } else {
                          setSettingDemographic(true);
                        }
                      }}
                      leftSection={<IconArrowsRightLeft />}
                    >
                      MAP TO HOMIS
                    </Button>
                  </ButtonGroup>
                )}
            </div>
          </div>
        }
      />
    </>
  );
};

export default MatchPatients;
