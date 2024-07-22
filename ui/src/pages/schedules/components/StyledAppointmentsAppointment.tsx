import classes from "../classes";
import { styled } from "@mui/material/styles";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderRadius: "10px",
    "&:hover": {
      opacity: 0.6,
    },
  },
}));

export default StyledAppointmentsAppointment;
