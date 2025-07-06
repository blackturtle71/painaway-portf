import { useTranslation } from 'react-i18next'
import SubmitButton from '../ui/SubmitButton'

const DocForm = ({ values }) => {
  const { t } = useTranslation()
  const { formik, doctor } = values
  const buttonProps = {
    formik,
    buttonTitle: t('profilePage.attachButton'),
  }

  return (
    <div className="attach-doctor-form">
      <div className="physician-field">
        <span className="field-label">
          {t('profilePage.doctor')}
          :
        </span>
        <span className="field-value">{doctor}</span>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="attach-field">
          <div className="form-group">
            <label htmlFor="doctorLogin" className="sr-only">{t('form.placeholders.getDoctor')}</label>
            <input
              id="doctorLogin"
              name="doctorLogin"
              type="text"
              className="form-input"
              placeholder={t('form.placeholders.getDoctor')}
              value={formik.values.doctorLogin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <SubmitButton values={buttonProps} />
        </div>
      </form>
    </div>
  )
}

export default DocForm
