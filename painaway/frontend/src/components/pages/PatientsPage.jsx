import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { openModal } from '../../slices/modalsSlice.js'
import InputField from '../ui/InputField.jsx'
import SubmitButton from '../ui/SubmitButton.jsx'
import Modal from '../modal/Modal.jsx'

const PatientsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [searchSurname, setSearchSurname] = useState()

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

      <div></div>

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
