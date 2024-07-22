import { Paper } from "@mantine/core";
import PageHeader from "../../../components/base/PageHeader";
import TeleserviceForm from "../PatientCreate/TeleserviceForm";
const Inquiry = () => {
  return (
    <div>
      <PageHeader title="Teleserve (Inquiry)" />
      <Paper p="xl" shadow="xl">
        <TeleserviceForm logData={{}} platform="facebook/messenger" />
      </Paper>
    </div>
  );
};

export default Inquiry;
