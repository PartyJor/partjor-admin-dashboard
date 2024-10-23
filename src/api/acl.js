import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from 'utils/axios';
// import axios from 'axios';

// const initialState = {
//   modal: false
// };

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = window.localStorage.getItem('serviceToken');
export const endpoints = {
  key: baseUrl,
  url: '/v1/admin/acl/roles' // server URL
};

export function useGetRoles() {
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.url,
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
