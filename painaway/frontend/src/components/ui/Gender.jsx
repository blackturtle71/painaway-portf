const Gender = (props) => {
  const { values } = props
  const {
    formik,
    label,
    sex,
    male,
    female,
  } = values

  return (
    <div className="form-group gender-group">
      <label id="sex" className="gender-label" htmlFor="sex">{sex}</label>
      <div className="gender-toggle" role="group" aria-labelledby="sex" aria-label={label}>
        <button
          type="button"
          className={formik.values.sex === 'M' ? 'active' : ''}
          onClick={() => formik.setFieldValue('sex', 'M')}
          aria-pressed={formik.values.sex === 'M'}
        >
          {male}
        </button>
        <button
          type="button"
          className={formik.values.sex === 'F' ? 'active' : ''}
          onClick={() => formik.setFieldValue('sex', 'F')}
          aria-pressed={formik.values.sex === 'F'}
        >
          {female}
        </button>
      </div>
    </div>
  )
}

export default Gender
