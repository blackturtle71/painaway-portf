import { useGetPatientRecordsQuery } from '../../services/api/linksApi'

const NumberOfNewRecords = ({ patientId }) => {
  const { data: records = [], isLoading: isLoadingRecords } = useGetPatientRecordsQuery(Number(patientId), {
    skip: !patientId,
  })

  if (isLoadingRecords) {
    return <div>Загрузка записей...</div>
  }

  return (
    <span className="new-entries">{records.length}</span>
  )
}

export default NumberOfNewRecords
