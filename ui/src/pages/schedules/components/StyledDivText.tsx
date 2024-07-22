import classes from "../classes";
import { styled } from "@mui/material/styles";

const StyledDivText = styled("div")(() => ({
  [`&.${classes.text}`]: {
    padding: "0.5em",
    textAlign: "center",
  },
}));

export default StyledDivText;
