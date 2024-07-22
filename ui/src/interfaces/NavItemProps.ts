import { NavLinkProps as MantineNavLinkProps } from "@mantine/core";
import PermissionList from "./PermissionList";
import RoleList from "./RoleList";

interface NavItemProps extends MantineNavLinkProps {
  to: string;
  lefticon: JSX.ElementType;
  permissions?: PermissionList[];
  roles?: RoleList[];
}

export default NavItemProps;
