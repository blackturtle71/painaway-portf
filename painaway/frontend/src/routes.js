export const apiBase = '/api/'

export const apiRoutes = {
  register: () => 'auth/register/',
  login: () => 'auth/login/',
  chats: () => '/chat/conversations/',
  chatWith: id => `/chat/conversations/${id}/`,
  deleteChatWith: peerId => `/chat/conversations/delete/${peerId}/`,
}

export const uiRoutes = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  chats: () => '/chat/conversations',
}
