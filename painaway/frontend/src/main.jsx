import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Provider } from 'react-redux'

import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './components/App.jsx'
import store from './services/index.js'
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
        <App />
      </Provider>
    </React.StrictMode>
  )
}

export default initApp
