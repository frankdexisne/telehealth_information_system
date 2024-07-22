import PermissionList from "./PermissionList";
import RoleList from "./RoleList";
import type { RouteProps } from "react-router-dom";

type RoutingProps = RouteProps & {
  isPrivate: boolean;
  role?: RoleList[];
  permission?: PermissionList;
  children?: RouteProps[];
};

export default RoutingProps;
