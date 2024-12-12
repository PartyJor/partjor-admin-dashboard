import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from 'utils/axios';
import axios from 'axios';

const initialState = {
  modal: false
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = sessionStorage.getItem('authToken');
export const endpoints = {
  key: baseUrl,
  list: '/v1/admin/users', // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: `/v1/admin/users/`, // server URL
  suspend: '/v1/admin/users/'
};

export function useGetUser() {
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.list,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      Users: data?.data,
      UsersLoading: isLoading,
      UsersError: error,
      UsersValidating: isValidating,
      UsersEmpty: !isLoading && !data?.Users?.length
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function insertUser(newUser) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentUser) => {
      newUser.id = currentUser.Users.length + 1;
      const addedUser = [...currentUser.Users, newUser];

      return {
        ...currentUser,
        Users: addedUser
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { newUser };
  //   await axios.post(endpoints.key + endpoints.insert, data);
}

export async function updateUser(UserId, updatedUser) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentUser) => {
      const newUser = currentUser.Users.map((User) => (User.id === UserId ? { ...User, ...updatedUser } : User));

      return {
        ...currentUser,
        Users: newUser
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { list: updatedUser };
  //   await axios.post(endpoints.key + endpoints.update, data);
}

export async function suspendUser(UserId) {
  const data = UserId;
  await axios
    .patch(
      endpoints.key + endpoints.suspend + `${data}/suspend`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function activateUser(UserId) {
  await axios
    .patch(
      endpoints.key + endpoints.suspend + `${UserId}/activate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteUser(UserId) {
  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  const data = UserId;
  await axios
    .delete(endpoints.key + endpoints.delete + `${data}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function useGetUserMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.modal, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      UserMaster: data,
      UserMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerUserDialog(modal) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.modal,
    (currentUsermaster) => {
      return { ...currentUsermaster, modal };
    },
    false
  );
}
