import { Accordion } from "@mantine/core";

const CreatePatient = () => {
  return (
    <>
      <Accordion.Item value="create-patient-faq-1" key="create-patient-faq-1">
        <Accordion.Control>
          How to create a patient consultation?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default CreatePatient;
