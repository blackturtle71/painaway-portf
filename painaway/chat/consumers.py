import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db import models
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from .models import Message
from django.shortcuts import get_object_or_404
from authentication.models import CustomUser

# is this the best consumer ever? fuck no, but it works, and I won't touch this piece of crap ever again
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
        self.peer_name = self.scope['url_route']['kwargs']['peer']
        
        self.peer = await self.get_user_by_username(self.peer_name)
        
        if not self.user or not self.peer or self.peer  == self.user:
            self.room_group_name = 'disconnect'
            await self.close()

        try:
            self.sender = self.user.username
            usernames = sorted([self.sender, self.peer.username])
            self.room_group_name = f'private_chat_{"_".join(usernames)}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            await self.send_message_history()
        except AttributeError: # if the peer doesn't exist self.peer.username throws this error
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
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

    async def send_message_history(self):
        # Load message history between the two users
        message_history = await self.get_message_history(self.user.id, self.peer.id)

        # Send the message history to the WebSocket
        async for message in message_history:
            #the dumbest fucking way to get this damn username
            sender = await self.get_user_from_message(message)
            await self.send(text_data=json.dumps({
                'message': message.content,
                'sender': sender,
                'timestamp': message.timestamp.isoformat(),
            }))

    @database_sync_to_async
    def get_user_by_username(self, username):
        try:
            return CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return None
        
    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(sender=sender, receiver=receiver, content=message)
    
    @database_sync_to_async
    def get_message_history(self, user, other_user):
        # Retrieve the message history between the two users
        return Message.objects.filter(
            (models.Q(sender=user) & models.Q(receiver=other_user)) |
            (models.Q(sender=other_user) & models.Q(receiver=user))
        ).order_by('timestamp')
    
    #this is indeed senile
    @sync_to_async
    def get_user_from_message(self, message):
        return message.sender.username