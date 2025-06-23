import { Form, Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import DateOfBirth from './DateOfBirth.jsx'
import Gender from './Gender.jsx'
import SubmitButton from './SubmitButton.jsx'

const RegisterCard = (props) => {
  const { values } = props
  const {
    formik,
    title,
    buttonTitle,
    inputFields,
    dateFields,
    dateOfBirth,
    genders,
    sex,
    userExists,
    haveAccount,
    login,
    path,
    registerFailed,
    inputRef,
  } = values

  const propsSurname = {
    formik,
    ...inputFields.surname,
    failed: formik.errors.surname && formik.touched.surname,
    inputRef,
    error: formik.errors.surname,
  }

  const propsName = {
    formik,
    ...inputFields.name,
    failed: formik.errors.name && formik.touched.name,
    inputRef: null,
    error: formik.errors.name,
  }

  const propsPatronymic = {
    formik,
    ...inputFields.patronymic,
    failed: formik.errors.patronymic && formik.touched.patronymic,
    inputRef: null,
    error: formik.errors.patronymic,
  }

  const propsLogin = {
    formik,
    ...inputFields.login,
    failed: (formik.errors.login && formik.touched.login) || registerFailed,
    inputRef: null,
    error: formik.errors.login,
  }

  const propsEmail = {
    formik,
    ...inputFields.email,
    failed: (formik.errors.email && formik.touched.email) || registerFailed,
    inputRef: null,
    error: formik.errors.email,
  }

  const propsPassword = {
    formik,
    ...inputFields.password,
    failed: (formik.errors.password && formik.touched.password),
    inputRef: null,
    error: formik.errors.password,
  }

  const propsPasswordConfirmationValues = {
    formik,
    ...inputFields.passwordConfirmation,
    failed: (
      (formik.errors.passwordConfirmation && formik.touched.passwordConfirmation)
      || registerFailed
    ),
    inputRef: null,
    error: registerFailed ? userExists : formik.errors.passwordConfirmation,
  }

  const propsBirth = {
    formik,
    label: dateOfBirth,
    fields: [
      { field: 'birthDay', ...dateFields.birthDay },
      { field: 'birthMonth', ...dateFields.birthMonth },
      { field: 'birthYear', ...dateFields.birthYear },
    ],
  }

  const propsGender = { formik, genders, sex }

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <h1 className="mb-4">{title}</h1>

        {/* Фамилия Имя Отчество */}
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={4}>
              <InputField values={propsSurname} />
            </Col>
            <Col md={4}>
              <InputField values={propsName} />
            </Col>
            <Col md={4}>
              <InputField values={propsPatronymic} />
            </Col>
          </Row>

          {/* Дата рождения и Пол */}
          <Row>
            <Col md={8}>
              <Col>
                <DateOfBirth values={propsBirth} />
              </Col>
            </Col>
            <Col md={4}>
              <Gender values={propsGender} />
            </Col>
          </Row>

          {/* Логин и Почта */}
          <Row>
            <Col md={6}>
              <InputField values={propsLogin} />
            </Col>
            <Col md={6}>
              <InputField values={propsEmail} />
            </Col>
          </Row>

          {/* Пароль и Подтверждение */}
          <Row>
            <Col md={6}>
              <InputField values={propsPassword} />
            </Col>
            <Col md={6}>
              <InputField values={propsPasswordConfirmationValues} />
            </Col>
          </Row>

          <SubmitButton values={{ formik, buttonTitle }} />
        </Form>
      </Card.Body>

      <Card.Footer className="text-center py-4">
        <div>
          <span className="text-muted d-block">{haveAccount}</span>
          <Link to={path}>{login}</Link>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default RegisterCard
