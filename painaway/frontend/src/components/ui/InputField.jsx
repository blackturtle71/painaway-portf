import cn from 'classnames'

const InputField = (props) => {
  const { values } = props
  const {
    formik,
    field,
    type,
    placeholder,
    failed,
    onBlur,
    inputRef,
    error,
  } = values

  return (
    <div className="form-group">
      <label htmlFor={field} className="form-label">{placeholder}</label>
      <input
        id={field}
        name={field}
        type={type}
        className={cn('form-input', { 'input-error': failed })}
        value={formik.values[field]}
        onChange={formik.handleChange}
        onBlur={onBlur || formik.handleBlur}
        disabled={formik.isSubmitting}
        autoComplete={field}
        ref={inputRef}
      />
      {failed && <div className="error-message">{error}</div>}
    </div>
  )
}

export default InputField
