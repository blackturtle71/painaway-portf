import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useGetLinksQuery } from '../../services/api/linksApi.js'
import { openModal } from '../../slices/modalsSlice.js'
import InputField from '../ui/InputField.jsx'
import Modal from '../modal/Modal.jsx'
import { useNavigate } from 'react-router-dom'
import { uiRoutes } from '../../routes.js'

const PatientsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: linksData, isLoading, isError } = useGetLinksQuery()

  const acceptedPatients = useMemo(() => linksData?.filter(link => link.status === 'accepted') || [], [linksData])

  const [searchSurname, setSearchSurname] = useState('')

  const filteredPatients = useMemo(() => {
    const search = searchSurname.trim().toLowerCase()

    if (!search) return acceptedPatients

    return acceptedPatients.filter(p => p.patient.last_name.toLowerCase().includes(search))
  }, [acceptedPatients, searchSurname])

  const handleChange = e => setSearchSurname(e.target.value)

  const handleOpenModal = () => {
    dispatch(openModal({ type: 'linkRequest' }))
  }

  const handlePatientClick = (patientId) => {
    navigate(uiRoutes.patientCard(patientId))
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading patient data</div>

  return (
    <section className="patients-section">
      <div className="find-patient">
        <InputField
          name="search"
          placeholder={t('patientsPage.findPatient')}
          value={searchSurname}
          onChange={handleChange}
          showLabel={false}
        />
      </div>

      <div className="accepted-patients">
        {filteredPatients.map((patient) => {
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
                  <span className="new-entries">Тут новые записи</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <aside className="new-requests">
        <button
          className="new-requests-button"
          onClick={handleOpenModal}
        >
          {t('patientsPage.newRequests')}
        </button>
      </aside>
      <Modal />
    </section>
  )
}

export default PatientsPage
