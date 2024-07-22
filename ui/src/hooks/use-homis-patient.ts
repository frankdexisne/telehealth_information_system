import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useHomisPatientProps {
  hpercode: string;
}
const useHomisPatient = ({ hpercode }: useHomisPatientProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [hpercode, `homis-patients:${hpercode}`],
      queryFn: async () => {
        return await getRequest(`/patients/${hpercode}/homis-patient`).then(
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

export default useHomisPatient;
