import { MonthView } from "@devexpress/dx-react-scheduler-material-ui";
const DayScaleCell = (props: any) => (
  <MonthView.DayScaleCell
    {...props}
    style={{ textAlign: "center", fontWeight: "bold", overflowY: "auto" }}
  />
);

export default DayScaleCell;
