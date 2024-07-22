import { PasswordInput as PasswordInputCore } from "@mantine/core";
import type { PasswordInputProps } from "@mantine/core";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";

const PasswordInput = ({
  control,
  name,
  ...rest
}: PasswordInputProps & {
  control: Control<any, string | number>;
  name: string;
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    control: control,
    defaultValue: "",
    name: name,
    rules: {
      required: {
        value: true,
        message: "This field is required",
      },
    },
  });
  return (
    <PasswordInputCore
      {...rest}
      required
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      value={value}
      error={invalid && error?.message}
    />
  );
};

export default PasswordInput;
