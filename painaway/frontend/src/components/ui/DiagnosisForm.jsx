import InputField from './InputField'
import SubmitButton from './SubmitButton'

const DiagnosisForm = ({
  placeholders,
  diagnosisText,
  prescriptionText,
  onDiagnosisChange,
  onPrescriptionChange,
  onSave,
  saveTitle,
}) => {
  return (
    <div className="edit-section">
      <InputField
        name="diagnosis"
        placeholder={placeholders.diagnosis}
        value={diagnosisText}
        onChange={onDiagnosisChange}
        showLabel={false}
      />
      <textarea
        name="prescription"
        placeholder={placeholders.prescription}
        value={prescriptionText}
        onChange={onPrescriptionChange}
        className="prescription-textarea"
      />
      <SubmitButton title={saveTitle} onClick={onSave} />
    </div>
  )
}

export default DiagnosisForm
