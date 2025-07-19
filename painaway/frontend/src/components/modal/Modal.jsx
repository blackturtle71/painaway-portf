import { useSelector } from 'react-redux'
import getModalComponent from './index.js'

const Modal = () => {
  const { isShown, type } = useSelector(state => state.modalsReducer.modals)

  if (!isShown || type === '') {
    return null
  }
  const ModalComponent = getModalComponent(type)
  return <ModalComponent />
}

export default Modal
