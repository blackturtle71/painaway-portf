const SubmitButton = ({
  title,
  disabled = false,
  type = 'submit',
  onClick,
}) => (
  <div className="form-submit">
    <button
      type={type}
      className="submit-button"
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  </div>
)

export default SubmitButton
