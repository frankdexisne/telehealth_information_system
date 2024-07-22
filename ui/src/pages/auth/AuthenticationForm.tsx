import {
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
  Avatar,
} from "@mantine/core";
import logo from "../../assets/brhmclogo.png";

import { TextInput } from "../../components/use-form-controls";
import { PasswordInput } from "../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { postRequest, errorProvider } from "../../hooks";
import { AxiosError } from "axios";
import { authActions } from "../../store/slices/auth";
import { useDispatch } from "react-redux";
import { useState } from "react";

interface LoginFormProps {
  email: string;
  password: string;
}

interface UserProps {
  id: number;
  name: string;
  email: string;
}

interface ResponseDataProps {
  token: string;
  user: UserProps;
  permissions: string[];
}

export function AuthenticationForm(props: PaperProps) {
  const dispatch = useDispatch();
  const [logingIn, setLogingIn] = useState(false);
  const { control, handleSubmit, setError } = useForm<LoginFormProps>();

  const loginHandler = (data: LoginFormProps) => {
    setLogingIn(true);
    postRequest("/auth/login", data)
      .then((data) => {
        const responseData: ResponseDataProps = data.data.data;
        const { token, user, permissions } = responseData;
        dispatch(authActions.setToken(token));
        dispatch(authActions.setUser(user));
        dispatch(authActions.setPermissions(permissions));
        window.location.href = "/";
      })
      .catch((error: AxiosError) => {
        setLogingIn(false);
        errorProvider<LoginFormProps>(error, (_errors: LoginFormProps) => {
          Object.keys(_errors).map((key) => {
            setError(key as keyof LoginFormProps, {
              type: "custom",
              message: _errors[key as keyof LoginFormProps],
            });
          });
        });
      });
  };

  return (
    <Paper
      radius="md"
      p="xl"
      className="w-[350px] h-[500px]"
      shadow="sm"
      withBorder
      {...props}
    >
      <div className="w-full flex justify-center">
        <Avatar src={logo} className="w-[150px] h-[150px]" />
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <Text size="lg" className="text-blue-600 text-2xl" fw={900} mb={5}>
          Telehealth <sup>v2</sup>
        </Text>
        <Text className="text-md" mb={10}>
          with integration to iHOMIS
        </Text>
      </div>

      <form onSubmit={handleSubmit(loginHandler)}>
        <Stack>
          <TextInput
            required
            type="email"
            name="email"
            control={control}
            label="Email"
            radius="md"
          />

          <PasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="Your password"
            radius="md"
          />
          <Button type="submit" radius="xl" loading={logingIn}>
            Login
          </Button>
          <Group justify="space-between" mt="xl"></Group>
        </Stack>
      </form>
    </Paper>
  );
}
