import {
  Divider,
  Drawer,
  Grid,
  Title,
  Button,
  Modal,
  Select,
} from "@mantine/core";
import { PatientSearch } from "../../../components/patients";
import { useDisclosure } from "@mantine/hooks";
import { ApiSelect, TextInput } from "../../../components/use-form-controls";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TeleserviceForm from "./TeleserviceForm";
import moment from "moment";
import { PatientSearchForm } from "../../../components/patients/PatientSearch";
import PatientResult from "./PatientResult";
import { IconSearch, IconUserSearch } from "@tabler/icons-react";
import PatientProfiling from "./PatientProfiling";

type SearchType = "teleserve-reffered" | "teleconsult" | null;

const PatientCreate = () => {
  const [searchType, setSearchType] = useState<SearchType>(null);
  const [patient, setPatient] = useState<PatientSearchForm | null>(null);
  const { control, watch, getValues, setValue } = useForm();
  const [isInquiry, setIsInquiry] = useState(false);
  const [isTeleconsult, setIsTeleconsult] = useState(false);
  const [isOpen, { open, close }] = useDisclosure(false);
  const [
    createReferral,
    { open: openCreateReferral, close: closeCreateReferral },
  ] = useDisclosure(false);
  const [
    createPatient,
    { open: openCreatePatient, close: closeCreatePatient },
  ] = useDisclosure(false);

  const mode = watch("mode");
  const informant = watch("informant");
  const log_datetime = watch("log_datetime");
  return (
    <div>
      <Title order={2} className="text-blue-500">
        Patient Create
      </Title>
      <Divider my={10} />
      <Grid>
        <Grid.Col span={3}>
          <ApiSelect
            api="selects/platforms"
            control={control}
            name="platform"
            label="Platform"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            type="datetime-local"
            label="Log Date & Time"
            control={control}
            name="log_datetime"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="Informant"
            control={control}
            name="informant"
            isRequired
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            data={[
              {
                value: "teleserve-inquiry",
                label: "Teleserve (Inquiry)",
              },
              {
                value: "teleserve-reffered",
                label: "Teleserve (Reffered to OPD)",
              },
              {
                value: "teleconsult",
                label: "Tele-Consult",
              },
            ]}
            label="Mode"
            name="mode"
            onChange={(value) => {
              console.log(value);
              setValue("mode", value);
              setIsInquiry(value === "teleserve-inquiry");
              if (value !== "teleserve-inquiry") {
                setSearchType(value as "teleserve-reffered" | "teleconsult");
              }
              setIsTeleconsult(value === "teleconsult");
              // else {
              //   setSearchType(null);
              // }
            }}
          />
        </Grid.Col>
      </Grid>
      <Divider my={10} />

      {isInquiry && (
        <>
          <Title size={16} order={3}>
            Inquiry Form
          </Title>
          <TeleserviceForm
            logData={{
              date: moment(log_datetime).format("YYYY-MM-DD"),
              time: moment(log_datetime).format("HH:mm"),
              informant: informant,
            }}
            platform={mode}
          />
        </>
      )}

      {!isInquiry && (
        <>
          <Grid>
            <Grid.Col span={6}>
              <Title size={16} order={3} pt={6}>
                SEARCH RESULT{" "}
              </Title>
            </Grid.Col>
            <Grid.Col span={6} className="flex justify-end">
              <Button onClick={open} leftSection={<IconUserSearch />}>
                PATIENT SEARCH
              </Button>
            </Grid.Col>
          </Grid>

          <Divider my={10} />
          {patient && (
            <PatientResult
              filter={{
                hpercode: patient.hpercode || "",
                fname: patient.fname || "",
                mname: patient.mname || "",
                lname: patient.lname || "",
              }}
              onCreate={() => {
                if (mode === "teleconsult") {
                  openCreatePatient();
                } else {
                  console.log("create referred patient");
                }
              }}
              onSearch={() => {
                open();
              }}
              onSelect={(id) => {
                console.log(getValues("mode"), mode, searchType);
                console.log(isTeleconsult);
                if (searchType === "teleconsult") {
                  openCreatePatient();
                  console.log("TELECONSULT");
                } else {
                  openCreateReferral();
                  console.log("REFERRAL");
                }
              }}
            />
          )}
        </>
      )}

      <Modal
        opened={createPatient}
        onClose={closeCreatePatient}
        size="calc(100vw - 3rem)"
        title={<h3 className="text-2xl">New Patient Profile</h3>}
      >
        <PatientProfiling
          onSuccess={() => {
            close();
          }}
          lname={patient?.lname || ""}
          fname={patient?.fname || ""}
          mname={patient?.mname || ""}
          logData={{
            date: moment(log_datetime).format("YYYY-MM-DD"),
            time: moment(log_datetime).format("HH:mm"),
            informant: informant,
          }}
          platform={mode}
        />
      </Modal>

      <Modal
        opened={createReferral}
        onClose={closeCreateReferral}
        size="lg"
        title={<h3 className="text-2xl">New Referrred Patient Profile</h3>}
        centered
      ></Modal>

      <Drawer
        opened={isOpen}
        onClose={close}
        title="Patient Search"
        position="right"
      >
        {searchType !== null && (
          <PatientSearch
            type={searchType}
            onSubmit={(payload: PatientSearchForm) => {
              setPatient(payload);
              close();
            }}
          />
        )}
      </Drawer>
    </div>
  );
};

export default PatientCreate;
