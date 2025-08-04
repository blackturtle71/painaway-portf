import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useGetLinksQuery } from '../../services/api/linksApi.js'
import PatientCard from '../ui/PatientCard.jsx'
import { openModal } from '../../slices/modalsSlice.js'
import InputField from '../ui/InputField.jsx'
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

      <div className="patients-scroll-container">
        <div className="accepted-patients">
          {filteredPatients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              handlePatientClick={handlePatientClick}
            />
          ))}
        </div>
      </div>

      <aside className="new-requests">
        <button
          className="new-requests-button"
          onClick={handleOpenModal}
        >
          {t('patientsPage.newRequests')}
        </button>
      </aside>
    </section>
  )
}

export default PatientsPage
