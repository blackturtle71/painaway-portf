import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import routes, { apiBase } from '../../routes.js'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase }),
  endpoints: builder => ({
    checkUsername: builder.query({
      query: username => ({
        url: routes.checkUsername(),
        params: { username },
      }),
    }),
    signupUser: builder.mutation({
      query: userData => ({
        url: routes.registerPath(),
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: userData => ({
        url: routes.loginPath(),
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
