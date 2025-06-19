import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase }),
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
  }),
})

export const {
  useCheckUsernameQuery,
  useSignupUserMutation,
  useLoginUserMutation,
} = authApi
