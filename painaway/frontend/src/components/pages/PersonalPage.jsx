import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import {
  useGetLinksQuery,
  useGetProfileDataQuery,
  // useGetPrescriptionDataQuery,
  useSelectDoctorMutation,
} from '../../services/api'
import { setLinkId, setDoctor, setPrescription } from '../../slices/profileSlice'
import ProfileCard from '../ui/ProfileCard'
import DocForm from '../ui/DocForm'
import DocInfo from '../ui/DocInfo'

const PersonalPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // const linkId = useSelector(state => state.profileReducer.linkId)
  const doctor = useSelector(state => state.profileReducer.doctor)
  const prescription = useSelector(state => state.profileReducer.prescription)

  const { data: profileData, isLoading } = useGetProfileDataQuery()
  const { data: linksData, isSuccess } = useGetLinksQuery()
  // const {
  //  data: prescriptionsData,
  //   isSuccess: prescriptionSuccess,
  // } = useGetPrescriptionDataQuery(linkId, { skip: !linkId })

  const [selectDoctor] = useSelectDoctorMutation()
  console.log('ProfileData:', profileData)
  console.log('linksData:', linksData)
  // console.log(doctor)

  useEffect(() => {
    if (isSuccess) {
      const accepted = linksData.find(link => link.status === 'accepted')

      if (accepted) {
        dispatch(setLinkId(accepted.id))
        dispatch(setDoctor(accepted.doctor))
        dispatch(setPrescription(accepted.prescription))
      }
      else {
        dispatch(setDoctor(t('profilePage.notAssigned')))
        dispatch(setPrescription(t('profilePage.notAssigned')))
      }
    }
  }, [isSuccess])

  const formik = useFormik({
    initialValues: {
      doctorLogin: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await selectDoctor(values.doctorLogin).unwrap()
        console.log('ответ от сервера:', response)
        toast.success(t('success.attachment'))
        resetForm()
      }
      catch (err) {
        console.log(err)
      }
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const isDoctor = profileData.groups?.includes('Doctor')

  const profileProps = { profileData }
  const formProps = { formik, doctor }
  const infoProps = { doctor, prescription }

  return (
    <section className="personal-page">
      <div className="profile-section">
        <ProfileCard values={profileProps} />
      </div>

      {!isDoctor && (
        <div className="attending-physician">
          {doctor === t('profilePage.notAssigned') ? <DocForm values={formProps} /> : <DocInfo values={infoProps} />}
        </div>
      )}
    </section>
  )
}

export default PersonalPage
