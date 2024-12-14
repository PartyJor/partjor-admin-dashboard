import { useState } from 'react';
// material-ui
// import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
// import UsersDataCard from 'components/cards/statistics/UsersDataCard';
// import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import UserOverview from 'sections/widget/chart/UserOverview';
import DevicesData from 'sections/widget/chart/DevicesData';

// import RepeatUserRate from 'sections/widget/chart/RepeatUserRate';
// import ProjectOverview from 'sections/widget/chart/ProjectOverview';
// import ProjectRelease from 'sections/dashboard/default/ProjectRelease';
// import AssignUsers from 'sections/widget/statistics/AssignUsers';

// import Transactions from 'sections/widget/data/Transactions';
// import TotalIncome from 'sections/widget/chart/TotalIncome';

// assets
// import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';

import axios from 'axios';
import { useEffect } from 'react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  // const theme = useTheme();

  // const [selectedValue, setSelectedValue] = useState('All');
  const [analytics, setAnalytics] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token =window.localStorage.getItem('authToken');  // const handleMenuSelection = (value) => {
  //   setSelectedValue(value);
  // };

  useEffect(() => {
    axios
      .get(`${baseUrl}/v1/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setAnalytics(response.data.data.attributes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, token]);

  useEffect(() => {
    console.log('analytics', token);
  });

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h2">User Analytics</Typography>
      </Grid>

      <Grid item xs={12}>
        <UserOverview />
      </Grid>

      {/* row 1 */}
      {/* <Grid item xs={12} sm={6} lg={3}>
        <UsersDataCard
          title="All Users"
          onSelectValue={handleMenuSelection}
          count={
            selectedValue === 'all'
              ? analytics?.total_users_ever
              : selectedValue === 'today'
                ? analytics?.total_users_today
                : selectedValue === 'weekly'
                  ? 0
                  : selectedValue === 'monthly'
                    ? analytics?.total_users_this_month
                    : analytics?.total_users_ever
          }
          iconPrimary={<Wallet3 />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        ></UsersDataCard>
      </Grid> */}
      {/* <Grid item xs={12} sm={6} lg={3}>
        <UsersDataCard
          title="Page Views"
          count={100}
          color="warning"
          iconPrimary={<Book color={theme.palette.warning.dark} />}
          percentage={
            <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </UsersDataCard>
      </Grid> */}
      {/* <Grid item xs={12} sm={6} lg={3}>
        <UsersDataCard
          title="Total task"
          count={1568}
          color="success"
          iconPrimary={<Calendar color={theme.palette.success.darker} />}
          percentage={
            <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </UsersDataCard>
      </Grid> */}
      {/* <Grid item xs={12} sm={6} lg={3}>
        <UsersDataCard
          title="Download"
          count={200}
          color="error"
          iconPrimary={<CloudChange color={theme.palette.error.dark} />}
          percentage={
            <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </UsersDataCard>
      </Grid> */}

      {/* row 2 */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DevicesData />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
      </Grid>
      {/* <Grid item xs={12} md={4} lg={3}>
        <Stack spacing={3}>
          <ProjectRelease />
          <AssignUsers />
        </Stack>
      </Grid> */}

      {/* row 3 */}
      {/* <Grid item xs={12} md={6}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={6}>
        <TotalIncome />
      </Grid> */}
    </Grid>
  );
}
