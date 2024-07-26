import { Tabs, rem } from "@mantine/core";
import {
  IconArrowForward,
  IconPhoneCall,
  IconCheckupList,
  IconActivity,
  IconTransfer,
} from "@tabler/icons-react";
import NewConsultations from "./NewConsultations";
import FollowUpConsultations from "./FollowUpConsultations";
import ActiveConsultations from "./ActiveConsultations";
import CompletedConsultations from "./CompletedConsultations";
import OutWhenCalled from "./OutWhenCalled";
import PageHeader from "../../components/base/PageHeader";

const TeleConsulting = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div>
      <PageHeader title="Teleconsulting" />
      <Tabs defaultValue="unfinished" className="mt-3">
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="unfinished"
            leftSection={<IconPhoneCall style={iconStyle} />}
          >
            Unfinished
          </Tabs.Tab>
          <Tabs.Tab
            value="new_consultations"
            leftSection={<IconArrowForward style={iconStyle} />}
          >
            New Consultations
          </Tabs.Tab>
          <Tabs.Tab
            value="follow_ups"
            leftSection={<IconActivity style={iconStyle} />}
          >
            Follow Up Consultations
          </Tabs.Tab>
          <Tabs.Tab
            value="active"
            leftSection={<IconCheckupList style={iconStyle} />}
          >
            Active Consultation
          </Tabs.Tab>
          <Tabs.Tab
            value="completed"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Completed
          </Tabs.Tab>
          <Tabs.Tab
            value="schedules"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Schedules
          </Tabs.Tab>
          <Tabs.Tab
            value="out_when_called"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Out When Called
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="unfinished">UNFINISHED</Tabs.Panel>

        <Tabs.Panel value="new_consultations">
          <NewConsultations />
        </Tabs.Panel>

        <Tabs.Panel value="follow_ups">
          <FollowUpConsultations />
        </Tabs.Panel>
        <Tabs.Panel value="active">
          <ActiveConsultations />
        </Tabs.Panel>
        <Tabs.Panel value="completed">
          <CompletedConsultations />
        </Tabs.Panel>
        <Tabs.Panel value="schedules">SCHEDULES</Tabs.Panel>
        <Tabs.Panel value="out_when_called">
          <OutWhenCalled />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TeleConsulting;
