import { BaseDispositionFormProps } from ".";
import { useForm } from "react-hook-form";
import { ApiSelect } from "../../../../components/use-form-controls";
import { Button, ButtonGroup, Alert } from "@mantine/core";
import { ConsultationDepartmentFormData } from "./CoManage";
import { putRequest } from "../../../../hooks";
import Swal from "sweetalert2";
import { IconInfoCircle } from "@tabler/icons-react";

interface TransferProps extends BaseDispositionFormProps {
  department_id: string;
  onSubmit: () => void;
}

const Transfer = ({ encounter_id, department_id, onSubmit }: TransferProps) => {
  const { control, handleSubmit } = useForm<ConsultationDepartmentFormData>();

  const submit = (data: ConsultationDepartmentFormData) => {
    putRequest(
      `/patient-consultations/${encounter_id}/transfer-department`,
      data
    ).then(() =>
      Swal.fire({
        title: "Success!",
        text: "Already transfered",
        icon: "success",
      }).then(() => {
        onSubmit();
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Alert
        className="w-full mt-5 mb-5"
        variant="light"
        color="blue"
        title={<h1 className="text-xl">Transfering Department</h1>}
        icon={<IconInfoCircle />}
      >
        <h1 className="text-slate-500 text-md mb-5">
          Please select the department to which this patient should be
          transferred, then click <b>Transfer</b> to proceed
        </h1>
      </Alert>
      <ApiSelect
        api={`/selects/departments?is_doctor=1&exclude=${department_id}`}
        control={control}
        name="department_id"
        label="Department"
        isRequired
      />
      <ButtonGroup mt={10}>
        <Button type="submit">Transfer</Button>
      </ButtonGroup>
    </form>
  );
};

export default Transfer;
