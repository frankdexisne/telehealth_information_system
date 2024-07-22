import { Tabs, rem, Title, Grid } from "@mantine/core";
import { IconUser, IconChecklist, IconProgress } from "@tabler/icons-react";
import ActiveConsultations from "./consultations/ActiveConsultations";
import CompletedConsultations from "./consultations/CompletedConsultations";
import NewConsultations from "./consultations/NewConsultations";
import PageHeader from "../../components/base/PageHeader";
const Telemedicine = () => {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <PageHeader title="Tele-Medicine" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}></Grid.Col>
      </Grid>
      <Tabs
        defaultValue="new_consultations"
        className="mt-3"
        keepMounted={false}
      >
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="new_consultations"
            leftSection={<IconUser style={iconStyle} />}
          >
            New Consultations
          </Tabs.Tab>
          <Tabs.Tab
            value="active_consultations"
            leftSection={<IconProgress style={iconStyle} />}
          >
            Active Consultations
          </Tabs.Tab>
          <Tabs.Tab
            value="completed_consultations"
            leftSection={<IconChecklist style={iconStyle} />}
          >
            Completed Consultations
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="new_consultations">
          <NewConsultations />
        </Tabs.Panel>
        <Tabs.Panel value="active_consultations">
          <ActiveConsultations />
        </Tabs.Panel>
        <Tabs.Panel value="completed_consultations">
          <CompletedConsultations />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Telemedicine;
