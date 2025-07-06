import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
}

export const persistAuth = credentials => (dispatch) => {
  const { token } = credentials

  dispatch(setCredentials({ token }))

  // localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', token)
}

export const restoreAuth = () => (dispatch) => {
  const token = localStorage.getItem('token')
  // const user = localStorage.getItem('user')
  console.log('Restoring auth:', token)
  if (token) {
    dispatch(setCredentials({ token }))
  }

  return token
}

export const clearLocalStorage = () => (dispatch) => {
  localStorage.removeItem('token')
  // localStorage.removeItem('user')
  dispatch(logOut())
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload
      // state.user = user
      state.token = token
    },
    logOut: (state) => {
      // state.user = null
      state.token = null
    },
  },
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer
