import { Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Http from "../../utils/api";
import { OptionType } from "../use-form-controls/Select";

interface FilterSelectApiProps {
  name: string;
  api: string;
  placeholder?: string;
  onChangeFilter: (value: string | null) => void;
}

const FilterSelectApi = ({
  name,
  api,
  onChangeFilter,
  placeholder,
}: FilterSelectApiProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["selectData:" + api, api],
    queryFn: async () =>
      await Http.get("/selects/" + api).then((res) =>
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
      size="xs"
      className="font-normal"
      searchable
      clearable
      name={name}
      placeholder={placeholder || name.charAt(0).toUpperCase() + name.slice(1)}
      data={data || []}
      disabled={isLoading}
      onChange={(value) => onChangeFilter(value)}
    />
  );
};

export default FilterSelectApi;
