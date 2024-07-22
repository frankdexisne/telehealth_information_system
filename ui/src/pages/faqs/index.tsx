import { Accordion, Grid } from "@mantine/core";
import Patients from "../../components/faqs/patients";
import TeleAnchors from "../../components/faqs/tele-anchors";
import TeleConsultations from "../../components/faqs/tele-consultations";
import TeleClerks from "../../components/faqs/teleclerks";
import CreateNotes from "../../components/faqs/tele-consultations/CreateNotes";
import PageHeader from "../../components/base/PageHeader";
import { IconHelp } from "@tabler/icons-react";

const Faqs = () => {
  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }} className="flex">
          <IconHelp className="mt-1 text-blue-500 mr-1" />
          <PageHeader title="Help Center" />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 6 }}
          className="flex pr-5 justify-end items-start"
        ></Grid.Col>
      </Grid>
      <Accordion>
        <Patients />
        <TeleClerks />
        <TeleAnchors />
        <TeleConsultations />
        <CreateNotes />
      </Accordion>
    </div>
  );
};

export default Faqs;
