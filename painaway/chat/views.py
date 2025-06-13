from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from authentication.models import CustomUser
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Case, When, Value
from channels.db import database_sync_to_async
from django.urls import reverse
    
class ChatView(APIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, peer_username):
        peer = get_object_or_404(CustomUser, username=peer_username)
        messages = Message.objects.filter(
            models.Q(sender=request.user, receiver=peer) | models.Q(sender=peer, receiver=request.user)
        ).order_by('-timestamp')
        serializer = self.serializer_class(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LobbyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        peers = Message.objects.filter(
            models.Q(sender=request.user) | 
            models.Q(receiver=request.user)
        ).annotate(
            peer=Case(
                When(sender=request.user, then='receiver__username'),
                When(receiver=request.user, then='sender__username')
            )
        ).values_list('peer', flat=True)
        peers = set(peers) # get unique peers
        return Response({'unique_peers': peers}, status=status.HTTP_200_OK)
    
    def post(self, request):
        peer_username = request.data.get('peer_username')
        if not peer_username:
            return Response({'error': 'peer_username is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            peer = CustomUser.objects.get(username=peer_username)
            chat_url = reverse('chat-view', kwargs={'peer_username': peer.username})
        except CustomUser.DoesNotExist:
            return Response({'error': 'Peer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': "Move your frontend ass over there",'chat_url': chat_url}, status=status.HTTP_200_OK)
    
class DeleteMessageHistory(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, peer_username):
        user = request.user
        try:
            peer_pk = CustomUser.objects.get(username=peer_username).id
            messages = Message.objects.filter(sender=user, receiver=peer_pk)
            messages.delete()
        except CustomUser.DoesNotExist:
            return Response({'error': 'Peer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
        