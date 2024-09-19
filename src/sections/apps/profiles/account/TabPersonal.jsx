// import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

import { ThemeMode } from 'config';
// import defaultImages from 'assets/images/users/default.png';

// assets
import { Camera } from 'iconsax-react';

// styles & constant
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
//     }
//   }
// };

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

export default function TabPersonal() {
  const theme = useTheme();
  // const [selectedImage, setSelectedImage] = useState(undefined);
  // const [avatar, setAvatar] = useState(defaultImages);

  // useEffect(() => {
  //   if (selectedImage) {
  //     setAvatar(URL.createObjectURL(selectedImage));
  //   }
  // }, [selectedImage]);

  // const handleChange = (event) => {
  //   setExperience(event.target.value);
  // };

  const getUserInitials = (name) => {
    if (!name) return ''; // Fallback if name is empty or undefined
    const nameParts = name.trim().split(' ');

    // If there's only one part of the name, just return the first letter
    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    }

    // Return initials from the first and last names
    const firstInitial = nameParts[0][0].toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };
  const user = JSON.parse(window.localStorage.getItem('userData'));
  return (
    <Grid container spacing={3}>
      <Grid item sx={{ width: '60%' }}>
        <MainCard title="Personal Information">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                <FormLabel
                  htmlFor="change-avtar"
                  sx={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    '&:hover .MuiBox-root': { opacity: 1 },
                    cursor: 'pointer'
                  }}
                >
                  {user.avatar ? (
                    <Avatar alt="Avatar 1" src={user.avatar} sx={{ width: 76, height: 76 }} />
                  ) : (
                    <Avatar sx={{ width: 76, height: 76 }}>{getUserInitials(user.first_name + ' ' + user.last_name)}</Avatar>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Stack spacing={0.5} alignItems="center">
                      <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                      <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                        Upload
                      </Typography>
                    </Stack>
                  </Box>
                </FormLabel>
                <TextField
                  type="file"
                  id="change-avtar"
                  placeholder="Outlined"
                  variant="outlined"
                  sx={{ display: 'none' }}
                  onChange={(e) => setSelectedImage(e.target.files?.[0])}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                <TextField fullWidth defaultValue={user.first_name} id="personal-first-name" placeholder="First Name" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-first-name">Last Name</InputLabel>
                <TextField fullWidth defaultValue={user.last_name} id="personal-first-name" placeholder="Last Name" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-location">Role</InputLabel>
                <TextField fullWidth defaultValue={user.roles[0]} id="personal-location" placeholder="Location" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                <TextField type="email" fullWidth defaultValue={user.email} id="personal-email" placeholder="Email Address" />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained">Update Profile</Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
