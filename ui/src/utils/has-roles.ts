import { useSelector } from "react-redux";
import { RootState } from "../store";
import RoleList from "../interfaces/RoleList";
import { ADMINISTRATOR } from "../interfaces/RoleList";
const HasRoles = (roles: RoleList[]) => {
  const role = useSelector((state: RootState) => state.auth.user.role_name);

  return role === ADMINISTRATOR || roles.includes(role);
};

export default HasRoles;
