import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Button from '@mui/material/Button';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

// assets
import { Location, Mobile, Calendar } from 'iconsax-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// ==============================|| User - VIEW ||============================== //

export default function UserEventView({ data }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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

  function formatTime(timeString) {
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours, 10);
    let timePeriod = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes}:${timePeriod}`;
  }
  const start_time = data?.data?.attributes?.start_time;
  let formattedStartTime = formatTime(start_time);

  const end_time = data?.data?.attributes?.end_time;
  let formattedEndTime = formatTime(end_time);

  useEffect(() => {
    console.log('event', data);
  });

  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <MainCard sx={{ flexGrow: 1 }}>
            <Chip
              label={data?.data?.attributes?.status}
              size="small"
              color={
                data?.data?.attributes?.status === 'completed' ||
                data?.data?.attributes?.status === 'ongoing' ||
                data?.data?.attributes?.status === 'published'
                  ? 'primary'
                  : data?.attributes?.status === 'draft'
                    ? 'info'
                    : 'error'
              }
              sx={{ position: 'absolute', right: 10, top: 10, fontSize: '0.675rem' }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  {data?.data?.attributes?.avatar ? (
                    <Avatar alt="E" size="xl" src={data?.attributes?.avatar} />
                  ) : (
                    <Avatar size="xl">{getUserInitials(data?.data?.attributes?.title)}</Avatar>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                  <ListItem
                    style={{
                      display: 'flex',
                      flexDirection: 'column', // Stacks items vertically
                      alignItems: 'flex-start', // Aligns items to the left
                      padding: '10px' // Add padding if necessary
                    }}
                  >
                    <ListItemIcon style={{ marginBottom: '15px' }}>
                      <Location size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                      <Typography
                        align="right"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '25px',
                          marginLeft: '25px'
                        }}
                      >
                        {data?.data?.attributes?.address}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem
                    style={{
                      display: 'flex',
                      flexDirection: 'column', // Stacks items vertically
                      alignItems: 'flex-start', // Aligns items to the left
                      padding: '10px' // Add padding if necessary
                    }}
                  >
                    <ListItemIcon style={{ marginBottom: '15px' }}>
                      <Mobile size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                      <Typography
                        align="right"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '30px',
                          marginLeft: '25px'
                        }}
                      >
                        {data?.data?.attributes?.phone_number}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem
                    style={{
                      display: 'flex',
                      flexDirection: 'column', // Stacks items vertically
                      alignItems: 'flex-start', // Aligns items to the left
                      padding: '10px' // Add padding if necessary
                    }}
                  >
                    <ListItemIcon style={{ marginBottom: '15px' }}>
                      <Calendar size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                      <Typography
                        align="right"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '25px',
                          marginLeft: '25px'
                        }}
                      >
                        {data?.data?.attributes?.day + '/' + data?.data?.attributes?.month + '/' + data?.data?.attributes?.year}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
            <MainCard title="Event Details" sx={{ flexGrow: 1 }}>
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Event Title</Typography>
                        <Typography>{data?.data?.attributes?.title}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Attendance Type</Typography>
                        <Typography>{data?.data?.attributes?.attendance_type}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Start Time</Typography>
                        <Typography>{formattedStartTime}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">End Time</Typography>
                        <Typography>{formattedEndTime}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Description</Typography>
                    <Typography>{data?.data?.attributes?.keynote}</Typography>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Invitations Count</Typography>
                    <Typography>{data?.data?.attributes?.invitations_count}</Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/apps/events/invitations-list/${data?.data?.attributes?.title}`, { state: { eventId: data?.data?.id } });
                      }}
                    >
                      View all invitations
                    </Button>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Gifts</Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/apps/events/gifts-list/${data?.data?.attributes?.title}`, { state: { eventId: data?.data.id } });
                      }}
                    >
                      View all gifts
                    </Button>
                  </Stack>
                </ListItem>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}

UserEventView.propTypes = { data: PropTypes.any };
