import { useTranslation } from 'react-i18next'

const profileCard = (props) => {
  const { t } = useTranslation()
  const { values } = props
  const { profileData } = values

  return (
    <div className="profile-card">
      <dl>
        <dt className="field-label">
          {t('profilePage.fullName')}
          :
        </dt>
        <dd className="field-value">
          {profileData.last_name}
          {' '}
          {profileData.first_name}
          {' '}
          {profileData.father_name}
        </dd>

        <dt className="field-label">
          {t('profilePage.sex')}
          :
        </dt>
        <dd className="field-value">{t(`form.gender.${profileData.sex}`)}</dd>

        <dt className="field-label">
          {t('profilePage.birthday')}
          :
        </dt>
        <dd className="field-value">{profileData.date_of_birth}</dd>

        <dt className="field-label">
          {t('profilePage.email')}
          :
        </dt>
        <dd className="field-value">{profileData.email}</dd>

        <dt className="field-label">
          {t('profilePage.login')}
          :
        </dt>
        <dd className="field-value">{profileData.username}</dd>
      </dl>
    </div>
  )
}

export default profileCard
