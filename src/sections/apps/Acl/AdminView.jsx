import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// ==============================|| User - VIEW ||============================== //

export default function AdminView({ data }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    console.log('data', data);
  });

  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={7} md={8} lg={8} xl={9} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
            <MainCard title="Role Details" sx={{ flexGrow: 1 }}>
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Role</Typography>
                        <Typography>{data?.attributes?.roles[0]?.name || ''}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Permissions</Typography>
                        {data?.attributes?.roles[0]?.name === 'super_admin' ? <Typography>All</Typography> : <List></List>}
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                {/* <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Address</Typography>
                    <Typography>{data.address}</Typography>
                  </Stack>
                </ListItem> */}
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}

AdminView.propTypes = { data: PropTypes.any };
