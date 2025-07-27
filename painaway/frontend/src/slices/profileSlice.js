import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  linkId: null,
  doctor: '',
  prescription: '',
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
    setPrescription: (state, { payload }) => {
      state.prescription = payload
    },
  },
})

export const { setLinkId, setDoctor, setPrescription } = profileSlice.actions
export default profileSlice.reducer
