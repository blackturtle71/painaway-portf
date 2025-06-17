import { useSelector } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Header from './Header.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import NotFound from './pages/NotFound.jsx'
import routes from '../routes.js'

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.auth.token)

  return token ? children : <Navigate to="/login" replace />
}

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={routes.chatPath()} replace />} />
        <Route
          path={routes.chatPath()}
          element={(
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          )}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
)

export default App
