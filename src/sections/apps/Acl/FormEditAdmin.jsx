import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { updateAdmin } from 'api/acl';

// ==============================|| User ADD / EDIT - FORM ||============================== //

export default function FormEditAdmin({ adminId, adminData, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const UserSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('First Name is required'),
    lastName: Yup.string().max(255).required('Last Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    role: Yup.string().required('Role is required')
  });

  const formik = useFormik({
    initialValues: {
      first_name: adminData?.first_name || '',
      last_name: adminData?.last_name || '',
      email: adminData?.email || '',
      role: adminData?.roles[0]?.name || ''
    },
    validationSchema: UserSchema,
    enableReinitialize: true
  });

  const { errors, touched, isSubmitting, getFieldProps } = formik;

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
              updateAdmin(adminId, formik.values).then(() => {
                openSnackbar({
                  open: true,
                  message: 'Admin updated successfully.',
                  variant: 'alert',

                  alert: {
                    color: 'success'
                  }
                });
                closeModal();
              });
              console.log('admin', formik.values);
            }}
          >
            <DialogTitle>Edit Admin</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-firstName">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="User-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('first_name')}
                          error={Boolean(touched.first_name && errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="User-lastName"
                          placeholder="Enter Last Name"
                          {...getFieldProps('last_name')}
                          error={Boolean(touched.last_name && errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="User-email"
                          placeholder="Enter User Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-role">Role</InputLabel>
                        <Select id="User-role" {...getFieldProps('role')} defaultValue="admin" error={Boolean(touched.role && errors.role)}>
                          <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Edit Admin
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {/* {User && <AlertUserDelete id={User.id} title={User.name} open={openAlert} handleClose={handleAlertClose} />} */}
    </>
  );
}

FormEditAdmin.propTypes = { User: PropTypes.any, closeModal: PropTypes.func };
