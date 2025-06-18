from django.urls import path
from .views import ChatView, LobbyView, DeleteMessageHistory

urlpatterns = [
    path('conversations/<int:peer_id>/', ChatView.as_view(), name='chat-view'),
    path('conversations/', LobbyView.as_view(), name='lobby-view'),
    path('conversations/delete/<int:peer_id>/', DeleteMessageHistory.as_view(), name='delete-history')
]