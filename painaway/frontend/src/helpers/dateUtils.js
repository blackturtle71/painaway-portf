export const formatDate = (isoDate) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('ru-RU')
}

export const formatTime = (isoDate) => {
  const formattedTime = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return formattedTime
}

export const formatDateTime = (isoDate) => {
  const date = new Date(isoDate)
  
  const formattedDate = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formattedTime = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${formattedDate} (${formattedTime})`
}

