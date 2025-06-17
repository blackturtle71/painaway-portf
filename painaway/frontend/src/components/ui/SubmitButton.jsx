import { Button } from 'react-bootstrap'

const SubmitButton = (props) => {
  const { values } = props
  const { formik, buttonTitle } = values

  return (
    <div className="d-grid">
      <Button
        variant="primary"
        type="submit"
        disabled={formik.isSubmitting}
      >
        {buttonTitle}
      </Button>
    </div>
  )
}

export default SubmitButton
