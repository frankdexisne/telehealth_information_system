import { TextInput as TextInputCore } from "@mantine/core";
import type { TextInputProps } from "@mantine/core";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";

const TextInput = ({
  control,
  name,
  defaultValue,
  isRequired,
  ...rest
}: TextInputProps & {
  type?: string;
  control: Control<any, string | number>;
  name: string;
  defaultValue?: string | number;
  isRequired?: boolean;
}) => {
  const type = rest.type ? rest.type : "text";
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    control: control,
    defaultValue: defaultValue || "",
    name: name,
    rules: {
      required: {
        value: isRequired || false,
        message: "This field is required",
      },
    },
  });
  return (
    <TextInputCore
      {...rest}
      label={
        <label className="mantine-InputWrapper-label mantine-TextInput-label">
          {rest.label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      }
      type={type}
      onChange={(e) => {
        if (rest.onChange) {
          rest.onChange(e);
        } else {
          onChange(e);
        }
      }}
      onBlur={onBlur}
      ref={ref}
      value={value}
      error={invalid && error?.message}
      disabled={rest.disabled}
    />
  );
};

export default TextInput;
