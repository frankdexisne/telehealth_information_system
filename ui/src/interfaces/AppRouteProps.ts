import type { PathRouteProps } from "react-router-dom";
import RoleList from "./RoleList";
import PermissionList from "./PermissionList";

export type BaseRouteProps = PathRouteProps & {
  isPrivate?: boolean;
  Component: React.ComponentType<any>;
  role?: RoleList;
  permission?: PermissionList;
};

type AppRouteProps = BaseRouteProps & {
  isPrivate?: boolean;
  permission?: PermissionList;
  childRoutes?: AppRouteProps[];
};

export default AppRouteProps;
