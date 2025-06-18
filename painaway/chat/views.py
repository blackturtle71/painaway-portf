from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from authentication.models import CustomUser
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Case, When
from django.urls import reverse

class ChatView(APIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, peer_id):
        peer = get_object_or_404(CustomUser, id=peer_id)
        messages = Message.objects.filter(
            models.Q(sender=request.user, receiver=peer) | 
            models.Q(sender=peer, receiver=request.user)
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
            peer_id=Case(
                When(sender=request.user, then='receiver'),
                When(receiver=request.user, then='sender')
            ),
            peer_username=Case(
                When(sender=request.user, then='receiver__username'),
                When(receiver=request.user, then='sender__username')
            )
        ).values('peer_id', 'peer_username')

        # get unique peers; we could use .distinct('peer_id'), but sqlite doesn't support it, might change later
        unique_peers = {
            p['peer_id']: {
                'id': p['peer_id'],
                'username': p['peer_username']
            } for p in peers
        }.values()

        return Response({
            'peers': list(unique_peers)
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        peer_id = request.data.get('peer_id')
        if not peer_id:
            return Response({'error': 'peer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            peer = CustomUser.objects.get(id=peer_id)
            chat_url = reverse('chat-view', kwargs={'peer_id': peer.id})
        except CustomUser.DoesNotExist:
            return Response({'error': 'Peer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': "Redirect to chat",
            'chat_url': chat_url
        }, status=status.HTTP_200_OK)

class DeleteMessageHistory(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, peer_id):
        user = request.user
        peer = get_object_or_404(CustomUser, id=peer_id)
        
        Message.objects.filter(
            (models.Q(sender=user) & models.Q(receiver=peer)) |
            (models.Q(sender=peer) & models.Q(receiver=user))
        ).delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)