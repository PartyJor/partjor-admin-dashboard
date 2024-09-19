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

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Location, Mobile, Sms } from 'iconsax-react';

// ==============================|| User - VIEW ||============================== //

export default function UserView({ data }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={5} md={4} lg={4} xl={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <MainCard sx={{ flexGrow: 1 }}>
            <Chip
              label={data.attributes.status}
              size="small"
              color={data.attributes.status === 'active' ? 'primary' : data.attributes.status === 'inactive' ? 'info' : 'error'}
              sx={{ position: 'absolute', right: 10, top: 10, fontSize: '0.675rem' }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  <Avatar alt="Avatar 1" size="xl" src={getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)} />
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
                      <Sms size={18} />
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
                        {data.attributes.email}
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
                        {data.attributes.phone_number.formattedPhoneNumber}
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
                        {data.attributes.country}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={8} xl={9} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
            <MainCard title="Personal Details" sx={{ flexGrow: 1 }}>
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Full Name</Typography>
                        <Typography>{data.attributes.name}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Country</Typography>
                        <Typography>{data.attributes.country}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Country Code</Typography>
                        <Typography>{data.attributes.country_code}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Address</Typography>
                    <Typography>{data.address}</Typography>
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

UserView.propTypes = { data: PropTypes.any };
