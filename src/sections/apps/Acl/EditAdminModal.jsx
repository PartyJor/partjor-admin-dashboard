import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormEditAdmin from './FormEditAdmin';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetUser } from 'api/user';

// ==============================|| User ADD / EDIT ||============================== //

export default function EditAdminModal({ open, modalToggler, adminId, admin }) {
  const { UsersLoading: loading } = useGetUser();

  const closeModal = useCallback(() => modalToggler(false), [modalToggler]);

  const UserForm = useMemo(
    () => !loading && <FormEditAdmin adminId={adminId} adminData={admin || null} closeModal={closeModal} />,
    [loading, closeModal, admin, adminId]
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

EditAdminModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, admin: PropTypes.object, adminId: PropTypes.string };
