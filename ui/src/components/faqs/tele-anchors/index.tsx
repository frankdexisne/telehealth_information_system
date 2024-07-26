import { Accordion } from "@mantine/core";
import TriageToDepartment from "../../../assets/faq-videos/tele-anchors/TRIAGE A PATIENT TO DEPARTMENT.mov";
const TeleAnchors = () => {
  return (
    <>
      <Accordion.Item value="teleanchor-faq-1" key="teleanchor-faq-1">
        <Accordion.Control>
          How to triaged patient consultation to clinic?
        </Accordion.Control>
        <Accordion.Panel>
          <video src={TriageToDepartment} width={500} height={240} controls />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="teleanchor-faq-2" key="teleanchor-faq-2">
        <Accordion.Control>
          Where do I view the list of triaged/active/completed/re-assigned
          patient(s)?
        </Accordion.Control>
        <Accordion.Panel></Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default TeleAnchors;
