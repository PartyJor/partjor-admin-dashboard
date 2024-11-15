import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Select from '@mui/material/Select';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';

import axios from 'axios';
// assets
import { ArrowDown, ArrowSwapHorizontal, ArrowUp, Chart, HomeTrendUp, ShoppingCart } from 'iconsax-react';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| CHART ||============================== //

function EcommerceDataChart({ data }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    fill: {
      opacity: [1, 0.5]
    },
    grid: {
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => '$ ' + val + ' thousands'
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary.main],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        },
        axisBorder: {
          show: false,
          color: line
        },
        axisTicks: {
          show: false
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      legend: {
        labels: {
          colors: 'secondary.main'
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series, setSeries] = useState(data);

  useEffect(() => {
    setSeries(data);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
}

// ==============================|| CHART WIDGET - PROJECT ANALYTICS ||============================== //

export default function ProjectAnalytics() {
  const [value, setValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState('ever');
  const [analytics, setAnalytics] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = window.localStorage.getItem('serviceToken');

  useEffect(() => {
    const getAllAnalytics = () => {
      axios({
        method: 'get',
        url: `${baseUrl}/v1/admin/analytics`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          console.log(response);
          setAnalytics(response.data.data.attributes);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getAllAnalytics();
  }, [token, baseUrl]);

  const chartData = [
    [
      {
        name: 'Users',
        data: [76, 85, 101, 98, 87, 105, 91]
      },
      {
        name: 'Events',
        data: [44, 55, 57, 56, 61, 58, 63]
      }
    ],
    [
      {
        name: 'Users',
        data: [80, 101, 90, 65, 120, 105, 85]
      },
      {
        name: 'Events',
        data: [45, 30, 57, 45, 78, 48, 63]
      }
    ],
    [
      {
        name: 'Users',
        data: [79, 85, 107, 95, 83, 115, 97]
      },
      {
        name: 'Events',
        data: [48, 56, 50, 54, 68, 53, 65]
      }
    ],
    [
      {
        name: 'Net Profit',
        data: [90, 111, 105, 55, 70, 65, 75]
      },
      {
        name: 'Revenue',
        data: [55, 80, 57, 45, 38, 48, 43]
      }
    ]
  ];

  const [data, setData] = useState(chartData[0]);

  const handleChangeSelect = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setData(chartData[newValue]);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3, pt: 1, '& .MuiTab-root': { mb: 0.5 } }}>
            <Tab label="Overview" {...a11yProps(0)} />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <Select id="demo-simple-select" value={selectedValue} onChange={handleChangeSelect}>
                        <MenuItem value={'ever'}>Ever</MenuItem>
                        <MenuItem value={'today'}>Today</MenuItem>
                        <MenuItem value={'monthly'}>Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
                <EcommerceDataChart data={data} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">-245</Typography>
                      <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowDown style={{ transform: 'rotate(45deg)' }} size={14} /> 10.6%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <Chart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Total Users</Typography>}
                    secondary={
                      <Typography variant="subtitle1">
                        {selectedValue === 'ever'
                          ? analytics?.total_users_ever
                          : selectedValue === 'today'
                            ? analytics?.total_users_today
                            : analytics?.total_users_this_month}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">+2,100</Typography>
                      <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 30.6%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <HomeTrendUp />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Events</Typography>}
                    secondary={
                      <Typography variant="subtitle1">
                        {selectedValue === 'ever'
                          ? analytics?.total_events_ever
                          : selectedValue === 'today'
                            ? analytics?.total_events_today
                            : analytics?.total_events_this_month}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">-26</Typography>
                      <Typography color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowSwapHorizontal size={14} /> 5%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <ShoppingCart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Total Deposits</Typography>}
                    secondary={
                      <Typography variant="subtitle1">
                        {selectedValue === 'ever'
                          ? `₦ ${analytics?.total_deposits_ever}`
                          : selectedValue === 'today'
                            ? `₦ ${analytics?.total_deposits_today}`
                            : `₦ ${analytics?.total_deposits_this_month}`}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainCard>
  );
}

EcommerceDataChart.propTypes = { data: PropTypes.array };
