const SubmitButton = (props) => {
  const { values } = props
  const { formik, buttonTitle } = values

  return (
    <div className="form-submit">
      <button
        type="submit"
        className="submit-button"
        disabled={formik.isSubmitting}
      >
        {buttonTitle}
      </button>
    </div>
  )
}

export default SubmitButton
