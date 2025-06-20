import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice.js'
import chatsReducer from '../slices/chatsSlice.js'
import { authApi, chatsApi, messagesApi } from './api/index.js'

const store = configureStore({
  reducer: {
    authReducer,
    chatsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    authApi.middleware,
    chatsApi.middleware,
    messagesApi.middleware,
  ),
})

export default store
