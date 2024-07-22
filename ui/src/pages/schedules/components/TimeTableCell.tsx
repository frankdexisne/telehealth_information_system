import StyledTableCell from "./StyledTableCell";
import StyledDivContent from "./StyledDivContent";
import StyledDivText from "./StyledDivText";
import classNames from "clsx";
import classes from "../classes";
import { styled } from "@mui/material";
import { WbSunny, FilterDrama, Opacity } from "@mui/icons-material";
import { memo } from "react";
import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import moment from "moment";

const StyledOpacity = styled(Opacity)(() => ({
  [`&.${classes.rain}`]: {
    color: "#4FC3F7",
  },
}));
// #FOLD_BLOCK
const StyledWbSunny = styled(WbSunny)(() => ({
  [`&.${classes.sun}`]: {
    color: "#FFEE58",
  },
}));
// #FOLD_BLOCK
const StyledFilterDrama = styled(FilterDrama)(() => ({
  [`&.${classes.cloud}`]: {
    color: "#90A4AE",
  },
}));

const WeatherIcon = ({ id }: { id: number }) => {
  switch (id) {
    case 0:
      return <StyledOpacity className={classes.rain} fontSize="large" />;
    case 1:
      return <StyledWbSunny className={classes.sun} fontSize="large" />;
    case 2:
      return <StyledFilterDrama className={classes.cloud} fontSize="large" />;
    default:
      return null;
  }
};

export const CellBase = memo(
  ({
    startDate,
    formatDate,
    otherMonth,
    showAddButton = true,
    // #FOLD_BLOCK
  }) => {
    const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 3);
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
      ? { day: "numeric", month: "long" }
      : { day: "numeric" };
    return (
      <StyledTableCell
        tabIndex={0}
        className={classNames({
          [classes.cell]: true,
          [classes.rainBack]: iconId === 0,
          [classes.sunBack]: iconId === 1,
          [classes.cloudBack]: iconId === 2,
          [classes.opacity]: otherMonth,
        })}
      >
        <StyledDivContent className={classes.content}></StyledDivContent>
        <StyledDivText className={classes.text}>
          {formatDate(startDate, formatOptions)}
          {showAddButton && (
            <>
              {moment() <= moment(startDate) && (
                <div>
                  <ActionIcon>
                    <IconPlus />
                  </ActionIcon>
                </div>
              )}
            </>
          )}
        </StyledDivText>
      </StyledTableCell>
    );
  }
);

const TimeTableCell = CellBase;

export default TimeTableCell;
