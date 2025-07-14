import cn from 'classnames'

const InputField = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  inputRef,
  error,
  touched,
  showLabel = true,
}) => {
  const failed = Boolean(error && touched)

  return (
    <div className="form-group">
      {showLabel && placeholder && (
        <label htmlFor={id || name} className="form-label">{placeholder}</label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        className={cn('form-input', { 'input-error': failed })}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={name}
        ref={inputRef}
        placeholder={!showLabel ? placeholder : ''}
      />
      <div className="error-message">
        {failed ? error : ' '}
      </div>
    </div>
  )
}

export default InputField
