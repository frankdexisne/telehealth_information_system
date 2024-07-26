import { Tabs, rem, Grid, Switch } from "@mantine/core";
import {
  IconArrowForward,
  IconPhoneCall,
  IconCheckupList,
  IconActivity,
  IconTransfer,
} from "@tabler/icons-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui";
import PageHeader from "../../components/base/PageHeader";
import Faqs from "../../components/faqs";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <PageHeader title="Teleconsulting" />
          <Faqs module="tele-consultations" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex justify-end items-center"
        >
          <Switch
            label="FILTER"
            defaultChecked={false}
            onChange={(e) =>
              dispatch(uiActions.toggleFilterTeleConsulting(e.target.checked))
            }
          />
        </Grid.Col>
      </Grid>
      <Tabs
        value={location.pathname.replace("/teleconsulting/doctor/", "")}
        onChange={(value) => navigate("/teleconsulting/doctor/" + value)}
        className="mt-3"
      >
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="unfinished-consultations"
            leftSection={<IconPhoneCall style={iconStyle} />}
          >
            Unfinished
          </Tabs.Tab>
          <Tabs.Tab
            value="un-assign-consultations"
            leftSection={<IconArrowForward style={iconStyle} />}
          >
            Un-Assigned
          </Tabs.Tab>
          <Tabs.Tab
            value="follow-up-consultations"
            leftSection={<IconActivity style={iconStyle} />}
          >
            Follow Up
          </Tabs.Tab>
          <Tabs.Tab
            value="active-consultations"
            leftSection={<IconCheckupList style={iconStyle} />}
          >
            Active Consultation
          </Tabs.Tab>
          <Tabs.Tab
            value="completed-consultations"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Completed
          </Tabs.Tab>
          <Tabs.Tab
            value="scheduled-consultations"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Schedules
          </Tabs.Tab>
          <Tabs.Tab
            value="out-when-called-consultations"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Out When Called
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default Doctors;
