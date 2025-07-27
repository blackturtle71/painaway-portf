import PatientRequestModal from './PatientRequestModal.jsx'
import NewNoteModal from './NewNoteModal.jsx'
import NoteModal from './NoteModal.jsx'
import ChangeModal from './ChangeModal.jsx'

const modals = {
  linkRequest: PatientRequestModal,
  newNote: NewNoteModal,
  note: NoteModal,
  change: ChangeModal,
}

export default modalType => modals[modalType]
