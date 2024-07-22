import classes from "../classes";
import { styled } from "@mui/material/styles";
import FilterDrama from "@mui/icons-material/FilterDrama";

const StyledFilterDrama = styled(FilterDrama)(() => ({
  [`&.${classes.cloud}`]: {
    color: "#90A4AE",
  },
}));

export default StyledFilterDrama;
