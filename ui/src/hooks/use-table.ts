import { useCallback, useEffect, useState } from "react";
import { getRequest } from "./use-http";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";

export interface ParametersProps {
  [key: string]: string | number | Date | null;
}

interface useTableProps {
  endpoint: string;
  pageSize: number;
  parameters?: object;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

interface PaginationStateProps {
  page: number;
  pageSize: number;
  lastPage: number;
  total: number;
}

const useTable = ({
  endpoint,
  pageSize = 5,
  parameters = {},
}: useTableProps) => {
  const [pagination, setPagination] = useState<PaginationStateProps>({
    page: 1,
    pageSize: pageSize,
    lastPage: 0,
    total: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [search] = useDebouncedValue(searchText, 500);

  const changePage = useCallback(
    (page: number) => {
      setPagination({
        ...pagination,
        page: page,
      });
    },
    [pagination]
  );

  const changeLastPage = useCallback(
    (total: number) => {
      setPagination({
        ...pagination,
        lastPage: Math.ceil(total / pagination.pageSize),
      });
    },
    [pagination]
  );

  const queryParams = new URLSearchParams({
    pageSize: pagination.pageSize?.toString(),
    page: pagination.page?.toString(),
    search: search,
    ...parameters,
  });

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    isSuccess,
    isFetched,
  } = useQuery({
    queryKey: [
      `tableData:${endpoint}`,
      pagination.page,
      pagination.pageSize,
      search,
      parameters,
    ],
    queryFn: async () => {
      return await getRequest(`${endpoint}?${queryParams}`).then((res) => {
        return res.data;
      });
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const settingPaginationTimeout = setTimeout(() => {
      if (isSuccess) {
        setPagination({
          page: data.current_page,
          pageSize: data.per_page,
          lastPage: data.last_page,
          total: data.total,
        });
      }
    }, 10);

    return () => clearTimeout(settingPaginationTimeout);
  }, [data]);

  return {
    data: data?.data || [],
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      lastPage: pagination.lastPage,
      total: pagination.total,
      onPageChange: changePage,
    },
    isLoading,
    isFetching,
    isFetched,
    isError,
    setPagination,
    changePage,
    changeLastPage,
    setSearchText,
    refetch,
  };
};

export default useTable;
