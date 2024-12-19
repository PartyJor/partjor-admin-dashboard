import useSWR from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from 'utils/axios';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = window.localStorage.getItem('authToken');
export const endpoints = {
  key: baseUrl,
  update: '/v1/admin/events/',
  list: '/v1/admin/events?include=user,invitationsCount,stream',
  delete: '/v1/admin/events/'
};

export function useGetEventsList() {
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
      Events: data?.data,
      EventsLoading: isLoading,
      EventsError: error,
      EventsValidating: isValidating,
      EventsEmpty: !isLoading && !data?.Users?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function deleteEvent(EventId) {
  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  const data = EventId;
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

export async function fetchEventDetails(EventId) {
  try {
    const response = await fetch(endpoints.key + `/v1/admin/events/${EventId}?include=invitations,gifts`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}

export async function updateEvent(EventId, EditedEvent, Event) {
  const eventId = EventId;
  const otherEventData = {
    latitude: Event.latitude,
    longitude: Event.longitude
  };

  const data = { ...EditedEvent, ...otherEventData };

  await axios({
    method: 'put',
    data: data,
    url: endpoints.key + endpoints.update + `${eventId}`,
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

  console.log('Event to be updated', data);
}
