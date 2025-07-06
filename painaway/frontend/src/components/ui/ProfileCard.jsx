import { useTranslation } from 'react-i18next'

const profileCard = (props) => {
  const { t } = useTranslation()
  const { values } = props
  const { profileData } = values

  return (
    <div className="profile-card">
      <div className="profile-field">
        <span className="field-label">
          {t('profilePage.fullName')}
          :
        </span>
        <span className="field-value">
          {profileData.last_name}
          {' '}
          {profileData.first_name}
          {' '}
          {profileData.father_name}
        </span>
      </div>
      <div className="profile-field">
        <span className="field-label">
          {t('profilePage.sex')}
          :
        </span>
        <span className="field-value">{profileData.sex}</span>
      </div>
      <div className="profile-field birthday">
        <span className="field-label">
          {t('profilePage.birthday')}
          :
        </span>
        <span className="field-value">{profileData.date_of_birth}</span>
      </div>
      <div className="profile-field email">
        <span className="field-label">
          {t('profilePage.email')}
          :
        </span>
        <span className="field-value">{profileData.email}</span>
      </div>
      <div className="profile-field login">
        <span className="field-label">
          {t('profilePage.login')}
          :
        </span>
        <span className="field-value">{profileData.username}</span>
      </div>
    </div>
  )
}

export default profileCard
