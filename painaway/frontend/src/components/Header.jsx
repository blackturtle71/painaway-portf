import { useDispatch, useSelector } from 'react-redux'
import { clearLocalStorage } from '../slices/authSlice'
import { useTranslation } from 'react-i18next'
import Logo from '../assets/images/Logo.png'
import bell from '../assets/images/Notifications.png'
import Navigation from './ui/Navigation'
import { uiRoutes } from '../routes'
import { authApi } from '../services/api'

const AuthButton = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector(state => state.authReducer.token)

  const handleLogOut = () => {
    dispatch(clearLocalStorage())
    dispatch(authApi.util.invalidateTags(['Profile']))
  }

  const handleOpenNotification = () => {
    console.log('Open notification')
  }

  if (!token) return null

  return (
    <div className="group-btn">
      <button
        className="notification-btn"
        onClick={handleOpenNotification}
        aria-label={t('alt.notification')}
      >
        <img src={bell} width="32" height="32" alt={t('alt.notifications')} />
      </button>
      <button className="logout-btn" onClick={handleLogOut}>{t('exit')}</button>
    </div>
  )
}

const Header = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.authReducer.user)
  const isDoctor = user?.groups?.includes('Doctor')

  const propsNavigation = isDoctor
    ? [
        { to: uiRoutes.patients(), label: t('patients') },
        { to: uiRoutes.profile(), label: t('profile') },
      ]
    : [
        { to: uiRoutes.dairy(), label: t('dairy') },
        { to: uiRoutes.profile(), label: t('profile') },
      ]

  return (
    <header className="pain-header">
      <div className="container">
        <a href="#" className="logo">
          <img src={Logo} width="270" height="60" alt={t('alt.logo')} />
        </a>

        <Navigation links={propsNavigation} />

        <div className="auth-control" role="region" aria-label={t('alt.authControls')}>
          <AuthButton />
        </div>
      </div>
    </header>
  )
}

export default Header
