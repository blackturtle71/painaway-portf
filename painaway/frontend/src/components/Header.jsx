import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../assets/images/Logo.png'
import bell from '../assets/images/Notifications.png'
import { uiRoutes } from '../routes'

const Header = () => {
  const { t } = useTranslation()

  return (
    <header className="pain-header">
      <div className="container">
        <a href="#" className="logo">
          <img src={Logo} width="270" height="60" alt={t('alt.logo')} />
        </a>

        <nav id="main-navbar" className="main-nav">
          <ul>
            <li>
              <NavLink
                to={uiRoutes.dairy()}
                className={({ isActive }) => cn('nav-link', { active: isActive })}
              >
                {t('dairy')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={uiRoutes.profile()}
                className={({ isActive }) => cn('nav-link', { active: isActive })}
              >
                {t('profile')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="notifications">
          <img src={bell} width="32" height="32" alt={t('alt.notifications')} />
        </div>
      </div>
    </header>
  )
}

export default Header
