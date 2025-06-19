import {
  Button,
  ButtonGroup,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setActiveChat } from '../slices/chatsSlice'

const Chat = ({ peer }) => {
  const { t } = useTranslation
  const dispatch = useDispatch()
  const activeChatId = useSelector(state => state.chatsReducer.activeChatId)
  const isActive = peer.id === activeChatId

  const handleClick = () => {
    dispatch(setActiveChat(peer.id))
  }

  const handleDeleteDialogue = () => {

  }

  return (
    <li key={peer.id} className="nav-item w-100">
      <ButtonGroup className="d-flex show">
        <Button
          id={peer.id}
          variant={isActive ? 'secondary' : 'light'}
          className="w-100 rounded-0 text-start text-truncate btn"
          onClick={() => handleClick(peer.id)}
        >
          {peer.username}
        </Button>
        <Button
          id={peer.id}
          variant=""
          type="button"
          className=""
          aria-label={t('chats.deleteDialogue')}
          onClick={() => handleDeleteDialogue(peer.id)}
        >
          <i className="bi bi-x-circle" />
        </Button>
      </ButtonGroup>
    </li>
  )
}

export default Chat
