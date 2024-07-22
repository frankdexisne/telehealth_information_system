import { Accordion, Title } from "@mantine/core";
import CreatePatientProfile from "../../../assets/faq-videos/patients/CREATING NEW PATIENT PROFILE.mov";
import CreatePatientProfileFromHOMIS from "../../../assets/faq-videos/patients/CREATE PATIENT FROM IHOMIS.mov";
const TeleClerks = () => {
  return (
    <>
      <Accordion.Item value="teleclerk-faq-1" key="teleclerk-faq-1">
        <Accordion.Control>
          How to create a patient consultation in Telehealth Information System?
        </Accordion.Control>
        <Accordion.Panel>
          <Title size={18}>CREATING NEW PROFILE</Title>
          <video src={CreatePatientProfile} width={400} height={200} controls />
          <Title size={18}>CREATE WITH INTEGRATION TO IHOMIS</Title>
          <video
            src={CreatePatientProfileFromHOMIS}
            width={400}
            height={200}
            controls
          />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="teleclerk-faq-2" key="teleclerk-faq-2">
        <Accordion.Control>
          How to view all attached files for patient?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="teleclerk-faq-3" key="teleclerk-faq-3">
        <Accordion.Control>
          How to add new attachment for patient consultation?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="teleclerk-faq-4" key="teleclerk-faq-4">
        <Accordion.Control>
          How to view all active/completed/out when called patients?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="teleclerk-faq-5" key="teleclerk-faq-5">
        <Accordion.Control>
          How to bind the consultation to iHOMIS?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default TeleClerks;
