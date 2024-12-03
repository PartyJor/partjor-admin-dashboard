import { useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// project-imports
import FormUserAdd from './FormUserAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { handlerUserDialog, useGetUser, useGetUserMaster } from 'api/user';

// ==============================|| User - ADD / EDIT ||============================== //

export default function AddUser() {
  const { UserMasterLoading, UserMaster } = useGetUserMaster();
  const { UsersLoading: loading, Users } = useGetUser();
  const isModal = UserMaster?.modal;

  const [list, setList] = useState(null);

  useEffect(() => {
    if (UserMaster?.modal && typeof UserMaster.modal === 'number') {
      const newList = Users.filter((info) => info.id === isModal && info)[0];
      setList(newList);
    } else {
      setList(null);
    }
    // eslint-disable-next-line
  }, [UserMaster]);

  const closeModal = () => handlerUserDialog(false);

  // eslint-disable-next-line
  const UserForm = useMemo(
    () => !loading && !UserMasterLoading && <FormUserAdd User={list} closeModal={closeModal} />,
    [list, loading, UserMasterLoading]
  );

  return (
    <>
      {isModal && (
        <Modal
          open={true}
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
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
              }}
            >
              {loading && UserMasterLoading ? (
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
