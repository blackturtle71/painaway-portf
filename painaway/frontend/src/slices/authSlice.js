import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,
}

export const persistAuth = credentials => (dispatch) => {
  const { user, token } = credentials

  dispatch(setCredentials({ user, token }))

  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', JSON.stringify(token))
}

export const restoreAuth = () => (dispatch) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (user && token) {
    dispatch(setCredentials({ user, token }))
  }

  return token
}

export const clearLocalStorage = () => (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  dispatch(logOut())
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user = null, token } = action.payload
      state.user = user
      state.token = token
    },
    logOut: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer
