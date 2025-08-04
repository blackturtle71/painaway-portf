import AcceptIcon from '../../assets/images/Accept.svg'
import RejectIcon from '../../assets/images/Reject.svg'
import { useState } from 'react'
import {
  useRespondToLinkRequestMutation,
  useSetDiagnosisMutation,
  useSetPrescriptionMutation,
} from '../../services/api'
import { useTranslation } from 'react-i18next'
import DiagnosisForm from './DiagnosisForm'
import { formatDate } from '../../helpers/dateUtils'

const RequestCard = ({ request }) => {
  const { t } = useTranslation()
  const [isAccepted, setIsAccepted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [diagnosisText, setDiagnosisText] = useState('')
  const [prescriptionText, setPrescriptionText] = useState('')
  const [respondToLinkRequest] = useRespondToLinkRequestMutation()
  const [setDiagnosis] = useSetDiagnosisMutation()
  const [setPrescription] = useSetPrescriptionMutation()
  const patientId = request.patient.id

  if (request.status !== 'pending' && !isAccepted) {
    return null
  }

  const handleAccept = async () => {
    try {
      setIsEditing(true)
    }
    catch (err) {
      console.error('Error accept request:', err)
    }
  }

  const handleReject = async () => {
    try {
      await respondToLinkRequest({ patientId, action: 'reject' }).unwrap()
    }
    catch (err) {
      console.error('Error reject request:', err)
    }
  }

  const handleSave = async () => {
    const linkId = request.id

    try {
      await respondToLinkRequest({ patientId, action: 'accept' }).unwrap()

      if (diagnosisText.trim()) {
        await setDiagnosis({ linkId, diagnosisText })
      }

      if (prescriptionText.trim()) {
        await setPrescription({ linkId, prescriptionText })
      }

      setIsEditing(false)
      setIsAccepted(false)
    }
    catch (err) {
      console.error('Ошибка при сохранении', err)
    }
  }

  return (
    <div key={request.id} className={`request-card ${isEditing ? 'editing' : ''}`}>
      <div className="request-patient-info">
        <div className="field-row">
          <label htmlFor="name">
            {t('profilePage.fullName')}
            :
          </label>
          <span className="name">
            {request.patient.last_name}
            {' '}
            {request.patient.first_name}
            {' '}
            {request.patient.father_name}
          </span>
        </div>
        <div className="field-row">
          <label htmlFor="sex">
            {t('profilePage.sex')}
            :
          </label>
          <span className="sex">
            {t(`form.gender.${request.patient.sex}`)}
          </span>
        </div>
        <div className="field-row">
          <label htmlFor="birthday">
            {t('profilePage.birthday')}
            :
          </label>
          <span className="birthday">
            {formatDate(request.patient.date_of_birth)}
          </span>
        </div>
      </div>

      {isEditing
        ? (
            <DiagnosisForm
              placeholders={
                {
                  diagnosis: t('modals.enterDiagnosis'),
                  prescription: t('modals.enterTreatment'),
                }
              }
              diagnosisText={diagnosisText}
              prescriptionText={prescriptionText}
              onDiagnosisChange={e => setDiagnosisText(e.target.value)}
              onPrescriptionChange={e => setPrescriptionText(e.target.value)}
              onSave={handleSave}
              saveTitle={t('save')}
            />
          )
        : (
            <div className="action-buttons">
              <button
                className="btn accept-btn"
                onClick={handleAccept}
              >
                <img src={AcceptIcon} alt={t('alt.acceptButton')} />
              </button>
              <button
                className="btn reject-btn"
                onClick={handleReject}
              >
                <img src={RejectIcon} alt={t('alt.rejectButton')} />
              </button>
            </div>
          )}
    </div>
  )
}

export default RequestCard
