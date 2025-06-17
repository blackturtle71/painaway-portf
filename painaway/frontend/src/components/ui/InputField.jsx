import Form from 'react-bootstrap/Form'

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
    <Form.Floating className="mb-3">
      <Form.Control
        id={field}
        name={field}
        type={type}
        autoComplete={field}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={onBlur || formik.handleBlur}
        value={formik.values[field]}
        isInvalid={failed}
        disabled={formik.isSubmitting}
        ref={inputRef}
      />
      <Form.Label htmlFor={field}>{placeholder}</Form.Label>
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Floating>
  )
}

export default InputField
