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

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
// import AlertUserDelete from './AlertUserDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertUser, updateUser } from 'api/user';
import { createAdmin } from 'api/acl';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';

const skills = [
  'Adobe XD',
  'After Effect',
  'Angular',
  'Animation',
  'ASP.Net',
  'Bootstrap',
  'C#',
  'CC',
  'Corel Draw',
  'CSS',
  'DIV',
  'Dreamweaver',
  'Figma',
  'Graphics',
  'HTML',
  'Illustrator',
  'J2Ee',
  'Java',
  'Javascript',
  'JQuery',
  'Logo Design',
  'Material UI',
  'Motion',
  'MVC',
  'MySQL',
  'NodeJS',
  'npm',
  'Photoshop',
  'PHP',
  'React',
  'Redux',
  'Reduxjs & tooltit',
  'SASS',
  'SCSS',
  'SQL Server',
  'SVG',
  'UI/UX',
  'User Interface Designing',
  'Wordpress'
];

// CONSTANT
const getInitialValues = (User) => {
  const newUser = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    age: 18,
    avatar: 1,
    gender: Gender.FEMALE,
    role: '',
    fatherName: '',
    orders: 0,
    progress: 50,
    status: 2,
    orderStatus: '',
    contact: '',
    country: '',
    location: '',
    about: '',
    skills: [],
    time: ['just now'],
    date: ''
  };

  if (User) {
    return _.merge({}, newUser, User);
  }

  return newUser;
};

const allStatus = [
  { value: 3, label: 'Rejected' },
  { value: 1, label: 'Verified' },
  { value: 2, label: 'Pending' }
];

// ==============================|| User ADD / EDIT - FORM ||============================== //

export default function FormAdminAdd({ User, closeModal }) {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(
    getImageUrl(`avatar-${User && User !== null && User?.avatar ? User.avatar : 1}.png`, ImagePath.USERS)
  );

  // useEffect(() => {
  //   if (selectedImage) {
  //     setAvatar(URL.createObjectURL(selectedImage));
  //   }
  // }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const UserSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('First Name is required'),
    lastName: Yup.string().max(255).required('Last Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    status: Yup.string().required('Status is required'),
    location: Yup.string().max(500),
    about: Yup.string().max(500)
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: ''
    },
    validationSchema: UserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role
      };

      try {
        console.log(data);
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
            <DialogTitle>New Admin</DialogTitle>
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
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
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
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
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
                        <TextField
                          fullWidth
                          id="User-role"
                          placeholder="Enter Role"
                          {...getFieldProps('role')}
                          error={Boolean(touched.role && errors.role)}
                          helperText={touched.role && errors.role}
                        />
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
                  {User && (
                    <Tooltip title="Delete User" placement="top">
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
                      {User ? 'Edit' : 'Add'}
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

FormAdminAdd.propTypes = { User: PropTypes.any, closeModal: PropTypes.func };
