import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiPath } from '../routes'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiPath,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().auth
      console.log('prepareHeaders state:', getState())
      console.log('Preparing headers with token:', token)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: builder => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channels'],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),
  }),
})

const {
  useGetChannelsQuery,
  useGetMessagesQuery,
} = chatApi

export {
  useGetChannelsQuery as getChannelsQuery,
  useGetMessagesQuery as getMessagesQuery,
}
