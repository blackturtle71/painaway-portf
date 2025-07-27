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
  tagTypes: ['Links'],
  endpoints: builder => ({
    // get all links (doctor - patient)
    getLinks: builder.query({
      query: () => apiRoutes.linksData(),
      providesTags: ['Links'],
    }),
    getPatientRecords: builder.query({
      query: patientId => apiRoutes.patientRecords(patientId),
    }),
    getDiagnosisData: builder.query({
      query: linkId => apiRoutes.diagnosisData(linkId),
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
    setDiagnosis: builder.mutation({
      query: ({ linkId, diagnosisText }) => ({
        url: apiRoutes.diagnosisData(linkId),
        method: 'POST',
        body: { link: linkId, diagnosis: diagnosisText },
      }),
      invalidatesTags: ['Links'],
    }),
    setPrescription: builder.mutation({
      query: ({ linkId, prescriptionText }) => ({
        url: apiRoutes.prescriptionData(linkId),
        method: 'POST',
        body: { link: linkId, prescription: prescriptionText },
      }),
      invalidatesTags: ['Links'],
    }),
    changeDiagnosis: builder.mutation({
      query: ({ diagnosisId, diagnosisText }) => ({
        url: apiRoutes.diagnosisById(diagnosisId),
        method: 'PATCH',
        body: { diagnosis: diagnosisText },
      }),
      invalidatesTags: ['Links'],
    }),
    changePrescription: builder.mutation({
      query: ({ prescriptionId, prescriptionText }) => ({
        url: apiRoutes.prescriptionById(prescriptionId),
        method: 'PATCH',
        body: { prescription: prescriptionText },
      }),
      invalidatesTags: ['Links'],
    }),
  }),
})

export const {
  useGetLinksQuery,
  useGetPatientRecordsQuery,
  useGetPrescriptionDataQuery,
  useGetDiagnosisDataQuery,
  useSelectDoctorMutation,
  useRespondToLinkRequestMutation,
  useSetDiagnosisMutation,
  useSetPrescriptionMutation,
  useChangeDiagnosisMutation,
  useChangePrescriptionMutation,
} = linksApi
