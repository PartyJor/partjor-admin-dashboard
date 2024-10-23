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
  roles: '/v1/admin/acl/roles',
  permissions: '/v1/admin/acl/permissions?sort=-created_at&all=true' // server URL
};

export function useGetRoles() {
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.roles,
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

export function useGetPermissions() {
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.permissions,
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
