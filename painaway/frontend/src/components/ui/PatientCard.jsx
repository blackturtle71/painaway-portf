import { useTranslation } from 'react-i18next'
import NumberOfNewRecords from './NumberOfNewRecords'

const PatientCard = ({ patient, handlePatientClick }) => {
  const { t } = useTranslation()

  return (
    <div
      key={patient.id}
      className="patient-card"
      onClick={() => handlePatientClick(patient.patient.id)}
    >
      <div className="patient-info">
        <span className="full-name">
          <span>{patient.patient.last_name}</span>
          <span>{patient.patient.first_name}</span>
          <span>{patient.patient.father_name}</span>
        </span>
        <span className="birthday">
          {patient.patient.date_of_birth}
        </span>
      </div>
      <div className="patient-diagnosis">
        <div className="field-row">
          <label htmlFor="diagnosis">
            {t('patientsPage.diagnosis')}
            {': '}
          </label>
          <span className="diagnosis">{patient.diagnosis?.diagnosis || 'Нет диагноза'}</span>
        </div>
        <div className="field-row">
          <label htmlFor="new-entries">
            {t('patientsPage.numberEntries')}
            {': '}
          </label>
          <NumberOfNewRecords patientId={patient.patient.id} />
        </div>
      </div>
    </div>
  )
}

export default PatientCard
