import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../slices/modalsSlice.js'
import CloseIcon from '../../assets/images/Close.svg'
import { addOrUpdateNote } from '../../slices/notesSlice.js'
import SubmitButton from '../ui/SubmitButton.jsx'
import { useEffect, useState } from 'react'

const NewNoteModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [intensity, setIntensity] = useState(0)
  const [painType, setPainType] = useState('')
  const [medicine, setMedicine] = useState(false)
  const selectedBodyPart = useSelector(state => state.modalsReducer.selectedBodyPart)
  const note = useSelector(state => state.notesReducer.notes.find(n => n.bodyPartPk === selectedBodyPart.pk))

  useEffect(() => {
    if (note) {
      setIntensity(note.intensity ?? 0)
      setPainType(note.painType ?? '')
      setMedicine(typeof note.medicine === 'boolean' ? note.medicine : false)
    }
    else {
      // Сбросить значения, если заметка отсутствует
      setIntensity(0)
      setPainType('')
    }
  }, [note?.bodyPartPk])

  // const isDataValid = intensity !== null && painType !== ''

  const handleSubmit = (e) => {
    e.preventDefault()

    // if (!isDataValid) return

    dispatch(addOrUpdateNote({
      bodyPartPk: selectedBodyPart.pk,
      bodyPartName: selectedBodyPart.name,
      intensity,
      painType,
      medicine,
    }))
    // console.log('painIntensity', painIntensity, 'painType', painType, 'medicine', medicine)
    // console.log('note', note)
    dispatch(closeModal())
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  return (
    <div className="modal-overlay new-note-modal">
      <div className="modal-window">
        <div className="modal-header">
          <h2 className="modal-title">{selectedBodyPart.name}</h2>
          <button
            className="modal-close"
            onClick={handleCloseModal}
          >
            <img src={CloseIcon} alt={t('alt.closeModal')} />
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="pain-form">
            <fieldset>
              <legend>{t('modals.painPower')}</legend>
              <div className="slider-wrapper">
                <input
                  type="range"
                  className="range"
                  id="pain-intensity"
                  name="pain-intensity"
                  min="0"
                  max="10"
                  step="1"
                  value={intensity}
                  onChange={e => setIntensity(Number(e.target.value))}
                />
                <div className="fill"></div>
                <span className="slider-value">{intensity}</span>
              </div>
            </fieldset>

            <fieldset>
              <label htmlFor="pain-type">{t('modals.painType')}</label>
              <select
                name="pain-type"
                id="pain-type"
                value={painType}
                onChange={e => setPainType(e.target.value)}
              >
                <option value="">{t('modals.choose')}</option>
                <option value="burning">{t('modals.painTypes.burning')}</option>
                <option value="stabbing">{t('modals.painTypes.stabbing')}</option>
                <option value="cutting">{t('modals.painTypes.cutting')}</option>
                <option value="throbbing">{t('modals.painTypes.throbbing')}</option>
              </select>
            </fieldset>

            <fieldset className="form-group toggle-group">
              <legend className="toggle-label">{t('modals.isMedicine')}</legend>
              <div className="toggle-button-group" role="radiogroup" aria-label={t('modals.isMedicine')}>
                <label className={`toggle-radio-button ${medicine === true ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="medicine"
                    value="true"
                    checked={medicine === true}
                    onChange={() => setMedicine(true)}
                  />
                  {t('yes')}
                </label>
                <label className={`toggle-radio-button ${medicine === false ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="medicine"
                    value="false"
                    checked={medicine === false}
                    onChange={() => setMedicine(false)}
                  />
                  {t('no')}
                </label>
              </div>
            </fieldset>

            <SubmitButton title={t('save')} />
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewNoteModal
