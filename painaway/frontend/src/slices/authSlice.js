import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,
}

export const persistAuth = credentials => (dispatch) => {
  const { token, user } = credentials

  dispatch(setCredentials({ token, user }))
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
      const { token, user } = action.payload
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
