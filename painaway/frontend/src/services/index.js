import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from 'redux'

import authReducer from '../slices/authSlice.js'
import chatsReducer from '../slices/chatsSlice.js'
import profileReducer from '../slices/profileSlice.js'
import notesReducer from '../slices/notesSlice.js'
import bodyPartsReducer from '../slices/bodyPartsSlice.js'
import modalsReducer from '../slices/modalsSlice.js'
import {
  authApi,
  chatsApi,
  messagesApi,
  linksApi,
  notesApi,
} from './api/index.js'

const authPersistConfig = {
  key: 'authReducer', // ключ под, которым данные сохраняются в localStorage
  storage, // куда сохраняем => получается authReducer: {"token":"ваш_токен"}
  whitelist: ['token', 'user'], // что сохраняем
}

const notePersistConfig = {
  key: 'notesReducer',
  storage,
  whitelist: ['notes', 'noteText'],
}

const rootReducer = combineReducers({
  // оборачиваем authReduce, чтобы при каждом setCredentials данные сохранялись в localStorage
  // и при старте redux-persist восстанавливал токен из localStorage в redux-стейт
  authReducer: persistReducer(authPersistConfig, authReducer),
  chatsReducer,
  profileReducer,
  notesReducer: persistReducer(notePersistConfig, notesReducer),
  bodyPartsReducer,
  modalsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [chatsApi.reducerPath]: chatsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [linksApi.reducerPath]: linksApi.reducer,
  [notesApi.reducerPath]: notesApi.reducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false, // чтобы не было ошибок persist
  }).concat(
    authApi.middleware,
    chatsApi.middleware,
    messagesApi.middleware,
    linksApi.middleware,
    notesApi.middleware,
  ),
})

// инициализирует redux-persist, запускает восстановление из localStorage
// и отслеживает изменения в store, сохраняя их обратно в localStorage
export const persistor = persistStore(store)
export default store
