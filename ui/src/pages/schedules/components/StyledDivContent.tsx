import classes from "../classes";
import { styled } from "@mui/material/styles";
const StyledDivContent = styled("div")(() => ({
  [`&.${classes.content}`]: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
  },
}));

export default StyledDivContent;
