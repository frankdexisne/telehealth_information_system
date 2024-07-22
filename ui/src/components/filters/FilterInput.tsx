import { Input } from "@mantine/core";
import { ChangeEvent } from "react";

type InputType = "text" | "date" | "number" | "time";

interface FilterInputProps {
  type?: InputType;
  name: string;
  value: string | number | undefined;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FilterInput = ({
  name,
  value,
  placeholder,
  onChange,
  type = "text",
}: FilterInputProps) => {
  return (
    <Input
      size="xs"
      className="font-normal"
      type={type}
      name={name}
      value={value || ""}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default FilterInput;
