import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modals: {
    isShown: false,
    type: '',
  },
}

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      const { type } = payload
      state.modals.isShown = true
      state.modals.type = type
    },
    closeModal: (state) => {
      state.modals.isShown = false
      state.modals.type = ''
    },
  },
})

export const { openModal, closeModal } = modalsSlice.actions
export default modalsSlice.reducer
