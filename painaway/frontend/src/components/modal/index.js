import PatientRequestModal from './PatientRequestModal.jsx'
import NewNoteModal from './NewNoteModal.jsx'
import NoteModal from './NoteModal.jsx'
import ChangeModal from './ChangeModal.jsx'
import NotificationsModal from './NotificationsModal.jsx'

const modals = {
  linkRequest: PatientRequestModal,
  newNote: NewNoteModal,
  note: NoteModal,
  change: ChangeModal,
  notifications: NotificationsModal,
}

export default modalType => modals[modalType]
