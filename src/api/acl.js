import useSWR from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from 'utils/axios';
import axios from 'axios';

// const initialState = {
//   modal: false
// };

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = window.localStorage.getItem('authToken');
export const endpoints = {
  key: baseUrl,
  admins: '/v1/admin/admins/',
  roles: '/v1/admin/acl/roles/',
  permissions: '/v1/admin/acl/permissions?all=true' // server URL
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

export function useGetAdmins() {
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.admins,
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

export async function useFetchRole(userId) {
  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  const { data, isLoading, error, isValidating } = useSWR(
    [
      endpoints.key + endpoints.roles + `/${userId}/include=permissions`,
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
      Role: data?.data,
      RoleLoading: isLoading,
      RoleError: error,
      RoleValidating: isValidating,
      RoleEmpty: !isLoading && !data?.Users?.length
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createRole(data) {
  axios({
    method: 'POST',
    url: endpoints.key + endpoints.roles,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: data
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function createAdmin(data) {
  axios({
    method: 'POST',
    url: endpoints.key + endpoints.admins,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: data
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteAdmin(adminId) {
  axios({
    method: 'DELETE',
    url: endpoints.key + endpoints.admins + adminId,
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

export async function updateAdmin(adminId, data) {
  axios({
    method: 'PUT',
    url: endpoints.key + endpoints.admins + adminId,
    data: data,
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

export async function deleteRole(roleId){
  axios({
    method: 'DELETE',
    url: endpoints.key + endpoints.roles + roleId,
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
