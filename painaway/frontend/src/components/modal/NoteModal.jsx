import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '../../assets/images/Close.svg'
import { closeModal } from '../../slices/modalsSlice.js'
import Human from '../ui/Human.jsx'

const NoteModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentNote = useSelector(state => state.modalsReducer.currentNote)
  console.log('currentNote', currentNote)
  return (
    <div className="modal-overlay note-modal">
      <div className="modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{t('diaryPage.noteFrom')}</h2>
          <button
            className="modal-close"
            onClick={() => dispatch(closeModal())}
          >
            <img src={CloseIcon} alt={t('alt.closeModal')} />
          </button>
        </div>

        <div className="note-modal-content">
          <div className="human-container static-human">
            <Human interactive={false} currentNote={currentNote} />
          </div>
          <div className="pain-info">
            <div className="field-row">
              <span className="field">{t('diaryPage.painDegree')}</span>
              <span className="value">{currentNote.intensity}</span>
            </div>
            <div className="field-row">
              <span className="field">{t('diaryPage.painType')}</span>
              <span className="value">{t(`modals.painTypes.${currentNote.pain_type}`)}</span>
            </div>
            <div className="field-row">
              <span className="field">{t('diaryPage.isMedicine')}</span>
              <span className="value">Бэк не принимает</span>
            </div>
            <div className="field-row">
              <span className="field">{t('note')}</span>
              <span className="value">{currentNote.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteModal
