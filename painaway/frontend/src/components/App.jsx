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
import PersonalPage from './pages/PersonalPage.jsx'
// import ChatPage from './pages/ChatPage.jsx'
import NotFound from './pages/NotFound.jsx'
import { uiRoutes } from '../routes.js'

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.authReducer.token)

  return token ? children : <Navigate to={uiRoutes.login()} replace />
}

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Header />
      <Routes>
        <Route
          path={uiRoutes.profile()}
          element={(
            <PrivateRoute>
              <PersonalPage />
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
