import { Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../../../hooks/use-http";
import { OptionType } from "../../../../components/use-form-controls";
import FaceToFace from "./FaceToFace";
import Transfer from "./Transfer";
import CoManage from "./CoManage";
import Confirmation from "./Confirmation";
import TextEditor from "./TextEditor";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { postRequest } from "../../../../hooks";
import Swal from "sweetalert2";
import socket from "../../../../socket";

interface DispositionFormsProps {
  encounter_id: number;
  onSubmit: () => void;
}

export interface BaseDispositionFormProps {
  encounter_id: number;
}

const defaultNotes = `
        <p><strong>PATIENT CONSENT:</strong></p>
        <p>[ ] YES, [ ] NO</p>
        <p><strong>SUBJECTIVE:</strong></p>
        <p><strong>HPI:</strong></p>
        <p><strong>Past medical history:</strong></p>
        <p>[x] DM, [ ] HPN, [ ] Bronchial Asthma, [ ] PTB, [ ] CA</p>
        <p><strong>Previous surgery:</strong></p>
        <p><strong>Previous hospital admission: (Date and hospital)</strong></p>
        <p>[ ] Allergies:</p>
        <p><strong>Personal Social History:</strong></p>
        <p>&nbsp;[ ] Smoker, [ ] Alcoholic, [ ] Elicit drug use</p>
        <p><strong>OBJECTIVE:</strong></p>
        <p><strong>Severity of ROS:</strong></p>
        <p><strong>Labs:</strong></p>
        <p><strong>Hypokalemia at</strong></p>
        <p></p>
        <p><strong>ASSESSMENT:</strong></p>
        <p><strong>PLAN:</strong></p>
        <p><strong>I</strong></p>
        <p><strong>II</strong></p>
        <p><strong>III</strong></p>
    `;

const DispositionForms = ({
  encounter_id,
  onSubmit,
}: DispositionFormsProps) => {
  const departmentId = useSelector(
    (state: RootState) => state.auth.user.department_id
  );

  const { data } = useQuery({
    queryKey: ["selectData:dispositions"],
    queryFn: async () => {
      return await getRequest(`/selects/dispositions`).then((res) => res.data);
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const textEditorSubmitHandler = (id: string, content?: string) => {
    contentSubmitHandler(id, content);
  };

  const broadcastClient = (dispositionId: number) => {
    if (dispositionId === 3) socket.emit("prescription");

    if (dispositionId === 4) socket.emit("attachment");

    if (dispositionId === 7) socket.emit("additional-advice");

    if (dispositionId === 10) socket.emit("out-when-called");
  };

  const contentSubmitHandler = (id: string, content: string | undefined) => {
    return postRequest(`/patient-consultations/${encounter_id}`, {
      disposition_id: id,
      findings: content,
    }).then(() =>
      Swal.fire({
        title: "Success",
        text: "Your notes has been saved",
        icon: "success",
      }).then(() => {
        broadcastClient(+id);
        onSubmit();
      })
    );
  };

  return (
    <>
      <Tabs
        defaultValue="1"
        orientation="vertical"
        variant="pills"
        className="flex h-[670px]"
      >
        <Tabs.List>
          {data?.map((disposition: OptionType) => (
            <Tabs.Tab
              key={disposition.value}
              value={disposition.value.toString()}
            >
              {disposition.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel className="px-7" value="1">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("1", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="2">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("2", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="3">
          <Confirmation
            disposition_id={3}
            encounter_id={encounter_id}
            title="Provide Prescription?"
            text="Please check if you will give the prescription to teleclerk to send it to the patient and upload the picture in Telehealth Information System"
            question="Yes, I confirm"
            onSubmit={() => {
              onSubmit();
              broadcastClient(3);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="4">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("4", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="5">
          <FaceToFace encounter_id={encounter_id} onSubmit={() => onSubmit()} />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="6">
          <TextEditor
            content={defaultNotes}
            onSubmit={(content) => {
              textEditorSubmitHandler("6", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="7">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("7", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="8">
          <Transfer
            onSubmit={() => onSubmit()}
            encounter_id={encounter_id}
            department_id={departmentId}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="9">
          <CoManage
            onSubmit={() => onSubmit()}
            encounter_id={encounter_id}
            department_id={departmentId}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="10">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("10", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="11">
          <TextEditor
            onSubmit={(content) => {
              textEditorSubmitHandler("11", content);
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel className="px-7" value="12">
          <Confirmation
            disposition_id={12}
            encounter_id={encounter_id}
            title="Signal Issue"
            text="The telehealth service phone is no signal"
            question="Yes, I confirm"
            onSubmit={() => onSubmit()}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default DispositionForms;
