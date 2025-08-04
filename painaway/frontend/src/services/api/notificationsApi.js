import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBase,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().authReducer

      if (token) {
        headers.set('Authorization', `Token ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['Notifications'],
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => apiRoutes.notifications(),
      providesTags: ['Notifications'],
    }),
    markNotificationRead: builder.mutation({
      query: id => ({
        url: apiRoutes.notifications(),
        method: 'PATCH',
        body: { notification_id: id },
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation({
      query: id => ({
        url: apiRoutes.notifications(),
        method: 'DELETE',
        body: { notification_id: id },
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi
