import { Accordion } from "@mantine/core";
import UpdateProfile from "../../../assets/faq-videos/patients/UPDATE PROFILE.mov";
import DeleteProfile from "../../../assets/faq-videos/patients/DELETE PROFILE.mov";

const Patients = () => {
  return (
    <>
      <Accordion.Item value="patient-faq-1" key="patient-faq-1">
        <Accordion.Control>
          How to update patient profile/demographic?
        </Accordion.Control>
        <Accordion.Panel>
          <video src={UpdateProfile} width={400} height={200} controls />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="patient-faq-2" key="patient-faq-2">
        <Accordion.Control>
          How to view patient's telehealth consultation(s)?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="patient-faq-3" key="patient-faq-3">
        <Accordion.Control>
          How to bind patient to iHOMIS patient?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="patient-faq-4" key="patient-faq-4">
        <Accordion.Control>How to delete patient profile?</Accordion.Control>
        <Accordion.Panel>
          <video src={DeleteProfile} width={400} height={200} controls />
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default Patients;
