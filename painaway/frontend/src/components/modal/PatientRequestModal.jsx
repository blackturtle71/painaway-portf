import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useGetLinksQuery, useRespondToLinkRequestMutation } from '../../services/api/index.js'
import CloseIcon from '../../assets/images/Close.svg'
import AcceptIcon from '../../assets/images/Accept.svg'
import RejectIcon from '../../assets/images/Reject.svg'
import { closeModal } from '../../slices/modalsSlice.js'

const PatientRequestModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { data: linksData } = useGetLinksQuery()
  const [respondToLinkRequest] = useRespondToLinkRequestMutation()
  const requests = linksData?.filter(link => link.status === 'pending') || []
  console.log('linksData', linksData)
  // console.log('requests', requests)
  // console.log('req', requests.map(req => console.log(req)))

  const handleAccept = async (patientId) => {
    try {
      console.log('send patient_id', patientId)
      await respondToLinkRequest({ patientId, action: 'accept' }).unwrap()
      console.log('accept')
    }
    catch (err) {
      console.error('Error accepting request:', err)
    }
  }

  const handleReject = async (patientId) => {
    try {
      await respondToLinkRequest({ patient_id: patientId, action: 'reject' }).unwrap()
      console.log('reject')
    }
    catch (err) {
      console.error('Error reject request:', err)
    }
  }

  return (
    <div className="modal-overlay request-modal">
      <div className="modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{t('modals.title')}</h2>
          <button
            className="modal-close"
            onClick={() => dispatch(closeModal())}
          >
            <img src={CloseIcon} alt={t('alt.closeModal')} />
          </button>
        </div>

        <div className="modal-content">
          {requests.length === 0
            ? (
                <p className="no-requests">{t('modals.noRequests')}</p>
              )
            : (
                requests.map(req => (
                  <div key={req.id} className="request-card">
                    <div className="patient-info">
                      <div className="field-row">
                        <label htmlFor="name">
                          {t('profilePage.fullName')}
                          :
                        </label>
                        <span className="name">
                          {req.patient.last_name}
                          {' '}
                          {req.patient.first_name}
                          {' '}
                          {req.patient.father_name}
                        </span>
                      </div>
                      <div className="field-row">
                        <label htmlFor="sex">
                          {t('profilePage.sex')}
                          :
                        </label>
                        <span className="sex">
                          {req.patient.sex}
                        </span>
                      </div>
                      <div className="field-row">
                        <label htmlFor="birthday">
                          {t('profilePage.birthday')}
                          :
                        </label>
                        <span className="birthday">
                          {req.patient.date_of_birth}
                        </span>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="btn accept-btn"
                        onClick={() => handleAccept(req.patient.id)}
                      >
                        <img src={AcceptIcon} alt={t('alt.acceptButton')} />
                      </button>
                      <button
                        className="btn reject-btn"
                        onClick={() => handleReject(req.patient.id)}
                      >
                        <img src={RejectIcon} alt={t('alt.rejectButton')} />
                      </button>
                    </div>
                  </div>
                ))
              )}
        </div>
      </div>
    </div>
  )
}

export default PatientRequestModal
