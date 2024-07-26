import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Tabs, rem } from "@mantine/core";
import { IconUser, IconListCheck, IconUserCog } from "@tabler/icons-react";
import HasPermission from "../../utils/has-permission";
import {
  USER_LIST,
  DEPARTMENT_LIST,
  ROLE_LIST,
} from "../../interfaces/PermissionList";
import PageHeader from "../../components/base/PageHeader";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div>
      <div className="w-full flex">
        <div className="w-[50%]">
          <PageHeader title="Settings" />
        </div>
        <div className="w-[50%] flex  items-center"></div>
      </div>
      <Tabs
        value={location.pathname.replace("/settings/", "")}
        className="mt-3"
        onChange={(value) => navigate(`/settings/${value}`)}
      >
        <Tabs.List className="mb-3">
          {HasPermission(USER_LIST) && (
            <Tabs.Tab
              value="users"
              leftSection={<IconUser style={iconStyle} />}
            >
              Users
            </Tabs.Tab>
          )}
          {HasPermission(ROLE_LIST) && (
            <Tabs.Tab
              value="roles"
              leftSection={<IconUserCog style={iconStyle} />}
            >
              Roles
            </Tabs.Tab>
          )}
          {HasPermission(DEPARTMENT_LIST) && (
            <Tabs.Tab
              value="departments"
              leftSection={<IconListCheck style={iconStyle} />}
            >
              Departments
            </Tabs.Tab>
          )}
        </Tabs.List>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default Settings;
