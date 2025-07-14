import { useTranslation } from 'react-i18next'
import SubmitButton from '../ui/SubmitButton'
import InputField from './InputField'

const DocForm = ({ values }) => {
  const { t } = useTranslation()
  const { formik, doctor } = values

  return (
    <section className="attach-doctor-form">
      <dl>
        <div className="physician-field">
          <dt className="field-label">
            {t('profilePage.doctor')}
            :
          </dt>
          <dd className="field-value">{doctor}</dd>
        </div>
      </dl>

      <form onSubmit={formik.handleSubmit}>
        <div className="attach-field">
          <InputField
            name="doctorLogin"
            placeholder={t('form.placeholders.getDoctor')}
            value={formik.values.doctorLogin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.doctorLogin}
            touched={formik.touched.doctorLogin}
            showLabel={false}
            disabled={formik.isSubmitting}
          />
          <SubmitButton
            title={t('profilePage.attachButton')}
            onclick={formik.isSubmitting}
          />
        </div>
      </form>
    </section>
  )
}

export default DocForm
