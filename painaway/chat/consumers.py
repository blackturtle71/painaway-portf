import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db import models
from rest_framework.authtoken.models import Token
from .models import Message
from authentication.models import CustomUser

class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user_from_token(self, token_key):
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return None

    async def connect(self):
        token_key = self.scope['query_string'].decode().split('=')[1]
        self.user = await self.get_user_from_token(token_key)
        self.peer_id = self.scope['url_route']['kwargs']['peer_id']
        
        self.peer = await self.get_user_by_id(self.peer_id)
        
        if not self.user or not self.peer or self.peer.id == self.user.id:
            self.room_group_name = 'disconnect'
            await self.close()

        try:
            self.sender = self.user.id  # Now using ID instead of username
            user_ids = sorted([str(self.sender), str(self.peer.id)])
            self.room_group_name = f'private_chat_{"_".join(user_ids)}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            await self.send_message_history()
        except AttributeError: # if the peer doesn't exist self.peer.id throws this error
            self.room_group_name = 'disconnect'
            await self.close()
            
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message,
                'sender':self.sender
            }
        )
        await self.save_message(self.user, self.peer, message)

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender_id
        }))

    async def send_message_history(self):
        # Load message history between the two users
        message_history = await self.get_message_history(self.user.id, self.peer.id)

        # Send the message history to the WebSocket
        async for message in message_history:
            await self.send(text_data=json.dumps({
                'message': message.content,
                'sender': message.sender_id,
                'timestamp': message.timestamp.isoformat(),
            }))

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None
        
    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(sender=sender, receiver=receiver, content=message)
    
    @database_sync_to_async
    def get_message_history(self, user_id, other_user_id):
        # Retrieve the message history between the two users
        return Message.objects.filter(
            (models.Q(sender=user_id) & models.Q(receiver=other_user_id)) |
            (models.Q(sender=other_user_id) & models.Q(receiver=user_id))
        ).order_by('timestamp')