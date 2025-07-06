import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const profileApi = createApi({
  reducerPath: 'profileApi',
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
    getProfileData: builder.query({
      query: () => apiRoutes.profileData(),
      providesTags: ['Profile'],
    }),
    getDoctor: builder.query({
      query: () => apiRoutes.doctorData(),
    }),
    getPrescriptionData: builder.query({
      query: linkId => apiRoutes.prescriptionData(linkId),
    }),
    selectDoctor: builder.mutation({
      query: docLogin => ({
        url: apiRoutes.selectDoctor(),
        method: 'POST',
        body: { doc_username: docLogin },
      }),
    }),
  }),
})

export const {
  useGetProfileDataQuery,
  useGetDoctorQuery,
  useGetPrescriptionDataQuery,
  useSelectDoctorMutation,
} = profileApi
