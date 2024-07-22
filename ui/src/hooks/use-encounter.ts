import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useEncounterProps {
  id: number;
}
const useEncounter = ({ id }: useEncounterProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [id, `encounters:${id}`],
      queryFn: async () => {
        return await getRequest(`/encounters/${id}`).then((res) => res.data);
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

export default useEncounter;
