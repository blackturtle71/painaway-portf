import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { uiRoutes } from '../../routes'
import { useGetBodyStatsQuery } from '../../services/api'
import { useDispatch } from 'react-redux'
import { openModal, setCurrentNote } from '../../slices/modalsSlice'
import { formatDateTime } from '../../helpers/dateUtils.js'
import Modal from '../modal/Modal'

const DiaryPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data = [] } = useGetBodyStatsQuery()
  console.log('Notes about pain', data)

  const handleNewNoteClick = () => {
    navigate(uiRoutes.newNote())
  }

  const handleOpenNoteClick = (note) => {
    console.log('note', note)
    dispatch(setCurrentNote(note))
    dispatch(openModal({ type: 'note' }))
  }

  return (
    <section className="diary-section">
      <div className="note-cards">
        {data.map(note => (
          <div
            key={note.id}
            className="note-card"
            onClick={() => handleOpenNoteClick(note)}
          >
            <div className="note-title">{`${t('diaryPage.noteFrom')} ${formatDateTime(note.date_recorded)}`}</div>
            <div className="note-content">
              <div className="field-row">
                <span className="field">
                  {t('diaryPage.painDegree')}
                  {': '}
                </span>
                <span className="value">{note.intensity}</span>
              </div>
              <div className="field-row">
                <span className="field">
                  {t('diaryPage.painType')}
                  {': '}
                </span>
                <span className="value">{t(`painTypes.${note.pain_type}`)}</span>
              </div>
              <div className="field-row">
                <span className="field">
                  {t('diaryPage.isMedicine')}
                  {': '}
                </span>
                <span className="value">{t(`${note.tookPrescription}`)}</span>
              </div>
            </div>
          </div>
        ))}
        <aside className="new-requests">
          <button
            className="new-note-button"
            onClick={handleNewNoteClick}
          >
            {t('diaryPage.addNote')}
          </button>
        </aside>
      </div>
      <Modal />
    </section>
  )
}

export default DiaryPage
