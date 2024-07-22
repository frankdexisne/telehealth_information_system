import { useSelector } from "react-redux";
import { RootState } from "../store";
import PermissionList from "../interfaces/PermissionList";
import { ADMINISTRATOR } from "../interfaces/RoleList";

const HasPermission = (permission: PermissionList): boolean => {
  const role = useSelector((state: RootState) => state.auth.user.role_name);
  const permissions = useSelector((state: RootState) => state.auth.permissions);

  return role === ADMINISTRATOR || permissions?.includes(permission);
};

export default HasPermission;
