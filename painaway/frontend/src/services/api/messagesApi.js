import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes'

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
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
  tagTypes: ['Messages'],
  endpoints: builder => ({
    getMessages: builder.query({
      query: peerId => apiRoutes.chatWith(peerId),
      providesTags: ['Chats'],
    }),
    deleteMessages: builder.mutation({
      query: peerId => ({
        url: apiRoutes.deleteMessagesWith(peerId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Chats'],
    }),
  }),
})

export const {
  useGetMessagesQuery,
  useDeleteMessagesMutation,
} = messagesApi
