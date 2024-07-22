import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
  AccessorFn,
} from "@tanstack/react-table";
import { useMemo } from "react";
import {
  Table,
  Pagination,
  Paper,
  Box,
  LoadingOverlay,
  Input,
  ButtonGroup,
  Button,
  Tooltip,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import PaginationProps from "../../interfaces/PaginationProps";
import Swal from "sweetalert2";
import { deleteRequest } from "../../hooks/use-http";
import { NavLink } from "react-router-dom";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface DefaultRowActionProps {
  id: number;
  editLink?: string;
  resource: string;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  canDelete?: boolean;
  canEdit?: boolean;
  children?: React.ReactNode;
  deleteText?: string;
  DeleteIcon?: React.ReactNode;
  EditIcon?: React.ReactNode;
}

export const DefaultRowAction = ({
  id,
  editLink,
  resource,
  onDelete,
  onEdit,
  children,
  canDelete = false,
  canEdit = false,
  deleteText = "You won't be able to revert this!",
  DeleteIcon,
  EditIcon,
}: DefaultRowActionProps) => {
  const deleteHandler = (id: number) => {
    Swal.fire({
      title: "Delete?",
      text: deleteText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRequest(resource + "/" + id).then(() =>
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          }).then(() => {
            onDelete(id);
          })
        );
      }
    });
  };

  return (
    <ButtonGroup>
      {canEdit && editLink && (
        <Tooltip label="Edit">
          <Button
            size="xs"
            variant="transparent"
            className="px-1"
            component={NavLink}
            to={editLink}
          >
            {EditIcon ? EditIcon : <IconPencil />}
          </Button>
        </Tooltip>
      )}
      {canEdit && onEdit && (
        <Tooltip label="Edit">
          <Button
            size="xs"
            variant="transparent"
            className="px-1"
            onClick={() => onEdit(id)}
          >
            {EditIcon ? EditIcon : <IconPencil />}
          </Button>
        </Tooltip>
      )}
      {canDelete && (
        <Tooltip label="Delete">
          <Button
            size="xs"
            className="px-1"
            variant="transparent"
            color="red"
            onClick={() => deleteHandler(id)}
          >
            {DeleteIcon ? DeleteIcon : <IconTrash />}
          </Button>
        </Tooltip>
      )}
      {children}
    </ButtonGroup>
  );
};

export interface ColumnDefinition<T> {
  field: AccessorFn<T> | string;
  header: string;
  size?: number;
  id?: string;
  cell?: (info: CellContext<T, unknown>) => unknown;
  FilterComponent?: React.ReactNode;
}

interface AppTanstackTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  pagination: PaginationProps;
  isFetching: boolean;
  toolbar?: React.ReactNode;
  setSearchText?: (text: string) => void;
  columnSearch?: boolean;
  EmptyContent?: React.ReactNode;
  isError?: boolean;
}

const AppTanstackTable = <T,>({
  data,
  columns,
  pagination,
  toolbar,
  setSearchText,
  EmptyContent,
  isFetching = false,
  columnSearch = false,
  isError = false,
}: AppTanstackTableProps<T>) => {
  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<T>();
    return columns.map(({ field, header, id, cell, size }) =>
      columnHelper.accessor(field as AccessorFn<T>, {
        header,
        cell: cell ? cell : (info) => info.getValue(),
        id,
        size: size,
      })
    );
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Paper
        radius="lg"
        withBorder
        py={7}
        px={10}
        bg="var(--mantine-color-body)"
      >
        <div className="flex w-full">
          <div className="w-[50%]">{toolbar}</div>
          <div className="w-[50%] flex justify-end">
            {setSearchText && (
              <Input
                rightSection={<IconSearch />}
                onChange={(e) => setSearchText(e.target.value)}
              />
            )}
          </div>
        </div>
        <Table>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id} className="text-xs text-left">
                {headerGroup.headers.map((header) => (
                  <Table.Th w={header.getSize() || 100} py={15} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                          ?.toString()
                          .toUpperCase()}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}

            {columnSearch && (
              <Table.Tr>
                {columns.map(
                  ({ FilterComponent }: ColumnDefinition<T>, index: number) => (
                    <Table.Th key={index}>
                      <div className="w-[90%]">{FilterComponent}</div>
                    </Table.Th>
                  )
                )}
              </Table.Tr>
            )}
          </Table.Thead>

          <Table.Tbody>
            {!isFetching && isError && (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <div className="w-full flex justify-center">
                    <h2 className="text-lg font-bold text-red-400">
                      --ERROR LOADING DATA--
                    </h2>
                  </div>
                </Table.Td>
              </Table.Tr>
            )}

            {!isError && isFetching && (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Box pos="relative" className="h-[50px]">
                    <LoadingOverlay
                      pt={10}
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2 }}
                    />
                  </Box>
                </Table.Td>
              </Table.Tr>
            )}

            {!isError &&
              !isFetching &&
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id} className="text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}

            {!isError &&
              !isFetching &&
              table.getRowModel().rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={columns.length} align="center">
                    {EmptyContent ? EmptyContent : "--No Record Found--"}
                  </Table.Td>
                </Table.Tr>
              )}
          </Table.Tbody>
        </Table>

        <div className="flex w-full">
          <div className="w-[50%]"></div>
          <div className="w-[50%] flex justify-end">
            <Pagination
              value={pagination.page}
              total={pagination.lastPage}
              onChange={pagination.onPageChange}
              className="mr-3 mb-2"
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default AppTanstackTable;
