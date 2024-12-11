import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import { ThemeMode } from 'config';

import axios from 'axios';

// ==============================|| CHART ||============================== //

function ApexPieChart({ series }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const mode = theme.palette.mode;

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.secondary[200];
  const backColor = theme.palette.background.paper;

  const pieChartOptions = {
    chart: {
      type: 'pie'
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: true
    },
    labels: ['Android', 'Web', 'IOS'],
    legend: {
      show: false
    }
  };

  const [options, setOptions] = useState(pieChartOptions);

  useEffect(() => {
    const primaryMain = theme.palette.primary.main;
    const primaryLight = theme.palette.primary[200];
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary[400];
    const secondaryDark = theme.palette.secondary.dark;
    const secondaryDarker = theme.palette.secondary.darker;

    setOptions((prevState) => ({
      ...prevState,
      colors: [primaryMain, primaryLight, secondaryLight, secondary, secondaryDark, secondaryDarker],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false
      },
      grid: {
        borderColor: line
      },
      stroke: {
        colors: [backColor]
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, grey200, backColor, theme]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="pie" height={downSM ? 280 : 350} />
    </div>
  );
}

// ==============================|| CHART WIDGETS - PRODUCT OVERVIEW ||============================== //

export default function DevicesData() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [android, setAndroid] = useState(0);
  const [web, setWeb] = useState(0);
  const [ios, setIos] = useState(0);
  const [series, setSeries] = useState([0, 0, 0]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem('authToken');

  // Fetching the data from API
  useEffect(() => {
    const getDevicesData = () => {
      axios({
        method: 'get',
        url: `${baseUrl}/v1/admin/analytics`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          const androidData = response?.data?.data?.attributes?.signup_device_data?.ANDROID || 0;
          const webData = response?.data?.data?.attributes?.signup_device_data?.WEB || 0;
          const iosData = response?.data?.data?.attributes?.signup_device_data?.IOS || 0;

          setAndroid(androidData);
          setWeb(webData);
          setIos(iosData);

          // Update series state here
          setSeries([androidData, webData, iosData]);

          // Set data as loaded
          setIsDataLoaded(true);
        })
        .catch((error) => {
          console.log(error);
          setIsDataLoaded(true); // Mark as loaded even if there's an error to avoid infinite loading
        });
    };

    getDevicesData();
  }, [baseUrl, token]);

  // Ensure the chart is only rendered when data is available
  if (!isDataLoaded) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">Devices Data</Typography>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ApexPieChart series={series} />
        </Grid>
        <Grid item xs={6} md={4}>
          <MainCard content={false}>
            <Stack alignItems="center" sx={{ py: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                <Typography>Android</Typography>
              </Stack>
              <Typography variant="subtitle1">{android}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={6} md={4}>
          <MainCard content={false}>
            <Stack alignItems="center" sx={{ py: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                <Typography>Web</Typography>
              </Stack>
              <Typography variant="subtitle1">{web}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={6} md={4}>
          <MainCard content={false}>
            <Stack alignItems="center" sx={{ py: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                <Typography>IOS</Typography>
              </Stack>
              <Typography variant="subtitle1">{ios}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        {/* <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Button variant="outlined" fullWidth color="secondary">
              View all
            </Button>
          </Stack>
        </Grid> */}
      </Grid>
    </MainCard>
  );
}
