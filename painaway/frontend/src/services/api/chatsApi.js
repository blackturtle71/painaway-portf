import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes'

export const chatsApi = createApi({
  reducerPath: 'chatsApi',
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
  tagTypes: ['Chats', 'Messages'],
  endpoints: builder => ({
    getChats: builder.query({
      query: () => apiRoutes.chats(),
      providesTags: ['Chats'],
    }),
    addChat: builder.mutation({
      query: peerId => ({
        url: apiRoutes.chats(),
        method: 'POST',
        body: { peer_id: peerId },
      }),
      invalidatesTags: ['Chats'],
    }),
    deleteChat: builder.mutation({
      query: peerId => ({
        url: apiRoutes.deleteChatWith(peerId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Chats', 'Messages'],
    }),
  }),
})

export const {
  useGetChatsQuery,
  useAddChatMutation,
  useDeleteChatMutation,
} = chatsApi
