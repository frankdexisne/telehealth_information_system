import { BaseDispositionFormProps } from ".";
import { useForm } from "react-hook-form";
import { ApiSelect } from "../../../../components/use-form-controls";
import { Button, ButtonGroup, Alert } from "@mantine/core";
import { putRequest } from "../../../../hooks";
import Swal from "sweetalert2";
import { IconInfoCircle } from "@tabler/icons-react";

export interface ConsultationDepartmentFormData {
  department_id: string;
  onSubmit: () => void;
}

const CoManage = ({
  encounter_id,
  department_id,
  onSubmit,
}: BaseDispositionFormProps & ConsultationDepartmentFormData) => {
  const { control, handleSubmit } = useForm<ConsultationDepartmentFormData>();

  const submit = (data: ConsultationDepartmentFormData) => {
    putRequest(
      `/patient-consultations/${encounter_id}/co-manage-department`,
      data
    ).then(() =>
      Swal.fire({
        title: "Success!",
        text: "Already add co-manage department",
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
        title={<h1 className="text-xl">Co-Manage Department</h1>}
        icon={<IconInfoCircle />}
      >
        <h1 className="text-slate-500 text-md mb-5">
          Please select the department with which this patient is to be
          co-managed, then click <b>Co-Manage</b> to proceed
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
        <Button type="submit">Co-Manage</Button>
      </ButtonGroup>
    </form>
  );
};

export default CoManage;
