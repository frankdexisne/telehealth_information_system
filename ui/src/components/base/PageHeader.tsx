import { Title } from "@mantine/core";
interface PageHeaderProps {
  title: string;
}
const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <Title size={24} className="font-bold text-blue-500 mb-3">
      {title}
    </Title>
  );
};

export default PageHeader;
