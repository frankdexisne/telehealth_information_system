import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useAttachmentProps {
  id: number;
}

const useAttachment = ({ id }: useAttachmentProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [id, `attachments:${id}`],
      queryFn: async () => {
        return await getRequest(
          `/patient-chief-complaints/${id}/attachments`
        ).then((res) => res.data.data);
      },
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );

  return {
    isLoading,
    isError,
    isFetching,
    isFetched,
    refetch,
    data,
  };
};

export default useAttachment;
