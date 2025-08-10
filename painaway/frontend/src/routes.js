const isProd = import.meta.env.PROD;

export const apiBase = isProd ? 'https://blackturtle71.pythonanywhere.com/api/' : '/api/';

export const apiRoutes = {
  register: () => 'auth/register/',
  login: () => 'auth/login/',
  profileData: () => 'auth/profile/',

  chats: () => '/chat/conversations/',
  chatWith: id => `/chat/conversations/${id}/`,
  deleteMessagesWith: peerId => `/chat/conversations/delete/${peerId}/`,

  linksData: () => '/diary/list_links/',
  diagnosisData: linkId => `/diary/diagnosis/?link_id=${linkId}`,
  diagnosisById: diagnosisId => `/diary/diagnosis/?diagnosis_id=${diagnosisId}`,
  prescriptionData: linkId => `/diary/prescription/?link_id=${linkId}`,
  prescriptionById: prescriptionId => `/diary/prescription/?prescription_id=${prescriptionId}`,
  selectDoctor: () => '/diary/link_doc/',
  respondToLinkRequest: () => 'diary/doc_respond/',
  bodyStats: () => 'diary/stats/',
  patientRecords: patientId => `/diary/stats/?patient_id=${patientId}`,
  bodyPartObjects: () => 'diary/bodyparts/',
  notifications: () => 'diary/notifications/',
}

export const uiRoutes = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  diary: () => '/diary',
  newNote: () => '/diary/new_record',
  patients: () => '/patients',
  patientCard: patientId => `/patient_card/${patientId}`,
  profile: () => '/profile',
  chats: () => '/chat/conversations',
}
