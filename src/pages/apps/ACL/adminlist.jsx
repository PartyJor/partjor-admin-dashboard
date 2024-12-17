import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useCallback, useEffect } from 'react';
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

import AlertAdminDelete from 'sections/apps/Acl/AlertAdminDelete';
import AdminView from 'sections/apps/Acl/AdminView';
import CreateAdminModal from 'sections/apps/Acl/CreateAdminModal';
import EditAdminModal from 'sections/apps/Acl/EditAdminModal';
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

import { useGetAdmins } from 'api/acl';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Eye, Trash, Edit2 } from 'iconsax-react';
// import UserAvatar from 'sections/apps/chat/UserAvatar';
// import Alert from 'themes/overrides/Alert';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const userData = JSON.parse(window.localStorage.getItem('userData'));

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
          {userData?.roles?.includes('super_admin') && (
            <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
              Create admin
            </Button>
          )}
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
                          <AdminView data={row.original} />
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

export default function AdminListPage() {
  const theme = useTheme();
  const { UsersLoading: loading, Users: lists } = useGetAdmins();
  const [open, setOpen] = useState(false);
  const [activateCreateAdminOpen, setActivateCreateAdminOpen] = useState(false);
  const [activateEditAdminOpen, setActivateEditAdminOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [role, setRole] = useState('');

  const handleClose = useCallback(() => {
    setOpen((prevState) => !prevState);
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

  const userData = JSON.parse(window.localStorage.getItem('userData'));

  useEffect(() => {
    if (userData?.roles.includes('admin')) {
      setRole('admin');
    }
  }, [role, userData?.roles]);

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
        header: 'Name',
        accessorFn: (row) => `${row.attributes.first_name} ${row.attributes.last_name}`,
        id: 'fullName',
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
        header: 'Role',
        accessorFn: (row) => (row.attributes.roles.length > 0 ? row.attributes.roles[0].name : 'No Role'),
        id: 'role',
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

              {userData?.roles?.includes('super_admin') && (
                <>
                  <Tooltip title="Edit Admin">
                    <IconButton
                      color="info"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivateEditAdminOpen(true);
                        setAdminId(row.original.id);
                        setSelectedAdmin(row?.original?.attributes);
                      }}
                    >
                      <Edit2 />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                        setAdminId(row?.original?.id);
                        setUserName(row.original.attributes.first_name + ' ' + row.original.attributes.last_name);
                      }}
                    >
                      <Trash />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          );
        }
      }
    ],
    [theme, handleClose, userData?.roles]
  );

  if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: lists,
          columns,
          modalToggler: () => {
            setActivateCreateAdminOpen(true);
          }
        }}
      />
      <AlertAdminDelete id={adminId} title={userName} open={open} handleClose={handleClose} />
      <CreateAdminModal open={activateCreateAdminOpen} modalToggler={setActivateCreateAdminOpen} />
      <EditAdminModal open={activateEditAdminOpen} modalToggler={setActivateEditAdminOpen} adminId={adminId} admin={selectedAdmin} />
      {/* {isUserModalOpen && <UserModal open={isUserModalOpen} modalToggler={setIsUserModalOpen} User={selectedUser} />} */}
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
