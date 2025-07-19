import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  loaded: false,
}

// list: [
//   { pk: Number, name: string, translation: string },
// ]

export const bodyPartsSlice = createSlice({
  name: 'bodyParts',
  initialState,
  reducers: {
    setBodyParts: (state, { payload }) => {
      state.list = payload
      state.loaded = true
    },
  },
})

export const { setBodyParts } = bodyPartsSlice.actions
export default bodyPartsSlice.reducer
