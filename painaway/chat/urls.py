from django.urls import path
from .views import ChatView, LobbyView, DeleteMessageHistory

urlpatterns = [
    path('conversations/<str:peer_username>/', ChatView.as_view(), name='chat-view'),
    path('conversations/', LobbyView.as_view(), name='lobby-view'),
    path('conversations/delete/<str:peer_username>/', DeleteMessageHistory.as_view(), name='delete-history')
]