import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '../../assets/images/Close.svg'
import { closeModal } from '../../slices/modalsSlice'
import DiagnosisForm from '../ui/DiagnosisForm'
import { useState } from 'react'
import { useChangeDiagnosisMutation, useChangePrescriptionMutation } from '../../services/api'

const ChangeModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const diagnosisId = useSelector(state => state.modalsReducer.modals.data?.currentPatient?.diagnosis?.id)
  const prescriptionId = useSelector(state => state.modalsReducer.modals.data?.currentPatient?.prescription?.id)

  const [diagnosisText, setDiagnosisText] = useState('')
  const [prescriptionText, setPrescriptionText] = useState('')
  const [changeDiagnosis] = useChangeDiagnosisMutation()
  const [changePrescription] = useChangePrescriptionMutation()

  const handleSave = async () => {
    try {
      if (diagnosisText.trim()) {
        await changeDiagnosis({ diagnosisId, diagnosisText })
      }

      if (prescriptionText.trim()) {
        await changePrescription({ prescriptionId, prescriptionText })
      }

      dispatch(closeModal())
    }
    catch (err) {
      console.error('Ошибка при сохранении', err)
    }
  }

  return (
    <div className="modal-overlay request-modal">
      <div className="modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{t('modals.change')}</h2>
          <button
            className="modal-close"
            onClick={() => dispatch(closeModal())}
          >
            <img src={CloseIcon} alt={t('alt.closeModal')} />
          </button>
        </div>

        <div className="modal-content">
          <DiagnosisForm
            placeholders={{
              diagnosis: t('modals.enterDiagnosis'),
              prescription: t('modals.enterTreatment'),
            }}
            diagnosisText={diagnosisText}
            prescriptionText={prescriptionText}
            onDiagnosisChange={e => setDiagnosisText(e.target.value)}
            onPrescriptionChange={e => setPrescriptionText(e.target.value)}
            onSave={handleSave}
            saveTitle={t('save')}
          />
        </div>
      </div>
    </div>
  )
}

export default ChangeModal
