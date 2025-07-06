import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from 'redux'

import authReducer from '../slices/authSlice.js'
import chatsReducer from '../slices/chatsSlice.js'
import profileReducer from '../slices/profileSlice.js'
import {
  authApi,
  chatsApi,
  messagesApi,
  profileApi,
} from './api/index.js'

const authPersistConfig = {
  key: 'authReducer', // ключ под, которым данные сохраняются в localStorage
  storage, // куда сохраняем => получается authReducer: {"token":"ваш_токен"}
}

const rootReducer = combineReducers({
  // оборачиваем authReduce, чтобы при каждом setCredentials данные сохранялись в localStorage
  // и при старте redux-persist восстанавливал токен из localStorage в redux-стейт
  authReducer: persistReducer(authPersistConfig, authReducer),
  chatsReducer,
  profileReducer,
  [authApi.reducerPath]: authApi.reducer,
  [chatsApi.reducerPath]: chatsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false, // чтобы не было ошибок persist
  }).concat(
    authApi.middleware,
    chatsApi.middleware,
    messagesApi.middleware,
    profileApi.middleware,
  ),
})

// инициализирует redux-persist, запускает восстановление из localStorage
// и отслеживает изменения в store, сохраняя их обратно в localStorage
export const persistor = persistStore(store)
export default store
