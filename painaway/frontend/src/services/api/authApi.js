import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['Profile'],
  endpoints: builder => ({
    signupUser: builder.mutation({
      query: userData => ({
        url: apiRoutes.register(),
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: userData => ({
        url: apiRoutes.login(),
        method: 'POST',
        body: userData,
      }),
    }),
    getProfileData: builder.query({
      query: () => apiRoutes.profileData(),
      providesTags: ['Profile'],
    }),
  }),
})

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useGetProfileDataQuery,
} = authApi
