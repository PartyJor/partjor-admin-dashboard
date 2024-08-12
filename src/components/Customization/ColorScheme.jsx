// material-ui
import { useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

import { TickSquare } from 'iconsax-react';

// ==============================|| CUSTOMIZATION - COLOR SCHEME ||============================== //

export default function ColorScheme() {
  const theme = useTheme();
  const { mode, presetColor, onChangePresetColor } = useConfig();

  const colorOptions = [
    {
      id: 'default',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme1',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme2',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme3',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme4',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme5',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme6',
      pprimary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme7',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    },
    {
      id: 'theme8',
      primary: mode === ThemeMode.DARK ? '#144438' : '#144438',
      darker: mode === ThemeMode.DARK ? '#ff9a30' : '#ff9a30'
    }
  ];

  const handlePresetColorChange = (event) => {
    onChangePresetColor(event.target.value);
  };

  return (
    <RadioGroup row aria-label="payment-card" name="payment-card" value={presetColor} onChange={handlePresetColorChange}>
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }} spacing={0.5}>
        {colorOptions.map((color, index) => (
          <FormControlLabel
            key={index}
            control={<Radio value={color.id} sx={{ display: 'none' }} />}
            sx={{ m: 0, width: presetColor === color.id ? '100%' : 'auto', display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: color.primary,
                  p: 1,
                  borderRadius: 0.5,
                  borderWidth: 4,
                  borderColor: presetColor === color.id ? color.darker : color.primary,
                  '&:hover': { borderColor: color.darker }
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: presetColor === color.id ? '100%' : 1, height: 44 }}
                >
                  {presetColor === color.id && (
                    <Stack direction="column" alignItems="center">
                      <TickSquare variant="Bulk" color={theme.palette.common.white} />
                      <Typography color="white" variant="caption">
                        {color.id}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </MainCard>
            }
          />
        ))}
      </Stack>
    </RadioGroup>
  );
}
