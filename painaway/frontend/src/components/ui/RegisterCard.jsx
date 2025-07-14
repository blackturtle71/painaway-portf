import { Link } from 'react-router-dom'

import InputField from './InputField.jsx'
import DateOfBirth from './DateOfBirth.jsx'
import Gender from './Gender.jsx'
import SubmitButton from './SubmitButton.jsx'
import { Fragment } from 'react'

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

  const fields = ['surname', 'name', 'patronymic', 'email', 'login', 'password', 'passwordConfirmation']

  return (
    <div className="signup-card">
      <form onSubmit={formik.handleSubmit}>
        {fields.map(field => (
          <Fragment key={field}>
            <InputField
              key={field}
              name={field}
              type={inputFields[field].type}
              placeholder={inputFields[field].placeholder}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors[field]}
              touched={formik.touched[field]}
              inputRef={field === 'surname' ? inputRef : null}
              disabled={formik.isSubmitting}
            />

            {field === 'patronymic' && (
              <>
                <Gender
                  values={{
                    formik,
                    label: gender.label,
                    sex: gender.sex,
                    male: gender.male,
                    female: gender.female,
                  }}
                />
                <DateOfBirth
                  values={{
                    formik,
                    label: dateOfBirth,
                    placeholder: dataPlaceholder,
                  }}
                />
              </>
            )}
          </Fragment>
        ))}

        <SubmitButton
          title={buttonTitle}
          disabled={formik.isSubmitting}
        />
      </form>

      <div className="auth-link">
        <Link to={path}>{login}</Link>
      </div>
    </div>
  )
}

export default RegisterCard
