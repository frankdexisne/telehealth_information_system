export const ADMINISTRATOR: string = "administrator";
export const DOCTOR: string = "doctor";
export const TELEANCHOR: string = "teleanchor";
export const TELECLERK: string = "teleclerk";

type Role =
  | typeof ADMINISTRATOR
  | typeof DOCTOR
  | typeof TELEANCHOR
  | typeof TELECLERK;

export default Role;
