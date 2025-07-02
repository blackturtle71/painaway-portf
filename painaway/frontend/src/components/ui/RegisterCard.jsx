import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import DateOfBirth from './DateOfBirth.jsx'
import Gender from './Gender.jsx'
import SubmitButton from './SubmitButton.jsx'

const RegisterCard = (props) => {
  const { values } = props
  const {
    formik,
    buttonTitle,
    inputFields,
    dataPlaceholder,
    dateOfBirth,
    gender,
    login,
    path,
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
    failed: formik.errors.login && formik.touched.login,
    inputRef: null,
    error: formik.errors.login,
  }

  const propsEmail = {
    formik,
    ...inputFields.email,
    failed: formik.errors.email && formik.touched.email,
    inputRef: null,
    error: formik.errors.email,
  }

  const propsPassword = {
    formik,
    ...inputFields.password,
    failed: formik.errors.password && formik.touched.password,
    inputRef: null,
    error: formik.errors.password,
  }

  const propsPasswordConfirmationValues = {
    formik,
    ...inputFields.passwordConfirmation,
    failed: formik.errors.passwordConfirmation && formik.touched.passwordConfirmation,
    inputRef: null,
    error: formik.errors.passwordConfirmation,
  }

  const propsBirth = {
    formik,
    label: dateOfBirth,
    placeholder: dataPlaceholder,
  }

  const propsGender = {
    formik,
    label: gender.label,
    sex: gender.sex,
    male: gender.male,
    female: gender.female,
  }

  return (
    <div className="signup-card">
      <form onSubmit={formik.handleSubmit}>
        <InputField values={propsSurname} />
        <InputField values={propsName} />
        <InputField values={propsPatronymic} />
        <Gender values={propsGender} />
        <DateOfBirth values={propsBirth} />
        <InputField values={propsLogin} />
        <InputField values={propsEmail} />
        <InputField values={propsPassword} />
        <InputField values={propsPasswordConfirmationValues} />

        <SubmitButton values={{ formik, buttonTitle }} />
      </form>

      <div className="auth-link">
        <Link to={path}>{login}</Link>
      </div>
    </div>
  )
}

export default RegisterCard
