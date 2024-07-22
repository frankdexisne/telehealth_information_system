import { Tabs, Title, Grid, Divider } from "@mantine/core";
import {
  IconCalendarUser,
  IconCheckupList,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import classes from "./PatientCreate.module.css";
import { useState } from "react";
import Teleconsulting from "./Teleconsulting";
import TeleserviceForm from "./TeleserviceForm";
import moment from "moment";
import Referral from "../../schedules/Referral";
import PatientAppointment from "./PatientAppointment";

const PatientCreate = () => {
  const [activeTab, setActiveTab] = useState("teleconsult");
  return (
    <div>
      <Grid>
        <Grid.Col span={6}>
          <Title
            size={32}
            className="text-blue-600 flex"
            style={{ textTransform: "uppercase" }}
          >
            <IconUser size={32} className="mt-1" />
            CREATE PATIENT
          </Title>
        </Grid.Col>
        <Grid.Col span={6} className="flex justify-end flex-col">
          <Tabs
            // orientation="vertical"
            variant="unstyled"
            classNames={classes}
            defaultValue="teleconsult"
            onChange={(value) => setActiveTab(value!)}
          >
            <Tabs.List justify="flex-end" grow>
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
          </Tabs>
        </Grid.Col>
      </Grid>
      <Divider my={15} />
      {activeTab === "teleconsult" && <Teleconsulting />}
      {activeTab === "referred" && <PatientAppointment />}
      {activeTab === "inquiry" && (
        <TeleserviceForm
          logData={{
            log_datetime: moment().format("YYYY-MM-DD HH:mm"),
            informant: "",
          }}
          platform="facebook/messenger"
        />
      )}
    </div>
  );
};

export default PatientCreate;
