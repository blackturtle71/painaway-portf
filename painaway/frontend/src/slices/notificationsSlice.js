import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, { payload }) => {
      state.list = payload
    },
    addNotification: (state, { payload }) => {
      state.list.unshift(payload)
    },
  },
})

export const { setNotifications, addNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
