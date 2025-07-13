import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import cn from 'classnames'

const Navigation = ({ links }) => {
  const { t } = useTranslation()

  return (
    <nav id="main-navbar" className="main-nav" role="navigation" aria-label={t('alt.mainNav')}>
      <ul>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => cn('nav-link', { active: isActive })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
