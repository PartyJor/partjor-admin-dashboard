import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import axios from 'axios';

// project-imports
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { useEffect, useState } from 'react';

// ==============================|| User - VIEW ||============================== //

export default function RoleView({ id }) {
  const [role, setRole] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token =window.localStorage.getItem('authToken');  const fetchRole = async () => {
    await axios({
      method: 'get',
      url: `${baseUrl}/v1/admin/acl/roles/${id}?include=permissions`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setRole(response.data.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

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
                        <Typography>{role?.attributes?.name || ''}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Permissions</Typography>
                        {role?.attributes?.name === 'super_admin' ? (
                          <Typography>All</Typography>
                        ) : (
                          <List>
                            {role?.relationships?.permissions?.data.map((index, permissions) => (
                              <ListItem key={index}>
                                <Typography>{permissions}</Typography>
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}

RoleView.propTypes = { id: PropTypes.any };
