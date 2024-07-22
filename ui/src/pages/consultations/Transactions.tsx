import { Tabs, rem, Title, Grid, Switch } from "@mantine/core";
import { IconUser, IconListCheck, IconUserCog } from "@tabler/icons-react";
import HasPermission from "../../utils/has-permission";
import {
  CONSULTATION_ADDITIONAL_ADVICE,
  CONSULTATION_FOLLOW_UP,
  CONSULTATION_FOR_ATTACHMENT,
  CONSULTATION_FOR_PRESCRIPTION,
  CONSULTATION_NEW,
  CONSULTATION_OUT_WHEN_CALLED,
  PATIENT_BIND,
} from "../../interfaces/PermissionList";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { uiActions } from "../../store/slices/ui";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/base/PageHeader";
import Faqs from "../../components/faqs";

const Transactions = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <PageHeader title="Transaction Logs" />
          <Faqs module="tele-clerks" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex justify-end items-center"
        >
          <Switch
            label="FILTER"
            defaultChecked={false}
            onChange={(e) => {
              dispatch(uiActions.toggleFilterTransaction(e.target.checked));
            }}
          />
        </Grid.Col>
      </Grid>

      <Tabs
        className="mt-3"
        value={location.pathname.replace("/transactions/", "")}
        onChange={(value) => navigation("/transactions/" + value)}
      >
        <Tabs.List className="mb-3">
          {HasPermission(CONSULTATION_NEW) && (
            <Tabs.Tab
              value="new-consultations"
              leftSection={<IconUser style={iconStyle} />}
            >
              New Consultations
            </Tabs.Tab>
          )}
          {HasPermission(CONSULTATION_FOLLOW_UP) && (
            <Tabs.Tab
              value="follow-up-consultations"
              leftSection={<IconUserCog style={iconStyle} />}
            >
              Follow up
            </Tabs.Tab>
          )}
          {HasPermission(CONSULTATION_ADDITIONAL_ADVICE) && (
            <Tabs.Tab
              value="additional-advice-consultations"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              Additional Advice
            </Tabs.Tab>
          )}
          {HasPermission(CONSULTATION_FOR_ATTACHMENT) && (
            <Tabs.Tab
              value="for-attachment-consultations"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              Attachment
            </Tabs.Tab>
          )}
          {HasPermission(CONSULTATION_FOR_PRESCRIPTION) && (
            <Tabs.Tab
              value="for-prescription-consultations"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              Prescription
            </Tabs.Tab>
          )}
          {HasPermission(CONSULTATION_OUT_WHEN_CALLED) && (
            <Tabs.Tab
              value="out-when-called-consultations"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              Out when called
            </Tabs.Tab>
          )}

          {HasPermission(PATIENT_BIND) && (
            <Tabs.Tab
              value="forward-to-homis-consultations"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              HOMIS Mapping
            </Tabs.Tab>
          )}
        </Tabs.List>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default Transactions;
