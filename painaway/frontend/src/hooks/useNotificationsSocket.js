import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from '../slices/notificationsSlice'

export const useNotificationsSocket = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.authReducer.token)

  useEffect(() => {
    if (!token) return

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`)

    socket.onopen = () => {
      console.log('WS connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('New notification', data)
      dispatch(addNotification(data))
    }

    socket.onerror = (error) => {
      console.log('WS error', error)
    }

    socket.onclose = () => {
      console.log('WS disconnected')
    }

    return () => socket.close()
  }, [token])
}
