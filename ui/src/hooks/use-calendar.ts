import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useCalendarProps {
  id: number;
}
const useCalendar = ({ id }: useCalendarProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [`patients:${id}`, id],
      queryFn: async () => {
        return await getRequest(`/patients/${id}`).then((res) => res.data);
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

export default useCalendar;
