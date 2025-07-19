import PatientRequestModal from './PatientRequestModal.jsx'
import NewNoteModal from './NewNoteModal.jsx'
import NoteModal from './NoteModal.jsx'

const modals = {
  linkRequest: PatientRequestModal,
  newNote: NewNoteModal,
  note: NoteModal,
}

export default modalType => modals[modalType]
