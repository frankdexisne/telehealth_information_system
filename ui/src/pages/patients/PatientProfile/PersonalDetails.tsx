import { PATIENT_UPDATE } from "../../../interfaces/PermissionList";
import HasPermission from "../../../utils/has-permission";
import PatientInformationForm, {
  ProfilingFormData,
} from "../PatientCreate/PatientInformationForm";
import { putRequest } from "../../../hooks";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface PersonalDetailsProps {
  personalData: ProfilingFormData;
  hideBackButton?: boolean;
}

const PersonalDetails = ({
  personalData,
  hideBackButton = false,
}: PersonalDetailsProps) => {
  const { id } = useParams();
  return (
    <div>
      <PatientInformationForm
        values={personalData}
        onSubmit={(payload: ProfilingFormData) =>
          putRequest(`/patients/${id}`, payload)
            .then(() =>
              Swal.fire({
                title: "Success",
                text: "Patient information is already updated",
                icon: "success",
              })
            )
            .catch(() => {
              Swal.fire({
                title: "Ooops!",
                text: "There's something went wrong",
                icon: "error",
              });
            })
        }
        submitLabel="Update Details"
        submitPosition="left"
        showSubmit={HasPermission(PATIENT_UPDATE)}
        hideBackButton={hideBackButton}
      />
    </div>
  );
};

export default PersonalDetails;
