import { Grid, TextInput } from "@mantine/core";
import moment from "moment";
import TeleconsultationStatus from "./TeleconsultationStatus";
import TeleserviceStatus from "./TeleserviceStatus";
import { useState } from "react";
import PageHeader from "../../components/base/PageHeader";

const Reports = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    moment().format("YYYY-MM").toString()
  );

  return (
    <div>
      <Grid>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex items-center w-[50%]"
        >
          <PageHeader title="Monthly Report" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex w-[50%] justify-end items-center"
        >
          <TextInput
            label="Filtered Month"
            type="month"
            value={selectedYearMonth}
            onChange={(event) => setSelectedYearMonth(event.target.value)}
            w={300}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <h1 className="text-md text-blue-500 font-semibold">
            TELECONSULTATION STATUS
          </h1>
          <TeleconsultationStatus yearMonth={selectedYearMonth} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <h1 className="text-md text-blue-500 font-semibold">
            TELESERVER STATUS
          </h1>
          <TeleserviceStatus yearMonth={selectedYearMonth} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Reports;
