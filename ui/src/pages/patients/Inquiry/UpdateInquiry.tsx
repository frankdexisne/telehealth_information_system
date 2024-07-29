import { Loader, Paper } from "@mantine/core";
import PageHeader from "../../../components/base/PageHeader";
import TeleserviceForm from "../PatientCreate/TeleserviceForm";
import useTeleclerkLog from "../../../hooks/use-teleserve";
import { useParams } from "react-router-dom";
const UpdateInquiry = () => {
  const { id } = useParams();
  const { data, isFetching } = useTeleclerkLog({
    id: +id!,
  });
  if (isFetching) {
    return <Loader />;
  }
  console.log(data);
  return (
    <div>
      <PageHeader title="Teleserve (Update Inquiry)" />
      <Paper p="xl" shadow="xl">
        <TeleserviceForm
          inquiry={data.data.inquiry}
          informant={data.data.informant}
          platform_id={data.data.platform_id.toString()}
          log_date={data.data.log_date}
          log_time={data.data.log_time}
          department_id={data.data.department_id}
          remarks={data.data.remarks}
          update={data.data.update}
          logData={{}}
          platform="facebook/messenger"
        />
      </Paper>
    </div>
  );
};

export default UpdateInquiry;
