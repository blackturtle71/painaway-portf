import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import RegisterCard from '../ui/RegisterCard.jsx'
import { useSignupUserMutation } from '../../services/api/authApi.js'
import { easySignUpSchema } from '../../validation/validationSchema.js'
import { getDays, getMonths, getYears } from '../../helpers/dateUtils.js'
import { uiRoutes } from '../../routes.js'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()
  const [signupUser] = useSignupUserMutation()
  const [registerFailed, setRegisterFailed] = useState(false)
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
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      sex: '',
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
          date_of_birth: `${values.birthYear}-${values.birthMonth.padStart(2, '0')}-${values.birthDay.padStart(2, '0')}`,
        }).unwrap()

        toast.success(t('success.registration'))
        setRegisterFailed(false)
        navigate(uiRoutes.login())
      }
      catch (err) {
        console.log(err.data)
        const errors = err.data || {}

        if (errors.username) {
          toast.error(t('errors.userExists'))
          setRegisterFailed(true)
        }

        if (errors.email) {
          toast.error(t('errors.emailExists'))
          setRegisterFailed(true)
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

  const dateFields = {
    birthDay: {
      ariaLabel: t('form.ariaLabels.day'), range: getDays(),
    },
    birthMonth: {
      ariaLabel: t('form.ariaLabels.month'), range: getMonths(),
    },
    birthYear: {
      ariaLabel: t('form.ariaLabels.year'), range: getYears(),
    },
  }

  const genders = [
    { gender: t('form.gender.male'), type: 'radio', id: 1 },
    { gender: t('form.gender.female'), type: 'radio', id: 2 },
  ]

  const values = {
    formik,
    title: t('registration'),
    buttonTitle: t('makeRegistration'),
    inputFields,
    dateFields,
    dateOfBirth: t('form.dateOfBirth'),
    genders,
    sex: t('form.gender.sex'),
    userExists: t('errors.userExists'),
    haveAccount: t('haveAccount'),
    login: t('entry'),
    path: uiRoutes.login(),
    registerFailed,
    inputRef,
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={12} lg={10} xl={9}>
          <RegisterCard values={values} />
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPage
