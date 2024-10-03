import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertEventDelete from 'sections/apps/events/AlertEventDelete';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { updateEvent } from 'api/event';


// assets
import { Trash } from 'iconsax-react';

// CONSTANT
const getInitialValues = (event) => {
  const newEvent = {
    title: '',
    Category: '',
    type: '',
    attendance_type: '',
    venue: '',
    address: 1,
    day: '',
    month: '',
    year: '',
    start_time: 0,
    end_time: 50,
    phone_number: 2,
    latitude: '',
    longitude: '',
    keynote: ''
  };

  if (event) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

const days = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: i + 1
}));

const months = Array.from({ length: 12 }, (_, i) => {
  const value = i.toString().padStart(2, '0');
  return { value, label: value };
});

const hours = Array.from({ length: 13 }, (_, i) => {
  const value = i.toString().padStart(2, '0');
  return { value, label: value };
});

const minutes = Array.from({ length: 61 }, (_, i) => {
  const value = i.toString().padStart(2, '0');
  return { value, label: value };
});

const timePeriod = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' }
];
const years = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
  { value: '2030', label: '2030' }
];

const type = [
  {
    value: 'private',
    label: 'Private'
  },
  {
    value: 'public',
    label: 'Public'
  }
];

const attendanceType = [
  {
    value: 'physical',
    label: 'Physical'
  },
  {
    value: 'virtual',
    label: 'Virtual'
  },
  {
    value: 'both',
    label: 'Both'
  }
];

// ==============================||EVENT EDIT - FORM ||============================== //

export default function FormEventEdit({ event, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const EventsSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    Category: Yup.string().max(255).required('Category is required'),
    type: Yup.string().max(255).required('Type is required'),
    attendance_type: Yup.string().max(255).required('Attendance Type is required'),
    venue: Yup.string().max(255).required('Venue is required'),
    address: Yup.string().max(255).required('Address is required'),
    day: Yup.number().max(2).required('Day is required'),
    month: Yup.number().max(2).required('Month is required'),
    year: Yup.number().max(4).required('Year is required'),
    hour: Yup.number().max(2).required('Hour is required'),
    minute: Yup.number().max(2).required('Minute is required'),
    period: Yup.string().max(255).required('Period is required'),
    keynote: Yup.string().max(255).required('Keynote is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(event),
    validationSchema: EventsSchema,
    enableReinitialize: true,
  });

  const { errors, touched, isSubmitting, getFieldProps, setFieldValue } = formik;
  const [startHour, startMinutes] = formik.values.start_time.split(':');
  const [endHour, endMinutes] = formik.values.end_time.split(':');

  let startHour12 = startHour;
  if (startHour12 > 12) {
    startHour12 -= 12;
  }
  startHour12 = String(startHour12).padStart(2, '0');

  let endHour12 = endHour;
  if (endHour12 > 12) {
    endHour12 -= 12;
  }
  endHour12 = String(endHour12).padStart(2, '0');

  let period = '';
  if (startHour >= 12 || endHour >= 12) {
    period = 'PM';
  } else if (startHour < 12 || endHour < 12) {
    period = 'AM';
  }

  const handleChangeStartHour = (event) => {
    let selectedHour = parseInt(event.target.value, 10);
    const currentMinute = formik.values.start_time.split(':')[1] || '00'; // Get current minute correctly
    const currentPeriod = period;

    if (currentPeriod === 'PM' && selectedHour !== 12) {
      selectedHour += 12;
    } else if (currentPeriod === 'AM' && selectedHour === 12) {
      selectedHour = '00';
    }
    formik.setFieldValue('start_time', `${selectedHour}:${currentMinute}`);
  };

  const handleChangeStartMinute = (event) => {
    const selectedMinute = event.target.value;
    const currentHour = formik.values.start_time.split(':')[0]; // Get current hour correctly
    formik.setFieldValue('start_time', `${currentHour}:${selectedMinute}`);
  };

  const handleChangeEndHour = (event) => {
    let selectedHour = parseInt(event.target.value, 10);
    const currentMinute = formik.values.end_time.split(':')[1] || '00'; // Get current minute correctly
    const currentPeriod = period;

    if (currentPeriod === 'PM' && selectedHour !== 12) {
      selectedHour += 12;
    } else if (currentPeriod === 'AM' && selectedHour === 12) {
      selectedHour = '00';
    }
    formik.setFieldValue('end_time', `${selectedHour}:${currentMinute}`);
  };

  const handleChangeEndMinute = (event) => {
    const selectedMinute = event.target.value;
    const currentHour = formik.values.end_time.split(':')[0]; // Get current hour correctly
    formik.setFieldValue('end_time', `${currentHour}:${selectedMinute}`);
  };

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="off"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              updateEvent(formik.values.identifier, formik.values, Event).then(() => {
                openSnackbar({
                  open: true,
                  message: 'Event updated successfully.',
                  variant: 'alert',

                  alert: {
                    color: 'success'
                  }
                });
                closeModal();
              });

              console.log('Event updated', formik.values);
            }}
          >
            <DialogTitle sx={{ pl: 2.5 }}>{'Edit Event'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-title"> Event Title</InputLabel>
                        <TextField
                          fullWidth
                          id="event-title"
                          placeholder="Enter Event"
                          {...getFieldProps('title')}
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-category">Category</InputLabel>
                        <TextField
                          fullWidth
                          id="event-category"
                          placeholder="Enter Category e.g Wedding, Graduation, Birthday"
                          {...getFieldProps('category')}
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-type">Type</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('type')}
                            onChange={(event) => setFieldValue('type', event.target.value)}
                            value={formik.values.type}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Select Status</Typography>;
                              }

                              const selectedStatus = type.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                </Typography>
                              );
                            }}
                          >
                            {type.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-attendance_type">Attendance Type</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('attendance_type')}
                            onChange={(event) => setFieldValue('attendance_type', event.target.value)}
                            value={formik.values.attendance_type}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Select Status</Typography>;
                              }

                              const selectedStatus = attendanceType.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                </Typography>
                              );
                            }}
                          >
                            {attendanceType.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-venue">Venue</InputLabel>
                        <TextField
                          fullWidth
                          id="event-venue"
                          placeholder="Enter Event Venue"
                          {...getFieldProps('venue')}
                          error={Boolean(touched.venue && errors.venue)}
                          helperText={touched.venue && errors.venue}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-role">Address</InputLabel>
                        <TextField
                          fullWidth
                          id="event-role"
                          placeholder="Enter Address"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-role">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="event-role"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phone_number')}
                          error={Boolean(touched.phone_number && errors.phone_number)}
                          helperText={touched.phone_number && errors.phone_number}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="event-role">Hashtags</InputLabel>
                        <TextField
                          fullWidth
                          id="event-role"
                          placeholder="Enter Hashtags"
                          {...getFieldProps('hashtags')}
                          error={Boolean(touched.hashtags && errors.hashtags)}
                          helperText={touched.hashtags && errors.hashtags}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="primary" sx={{ mb: 1 }}>
                        Date
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Day</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                {...getFieldProps('day')}
                                onChange={(event) => setFieldValue('day', event.target.value)}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select day</Typography>;
                                  }

                                  const selectedStatus = days.filter((item) => item.value === Number(selected));
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {days.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Month</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                {...getFieldProps('month')}
                                onChange={(event) => setFieldValue('month', event.target.value)}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Month</Typography>;
                                  }

                                  const selectedStatus = months.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {months.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Year</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                {...getFieldProps('year')}
                                onChange={(event) => setFieldValue('year', event.target.value)}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Year</Typography>;
                                  }

                                  const selectedStatus = years.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {years.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="primary" sx={{ mb: 2 }}>
                        Start Time
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Hour</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={startHour12}
                                onChange={handleChangeStartHour}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Hour</Typography>;
                                  }

                                  const selectedStatus = hours.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {hours.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Minute</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={startMinutes}
                                onChange={handleChangeStartMinute}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Minutes</Typography>;
                                  }

                                  const selectedStatus = minutes.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {minutes.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Period</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={period}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Period</Typography>;
                                  }

                                  const selectedStatus = timePeriod.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {timePeriod.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="primary" sx={{ mb: 1 }}>
                        End Time
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Hour</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={endHour12}
                                onChange={handleChangeEndHour}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Hour</Typography>;
                                  }

                                  const selectedStatus = hours.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {hours.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Minute</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={endMinutes}
                                onChange={handleChangeEndMinute}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Minutes</Typography>;
                                  }

                                  const selectedStatus = minutes.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {minutes.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Event-start_time">Period</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                id="column-hiding"
                                displayEmpty
                                value={period}
                                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return <Typography variant="subtitle1">Select Period</Typography>;
                                  }

                                  const selectedStatus = timePeriod.filter((item) => item.value === selected);
                                  return (
                                    <Typography variant="subtitle2">
                                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                    </Typography>
                                  );
                                }}
                              >
                                {timePeriod.map((column) => (
                                  <MenuItem key={column.value} value={column.value}>
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {event && (
                    <Tooltip title="Delete event" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Edit Event
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {event && <AlertEventDelete id={event.id} title={event.title} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormEventEdit.propTypes = { event: PropTypes.any, closeModal: PropTypes.func };
