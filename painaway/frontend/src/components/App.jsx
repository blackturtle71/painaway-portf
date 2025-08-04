import { useSelector } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Header from './Header.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PersonalPage from './pages/PersonalPage.jsx'
import PatientsPage from './pages/PatientsPage.jsx'
import DiaryPage from './pages/DiaryPage.jsx'
import NewNotePage from './pages/NewNotePage.jsx'
import PatientRecordsPage from './pages/PatientRecordsPage.jsx'
// import ChatPage from './pages/ChatPage.jsx'
import NotFound from './pages/NotFound.jsx'
import Modal from './modal/Modal'
import { uiRoutes } from '../routes.js'

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.authReducer.token)

  return token ? children : <Navigate to={uiRoutes.login()} replace />
}

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Header />
      <main>
        <Routes>
          <Route
            path={uiRoutes.profile()}
            element={(
              <PrivateRoute>
                <PersonalPage />
              </PrivateRoute>
            )}
          />
          <Route
            path={uiRoutes.patients()}
            element={(
              <PrivateRoute>
                <PatientsPage />
              </PrivateRoute>
            )}
          />
          <Route
            path={uiRoutes.diary()}
            element={(
              <PrivateRoute>
                <DiaryPage />
              </PrivateRoute>
            )}
          />
          <Route
            path={uiRoutes.newNote()}
            element={(
              <PrivateRoute>
                <NewNotePage />
              </PrivateRoute>
            )}
          />
          <Route
            path="/patient_card/:patientId"
            element={(
              <PrivateRoute>
                <PatientRecordsPage />
              </PrivateRoute>
            )}
          />
          <Route path={uiRoutes.register()} element={<RegisterPage />} />
          <Route path={uiRoutes.login()} element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={4000} />
      </main>
      <Modal />
    </div>
  </BrowserRouter>
)

export default App
