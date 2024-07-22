import classes from "../classes";
import { styled } from "@mui/material/styles";
import WbSunny from "@mui/icons-material/WbSunny";

const StyledWbSunny = styled(WbSunny)(() => ({
  [`&.${classes.sun}`]: {
    color: "#FFEE58",
  },
}));

export default StyledWbSunny;
