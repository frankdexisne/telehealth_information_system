import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useSentToHomisProps {
  id: number;
}
const useSentToHomis = ({ id }: useSentToHomisProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [`sent-to-homis:${id}`, id],
      queryFn: async () => {
        return await getRequest(
          `/patient-chief-complaints/${id}/telehealth-data/forward-to-homis`
        ).then((res) => res.data);
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

export default useSentToHomis;
