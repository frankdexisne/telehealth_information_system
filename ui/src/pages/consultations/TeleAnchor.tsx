import { Tabs, rem, Title, Grid, Switch } from "@mantine/core";
import {
  IconArrowForward,
  IconPhoneCall,
  IconCheckupList,
  IconActivity,
  IconTransfer,
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui";
import PageHeader from "../../components/base/PageHeader";
import Faqs from "../../components/faqs";

const TeleAnchor = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <PageHeader title="Tele Anchor" />
          <Faqs module="tele-anchors" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex justify-end items-center"
        >
          <Switch
            label="FILTER"
            defaultChecked={false}
            onChange={(e) =>
              dispatch(uiActions.toggleFilterTeleAnchor(e.target.checked))
            }
          />
        </Grid.Col>
      </Grid>
      <Tabs
        defaultValue="consultations"
        className="mt-3"
        value={location.pathname.replace("/teleconsulting/tele-anchor/", "")}
        onChange={(value) => navigate("/teleconsulting/tele-anchor/" + value)}
      >
        <Tabs.List className="mb-3">
          <Tabs.Tab
            value="un-triage-consultations"
            leftSection={<IconPhoneCall style={iconStyle} />}
          >
            Untriage
          </Tabs.Tab>
          <Tabs.Tab
            value="triaged-consultations"
            leftSection={<IconArrowForward style={iconStyle} />}
          >
            Triaged
          </Tabs.Tab>
          <Tabs.Tab
            value="active-consultations"
            leftSection={<IconActivity style={iconStyle} />}
          >
            Active
          </Tabs.Tab>
          <Tabs.Tab
            value="completed-consultations"
            leftSection={<IconCheckupList style={iconStyle} />}
          >
            Completed
          </Tabs.Tab>
          <Tabs.Tab
            value="reassign-consultations"
            leftSection={<IconTransfer style={iconStyle} />}
          >
            Reassign
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default TeleAnchor;
