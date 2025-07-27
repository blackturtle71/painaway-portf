import { useTranslation } from 'react-i18next'

const DocInfo = (props) => {
  const { t } = useTranslation()
  const { values } = props
  const { doctor, prescription } = values
  console.log('Doctor Information:', doctor)
  console.log('Prescription Information:', prescription)

  return (
    <section className="doctor-info">
      <dl>
        <div className="physician-field">
          <dt className="field-label">
            {t('profilePage.doctor')}
            :
          </dt>
          <dd className="filed-label">
            {doctor.last_name}
            {' '}
            {doctor.first_name}
            {' '}
            {doctor.father_name}
          </dd>
        </div>
      </dl>

      <dl>
        <div className="physician-field">
          <dt className="field-label">
            {t('profilePage.treatment')}
            :
          </dt>
          <dd className="filed-label">{prescription?.prescription}</dd>
        </div>
      </dl>
    </section>
  )
}

export default DocInfo
