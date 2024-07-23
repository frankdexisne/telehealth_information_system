import { Badge, Title, Card, Text, Button } from "@mantine/core";
import moment from "moment";

interface DayProps {
  date: Date;
  scheduled: number;
  dailyLimit: number;
  hideAction?: boolean;
  onSelect?: (date: Date) => void;
  active?: boolean;
}

const Day = ({
  date,
  scheduled,
  dailyLimit,
  onSelect,
  hideAction = false,
  active = false,
}: DayProps) => {
  const month = moment(date).format("MMMM");
  const activeDate = moment(date).format("DD");
  const year = moment(date).format("YYYY");
  return (
    <Card
      shadow="sm"
      my={5}
      padding="sm"
      radius="md"
      withBorder
      onClick={() => {
        if (onSelect) onSelect(date);
      }}
      className={`${onSelect && "cursor-pointer"} ${
        active && "border-blue-500 border-4"
      }`}
    >
      <Card.Section className="flex justify-center space-y-10 flex-col items-center min-h-[70px] pt-5">
        <Title size={20} lh={0}>
          {month}
        </Title>
        <Title size={60} lh={0}>
          {activeDate}
        </Title>
        <Title size={20} lh={0} mb={-10}>
          {year}
        </Title>
        <Text c="gray" lh={0}>
          {moment(date).format("dddd")}
        </Text>
      </Card.Section>

      <div className="w-full flex justify-center items-center space-x-2 mt-4">
        <Badge color="green" size="xs"></Badge>
        <Text>
          {scheduled}/{dailyLimit}
        </Text>
      </div>
      {!hideAction && (
        <Button color="blue" fullWidth mt="xs" radius="md" size="xs">
          SET SCHEDULE
        </Button>
      )}
    </Card>
  );
};

export default Day;
