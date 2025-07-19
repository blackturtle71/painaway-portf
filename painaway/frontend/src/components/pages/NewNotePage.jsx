import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useSendBodyStatsMutation } from '../../services/api/notesApi.js'
import { clearNotes, setNoteText } from '../../slices/notesSlice.js'

import Human from '../ui/Human'
import Modal from '../modal/Modal'
import SubmitButton from '../ui/SubmitButton.jsx'
import { useEffect } from 'react'

const NewNotePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notesReducer.notes)
  console.log(notes)
  const noteText = useSelector(state => state.notesReducer.noteText)
  const [sendBodyStats] = useSendBodyStatsMutation()

  useEffect(() => {
    if (notes) {
      const bodyParts = notes.map(note => note.bodyPartName)
      console.log('Names bodyParts', bodyParts)
    }
  }, [notes])

  useEffect(() => {
    // При размонтировании страницы сбросить данные
    return () => {
      dispatch(clearNotes())
    }
  }, [dispatch])

  const isSubmitDisabled = notes.length === 0 || notes.some(note =>
    note.intensity === 0
    || note.painType === '',
  )

  const handleSubmit = async () => {
    for (const note of notes) {
      const payload = {
        bodyPartPk: note.bodyPartPk,
        painType: note.painType,
        intensity: note.intensity,
        description: noteText,
      }
      try {
        await sendBodyStats(payload).unwrap()
        dispatch(clearNotes())
      }
      catch (err) {
        console.error('Ошибка при отправке:', err)
      }
    }
  }

  return (
    <div className="new-note-container">
      <div className="new-note">
        <div className="human-container">
          <Human interactive={true} />
        </div>
        <div className="description-container">
          <div className="note">
            <label htmlFor="note">
              {t('note')}
              {': '}
            </label>
            <textarea
              name="note"
              id="note"
              value={noteText}
              onChange={e => dispatch(setNoteText(e.target.value))}
            />
          </div>
          <SubmitButton title={t('save')} onClick={handleSubmit} disabled={isSubmitDisabled} />
        </div>
        <Modal />
      </div>
    </div>
  )
}

export default NewNotePage
