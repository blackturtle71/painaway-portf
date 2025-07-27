import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import RegisterCard from '../ui/RegisterCard.jsx'
import { useSignupUserMutation } from '../../services/api/authApi.js'
import { easySignUpSchema } from '../../validation/validationSchema.js'
import { uiRoutes } from '../../routes.js'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()
  const [signupUser] = useSignupUserMutation()
  const messages = {
    minLength: t('registerRules.minLength'),
    required: t('errors.required'),
    birthType: t('registerRules.birthType'),
    birthDay: t('registerRules.birthDay'),
    birthMonth: t('registerRules.birthMonth'),
    birthYear: t('registerRules.birthYear'),
    genderError: t('errors.genderError'),
    loginMessage: t('registerRules.login'),
    emailMessage: t('registerRules.email'),
    passwordMessage: t('registerRules.password'),
    passwordConfirmation: t('registerRules.passwordConfirmation'),
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      surname: '',
      name: '',
      patronymic: '',
      birthday: '',
      sex: 'M',
      login: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: easySignUpSchema(messages),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await signupUser({
          username: values.login,
          email: values.email,
          password: values.password,
          first_name: values.name,
          last_name: values.surname,
          father_name: values.patronymic,
          sex: values.sex,
          date_of_birth: values.birthday,
        }).unwrap()

        toast.success(t('success.registration'))
        navigate(uiRoutes.login())
      }
      catch (err) {
        console.log(err.data)
        const errors = err.data || {}

        if (errors.username) {
          formik.setFieldError('login', t('errors.loginExists'))
          toast.error(t('errors.loginExists'))
        }

        if (errors.email) {
          formik.setFieldError('email', t('errors.emailExists'))
          toast.error(t('errors.emailExists'))
        }

        if (err.status >= 500) {
          toast.error(t('errors.serverError'))
        }
        else {
          toast.error(t('errors.network'))
        }
      }
    },
  })

  const inputFields = {
    surname: {
      field: 'surname', type: 'text', placeholder: t('form.placeholders.surname'),
    },
    name: {
      field: 'name', type: 'text', placeholder: t('form.placeholders.name'),
    },
    patronymic: {
      field: 'patronymic', type: 'text', placeholder: t('form.placeholders.patronymic'),
    },
    login: {
      field: 'login', type: 'text', placeholder: t('form.placeholders.login'),
    },
    email: {
      field: 'email', type: 'email', placeholder: t('form.placeholders.email'),
    },
    password: {
      field: 'password', type: 'password', placeholder: t('form.placeholders.password'),
    },
    passwordConfirmation: {
      field: 'passwordConfirmation', type: 'password', placeholder: t('form.placeholders.passwordConfirmation'),
    },
  }

  const gender = {
    label: t('form.gender.ariaLabel'),
    sex: t('form.gender.sex'),
    male: t('form.gender.M'),
    female: t('form.gender.F'),
  }

  const values = {
    formik,
    title: t('registration'),
    buttonTitle: t('makeRegistration'),
    inputFields,
    dataPlaceholder: t('form.placeholders.date'),
    dateOfBirth: t('form.dateOfBirth'),
    gender,
    userExists: t('errors.loginExists'),
    haveAccount: t('haveAccount'),
    login: t('entry'),
    path: uiRoutes.login(),
    inputRef,
  }

  return (
    <section className="signup-page">
      <RegisterCard values={values} />
    </section>
  )
}

export default RegisterPage
