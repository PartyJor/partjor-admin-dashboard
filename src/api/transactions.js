import useSWR, { mutate } from 'swr';
import { useMemo, useState, useEffect } from 'react';

// utils
import { fetcher } from 'utils/axios';
import axios from 'axios';

const initialState = {
  modal: false
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = window.localStorage.getItem('serviceToken');
export const endpoints = {
  key: baseUrl,
  list: '/v1/admin/payment/wallet/transactions?include=user', // server URL
  user: '/v1/admin/users', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: `/v1/admin/users/`, // server URL
  suspend: '/v1/admin/users/'
};

export function useGetTransactionsList() {
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

  const [userDictionary, setUserDictionary] = useState({});

  useEffect(() => {
    if (data?.data) {
      const uniqueUserIds = [...new Set(data.data.map((transaction) => transaction.relationships?.user?.data?.id))].filter(Boolean);

      // Fetch user data for each unique user ID
      Promise.all(
        uniqueUserIds.map((userId) =>
          fetch(endpoints.key + `${endpoints.user}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((res) => res.json())
        )
      )
        .then((userResponses) => {
          const users = userResponses.reduce((acc, user) => {
            acc[user.data.id] = user.data.attributes.name; // Map user ID to user name
            return acc;
          }, {});
          setUserDictionary(users);
        })
        .catch((err) => console.error('Failed to fetch user data:', err));
    }
  }, [data]);

  const memoizedValue = useMemo(
    () => ({
      Transactions: data?.data,
      TransactionsLoading: isLoading,
      TransactionsError: error,
      TransactionsValidating: isValidating,
      TransactionsEmpty: !isLoading && !data?.data?.length,
      Users: userDictionary
    }),
    [data, error, isLoading, isValidating, userDictionary]
  );

  console.log('data:', data);
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('isValidating:', isValidating);
  console.log('users', userDictionary);

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
