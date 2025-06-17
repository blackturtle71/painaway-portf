import { Form, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import SubmitButton from './SubmitButton.jsx'

const LoginCard = (props) => {
  const { values } = props
  const {
    formik,
    title,
    buttonTitle,
    placeholderName,
    placeholderPassword,
    noAccount,
    registration,
    error,
    path,
    authFailed,
    inputRef,
  } = values

  const propsUsername = {
    formik,
    field: 'username',
    type: 'text',
    placeholder: placeholderName,
    authFailed,
    inputRef,
    error: '',
  }

  const propsPassword = {
    formik,
    field: 'password',
    type: 'password',
    placeholder: placeholderPassword,
    failed: authFailed,
    inputRef: null,
    error,
  }

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-lg-5">
        <h1 className="mb-4">{title}</h1>

        <Form onSubmit={formik.handleSubmit}>
          <InputField values={propsUsername} />
          <InputField values={propsPassword} />

          <SubmitButton values={{ formik, buttonTitle }} />
        </Form>
      </Card.Body>

      <Card.Footer className="text-center py-4">
        <div>
          <span className="text-muted d-block">{noAccount}</span>
          <Link to={path}>{registration}</Link>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default LoginCard
