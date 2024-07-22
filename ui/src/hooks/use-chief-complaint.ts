import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./use-http";

interface useChiefComplaintProps {
  id: number;
}

const useChiefComplaint = ({ id }: useChiefComplaintProps) => {
  const { data, isLoading, isError, isFetching, isFetched, refetch } = useQuery(
    {
      queryKey: [id, `chief-complaints:${id}`],
      queryFn: async () => {
        return await getRequest(`/patient-chief-complaints/${id}`).then(
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

export default useChiefComplaint;
