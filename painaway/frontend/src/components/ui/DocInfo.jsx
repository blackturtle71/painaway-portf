import { useTranslation } from 'react-i18next'

const DocInfo = (props) => {
  const { t } = useTranslation()
  const { values } = props
  const { doctor, treatment } = values

  return (
    <div className="doctor-info">
      <div className="physician-field">
        <span className="field-label">
          {t('profilePage.doctor')}
          :
        </span>
        <span className="field-value">{doctor}</span>
      </div>
      <div className="physician-field">
        <span className="field-label">
          {t('profilePage.treatment')}
          :
        </span>
        <span className="field-value">{treatment}</span>
      </div>
    </div>
  )
}

export default DocInfo
