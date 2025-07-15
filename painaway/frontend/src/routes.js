export const apiBase = '/api/'

export const apiRoutes = {
  register: () => 'auth/register/',
  login: () => 'auth/login/',
  chats: () => '/chat/conversations/',
  chatWith: id => `/chat/conversations/${id}/`,
  deleteMessagesWith: peerId => `/chat/conversations/delete/${peerId}/`,
  profileData: () => 'auth/profile/',
  linksData: () => '/diary/list_links/',
  diagnosisData: linkId => `/diary/diagnosis/?link_id=${linkId}/`,
  prescriptionData: linkId => `/diary/prescription/?link_id=${linkId}/`,
  selectDoctor: () => '/diary/link_doc/',
  respondToLinkRequest: () => '/diary/doc_respond/',
}

export const uiRoutes = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  dairy: () => '/dairy',
  patients: () => '/patients',
  profile: () => '/profile',
  chats: () => '/chat/conversations',
}
