import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertUser, updateUser } from 'api/user';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { FormGroup } from '@mui/material';

// ==============================|| User ADD / EDIT - FORM ||============================== //

export default function FormRoleAdd({ closeModal }) {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);

  const permissions = [
    {
      id: 1,
      permission: 'View admin'
    },
    {
      id: 2,
      permission: 'Create admin'
    },
    {
      id: 3,
      permission: 'Edit admin'
    },
    {
      id: 4,
      permission: 'Delete admin'
    },
    {
      id: 5,
      permission: 'View role'
    },
    {
      id: 6,
      permission: 'Edit role'
    },
    {
      id: 7,
      permission: 'View review'
    },
    {
      id: 8,
      permission: 'Create Role'
    },
    {
      id: 9,
      permission: 'Delete role'
    },
    {
      id: 10,
      permission: 'View user'
    },
    {
      id: 11,
      permission: 'Edit user'
    },
    {
      id: 12,
      permission: 'Delete user'
    },
    {
      id: 13,
      permission: 'Create user'
    },
    {
      id: 14,
      permission: 'Impersonate user'
    },
    {
      id: 15,
      permission: 'View event'
    },
    {
      id: 16,
      permission: 'Edit event'
    }
  ];

  //   useEffect(() => {
  //     if (selectedImage) {
  //       setAvatar(URL.createObjectURL(selectedImage));
  //     }
  //   }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const RoleSchema = Yup.object().shape({
    roleName: Yup.string().max(255).required('Role Name is required'),
    perimission: Yup.string().max(255).required('Permission is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    validationSchema: RoleSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newUser = values;
        newUser.name = newUser.firstName + ' ' + newUser.lastName;

        if (User) {
          updateUser(newUser.id, newUser).then(() => {
            openSnackbar({
              open: true,
              message: 'User update successfully.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertUser(newUser).then(() => {
            openSnackbar({
              open: true,
              message: 'User added successfully.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        }
      } catch (error) {
        // console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-firstName">Role Name</InputLabel>
                        <TextField
                          fullWidth
                          id="User-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.roleName && errors.roletName)}
                          helperText={touched.roleName && errors.roleName}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="User-firstName">Assign Permissions</InputLabel>
                  </Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <FormGroup>
                          {permissions
                            .filter((permission) => permission.id >= 1 && permission.id <= 8)
                            .map((permission) => (
                              <FormControlLabel key={permission.id} control={<Checkbox />} label={permission.permission} />
                            ))}
                        </FormGroup>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <FormGroup>
                          {permissions
                            .filter((permission) => permission.id >= 9 && permission.id <= 16)
                            .map((permission) => (
                              <FormControlLabel key={permission.id} control={<Checkbox />} label={permission.permission} />
                            ))}
                        </FormGroup>
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
                  <Stack direction="row" spacing={6} alignItems="center">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Add Role
                    </Button>
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}

FormRoleAdd.propTypes = { closeModal: PropTypes.func };
