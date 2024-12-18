import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import UserModal from './UserModal';
import UserPreview from './UserPreview';
import AlertUserDelete from './AlertUserDelete';
import ListSmallCard from './export-pdf/ListSmallCard';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';

// assets
import { CallCalling, Link2, Location, Sms } from 'iconsax-react';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// ==============================|| User - CARD ||============================== //

export default function UserCard({ User }) {
  const [open, setOpen] = useState(false);
  const [UserModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const editUser = () => {
    setSelectedUser(User);
    setUserModal(true);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    color="secondary"
                    onClick={handleMenuClick}
                    sx={{ transform: 'rotate(90deg)' }}
                  >
                    <MoreIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={User.name} src={getImageUrl(`avatar-${!User.avatar ? 1 : User.avatar}.png`, ImagePath.USERS)} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{User.name}</Typography>}
                  secondary={<Typography color="text.secondary">{User.role}</Typography>}
                />
              </ListItem>
            </List>
            <Menu
              id="fade-menu"
              MenuListProps={{ 'aria-labelledby': 'fade-button' }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}>
                <PDFDownloadLink document={<ListSmallCard User={User} />} fileName={`User-${User.name}.pdf`}>
                  Export PDF
                </PDFDownloadLink>
              </MenuItem>
              <MenuItem onClick={editUser}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>Hello, {User.about}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={6}>
                <List
                  sx={{
                    p: 0,
                    overflow: 'hidden',
                    '& .MuiListItem-root': { px: 0, py: 0.5 },
                    '& .MuiListItemIcon-root': { minWidth: 28 }
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Sms size={18} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="text.secondary">{User.email}</Typography>} />
                  </ListItem>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <CallCalling size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="text.secondary">
                          <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={User.contact} />
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List
                  sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 }, '& .MuiListItemIcon-root': { minWidth: 28 } }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="text.secondary">{User.country}</Typography>} />
                  </ListItem>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Link2 size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href="https://google.com" target="_blank" sx={{ textTransform: 'lowercase' }}>
                          https://{User.firstName}.en
                        </Link>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0 }} component="ul">
                {User.skills.map((skill, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="text.secondary">
            Updated in {User.time}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleClickOpen}>
            Preview
          </Button>
        </Stack>
      </MainCard>

      <UserPreview User={User} open={open} onClose={handleClose} editUser={editUser} />
      <AlertUserDelete id={User.id} title={User.name} open={openAlert} handleClose={handleAlertClose} />
      <UserModal open={UserModal} modalToggler={setUserModal} User={selectedUser} />
    </>
  );
}

UserCard.propTypes = { User: PropTypes.any };
