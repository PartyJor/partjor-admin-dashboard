import useSWR from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from 'utils/axios';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = window.localStorage.getItem('serviceToken');
export const endpoints = {
  key: baseUrl,
  analytics: '/v1/admin/users'
};

export function useGetAnalytics() {
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

