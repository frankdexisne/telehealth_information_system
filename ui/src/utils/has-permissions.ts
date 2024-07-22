import { useSelector } from "react-redux";
import { RootState } from "../store";
import PermissionList from "../interfaces/PermissionList";

const HasPermissions = (permissions: PermissionList[]): boolean => {
  const permissionLists = useSelector(
    (state: RootState) => state.auth.permissions
  );

  return (
    permissions?.some((permission) => permissionLists?.includes(permission)) ||
    false
  );
};

export default HasPermissions;
