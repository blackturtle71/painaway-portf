import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const notesApi = createApi({
  reducerPath: 'notesApi',
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
  tagTypes: ['Notes'],
  endpoints: builder => ({
    getBodyPartObject: builder.query({
      query: () => apiRoutes.bodyPartObjects(),
    }),
    getBodyStats: builder.query({
      query: () => apiRoutes.bodyStats(),
      providesTags: ['Notes'],
    }),
    sendBodyStats: builder.mutation({
      query: ({ bodyPartPk, painType, intensity, medicine, description }) => ({
        url: apiRoutes.bodyStats(),
        method: 'POST',
        body: {
          body_part: bodyPartPk,
          pain_type: painType,
          intensity,
          tookPrescription: medicine,
          description,
        },
      }),
      invalidatesTags: ['Notes'],
    }),
    updateBodyStats: builder.mutation({
      query: data => ({
        url: apiRoutes.bodyStats(),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Notes'],
    }),
  }),
})

export const {
  useGetBodyPartObjectQuery,
  useGetBodyStatsQuery,
  useSendBodyStatsMutation,
  useUpdateBodyStatsMutation,
} = notesApi
