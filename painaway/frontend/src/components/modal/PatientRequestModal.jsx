import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useGetLinksQuery } from '../../services/api/index.js'
import CloseIcon from '../../assets/images/Close.svg'
import { closeModal } from '../../slices/modalsSlice.js'
import RequestCard from '../ui/RequestCard.jsx'

const PatientRequestModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { data: linksData } = useGetLinksQuery()
  const requests = linksData?.filter(link => link.status === 'pending') || []
  console.log('linksData', linksData)

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
                  <RequestCard key={req.id} request={req} />
                ))
              )}
        </div>
      </div>
    </div>
  )
}

export default PatientRequestModal
