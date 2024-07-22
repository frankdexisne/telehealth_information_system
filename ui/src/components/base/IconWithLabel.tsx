import { Paper, Text } from "@mantine/core";
interface IconWithLabelProps {
  Component: JSX.ElementType;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const IconWithLabel = ({
  Component,
  isSelected,
  label,
  onSelect,
}: IconWithLabelProps) => {
  return (
    <Paper
      style={{ cursor: "pointer" }}
      className={`flex flex-col justify-center items-center ${
        isSelected ? "bg-blue-400" : ""
      }`}
      shadow="xs"
      p="xl"
      onClick={onSelect}
    >
      <Component
        color={isSelected ? "white" : "black"}
        style={{ fontSize: 40 }}
      />
      <Text className={isSelected ? "text-white" : ""}>{label}</Text>
    </Paper>
  );
};

export default IconWithLabel;
