import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import {
  useGetLinksQuery,
  useGetProfileDataQuery,
  // useGetPrescriptionDataQuery,
  useSelectDoctorMutation,
} from '../../services/api'
import ProfileCard from '../ui/ProfileCard'
import DocForm from '../ui/DocForm'
import DocInfo from '../ui/DocInfo'

const PersonalPage = () => {
  const { t } = useTranslation()

  const token = useSelector(state => state.authReducer.token)

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileDataQuery(undefined, { skip: !token })
  const { data: linksData = [], isLoading: isLinksLoading } = useGetLinksQuery()
  const [selectDoctor] = useSelectDoctorMutation()
  const acceptedLink = linksData.find(link => link.status === 'accepted')
  const doctor = acceptedLink?.doctor
  const prescription = acceptedLink?.prescription

  const formik = useFormik({
    initialValues: {
      doctorLogin: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await selectDoctor(values.doctorLogin).unwrap()
        toast.success(t('success.attachment'))
        resetForm()
      }
      catch (err) {
        console.log(err)
      }
    },
  })

  if (isProfileLoading || isLinksLoading) {
    return <div>Loading...</div>
  }

  const isDoctor = profileData.groups?.includes('Doctor')

  const profileProps = { profileData }
  const formProps = { formik, doctor: doctor ?? t('profilePage.notAssigned') }
  const infoProps = {
    doctor: doctor ?? t('profilePage.notAssigned'),
    prescription: prescription ?? t('profilePage.notAssigned'),
  }

  return (
    <section className="personal-page">
      <div className="profile-section">
        <ProfileCard values={profileProps} />
      </div>

      {!isDoctor && (
        <div className="attending-physician">
          {doctor?.id ? <DocInfo values={infoProps} /> : <DocForm values={formProps} />}
        </div>
      )}
    </section>
  )
}

export default PersonalPage
