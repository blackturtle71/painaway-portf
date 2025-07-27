import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { openModal, setCurrentNote } from '../../slices/modalsSlice'
import { useGetLinksQuery, useGetPatientRecordsQuery } from '../../services/api/linksApi'
import { useParams } from 'react-router-dom'
import Modal from '../modal/Modal'
import IntensityGraph from '../ui/IntensityGraph'
import { formatDate, formatDateTime } from '../../helpers/dateUtils'

const PatientRecordsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector(state => state.authReducer.token)
  const { data: linksData, isLoading: isLoadingProfile } = useGetLinksQuery(undefined, {
    skip: !token,
  })
  const { patientId } = useParams()
  const currentPatient = linksData?.find(link => link.patient.id === Number(patientId))
  console.log('id', patientId)
  console.log('current link', currentPatient?.id)
  console.log('currentPatient', currentPatient)
  const { data: records = [], isLoading: isLoadingRecords } = useGetPatientRecordsQuery(Number(patientId), {
    skip: !patientId,
  })
  console.log('dataProfile', linksData)
  console.log('records', records)

  const recordsForGraph = useMemo(() => records.map((record) => {
    return {
      id: record.id,
      date: formatDate(record.date_recorded),
      intensity: record.intensity,
    }
  }), [records])
  console.log('recordsForGraph', recordsForGraph)

  if (isLoadingProfile) {
    return <div>Загрузка профиля...</div>
  }

  if (isLoadingRecords) {
    return <div>Загрузка записей...</div>
  }

  const handleRecordClick = (record) => {
    dispatch(setCurrentNote(record))
    dispatch(openModal({ type: 'note' }))
  }

  const handleChangeClick = () => {
    dispatch(openModal({ type: 'change', data: { currentPatient } }))
  }

  return (
    <section className="patient-records">
      <div className="patient-info">
        <div className="field-row">
          <span className="field">
            {t('profilePage.fullName')}
            {': '}
          </span>
          <span className="value">
            {currentPatient.patient.last_name}
            {' '}
            {currentPatient.patient.first_name}
            {' '}
            {currentPatient.patient.father_name}
          </span>
        </div>
        <div className="field-row">
          <span className="field">
            {t('profilePage.sex')}
            {': '}
          </span>
          <span className="value">{t(`form.gender.${currentPatient.patient.sex}`)}</span>
        </div>
        <div className="field-row">
          <span className="field">
            {t('profilePage.birthday')}
            {': '}
          </span>
          <span className="value">{currentPatient.patient.date_of_birth}</span>
        </div>
        <div className="field-row">
          <span className="field">
            {t('patientsPage.diagnosis')}
            {': '}
          </span>
          <span className="value">{currentPatient.diagnosis?.diagnosis || 'Нет диагноза'}</span>
          <span className="change" onClick={handleChangeClick}>{t('change')}</span>
        </div>
        <div className="field-row">
          <span className="field">
            {t('profilePage.treatment')}
            {': '}
          </span>
          <span className="value">{currentPatient.prescription?.prescription || 'Нет лечения'}</span>
          <span className="change" onClick={handleChangeClick}>{t('change')}</span>
        </div>
      </div>

      <div className="pain-info-container">
        <div className="dynamics-pain">
          <div className="dynamics-pain-title">{t('patientsPage.intensityDynamic')}</div>
          <div className="dynamic-pain-graph">
            {recordsForGraph.length > 0
              ? (
                  recordsForGraph.map(({ id, date, intensity }) => (
                    <IntensityGraph
                      key={id}
                      date={date}
                      intensity={intensity}
                    />
                  ))
                )
              : (
                  <div>Нет данных для отображения</div>
                )}
          </div>
        </div>

        <div className="records-container">
          <div className="records-title">{t('patientsPage.records')}</div>
          {records?.map(record => (
            <div
              key={record.id}
              className="mini-record"
              onClick={() => handleRecordClick(record)}
            >
              <div className="date-record">{`${formatDateTime(record.date_recorded)}`}</div>
              <div className="info-container">
                <div className="type-intensity">
                  <span className="value">{`${t(`painTypes.${record.pain_type}`)} (${record.intensity})`}</span>
                </div>
                <div className="isMedicine">
                  <span className="field">
                    {t('diaryPage.isMedicine')}
                    {': '}
                  </span>
                  <span className="value">{t(`${record.tookPrescription}`)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal />
    </section>
  )
}

export default PatientRecordsPage
