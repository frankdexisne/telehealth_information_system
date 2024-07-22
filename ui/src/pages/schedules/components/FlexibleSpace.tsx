import classes from "../classes";
import { styled } from "@mui/material/styles";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";
import { Typography } from "@mui/material";
import { IconCalendar } from "@tabler/icons-react";
import { Select } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useState } from "react";

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    flex: "none",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
  },
}));

const FlexibleSpace = ({ onChange, ...restProps }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const departments = useSelector(
    (state: RootState) => state.select.departments
  );
  return (
    <StyledToolbarFlexibleSpace
      {...restProps}
      className={classes.flexibleSpace}
    >
      <div className={classes.flexContainer}>
        <IconCalendar />
        <Select
          placeholder="Select department"
          value={selectedDepartment}
          onChange={(value) => {
            setSelectedDepartment(value);
            if (onChange) {
              onChange(value);
            }
          }}
          w={300}
          data={departments}
        ></Select>
      </div>
    </StyledToolbarFlexibleSpace>
  );
};

export default FlexibleSpace;
