import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import SubmitButton from './SubmitButton.jsx'

const LoginCard = ({ values }) => {
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

  return (
    <div className="login-card">
      <form onSubmit={formik.handleSubmit}>
        <InputField
          name="username"
          type="text"
          placeholder={placeholderName}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={null}
          touched={formik.touched.username}
          inputRef={inputRef}
          disabled={formik.isSubmitting}
        />

        <InputField
          name="password"
          type="password"
          placeholder={placeholderPassword}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={authFailed ? error : ''}
          touched={formik.touched.password}
          disabled={formik.isSubmitting}
        />

        <SubmitButton
          title={buttonTitle}
          disabled={formik.isSubmitting}
        />
      </form>

      <div className="auth-link">
        <Link to={path}>{registration}</Link>
      </div>
    </div>
  )
}

export default LoginCard
