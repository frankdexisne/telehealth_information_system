import { Modal, Divider, Grid, Switch, Paper, Title } from "@mantine/core";
import { useState } from "react";
import {
  PatientSearch,
  SelectPlatform,
  plaformType,
  SearchViaHospNoType,
  SearchViaNameType,
} from "../../../components/patients";
import PatientResult from "./PatientResult";
import PatientProfiling from "./PatientProfiling";
import { useDisclosure } from "@mantine/hooks";
import CreateConsultationDetail from "./CreateConsultationDetail";
import { ChieftComplaintFormData } from "./ChiefComplaintForm";
import { postRequest } from "../../../hooks/use-http";
import TeleserviceForm from "./TeleserviceForm";
import { TextInput } from "@mantine/core";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/base/PageHeader";

export type FilterType = SearchViaHospNoType | SearchViaNameType;
export interface LogData {
  date: string;
  time: string;
  informant: string;
}

const PatientCreate = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [showPatientResult, setShowPatientResult] = useState(false);
  const [patientId, setPatientId] = useState<number>();
  const [isProceed, setIsProceed] = useState<boolean>(false);
  const [patientFilter, setPatientFilter] = useState<FilterType>(
    {} as FilterType
  );
  const [seletectPlatform, setSelectedPlatform] =
    useState<plaformType>("facebook/messenger");
  const [isTeleconsult, setIsTeleconsult] = useState<boolean>(false);
  const [logData, setLogData] = useState<LogData>({
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:ss"),
    informant: "",
  });

  const saveChiefComplaintHandler = (payload: ChieftComplaintFormData) => {
    const plaformIds = {
      call: 1,
      "facebook/messenger": 2,
      radio: 3,
      viber: 4,
    };

    const platformId = seletectPlatform ? plaformIds[seletectPlatform] : 2;

    const formData = {
      ...payload,
      log_date: logData.date,
      log_time: logData.time,
      informant: logData.informant,
      platform_id: platformId,
    };

    postRequest(`/patient-chief-complaints/${patientId}`, formData).then(() => {
      setPatientId(undefined);
      setIsProceed(false);
      setSelectedPlatform("facebook/messenger");
    });
  };

  return (
    <>
      <div>
        {/* <Divider
          label={
            <h3 className="text-lg text-blue-700">Communication Platform</h3>
          }
          size="lg"
          my={5}
          labelPosition="left"
        />

        <SelectPlatform
          onConfirm={(platform: plaformType) => {
            setSelectedPlatform(platform);
          }}
          onReset={() => console.log("reset")}
        /> */}

        <Grid>
          <Grid.Col span={{ base: 12, lg: 9 }}>
            <PageHeader title="CREATE PATIENT" />
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, lg: 3 }}
            className="flex items-center justify-end"
          >
            <Switch
              size="xl"
              onLabel="YES"
              offLabel="NO"
              label="Teleconsult"
              onChange={(event) =>
                setIsTeleconsult(event.currentTarget.checked)
              }
            />
          </Grid.Col>
        </Grid>

        {!isTeleconsult && (
          <>
            <TeleserviceForm logData={logData} platform={seletectPlatform} />
          </>
        )}

        {isTeleconsult && (
          <>
            {isProceed && patientId && seletectPlatform && (
              <CreateConsultationDetail
                id={patientId}
                onCancel={() => setIsProceed(false)}
                onSubmit={saveChiefComplaintHandler}
                platform={seletectPlatform}
              />
            )}

            {!isProceed && (
              <div className="w-full">
                {/* <Divider
                  label={
                    <h3 className="text-lg text-blue-700">Selecting Patient</h3>
                  }
                  size="lg"
                  my={10}
                  labelPosition="left"
                /> */}
                <Grid>
                  <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Paper py="lg" px="md" shadow="lg">
                      <Title size={16} c="blue">
                        SEARCH PATIENT
                      </Title>
                      <PatientSearch
                        type="teleconsult"
                        onSubmit={(payload) => {
                          setPatientFilter(payload);
                          setShowPatientResult(true);
                        }}
                      />
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, lg: 8 }}>
                    {showPatientResult && (
                      <PatientResult
                        searched={patientFilter !== null}
                        filter={patientFilter}
                        onCreate={open}
                        onSearch={() => {
                          setShowPatientResult(false);
                        }}
                        onSelect={(id) => {
                          setPatientId(id);
                          setIsProceed(true);
                        }}
                      />
                    )}
                  </Grid.Col>
                </Grid>
              </div>
            )}
          </>
        )}
      </div>

      {isTeleconsult && (
        <Modal
          opened={opened}
          onClose={close}
          size="calc(100vw - 3rem)"
          title={<h3 className="text-2xl">New Patient Profile</h3>}
        >
          <PatientProfiling
            onSuccess={() => {
              close();
              setIsProceed(false);
              setPatientId(undefined);
              setPatientFilter({} as FilterType);
              setShowPatientResult(false);
              setSelectedPlatform("facebook/messenger");
              navigate("/patients");
            }}
            lname={patientFilter["lname" as keyof FilterType] || ""}
            fname={patientFilter["fname" as keyof FilterType] || ""}
            mname={patientFilter["mname" as keyof FilterType] || ""}
            logData={logData}
            platform={seletectPlatform}
          />
        </Modal>
      )}
    </>
  );
};

export default PatientCreate;
