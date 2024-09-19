import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormUserAdd from './FormUserAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetUser } from 'api/user';

// ==============================|| User ADD / EDIT ||============================== //

export default function UserModal({ open, modalToggler, User }) {
  const { UsersLoading: loading } = useGetUser();

  const closeModal = () => modalToggler(false);

  const UserForm = useMemo(
    () => !loading && <FormUserAdd User={User || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [User, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-User-add-label"
          aria-describedby="modal-User-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                UserForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

UserModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, User: PropTypes.any };
