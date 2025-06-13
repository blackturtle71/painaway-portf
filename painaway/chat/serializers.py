from rest_framework import serializers
from .models import Message
from authentication.serializers import UserSerializer
    
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['sender', 'receiver', 'content', 'timestamp']
        read_only_fields = ['sender', 'timestamp']

        
