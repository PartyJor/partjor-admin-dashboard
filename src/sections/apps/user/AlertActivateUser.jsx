import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { activateUser } from 'api/user';
import { openSnackbar } from 'api/snackbar';

// assets
import { UserTick } from 'iconsax-react';

// ==============================|| User - DELETE ||============================== //

export default function AlertActivateUser({ id, title, open, handleClose }) {
  const activateHandler = async () => {
    await activateUser(id).then(() => {
      openSnackbar({
        open: true,
        message: 'User activated successfully',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="success" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <UserTick variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to activate user?
            </Typography>
            <Typography align="center">
              By activating
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              this account will be reinstated.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="success" variant="contained" onClick={activateHandler} autoFocus>
              Activate
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertActivateUser.propTypes = { id: PropTypes.string, title: PropTypes.string, open: PropTypes.bool, handleClose: PropTypes.func };
