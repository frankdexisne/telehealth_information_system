import { Select as SelectCore, Input } from "@mantine/core";
import type { SelectProps } from "@mantine/core";
import { Control, useController } from "react-hook-form";

export interface OptionType {
  value: string | number;
  label: string;
}

export interface FormSelectProps {
  label?: string;
  control: Control<any, string | number>;
  name: string;
  defaultValue?: string;
  isRequired?: boolean;
}

const Select = ({
  label,
  control,
  name,
  isRequired,
  ...rest
}: SelectProps & FormSelectProps) => {
  const defaultValueControl = rest.defaultValue ? rest.defaultValue : "";

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    control: control,
    name: name,
    defaultValue: defaultValueControl,
    rules: {
      required: {
        value: isRequired || false,
        message: "This field is required",
      },
    },
  });

  return (
    <SelectCore
      {...rest}
      searchable={true}
      clearable={true}
      label={
        <label className="mantine-InputWrapper-label mantine-TextInput-label">
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      }
      onChange={rest.onChange ? rest.onChange : onChange}
      onBlur={onBlur}
      ref={ref}
      value={value || rest.value}
      error={invalid && <Input.Error>{error?.message}</Input.Error>}
    />
  );
};

export default Select;
