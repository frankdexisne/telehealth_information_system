import {
  SearchViaHospNoType,
  SearchViaNameType,
} from "../../../components/patients";
import useTable from "../../../hooks/use-table";
import { PatientRowData } from "..";
import AppTanstackTable, {
  ColumnDefinition,
} from "../../../components/tables/AppTanstackTable";
import { ButtonGroup, Button } from "@mantine/core";
import { IconUserPlus, IconArrowRight } from "@tabler/icons-react";
import moment from "moment";
import { getRequest } from "../../../hooks/use-http";
import { Modal } from "@mantine/core";
import AdditionalPatientFormData from "./AdditionaPatientFormData";
import AdditionalReferralFormData from "./AdditionalPatientReferralFormData";
import { useNavigate } from "react-router-dom";

interface PatientResultProps {
  filter: SearchViaHospNoType | SearchViaNameType;
  onCreate: () => void;
  onSearch: () => void;
  onSelect: (id: number, data: any) => void;
  onSelectFromHOMIS: (hpercode: string, data: any) => void;
  searched?: boolean;
  referral?: boolean;
}
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const PatientResult = ({
  filter,
  onCreate,
  onSelect,
  onSelectFromHOMIS,
  searched = false,
  referral = false,
}: PatientResultProps) => {
  const navigate = useNavigate();
  const { data, pagination, isFetching, isError } = useTable({
    endpoint: "patients/search",
    pageSize: 5,
    parameters: { ...filter, searching: true },
  });
  const [opened, { close }] = useDisclosure(false);
  const [hpercode, setHpercode] = useState<string | null>(null);

  const validatingHandler = (hpercode: string) => {
    getRequest(`/patients/${hpercode}/validate`).then((res) => {
      if (res.data.cloned === 0) {
        // open();
        onSelectFromHOMIS(hpercode, res.data);
      } else {
        onSelect(res.data.id, res.data);
      }
    });
  };

  const columns: ColumnDefinition<PatientRowData>[] = [
    {
      field: "hpercode",
      header: "Hospital Number",
    },
    {
      field: "lname",
      header: "Lastname",
    },
    {
      field: "fname",
      header: "Firstname",
    },
    {
      field: "mname",
      header: "Middlename",
    },
    {
      field: (row) => moment(row.dob).format("MM/DD/YYYY"),
      header: "Date of Birth",
    },
    {
      field: (row) => row.gender.toUpperCase(),
      header: "Gender",
    },
    {
      field: (row) => {
        if (row.hpercode) {
          return (
            <Button
              variant="transparent"
              onClick={() => {
                setHpercode(row.hpercode);
                validatingHandler(row.hpercode);
              }}
            >
              Proceed <IconArrowRight />
            </Button>
          );
        }

        return (
          <Button onClick={() => onSelect(row.id, row)} variant="transparent">
            Proceed <IconArrowRight />
          </Button>
        );
      },
      header: "Action",
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
        EmptyContent={
          <div className="w-full flex flex-col justify-center gap-4">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-300">
                {searched === true ? (
                  <span>--NO RECORD FOUND--</span>
                ) : (
                  <span>--PLEASE ENTER CRITERIA FOR SEARCH--</span>
                )}
              </h2>
            </div>
            <div className="w-full flex justify-center">
              {searched === true && (
                <ButtonGroup>
                  <Button w={250} onClick={onCreate}>
                    <IconUserPlus /> CREATE PATIENT PROFILE
                  </Button>
                </ButtonGroup>
              )}
            </div>
          </div>
        }
      />

      {!referral && (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <h3 className="text-2xl flex items-center">
              Completing Patient Information
              <small className="text-xs ml-1 font-bold text-slate-600">
                (HOMIS - Telehealth Patient)
              </small>
            </h3>
          }
          size="lg"
        >
          {hpercode && (
            <AdditionalPatientFormData
              hpercode={hpercode}
              onSubmit={(res) => {
                close();
                if (res.data?.id) {
                  navigate("/patients/" + res.data?.id + "/view");
                }
              }}
              onCancel={() => close()}
            />
          )}
        </Modal>
      )}

      {referral && (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <h3 className="text-2xl flex items-center">
              Referral Information
              <small className="text-xs ml-1 font-bold text-slate-600">
                (HOMIS - Telehealth Patient)
              </small>
            </h3>
          }
          size="lg"
        >
          {hpercode && (
            <AdditionalReferralFormData
              hpercode={hpercode}
              onSubmit={(res) => {
                close();
                if (res.data?.id) {
                  navigate("/patients/" + res.data?.id + "/view");
                }
              }}
              onCancel={() => close()}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default PatientResult;
