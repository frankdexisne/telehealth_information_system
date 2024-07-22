import { Alert, Group, Button, Checkbox } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { putRequest } from "../../../../hooks";

interface ConfirmationProps {
  encounter_id: number;
  title: string;
  question: string;
  disposition_id: number;
  onSubmit: () => void;
  text?: string;
}

const Confirmation = ({
  encounter_id,
  title,
  question,
  disposition_id,
  onSubmit,
  text,
}: ConfirmationProps) => {
  const confirmationHandler = () => {
    if (disposition_id === 3) {
      putRequest(
        "/patient-consultations/" + encounter_id + "/provide-prescription",
        {
          disposition_id: disposition_id,
        }
      ).then(() => onSubmit());
    }

    if (disposition_id === 12) {
      putRequest(
        "/patient-consultations/" + encounter_id + "/confirm-no-signal",
        {
          disposition_id: disposition_id,
        }
      ).then(() => onSubmit());
    }
  };

  return (
    <Alert
      className="w-full mt-5"
      variant="light"
      color="blue"
      title={<h1 className="text-xl">{title}</h1>}
      icon={<IconInfoCircle />}
    >
      {text && <h1 className="text-slate-500 text-md mb-5">{text}</h1>}
      <div className="flex">
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              confirmationHandler();
            }
          }}
        />{" "}
        <span className="ml-3">{question}</span>
      </div>
      {/* <Group my={15} className="w-full flex justify-center">
        <Button color="green" onClick={confirmationHandler}>
          YES
        </Button>
        <Button color="gray">NO</Button>
      </Group> */}
    </Alert>
  );
};

export default Confirmation;
