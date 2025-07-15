import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'

import LoginCard from '../ui/LoginCard.jsx'
import { persistAuth } from '../../slices/authSlice.js'
import { useLoginUserMutation } from '../../services/api/authApi.js'
import { loginSchema } from '../../validation/validationSchema.js'
import { uiRoutes } from '../../routes.js'
import { authApi } from '../../services/api/index.js'

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const inputRef = useRef()
  const navigate = useNavigate()
  const [loginUser] = useLoginUserMutation()
  const [authFailed, setAuthFailed] = useState(false)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema(t('errors.required')),
    onSubmit: async (values) => {
      setAuthFailed(false)

      try {
        const response = await loginUser(values).unwrap()
        console.log('Вход', response)
        dispatch(persistAuth(response))
        dispatch(authApi.util.invalidateTags(['Profile']))
        navigate(uiRoutes.profile())
      }
      catch (err) {
        formik.setSubmitting(false)
        if (err.status === 400) {
          setAuthFailed(true)
          inputRef.current.select()
        }
        else {
          toast.error(t('errors.network'))
        }
      }
    },
  })

  const values = {
    formik,
    title: t('entry'),
    buttonTitle: t('entry'),
    placeholderName: t('form.placeholders.login'),
    placeholderPassword: t('form.placeholders.password'),
    noAccount: t('noAccount'),
    registration: t('registration'),
    error: t('errors.invalidFeedback'),
    path: uiRoutes.register(),
    authFailed,
    inputRef,
  }

  return (
    <section className="login-page">
      <LoginCard values={values} />
    </section>
  )
}

export default LoginPage
