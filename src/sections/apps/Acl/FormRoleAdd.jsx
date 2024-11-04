import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  Button,
  Divider,
  TextField,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { createRole } from 'api/acl';
import { openSnackbar } from 'api/snackbar';

export default function FormRoleAdd({ closeModal }) {
  const [loading, setLoading] = useState(true);

  const permissions = [
    {
      id: 1,
      name: 'view.admin',
      permission: 'View admin'
    },
    {
      id: 2,
      name: 'create.admin',
      permission: 'Create admin'
    },
    {
      id: 3,
      name: 'edit.admin',
      permission: 'Edit admin'
    },
    {
      id: 4,
      name: 'delete.admin',
      permission: 'Delete admin'
    },
    {
      id: 5,
      name: 'view.role',
      permission: 'View role'
    },
    {
      id: 6,
      name: 'edit.role',
      permission: 'Edit role'
    },
    {
      id: 7,
      name: 'view.review',
      permission: 'View review'
    },
    {
      id: 8,
      name: 'create.role',
      permission: 'Create Role'
    },
    {
      id: 9,
      name: 'delete.role',
      permission: 'Delete role'
    },
    {
      id: 10,
      name: 'view.user',
      permission: 'View user'
    },
    {
      id: 11,
      name: 'edit.user',
      permission: 'Edit user'
    },
    {
      id: 12,
      name: 'delete.user',
      permission: 'Delete user'
    },
    {
      id: 13,
      name: 'create.user',
      permission: 'Create user'
    },
    {
      id: 14,
      name: 'impersonate.user',
      permission: 'Impersonate user'
    },
    {
      id: 15,
      name: 'view.event',
      permission: 'View event'
    },
    {
      id: 16,
      name: 'edit.event',
      permission: 'Edit event'
    }
  ];

  const RoleSchema = Yup.object().shape({
    role: Yup.string().max(255).required('Role Name is required'),
    permissions: Yup.array()
      .of(Yup.string()) // Ensure each item in the array is a string
      .min(1, 'At least one permission is required') // Require at least one permission
      .required('Permissions are required')
  });

  const formik = useFormik({
    initialValues: {
      role: '',
      permissions: []
    },
    validationSchema: RoleSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        role: values.role,
        permissions: values.permissions
      };

      try {
        console.log(data);
        await createRole(data);
        openSnackbar({
          open: true,
          message: 'Role created successfully.',
          variant: 'alert',
          alert: { color: 'success' }
        });
        closeModal();
      } catch (error) {
        console.error('Role creation error:', error);
        openSnackbar({
          open: true,
          message: 'Failed to create role. Please try again.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const { errors, touched, handleSubmit, isSubmitting, values } = formik;

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
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>Create Role</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="role">Role Name</InputLabel>
                    <TextField
                      fullWidth
                      id="role"
                      name="role"
                      placeholder="Enter Role Name"
                      value={values.role}
                      onChange={formik.handleChange}
                      error={Boolean(touched.role && errors.role)}
                      helperText={touched.role && errors.role}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Assign Permissions</InputLabel>
                  </Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormGroup>
                        {permissions
                          .filter((permission) => permission.id >= 1 && permission.id <= 8)
                          .map((permission) => (
                            <FormControlLabel
                              key={permission.id}
                              control={
                                <Checkbox
                                  value={permission.name}
                                  checked={values.permissions.includes(permission.name)}
                                  onChange={(e) => {
                                    const name = e.target.value;
                                    formik.setFieldValue(
                                      'permissions',
                                      e.target.checked
                                        ? [...values.permissions, name]
                                        : values.permissions.filter((permName) => permName !== name)
                                    );
                                  }}
                                />
                              }
                              label={permission.permission}
                            />
                          ))}
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormGroup>
                        {permissions
                          .filter((permission) => permission.id >= 9 && permission.id <= 16)
                          .map((permission) => (
                            <FormControlLabel
                              key={permission.id}
                              control={
                                <Checkbox
                                  value={permission.name}
                                  checked={values.permissions.includes(permission.name)}
                                  onChange={(e) => {
                                    const name = e.target.value;
                                    formik.setFieldValue(
                                      'permissions',
                                      e.target.checked
                                        ? [...values.permissions, name]
                                        : values.permissions.filter((permName) => permName !== name)
                                    );
                                  }}
                                />
                              }
                              label={permission.permission}
                            />
                          ))}
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Add Role
              </Button>
              <Button color="error" onClick={closeModal}>
                Cancel
              </Button>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}

FormRoleAdd.propTypes = { closeModal: PropTypes.func };
