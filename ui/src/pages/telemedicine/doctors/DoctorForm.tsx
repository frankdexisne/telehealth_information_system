import { Divider, Title } from "@mantine/core";
import Doctors from ".";
import { SelectPlatform } from "../../../components/patients";
import DoctorProfile from "./DoctorProfile";
const DoctorForm = () => {
  return (
    <div>
      <Title className="text-2xl">CREATE/SEARCH TELEMEDICINE DOCTOR</Title>
      <Divider
        label={
          <h3 className="text-xl text-blue-700">Communication Platform</h3>
        }
        size="lg"
        my={20}
        labelPosition="left"
      />
      <SelectPlatform
        onConfirm={() => console.log("confirm")}
        onReset={() => console.log("reset")}
      />
      <DoctorProfile
        onSubmit={() => console.log("test")}
        onCancel={() => console.log("cancelled")}
      />
    </div>
  );
};

export default DoctorForm;
