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
import { uiRoutes } from '../routes.js'

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.authReducer.token)

  return token ? children : <Navigate to="/login" replace />
}

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Header />
      <Routes>
        <Route path={uiRoutes.home()} element={<Navigate to={uiRoutes.chats()} replace />} />
        <Route
          path={uiRoutes.chats()}
          element={(
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          )}
        />
        <Route path={uiRoutes.register()} element={<RegisterPage />} />
        <Route path={uiRoutes.login()} element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
)

export default App
