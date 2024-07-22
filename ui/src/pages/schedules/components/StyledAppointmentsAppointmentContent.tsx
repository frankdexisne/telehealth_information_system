import classes from "../classes";
import { styled } from "@mui/material/styles";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

const StyledAppointmentsAppointmentContent = styled(
  Appointments.AppointmentContent
)(() => ({
  [`&.${classes.apptContent}`]: {
    "&>div>div": {
      whiteSpace: "normal !important",
      lineHeight: 1.2,
    },
  },
}));

export default StyledAppointmentsAppointmentContent;
