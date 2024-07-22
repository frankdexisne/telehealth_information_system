import classes from "../classes";
import { styled } from "@mui/material/styles";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    flex: "none",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
  },
}));

export default StyledToolbarFlexibleSpace;
