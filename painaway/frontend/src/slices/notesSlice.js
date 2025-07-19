import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notes: [],
  noteText: '',
}
// use TS with types?....
// export const NoteDefault = {
//   bodyPartPk: null,
//   bodyPartName: '',
//   intensity: 0,
//   type: '',
//   medicine: false,
// }

export const notesSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    addOrUpdateNote: (state, { payload }) => {
      const existing = state.notes.find(n => n.bodyPartPk === payload.bodyPartPk)
      const noteData = {
        ...payload,
        medicine: payload.medicine !== undefined ? payload.medicine : false,
      }
      if (existing) {
        Object.assign(existing, noteData) // update existind note
      }
      else {
        state.notes.push(noteData) // add new note
      }
    },
    setNoteText: (state, { payload }) => {
      state.noteText = payload
    },
    clearNotes: (state) => {
      state.notes = []
      state.noteText = ''
    },
  },
})

export const {
  addOrUpdateNote,
  setNoteText,
  clearNotes,
} = notesSlice.actions
export default notesSlice.reducer
