import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  linkId: null,
  doctor: '',
  treatment: '',
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLinkId: (state, { payload }) => {
      state.linkId = payload
    },
    setDoctor: (state, { payload }) => {
      state.doctor = payload
    },
    setTreatment: (state, { payload }) => {
      state.treatment = payload
    },
  },
})

export const { setLinkId, setDoctor, setTreatment } = profileSlice.actions
export default profileSlice.reducer
