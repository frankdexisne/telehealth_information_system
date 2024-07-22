import StyledAppointmentsAppointmentContent from "./StyledAppointmentsAppointmentContent";
import classes from "../classes";
const AppointmentContent = ({ ...restProps }) => (
  <StyledAppointmentsAppointmentContent
    className={classes.apptContent}
    data={restProps.data}
    resources={restProps.resources}
    recurringIconComponent={restProps.recurringIconComponent}
    type={restProps.type}
    formatDate={restProps.formatDate}
    durationType={restProps.durationType}
  />
);

export default AppointmentContent;
