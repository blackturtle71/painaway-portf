import { formatDateTime } from '../../helpers/dateUtils'
import CloseIcon from '../../assets/images/Close.svg'
import { useTranslation } from 'react-i18next'
import { useDeleteNotificationMutation } from '../../services/api'

const NotificationCard = ({ data }) => {
  const { t } = useTranslation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const handleDeleteNotification = () => {
    deleteNotification(data.id)
  }

  return (
    <li className={`notification-card ${data.is_read ? 'read' : 'unread'}`}>
      <div className="notification-message-container">
        <div className="notification-message">{data.message}</div>
        <button className="notification-close" onClick={handleDeleteNotification}>
          <img src={CloseIcon} alt={t('alt.closeModal')} />
        </button>
      </div>
      <div className="notification-date">{formatDateTime(data.created_at)}</div>
    </li>
  )
}

export default NotificationCard
