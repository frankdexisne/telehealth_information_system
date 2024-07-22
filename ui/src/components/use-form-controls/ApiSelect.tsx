import Select from "./Select";
import type { OptionType, FormSelectProps } from "./Select";
import type { SelectProps } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Http from "../../utils/api";

interface ApiSelectProps {
  api: string;
  label?: string;
  isRequired?: boolean;
}

const ApiSelect = ({
  api,
  label,
  control,
  name,
  isRequired,
  ...rest
}: SelectProps & FormSelectProps & ApiSelectProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["selectData", api],
    queryFn: async () =>
      await Http.get(api).then((res) =>
        res.data.map((item: OptionType) => ({
          ...item,
          value: item.value.toString(),
        }))
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <Select
      {...rest}
      data={data || []}
      disabled={isLoading || rest.disabled}
      control={control}
      label={label}
      name={name}
      isRequired={isRequired}
    />
  );
};

export default ApiSelect;
