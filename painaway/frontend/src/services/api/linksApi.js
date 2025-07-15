import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBase, apiRoutes } from '../../routes.js'

export const linksApi = createApi({
  reducerPath: 'linksApi',
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
  endpoints: builder => ({
    // get all links (doctor - patient)
    getLinks: builder.query({
      query: () => apiRoutes.linksData(),
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
    respondToLinkRequest: builder.mutation({
      query: ({ patientId, action }) => ({
        url: apiRoutes.respondToLinkRequest(),
        method: 'POST',
        body: { patient_id: patientId, action },
      }),
    }),
  }),
})

export const {
  useGetLinksQuery,
  useGetPrescriptionDataQuery,
  useSelectDoctorMutation,
  useRespondToLinkRequestMutation,
} = linksApi
