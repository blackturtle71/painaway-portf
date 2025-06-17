import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: null,
  token: null,
}

export const persistAuth = credentials => (dispatch) => {
  const { username, token } = credentials

  dispatch(setCredentials({ username, token }))

  localStorage.setItem('username', JSON.stringify(username))
  localStorage.setItem('token', JSON.stringify(token))
}

export const restoreAuth = () => (dispatch) => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  if (username && token) {
    dispatch(setCredentials({ username, token }))
  }

  return token
}

export const clearLocalStorage = () => (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  dispatch(logOut())
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { username = null, token } = action.payload
      state.username = username
      state.token = token
    },
    logOut: (state) => {
      state.username = null
      state.token = null
    },
  },
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer
