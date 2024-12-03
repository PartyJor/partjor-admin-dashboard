import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { Sms } from 'iconsax-react';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

export default function TabProfile() {
  const user = JSON.parse(window.localStorage.getItem('userData'));

  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');

    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    }

    const firstInitial = nameParts[0][0].toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    {user.avatar ? (
                      <Avatar alt="Avatar 1" src={user.avatar} sx={{ width: 76, height: 76 }} />
                    ) : (
                      <Avatar sx={{ width: 76, height: 76 }}>{getUserInitials(user.first_name + ' ' + user.last_name)}</Avatar>
                    )}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{user.first_name + ' ' + user.last_name}</Typography>
                      <Typography color="secondary">{user.roles[0]}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{user.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
