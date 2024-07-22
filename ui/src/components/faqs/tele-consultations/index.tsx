import { Accordion } from "@mantine/core";

const TeleConsultations = () => {
  return (
    <>
      <Accordion.Item
        value="teleconsultation-faq-1"
        key="teleconsultation-faq-1"
      >
        <Accordion.Control>
          How to consult a patient in Telehealth Information System?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item
        value="teleconsultation-faq-2"
        key="teleconsultation-faq-2"
      >
        <Accordion.Control>
          How to resume/continue my consultation to specific patient?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default TeleConsultations;
