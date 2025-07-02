import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import SubmitButton from './SubmitButton.jsx'

const LoginCard = (props) => {
  const { values } = props
  const {
    formik,
    buttonTitle,
    placeholderName,
    placeholderPassword,
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
    <div className="login-card">
      <form onSubmit={formik.handleSubmit}>
        <InputField values={propsUsername} />
        <InputField values={propsPassword} />
        <SubmitButton values={{ formik, buttonTitle }} />
      </form>

      <div className="auth-link">
        <Link to={path}>{registration}</Link>
      </div>
    </div>
  )
}

export default LoginCard
