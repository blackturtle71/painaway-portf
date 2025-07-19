export const apiBase = '/api/'

export const apiRoutes = {
  register: () => 'auth/register/',
  login: () => 'auth/login/',
  chats: () => '/chat/conversations/',
  chatWith: id => `/chat/conversations/${id}/`,
  deleteMessagesWith: peerId => `/chat/conversations/delete/${peerId}/`,
  profileData: () => 'auth/profile/',
  linksData: () => '/diary/list_links/',
  diagnosisData: linkId => `/diary/diagnosis/?link_id=${linkId}`,
  prescriptionData: linkId => `/diary/prescription/?link_id=${linkId}`,
  selectDoctor: () => '/diary/link_doc/',
  respondToLinkRequest: () => 'diary/doc_respond/',
  bodyStats: () => 'diary/stats/',
  bodyPartObjects: () => 'diary/bodyparts/',
}

export const uiRoutes = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  diary: () => '/diary',
  newNote: () => '/diary/new_record',
  patients: () => '/patients',
  profile: () => '/profile',
  chats: () => '/chat/conversations',
}
