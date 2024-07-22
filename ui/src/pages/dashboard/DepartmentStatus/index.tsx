import Assigned from "./Assigned";
import OnGoing from "./OnGoing";
import Closed from "./Closed";
import { Tabs } from "@mantine/core";
import {
  IconCalendarUser,
  IconProgress,
  IconChecklist,
} from "@tabler/icons-react";
import { rem } from "@mantine/core";

export interface BaseDepartmentStatusProps {
  id: null | number;
  year: number;
  month: number;
}

const DepartmentStatus = ({ id, year, month }: BaseDepartmentStatusProps) => {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div>
      <Tabs defaultValue="assigned" className="mt-3">
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="assigned"
            leftSection={<IconCalendarUser style={iconStyle} />}
          >
            Triaged
          </Tabs.Tab>
          <Tabs.Tab
            value="on-going"
            leftSection={<IconProgress style={iconStyle} />}
          >
            Active
          </Tabs.Tab>
          <Tabs.Tab
            value="closed"
            leftSection={<IconChecklist style={iconStyle} />}
          >
            Closed
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="assigned">
          <Assigned id={id} year={year} month={month} />
        </Tabs.Panel>
        <Tabs.Panel value="on-going">
          <OnGoing id={id} year={year} month={month} />
        </Tabs.Panel>
        <Tabs.Panel value="closed">
          <Closed id={id} year={year} month={month} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default DepartmentStatus;
