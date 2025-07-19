import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modals: {
    isShown: false,
    type: '',
  },
  selectedBodyPart: {
    pk: null,
    name: '',
  },
  currentNote: null,
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
      state.selectedBodyPart.pk = null
      state.selectedBodyPart.name = ''
      state.setCurrentNote = null
    },
    setSelectedBodyPart: (state, { payload }) => {
      // or just state.selectedBodyPart = payload
      const { pk, name } = payload
      state.selectedBodyPart.pk = pk
      state.selectedBodyPart.name = name
    },
    setCurrentNote: (state, { payload }) => {
      state.currentNote = payload
    },
  },
})

export const {
  openModal,
  closeModal,
  setSelectedBodyPart,
  clearSelectedBodyPart,
  setCurrentNote,
} = modalsSlice.actions
export default modalsSlice.reducer
