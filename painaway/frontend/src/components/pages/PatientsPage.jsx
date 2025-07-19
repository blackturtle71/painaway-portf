import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useGetLinksQuery } from '../../services/api/linksApi.js'
import { openModal } from '../../slices/modalsSlice.js'
import InputField from '../ui/InputField.jsx'
import SubmitButton from '../ui/SubmitButton.jsx'
import Modal from '../modal/Modal.jsx'

const PatientsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [searchSurname, setSearchSurname] = useState()
  const { data: linksData } = useGetLinksQuery()
  const acceptedPatients = linksData?.filter(link => link.status === 'accepted') || []

  const handleSearch = () => {
    console.log('Finding...')
  }

  const hadnleOpenModal = () => {
    dispatch(openModal({ type: 'linkRequest' }))
  }

  return (
    <section className="patients-section">
      <div className="find-patient">
        <InputField
          name="search"
          placeholder={t('patientsPage.findPatient')}
          value={searchSurname}
          onChange={e => setSearchSurname(e.target.value)}
          showLabel={false}
        />
        <SubmitButton
          title={t('patientsPage.findButton')}
          onClick={handleSearch}
        />
      </div>

      <div className="accepted-patients">
        {acceptedPatients.map(patient => (
          <div key={patient.id} className="patient-card">
            <div className="patient-info">
              <span className="full-name">
                {patient.patient.last_name}
                {' '}
                {patient.patient.first_name}
                {' '}
                {patient.patient.father_name}
              </span>
              <span className="birthday">
                {patient.patient.date_of_birth}
              </span>
            </div>
            <div className="patient-diagnosis">
              <div className="field-row">
                <label htmlFor="diagnosis">
                  {t('patientsPage.diagnosis')}
                  :
                </label>
                <span className="diagnosis">Тут диагноз</span>
              </div>
              <div className="field-row">
                <label htmlFor="new-entries">
                  {t('patientsPage.newEntries')}
                  :
                </label>
                <span className="new-entries">Тут новые записи</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="new-requests">
        <button
          className="new-requests-button"
          onClick={hadnleOpenModal}
        >
          {t('patientsPage.newRequests')}
        </button>
      </aside>
      <Modal />
    </section>
  )
}

export default PatientsPage
