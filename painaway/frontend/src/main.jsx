import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './components/App.jsx'
import store, { persistor } from './services/index.js'
import resources from './locales/index.js'

const initApp = () => {
  const i18n = i18next.createInstance()
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    })

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  )
}

export default initApp
