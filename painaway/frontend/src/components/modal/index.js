import PatientRequestModal from './PatientRequestModal.jsx'

const modals = {
  linkRequest: PatientRequestModal,
}

export default modalType => modals[modalType]
