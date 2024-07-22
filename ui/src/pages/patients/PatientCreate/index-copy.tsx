import {
  Grid,
  Tabs,
  Select,
  TextInput,
  Title,
  Divider,
  Paper,
  Modal,
} from "@mantine/core";
import { DateInput, TimeInput, DatePicker } from "@mantine/dates";
import {
  IconCalendarUser,
  IconCheckupList,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import classes from "./PatientCreate.module.css";
import {
  PatientSearch as TeleConsultSearch,
  PatientSearch as ReferralSearch,
} from "../../../components/patients";
import { PatientSearchForm } from "../../../components/patients/PatientSearch";
import TeleserviceForm from "./TeleserviceForm";
import TeleconsultPatientResult from "./PatientResult";
import ReferralPatientResult from "./PatientResult";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import PatientProfiling from "./PatientProfiling";
import moment from "moment";

const PatientCreate = () => {
  const [
    openedCreatePatientModal,
    { open: openCreatePatientModal, close: closeCreatePatientModal },
  ] = useDisclosure(false);
  const [
    openedCreatePatientReferralModal,
    {
      open: openCreatePatientReferralModal,
      close: closeCreatePatientReferralModal,
    },
  ] = useDisclosure(false);

  const [patient, setPatient] = useState<PatientSearchForm | null>(null);
  const [referral, setReferral] = useState<PatientSearchForm | null>(null);
  return (
    <div>
      <Grid>
        <Grid.Col span={3} className="flex justify-start items-center">
          <Title
            size={45}
            className="text-blue-600 flex"
            style={{ textTransform: "uppercase" }}
          >
            <IconUser size={45} className="mt-1" />
            Patient Create
          </Title>
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput label="Informant" />
        </Grid.Col>
        <Grid.Col span={3}>
          <DateInput label="Log Date" />
        </Grid.Col>
        <Grid.Col span={3}>
          <TimeInput label="Log time" />
        </Grid.Col>
      </Grid>
      <Divider my={15} />
      <Tabs
        // orientation="vertical"
        mt={15}
        classNames={classes}
        defaultValue="teleconsult"
      >
        <Tabs.List>
          <Tabs.Tab value="teleconsult" leftSection={<IconCheckupList />}>
            Teleconsultation
          </Tabs.Tab>
          <Tabs.Tab value="referred" leftSection={<IconCalendarUser />}>
            Reffered to OPD
          </Tabs.Tab>
          <Tabs.Tab value="inquiry" leftSection={<IconPhoneCall />}>
            Inquiry
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="teleconsult" px={10}>
          <Grid mt={10}>
            <Grid.Col span={3}>
              <Paper p="lg">
                <Title size={16}>Search Patient</Title>
                <TeleConsultSearch
                  type="teleconsult"
                  onSubmit={(payload: PatientSearchForm) => {
                    setPatient(payload);
                  }}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={9}>
              <TeleconsultPatientResult
                searched={patient !== null}
                filter={{
                  hpercode: patient?.hpercode,
                  fname: patient?.fname,
                  mname: patient?.mname,
                  lname: patient?.lname,
                }}
                onCreate={() => {
                  openCreatePatientModal();
                }}
                onSearch={() => {
                  open();
                }}
                onSelect={(id) => {}}
              />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
        <Tabs.Panel value="inquiry" px={10}>
          <TeleserviceForm />
        </Tabs.Panel>
        <Tabs.Panel value="referred" px={10}>
          <Grid mt={10}>
            <Grid.Col span={3}>
              <Paper p="lg">
                <Title size={16}>Search Patient</Title>
                <ReferralSearch
                  type="teleserve-reffered"
                  onSubmit={(payload: PatientSearchForm) => {
                    setReferral(payload);
                  }}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={9}>
              <ReferralPatientResult
                searched={referral !== null}
                referral={true}
                filter={{
                  hpercode: referral?.hpercode,
                  fname: referral?.fname,
                  mname: referral?.mname,
                  lname: referral?.lname,
                }}
                onCreate={() => {
                  openCreatePatientReferralModal();
                }}
                onSearch={() => {
                  open();
                }}
                onSelect={(id) => {}}
              />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={openedCreatePatientModal}
        onClose={closeCreatePatientModal}
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
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm"),
            informant: "test",
          }}
          platform="facebook/messenger"
        />
      </Modal>

      <Modal
        opened={openedCreatePatientReferralModal}
        onClose={closeCreatePatientReferralModal}
        size="lg"
        title={<h3 className="text-2xl">New Referrred Patient Profile</h3>}
        centered
      ></Modal>
    </div>
  );
};

export default PatientCreate;
