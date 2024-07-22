import { Select } from "@mantine/core";

interface FilterSelectProps {
  name: string;
  data: SelectOptionType[];
  placeholder?: string;
  onChangeFilter: (value: string | null) => void;
}

export type SelectOptionType = {
  label: string;
  value: string;
};

const FilterSelect = ({
  name,
  data,
  onChangeFilter,
  placeholder,
}: FilterSelectProps) => {
  return (
    <Select
      size="xs"
      className="font-normal"
      clearable
      searchable
      name={name}
      placeholder={placeholder || name.charAt(0).toUpperCase() + name.slice(1)}
      data={data}
      onChange={(value) => onChangeFilter(value)}
    />
  );
};

export default FilterSelect;
