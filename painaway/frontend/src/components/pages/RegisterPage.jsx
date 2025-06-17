import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import RegisterCard from '../ui/RegisterCard.jsx'
import { useCheckUsernameQuery, useSignupUserMutation } from '../../services/api/authApi.js'
import { easySignUpSchema } from '../../validation/validationSchema.js'
import routes from '../../routes.js'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef()
  const [usernameToCheck, setUsernameToCheck] = useState(null)
  const [emailToCheck, setEmailToCheck] = useState(null)
  const { data: usernameExists } = useCheckUsernameQuery(
    usernameToCheck,
    { skip: !usernameToCheck },
  )
  const [signupUser] = useSignupUserMutation()
  const [registerFailed, setRegisterFailed] = useState(false)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (usernameExists?.exists) {
      formik.setFieldError('username', t('errors.userExists'))
    }
    else if (formik.errors.username === t('errors.userExists')) {
      formik.setFieldError('username', undefined) // remove error if login became unique
    }
  }, [usernameExists])

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: easySignUpSchema(t('registrationRules.name'), t('registrationRules.password'), t('errors.required'), t('registrationRules.passwordConfirmation')),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsernameToCheck(null)

      try {
        await signupUser({
          username: values.username,
          email: values.email,
          password1: values.password,
          password2: values.passwordConfirmation,
        }).unwrap()

        toast.success(t('success.registration'))
        setRegisterFailed(false)
        navigate(routes.loginPath())
      }
      catch (err) {
        console.log(err.data)
        if (err.response && err.response.status === 400) {
          toast.error(t('errors.userExists'))
          setRegisterFailed(true)
        }
        else if (err.status) {
          toast.error(t('errors.serverError'))
        }
        else {
          toast.error(t('errors.network'))
        }
      }
    },
  })

  // Обработка blur для поля логина
  const handleUsernameBlur = async (e) => {
    formik.handleBlur(e) // стандартный обработчик Formik

    const username = e.target.value.trim()
    await formik.validateField('username')

    if (username && !formik.errors.username) {
      setUsernameToCheck(username)
    }
  }

  const handleEmailBlur = async (e) => {
    formik.handleBlur(e) // стандартный обработчик Formik

    const email = e.target.value.trim()
    await formik.validateField('email')

    if (email && !formik.errors.username) {
      setEmailToCheck(email)
    }
  }

  const values = {
    formik,
    title: t('registration'),
    buttonTitle: t('makeRegistration'),
    placeholderUsername: t('placeholders.username'),
    placeholderEmail: t('placeholders.email'),
    placeholderPassword: t('placeholders.password'),
    placeholderPasswordConfirmation: t('placeholders.passwordConfirmation'),
    userExists: t('errors.userExists'),
    haveAccount: t('haveAccount'),
    login: t('entry'),
    path: routes.loginPath(),
    registerFailed,
    usernameOnBlur: handleUsernameBlur,
    emailOnBlur: handleEmailBlur,
    inputRef,
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} py={5}>
          <RegisterCard values={values} />
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPage
