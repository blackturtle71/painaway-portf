console.log('Script started executing')

import * as yup from 'yup'
import keyBy from 'lodash/keyBy'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty.js'
import axios from 'axios'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const routes = {
  userPath: () => '/register/',
}

const schema = yup.object().shape({
  login: yup
    .string()
    .trim()
    .required()
    .matches(
      /^\w{2,16}$/,
      'Логин должен содержать от 2 до 16 символов, только буквы, цифры и нижнее подчеркивание',
    ),
  email: yup
    .string()
  //  .required()
    .email(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=]).{8,}$/,
      'Пароль должен содержать минимум 8 символов, включая одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
    ),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf(
      [yup.ref('password'), null],
      'Пароли должны совпадать',
    ),
})

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
}

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false })
    return {}
  }
  catch (e) {
    return keyBy(e.inner, 'path')
  }
}

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'filling':
    case 'error':
      elements.submitButton.disabled = false
      break

    case 'sending':
      elements.submitButton.disabled = true
      break

    case 'sent':
      elements.container.innerHTML = `
        <div class="alert alert-success" role="alert">
          Регистрация прошла успешно!
        </div>
      `
      break

    default:
      throw new Error(`Unknown process state: ${processState}`)
  }
}

const renderError = (fieldElement, error) => {
  const feedbackElement = fieldElement.nextElementSibling

  if (feedbackElement) {
    feedbackElement.textContent = error.message
    return
  }

  fieldElement.classList.add('is-invalid')
  const newFeedbackElement = document.createElement('div')
  newFeedbackElement.classList.add('invalid-feedback')
  newFeedbackElement.textContent = error.message
  fieldElement.after(newFeedbackElement)
}

const renderErrors = (elements, state) => {
  const { errors, fieldsUi } = state.form
  if (!fieldsUi || !fieldsUi.touched) return

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName]
    const fieldHasError = has(errors, fieldName)

    if (!fieldHasError) {
      fieldElement.classList.remove('is-invalid')
      fieldElement.nextElementSibling?.remove()
      return
    }

    if (fieldsUi.touched[fieldName] && fieldHasError) {
      renderError(fieldElement, error)
    }
  })
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
}

const app = () => {
  console.log('app() is running')
  const elements = {
    container: document.querySelector('.container'),
    form: document.querySelector('[data-form="sign-up"]'),
    fields: {
      login: document.getElementById('sign-up-login'),
      email: document.getElementById('sign-up-email'),
      password: document.getElementById('sign-up-password'),
      passwordConfirmation: document.getElementById('sign-up-password-confirmation'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
  }

  const initialState = proxy({
    signupProcess: {
      processState: 'filling',
      processError: null,
    },
    form: {
      valid: true,
      errors: {},
      fields: {
        login: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      fieldsUi: {
        touched: {
          login: false,
          email: false,
          password: false,
          passwordConfirmation: false,
        },
      },
    },
  })

  subscribe(initialState.signupProcess, () => {
    const currentState = snapshot(initialState)
    handleProcessState(elements, currentState.signupProcess.processState)
  })

  subscribe(initialState.form, () => {
    const currentState = snapshot(initialState)
    console.log('Form state updated:', currentState.form)
    elements.submitButton.disabled = !initialState.form.valid
    renderErrors(elements, currentState)
  })

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target
      initialState.form.fields[fieldName] = value
      initialState.form.fieldsUi.touched[fieldName] = true
      const errors = validate(initialState.form.fields)
      initialState.form.errors = errors
      initialState.form.valid = isEmpty(errors)
    })
  })

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault()

    initialState.signupProcess.processState = 'sending'
    initialState.signupProcess.processError = null

    try {
      const formData = new FormData()
      formData.append('username', initialState.form.fields.login)
      formData.append('password1', initialState.form.fields.password)
      formData.append('password2', initialState.form.fields.passwordConfirmation)

      const csrfToken = getCookie('csrftoken')

      console.log('Sending data:', {
        username: initialState.form.fields.login,
        password1: initialState.form.fields.password,
        password2: initialState.form.fields.passwordConfirmation,
      })

      console.log(routes.userPath())

      await axios.post(routes.userPath(), formData, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      })

      initialState.signupProcess.processState = 'sent'
    }
    catch (err) {
      initialState.signupProcess.processState = 'error'
      initialState.signupProcess.processError = errorMessages.network.error
      throw err
    }
  })
}

document.addEventListener('DOMContentLoaded', app)

app()
