import { useEffect, useState } from "react";
import { getRequest, errorProvider, postRequest } from "../../../hooks";
import { TextInput } from "../../../components/use-form-controls";
import { useForm } from "react-hook-form";
import { List, Checkbox, Button, Grid, Paper, Text } from "@mantine/core";
import PermissionList from "../../../interfaces/PermissionList";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface PermissionRow {
  id: number;
  name: string;
  display_name: string;
}

interface ModuleRow {
  id: number;
  name: string;
  permission: PermissionRow[];
}

interface RoleFormData {
  name: string;
  permission: PermissionList[];
}

const CreateRole = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const { control, handleSubmit, register, setError } = useForm<RoleFormData>();

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      getRequest("/roles/permission-lists").then((res) => {
        setModules(res.data);
      });
    }, 500);
    return () => clearTimeout(fetchTimeout);
  }, []);

  const submitHandler = (payload: RoleFormData) => {
    postRequest(`/roles`, payload).then(successHandler).catch(catchHandler);
  };

  const successHandler = () => {
    Swal.fire({
      title: "Success",
      text: "Role and Permissions has been added",
      icon: "success",
    }).then(() => {
      navigate("/settings/roles");
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(`tableData:roles`),
      });
    });
  };

  const catchHandler = (error: AxiosError) => {
    errorProvider<RoleFormData>(error, function (_errors: RoleFormData) {
      Object.keys(_errors).map((field) => {
        setError(field as keyof RoleFormData, {
          type: "custom",
          message: _errors[field as keyof RoleFormData]?.toString(),
        });
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <h1 className="text-lg text-blue-500">CREATE NEW ROLE</h1>
      <TextInput
        label="Name of Role"
        control={control}
        name="name"
        isRequired
      />
      <Grid mt={10}>
        {modules.map(({ name, permission }: ModuleRow, index: number) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
            <Paper shadow="xs" p="md" mih={430}>
              <Text className="text-lg font-semibold flex mb-3">
                <span style={{ marginTop: -4 }}>{name}</span>
              </Text>
              <List>
                {permission.map((perm: PermissionRow) => (
                  <List.Item key={`${index}-${perm.id}`}>
                    <h1 className="text-sm">
                      <Checkbox
                        {...register("permission")}
                        value={perm.name}
                        label={perm.display_name}
                      />
                    </h1>
                  </List.Item>
                ))}
              </List>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
      <Button className="mt-5" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default CreateRole;
