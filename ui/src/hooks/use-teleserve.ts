import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useTeleclerkLogProps {
  id: number;
}
const useTeleclerkLog = ({ id }: useTeleclerkLogProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [`teleclerk-logs:${id}`, id],
      queryFn: async () => {
        return await getRequest(`/teleclerk-logs/${id}`).then(
          (res) => res.data
        );
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

export default useTeleclerkLog;
