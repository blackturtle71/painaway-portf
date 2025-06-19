import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeChatId: null,
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChatId = payload
    },
  },
})

export const {
  setActiveChat,
} = chatsSlice.actions

export default chatsSlice.reducer
