export type PermissionList =
  | "users.index"
  | "patients.index"
  | "users.store"
  | "users.update"
  | "patients.index"
  | "patients.store"
  | "patients.destroy"
  | "patients.update";

interface PermissionInterface {
  permission?: PermissionList;
}

export default PermissionInterface;
