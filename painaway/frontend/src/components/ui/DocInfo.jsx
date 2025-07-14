import { useTranslation } from 'react-i18next'

const DocInfo = (props) => {
  const { t } = useTranslation()
  const { values } = props
  const { doctor, treatment } = values

  return (
    <section className="doctor-info">
      <dl>
        <div className="physician-field">
          <dt className="field-label">
            {t('profilePage.doctor')}
            :
          </dt>
          <dd className="filed-label">{doctor}</dd>
        </div>
      </dl>

      <dl>
        <div className="physician-field">
          <dt className="field-label">
            {t('profilePage.treatment')}
            :
          </dt>
          <dd className="filed-label">{treatment}</dd>
        </div>
      </dl>
    </section>
  )
}

export default DocInfo
