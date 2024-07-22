import { useState } from "react";
import moment from "moment";

import { useTable, useFilter } from "../../hooks";
import {
  FilterInput,
  FilterSelect,
  SelectOptionType,
} from "../../components/filters";

import AppTanstackTable, {
  ColumnDefinition,
} from "../../components/tables/AppTanstackTable";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDownload, IconEye } from "@tabler/icons-react";
import { AttachFile } from "../../components/patients";
import Attachments from "../patients/PatientProfile/Attachments";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ForAttachmentRowData {
  id: number;
  patient_chief_complaint_id: number;
  created_at: string;
  chief_complaint: string;
  patient_profile_name: string;
  gender: "male" | "female";
  dob: string;
  contact_no: string;
  transaction_code: string;
  teleclerk: string;
}

const ForAttachments = () => {
  const toggleFilter = useSelector(
    (state: RootState) => state.ui.filterTransaction
  );
  const teleclerks = useSelector((state: RootState) => state.select.teleclerks);
  const [openedAttachment, { open: openAttachment, close: closeAttachment }] =
    useDisclosure(false);
  const [openedViewer, { open: openViewer, close: closeViewer }] =
    useDisclosure(false);
  const [id, setId] = useState<number | null>(null);

  const {
    parameters,
    debouncedParameters,
    inputChangeHandler,
    selectChangeHandler,
  } = useFilter();
  const { data, pagination, isFetching, changePage, isError } = useTable({
    endpoint: "consultations/for-attachment-consultations",
    pageSize: 10,
    parameters: debouncedParameters,
  });

  const columns: ColumnDefinition<ForAttachmentRowData>[] = [
    {
      field: (row) => {
        return (
          <div className="w-[70px]">
            <Button
              variant="transparent"
              px={3}
              color="green"
              title="Upload"
              onClick={() => openAttachment()}
            >
              <IconDownload />
            </Button>
            <Button
              px={3}
              variant="transparent"
              onClick={() => {
                openViewer();
                setId(row.patient_chief_complaint_id);
              }}
              title="View Attachments"
            >
              {" "}
              <IconEye />
            </Button>
          </div>
        );
      },
      header: "Action",
      size: 80,
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
    },
  ];

  return (
    <>
      <AppTanstackTable
        isError={isError}
        isFetching={isFetching}
        columns={columns}
        columnSearch={toggleFilter}
        data={data}
        pagination={pagination}
      />
      <Modal
        opened={openedAttachment}
        onClose={closeAttachment}
        title="New Attachment"
        centered
      >
        <AttachFile />
      </Modal>
      <Modal
        opened={openedViewer}
        onClose={closeViewer}
        title="View Attachments"
        centered
        size="80%"
      >
        {id && <Attachments chief_complaint_id={id} />}
      </Modal>
    </>
  );
};

export default ForAttachments;
