import {
  Col,
  Spinner,
  Alert,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useGetMessagesQuery } from '../services/api'

const Messages = () => {
  const { t } = useTranslation()
  const currentUserId = useSelector(state => state.authReducer.user?.id)
  const activeChatId = useSelector(state => state.chatsReducer.activeChatId)

  if (!activeChatId) {
    return (
      <Col className="col p-0 h-100 d-flex justify-content-center align-items-center text-muted">
        <Alert variant="secondary">{t('chats.warning')}</Alert>
      </Col>
    )
  }

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useGetMessagesQuery(activeChatId, { skip: !activeChatId }) // activeChatId === peer.id cuz there is no unique chatId

  if (isLoading) {
    return (
      <Col className="col p-0 h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </Col>
    )
  }

  if (isError) {
    return (
      <Col className="col p-0 h-100 d-flex justify-content-center align-items-center text-danger">
        <Alert variant="danger">{t('errors.loadingError')}</Alert>
      </Col>
    )
  }

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto px-4 mb-2">
          {messages.map((msg) => {
            const isMine = msg.sender.id === currentUserId
            return (
              <div key={msg.id} className={`text-break mb-2 ${isMine ? 'text-end text-primary' : 'text-start'}`}>
                <strong>{isMine ? t('chats.you') : msg.sender.username}</strong>
                {`: ${msg.content}`}
              </div>
            )
          })}
        </div>
      </div>
    </Col>
  )
}

export default Messages
