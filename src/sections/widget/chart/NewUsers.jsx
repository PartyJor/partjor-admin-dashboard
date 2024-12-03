import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';

// assets
import { ArrowUp } from 'iconsax-react';

// ==============================|| CHART ||============================== //

function DataChart() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-users-chart',
      type: 'area',
      sparkline: { enabled: true },
      offsetX: -1
    },
    stroke: {
      width: 1
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0]
      }
    ],
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: {
        title: {
          formatter: () => ''
        }
      }
    }
  };
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.success.main],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series] = useState([
    {
      data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0]
    }
  ]);

  return <ReactApexChart options={options} series={series} type="area" height={80} />;
}

// ==============================|| CHART WIDGETS - NEW USERS ||============================== //

export default function NewUsers() {
  const [selectedValue, setSelectedValue] = useState('ever');
  const [totalUsers, setTotalUsers] = useState(0);
  const [dailyUsers, setDailyUsers] = useState(0);
  const [monthlyUsers, setMonthlyUsers] = useState(0);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(selectedValue);
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = window.localStorage.getItem('serviceToken');

  const getAllUsers = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/v1/admin/analytics`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response.data.data.attributes.total_users_ever);
        setTotalUsers(response.data.data.attributes.total_users_ever);
        setDailyUsers(response.data.data.attributes.total_users_today);
        setMonthlyUsers(response.data.data.attributes.total_users_this_month);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllUsers();
  });

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">Total Users</Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <Select id="demo-simple-select" value={selectedValue} onChange={handleChange}>
                  <MenuItem value={'ever'}>Ever</MenuItem>
                  <MenuItem value={'today'}>Today</MenuItem>
                  <MenuItem value={'monthly'}>This month</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <DataChart />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="subtitle1">
              {selectedValue === 'ever' ? totalUsers : selectedValue === 'today' ? dailyUsers : monthlyUsers} users
            </Typography>
            <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <ArrowUp size={14} style={{ transform: 'rotate(45deg)' }} />
              30.6%
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" style={{ borderColor: '#ff9a30', color: '#ff9a30' }}>
            View more
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
}
