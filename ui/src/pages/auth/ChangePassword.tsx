import { TextInput } from "../../components/use-form-controls";
import { Title, Button, ButtonGroup, Paper } from "@mantine/core";
import { useForm } from "react-hook-form";
import { putRequest, errorProvider } from "../../hooks";

interface ChangePasswordData {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

const defaultValues: ChangePasswordData = {
  password: "",
  new_password: "",
  new_password_confirmation: "",
};

const ChangePassword = () => {
  const { control, handleSubmit, setError } = useForm<ChangePasswordData>({
    defaultValues: defaultValues,
  });

  const saveUserHandler = (payload: ChangePasswordData) => {
    putRequest(`/auth/change-password`, payload).catch((error) => {
      errorProvider<ChangePasswordData>(
        error,
        function (_errors: ChangePasswordData) {
          Object.keys(_errors).map((field) => {
            setError(field as keyof ChangePasswordData, {
              type: "custom",
              message: _errors[field as keyof ChangePasswordData],
            });
          });
        }
      );
    });
  };

  return (
    <div className="w-full flex justify-center h-screen pt-10">
      <Paper className="shadow h-[320px]" px={25}>
        <div className="w-[400px] my-3 ">
          <Title>Change Password</Title>
          <form onSubmit={handleSubmit(saveUserHandler)}>
            <TextInput
              name="password"
              type="password"
              control={control}
              label="Current Password"
              isRequired
            />
            <TextInput
              name="new_password"
              type="password"
              control={control}
              label="New Password"
              isRequired
            />
            <TextInput
              name="new_password_confirmation"
              type="password"
              control={control}
              label="Confirm Password"
              isRequired
            />

            <ButtonGroup className="mt-3">
              <Button color="gray">Cancel</Button>
              <Button type="submit">Submit</Button>
            </ButtonGroup>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default ChangePassword;
