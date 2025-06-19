import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
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
  const [registerFailed, setRegisterFailed] = useState(false)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

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
      try {
        await signupUser({
          username: values.username,
          email: values.email,
          password1: values.password,
          password2: values.passwordConfirmation,
        }).unwrap()

        toast.success(t('success.registration'))
        setRegisterFailed(false)
        navigate(uiRoutes.login())
      }
      catch (err) {
        console.log(err.data)
        if (err.response.username && err.response.status === 400) {
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
    path: uiRoutes.login(),
    registerFailed,
    // usernameOnBlur: handleUsernameBlur,
    // emailOnBlur: handleEmailBlur,
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
