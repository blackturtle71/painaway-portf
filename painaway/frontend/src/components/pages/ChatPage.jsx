import { Container, Row } from 'react-bootstrap'
import Chats from '../Chats.jsx'
// import Messages from '../Messages.jsx'

const ChatPage = () => (
  <Container className="h-100 my-4 overflow-hidden rounded shadow">
    <Row className="h-100 bg-white flex-md-row">
      <Chats />
    </Row>
  </Container>
)

export default ChatPage
