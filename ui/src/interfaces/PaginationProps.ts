interface PaginationProps {
  page: number;
  pageSize: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default PaginationProps;
