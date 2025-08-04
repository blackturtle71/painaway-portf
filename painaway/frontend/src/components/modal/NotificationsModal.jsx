import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../services/api/index.js'
import { closeModal } from '../../slices/modalsSlice'
import NotificationCard from '../ui/NotificationCard'
import CloseIcon from '../../assets/images/Close.svg'

const NotificationsModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector(state => state.authReducer.token)
  const [markNotificationRead] = useMarkNotificationReadMutation()
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, { skip: !token })

  const handleCloseModal = () => {
    const unread = notifications.filter(n => !n.is_read)
    unread.forEach(n => markNotificationRead(n.id))

    dispatch(closeModal())
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="notification-modal-overlay">
      <div className="notifications-modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{t('notifications')}</h2>
          <button
            className="modal-close"
            onClick={handleCloseModal}
          >
            <img src={CloseIcon} alt={t('alt.closeModal')} />
          </button>
        </div>
        <div className="notifications">
          <ul className="notifications-list">
            {notifications.map(n => (
              <NotificationCard key={n.id} data={n} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotificationsModal
