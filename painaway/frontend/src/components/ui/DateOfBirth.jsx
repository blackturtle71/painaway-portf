const DateOfBirth = (props) => {
  const { values } = props
  const {
    formik,
    label,
    placeholder,
  } = values

  const failed = formik.errors.birthday && formik.touched.birthday
  const error = formik.errors.birthday

  return (
    <div className="form-group date-group">
      <label htmlFor="birthday" className="form-label">{label}</label>
      <input
        id="birthday"
        name="birthday"
        className="form-input"
        type="date"
        min="1900-01-01"
        max={new Date().toISOString().split('T')[0]} // Current date
        placeholder={placeholder}

        value={formik.values.birth}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        autoComplete="bday"
      />
      <div className="error-message">
        {failed ? error : ' '}
      </div>
    </div>
  )
}

export default DateOfBirth
