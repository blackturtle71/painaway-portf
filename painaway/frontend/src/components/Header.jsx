import {
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { Button, Navbar, Nav, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { clearLocalStorage } from '../slices/authSlice'

const AuthButton = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const token = useSelector(state => state.auth.token)

  const handleLogOut = () => {
    dispatch(clearLocalStorage())
  }

  return (
    token
      ? <Button onClick={handleLogOut}>Выйти</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>Войти</Button>
  )
}

const RegisterButton = () => {
  const token = useSelector(state => state.auth.token)

  if (token) return null

  return (
    <Button as={Link} to="/register" variant="outline-primary" className="bi bi-person">Регистрация</Button>
  )
}

const Header = () => (
  <>
    <Navbar bg="light" expand="lg" className="pain-header sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">БОЛИ.НЕТ</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/about">О нас</Nav.Link>
            <Nav.Link as={Link} to="/contacts">Контакты</Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            <RegisterButton />
            <AuthButton />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />
  </>
)

export default Header
