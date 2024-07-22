import { PATIENT_UPDATE } from "../../../interfaces/PermissionList";
import HasPermission from "../../../utils/has-permission";
import DemographicForm, {
  DemographicFormData,
} from "../PatientCreate/DemographicForm";
import { putRequest, postRequest } from "../../../hooks";
import { usePatient } from "../../../hooks";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface DemographicDetailsProps {
  demographicData: DemographicFormData;
}

const DemographicDetails = ({ demographicData }: DemographicDetailsProps) => {
  const { id } = useParams();
  const { data } = usePatient({
    id: +id!,
  });

  const { demographics } = data;

  return (
    <div>
      <DemographicForm
        values={demographicData}
        onSubmit={(payload: DemographicFormData) => {
          if (demographics) {
            putRequest(`/demographics/${demographics.id}`, payload)
              .then(() =>
                Swal.fire({
                  title: "Success",
                  text: "Demographic has been updated",
                  icon: "success",
                })
              )
              .catch(() => {
                Swal.fire({
                  title: "Ooops!",
                  text: "Something went wrong!",
                  icon: "error",
                });
              });
          } else {
            postRequest(`/demographics/${id}`, payload)
              .then(() => {
                Swal.fire({
                  title: "Success",
                  text: "Demographic has been updated",
                  icon: "success",
                });
              })
              .catch(() => {
                Swal.fire({
                  title: "Ooops!",
                  text: "Something went wrong!",
                  icon: "error",
                });
              });
          }
        }}
        submitLabel="Update Details"
        submitPosition="left"
        hideBackButton={true}
        showSubmit={HasPermission(PATIENT_UPDATE)}
      />
    </div>
  );
};

export default DemographicDetails;
