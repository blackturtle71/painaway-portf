import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import {
  useGetDoctorQuery,
  useGetProfileDataQuery,
  // useGetPrescriptionDataQuery,
  useSelectDoctorMutation,
} from '../../services/api'
import { setLinkId, setDoctor, setTreatment } from '../../slices/profileSlice'
import ProfileCard from '../ui/ProfileCard'
import DocForm from '../ui/DocForm'
import DocInfo from '../ui/DocInfo'

const PersonalPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // const linkId = useSelector(state => state.profileReducer.linkId)
  const doctor = useSelector(state => state.profileReducer.doctor)
  const treatment = useSelector(state => state.profileReducer.treatment)

  const { data: profileData, isLoading } = useGetProfileDataQuery()
  const { data: linksData, isSuccess } = useGetDoctorQuery()
  // const {
  //  data: prescriptionsData,
  //   isSuccess: prescriptionSuccess,
  // } = useGetPrescriptionDataQuery(linkId, { skip: !linkId })

  const [selectDoctor] = useSelectDoctorMutation()
  // console.log(profileData)
  // console.log('linksData:', linksData)
  // console.log(doctor)

  useEffect(() => {
    if (isSuccess) {
      const accepted = linksData.find(link => link.status === 'accepted')

      if (accepted) {
        dispatch(setLinkId(accepted.id))
        dispatch(setDoctor(accepted.doctor))
      }
      else {
        dispatch(setDoctor(t('profilePage.notAssigned')))
        dispatch(setTreatment(t('profilePage.notAssigned')))
      }
    }
  }, [isSuccess])

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  const profileProps = { profileData }
  const formProps = { formik, doctor }
  const infoProps = { doctor, treatment }

  return (
    <div className="personal-page">
      <div className="profile-section">
        <ProfileCard values={profileProps} />
        <div className="attending-physician">
          {doctor === t('profilePage.notAssigned') ? <DocForm values={formProps} /> : <DocInfo values={infoProps} />}
        </div>
      </div>
    </div>
  )
}

export default PersonalPage
