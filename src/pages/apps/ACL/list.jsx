import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useCallback } from 'react';
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import AlertUserDelete from 'sections/apps/user/AlertUserDelete';
import AlertSuspendUser from 'sections/apps/user/AlertSuspendUser';
import AlertActivateUser from 'sections/apps/user/AlertActivateUser';
import RoleView from 'sections/apps/Acl/Roleview';
import CreateRoleModal from 'sections/apps/Acl/CreateRoleModal';
import EmptyReactTable from 'pages/tables/react-table/empty';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { useGetRoles } from 'api/acl';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Eye, Trash, UserRemove, UserTick } from 'iconsax-react';
// import UserAvatar from 'sections/apps/chat/UserAvatar';
// import Alert from 'themes/overrides/Alert';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });
  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data?.length} records...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Create roles
          </Button>
          <CSVExport {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'User-list.csv' }} />
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                        <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                          <RoleView id={row.original.id} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| User LIST ||============================== //

export default function ACLListPage() {
  const theme = useTheme();
  const { UsersLoading: loading, Users: lists } = useGetRoles();
  const [open, setOpen] = useState(false);
  const [isSuspendUserOpen, setIsSuspendUserOpen] = useState(false);
  const [activateUserOpen, setActivateUserOpen] = useState(false);
  const [activateCreateRoleOpen, setActivateCreateRoleOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [UserDeleteId, setUserDeleteId] = useState('');

  const handleClose = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleCloseSuspendModal = useCallback(() => {
    setIsSuspendUserOpen((prevState) => !prevState);
  }, []);

  const handleCloseActivateModal = useCallback(() => {
    setActivateUserOpen((prevState) => !prevState);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');

    // Handle case with one name
    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    }

    // Get initials from the first and last name
    const firstInitial = nameParts[0][0].toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  const columns = useMemo(
    () => [
      {
        id: 'Row Selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: '#',
        accessorKey: 'id',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => <Typography variant="text.primary">{row.index + 1}</Typography>
      },
      {
        header: 'Role',
        accessorKey: 'attributes.name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {row.original.attributes.avatar ? (
              <Avatar alt="Avatar" size="sm" src={getImageUrl(`avatar-${!row.original.attributes.avatar}.png`, ImagePath.USERS)} />
            ) : (
              <Avatar alt="User Initials" size="sm">
                {getUserInitials(getValue())}
              </Avatar>
            )}
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row.original.attributes.email}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Guard Name',
        accessorKey: 'attributes.guard_name',
        cell: ({ getValue }) => <Typography variant="text.primary">{getValue()}</Typography>
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <Eye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Suspend User">
                <IconButton
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseSuspendModal();
                    setUserDeleteId(row.original.id);
                    setUserName(row.original.attributes.name);
                  }}
                >
                  <UserRemove />
                </IconButton>
              </Tooltip>
              <Tooltip title="Activate User">
                <IconButton
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseActivateModal();
                    setUserDeleteId(row.original.id);
                    setUserName(row.original.attributes.name);
                  }}
                >
                  <UserTick />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setUserDeleteId(row.original.id);
                    setUserName(row.original.attributes.name);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme, handleClose, handleCloseActivateModal, handleCloseSuspendModal]
  );

  if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: lists,
          columns,
          modalToggler: () => {
            setActivateCreateRoleOpen(true);
          }
        }}
      />
      <AlertUserDelete id={UserDeleteId} title={userName} open={open} handleClose={handleClose} />
      <AlertSuspendUser id={UserDeleteId} title={userName} open={isSuspendUserOpen} handleClose={handleCloseSuspendModal} />
      <AlertActivateUser id={UserDeleteId} title={userName} open={activateUserOpen} handleClose={handleCloseActivateModal} />
      <CreateRoleModal open={activateCreateRoleOpen} modalToggler={setActivateCreateRoleOpen} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
