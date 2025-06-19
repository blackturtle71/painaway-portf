import {
  Col,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useGetChatsQuery } from '../services/api/index'
import Chat from './Chat.jsx'

const Chats = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    data: chats,
    isLoading,
    isError,
  } = useGetChatsQuery()

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
    <Col>
      <div>
        <strong>{t('chats.dialogues')}</strong>
        <Button
          variant=""
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          aria-label={t('chats.addPatient')}
          onClick={() => dispatch()}
        >
          <i className="bi bi-plus-square" />
        </Button>
      </div>
      <ul>
        {chats.peers.map(peer => (
          <Chat key={peer.id} chat={peer} />
        ))}
      </ul>
    </Col>
  )
}

export default Chats
