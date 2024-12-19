import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
// import Tooltip from '@mui/material/Tooltip';
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

// import AlertUserDelete from 'sections/apps/user/AlertUserDelete';
// import AlertEventDelete from 'sections/apps/events/AlertEventDelete';
// import AlertSuspendUser from 'sections/apps/user/AlertSuspendUser';
// import AlertActivateUser from 'sections/apps/user/AlertActivateUser';
import EventView from 'sections/apps/events/EventView';
// import EventsModal from './EventsModal';

import EmptyReactTable from 'pages/tables/react-table/empty';

import { DebouncedInput, HeaderSort, IndeterminateCheckbox, RowSelection, TablePagination } from 'components/third-party/react-table';

import { useGetEventsList, fetchEventDetails } from 'api/event';

// assets
import { useLocation, useParams } from 'react-router';
// import UserAvatar from 'sections/apps/chat/UserAvatar';
// import Alert from 'themes/overrides/Alert';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data = [], columns }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const { title } = useParams();

  const table = useReactTable({
    data: data || [],
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
    <>
      <Typography style={{ marginBottom: 15, fontSize: 20, fontWeight: 'bold' }}>Invitation List for {title}</Typography>
      <MainCard content={false}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${data?.length ?? 0} records...`}
          />
        </Stack>
        <ScrollX>
          <Stack>
            <RowSelection selected={Object.keys(rowSelection)?.length} />
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
                    <Fragment key={row.original.id}>
                      <TableRow>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                          <TableCell colSpan={row.getVisibleCells()?.length} sx={{ p: 2.5, overflow: 'hidden' }}>
                            <EventView data={row.original} />
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
    </>
  );
}
// ==============================|| User LIST ||============================== //

export default function InvitationsListPage() {
  const theme = useTheme();
  const location = useLocation();
  const event_id = location?.state?.eventId;
  const { EventsLoading: loading, Events: lists } = useGetEventsList();
  // const [open, setOpen] = useState(false);
  // const [eventTitle, setEventTitle] = useState('');
  // const [eventDeleteId, setEventDeleteId] = useState('');
  // const [selectedEvent, setSelectedEvent] = useState('');
  // const [eventId, setEventId] = useState('');
  // const [eventModalOpen, setEventModalOpen] = useState(false);
  const [invitationList, setInvitationsList] = useState(null);

  // const handleClose = () => {
  //   setOpen(!open);
  // };

  useEffect(() => {
    const handleFetchEventDetails = async () => {
      if (lists) {
        const eventDetails = await fetchEventDetails(event_id); // Assuming fetchEventDetails returns a single promise
        console.log('Event Details:', eventDetails?.included);
        if (eventDetails && eventDetails.included) {
          const allInvitations = eventDetails.included.filter((detail) => detail.type === 'invitations') || [];
          console.log('invitations', allInvitations);
          setInvitationsList(allInvitations);
        }
      }
    };

    handleFetchEventDetails();
  }, [event_id, lists]);

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
        header: 'Email',
        accessorKey: 'attributes.email',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row?.original?.attributes?.email}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Has Account',
        accessorKey: 'attributes.has_account',
        cell: ({ getValue }) => <Typography variant="text.primary">{getValue() === false ? 'No' : 'Yes'}</Typography>
      },
      {
        header: 'Level',
        accessorKey: 'attributes.level',
        meta: {
          className: 'cell-left'
        }
      },
      {
        header: 'Type',
        accessorKey: 'attributes.message'
      },
      {
        header: 'Status',
        accessorKey: 'attributes.status',
        cell: ({ getValue }) => (
          <Chip
            color={getValue() === 'accepted' ? 'success' : getValue() === 'invited' ? 'info' : 'error'}
            label={getValue()}
            size="small"
            variant="light"
          />
        )
      }
      // {
      //   header: 'Actions',
      //   meta: {
      //     className: 'cell-center'
      //   },
      //   disableSortBy: true,
      //   cell: ({ row }) => {
      //     const collapseIcon =
      //       row.getCanExpand() && row.getIsExpanded() ? (
      //         <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
      //       ) : (
      //         <Eye />
      //       );
      //     return (
      //       <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      //         <Tooltip title="View Event">
      //           <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
      //             {collapseIcon}
      //           </IconButton>
      //         </Tooltip>
      //         <Tooltip title="Edit Event">
      //           <IconButton
      //             color="success"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               setSelectedEvent(row.original.attributes);
      //               setEventModalOpen(true);
      //               setEventId(row.original.id);
      //             }}
      //           >
      //             <Edit />
      //           </IconButton>
      //         </Tooltip>
      //         <Tooltip title="Delete Event">
      //           <IconButton
      //             color="error"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               handleClose();
      //               setEventDeleteId(row.original.id);
      //               setEventTitle(row.original.attributes.title);
      //             }}
      //           >
      //             <Trash />
      //           </IconButton>
      //         </Tooltip>
      //       </Stack>
      //     );
      //   }
      // }
    ],
    [theme]
  );

  if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: invitationList,
          columns,
          modalToggler: () => {
            setUserModal(true);
          }
        }}
      />
      {/* <AlertEventDelete id={eventDeleteId} title={eventTitle} open={open} handleClose={handleClose} />
      <EventsModal open={eventModalOpen} modalToggler={setEventModalOpen} EventId={eventId} Event={selectedEvent} /> */}
      {/* <AlertSuspendUser id={UserDeleteId} title={userName} open={isSuspendUserOpen} handleClose={handleCloseSuspendModal} />
      <AlertActivateUser id={UserDeleteId} title={userName} open={activateUserOpen} handleClose={handleCloseActivateModal} /> */}
      {/* {isUserModalOpen && <UserModal open={isUserModalOpen} modalToggler={setIsUserModalOpen} User={selectedUser} />} */}
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
