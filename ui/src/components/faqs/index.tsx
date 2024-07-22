import { Accordion, Modal, Title, ActionIcon, Tooltip } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Patients from "./patients";
import CreatePatient from "./patients/CreatePatient";
import TeleAnchors from "./tele-anchors";
import TeleConsultations from "./tele-consultations";
import CreateNotes from "./tele-consultations/CreateNotes";
import TeleClerks from "./teleclerks";

interface FaqInterface {
  module:
    | "patients"
    | "create-patient"
    | "tele-clerks"
    | "tele-consultations"
    | "create-notes"
    | "tele-anchors";
}

const Faqs = ({ module }: FaqInterface) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Tooltip label="Help">
        <ActionIcon
          className="ml-1"
          color="green.9"
          variant="transparent"
          onClick={open}
        >
          <IconHelp />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Title size={24} className="flex text-blue-500">
            <IconHelp className="mt-1 mr-1" />
            How to use Telehealth Information System
          </Title>
        }
        size="50%"
        centered
      >
        <Accordion>
          {module === "patients" && <Patients />}
          {module === "create-patient" && <CreatePatient />}
          {module === "tele-clerks" && <TeleClerks />}
          {module === "tele-anchors" && <TeleAnchors />}
          {module === "tele-consultations" && <TeleConsultations />}
          {module === "create-notes" && <CreateNotes />}
        </Accordion>
      </Modal>
    </>
  );
};

export default Faqs;
