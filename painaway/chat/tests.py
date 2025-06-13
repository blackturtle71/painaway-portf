import json
from channels.testing import WebsocketCommunicator
from channels.db import database_sync_to_async
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.urls import reverse
from painaway.asgi import application
from .models import Message
from asgiref.sync import sync_to_async
import asyncio

User = get_user_model()

class ChatTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123'
        )
        
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)

        self.lobby_url = reverse('lobby-view')
        self.convo_url = reverse('chat-view', kwargs={'peer_username': self.user2.username})
        self.delete_convo_url = reverse('delete-history', kwargs={'peer_username': self.user2.username})
        self.delete_convo_url_wrong_user = reverse('delete-history', kwargs={'peer_username': 'gibberish'})
    
    def authenticate(self, user):
        if user == self.user1:
            self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1.key}')
        else:
            self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token2.key}')

    async def test_websocket_connect_valid_token(self):
        communicator = WebsocketCommunicator(application,
                                             f"ws/chat/{self.user2.username}/?token={self.token1.key}")
        connected, _ = await communicator.connect()
        self.assertTrue(connected)
        await communicator.disconnect()

    async def test_websocket_connect_invalid_token(self):
        communicator = WebsocketCommunicator(application,
                                             f"ws/chat/{self.user2.username}/?token=gibberish")
        connected, _ = await communicator.connect()
        self.assertFalse(connected)

    async def test_websocket_message_exchange(self):
        communicator1 = WebsocketCommunicator(application,
                                             f"ws/chat/{self.user2.username}/?token={self.token1.key}")
        await communicator1.connect()

        communicator2 = WebsocketCommunicator(application,
                                             f"ws/chat/{self.user1.username}/?token={self.token2.key}")
        await communicator2.connect()

        await communicator1.send_json_to({"message": "sup"})

        response = await communicator2.receive_json_from()

        self.assertEqual(response["message"], "sup")
        self.assertEqual(response['sender'], self.user1.username)


        await communicator1.disconnect()
        await communicator2.disconnect()

    def test_delete_message_history(self):
        Message.objects.create(sender=self.user1, receiver=self.user2, content='sup')
        self.authenticate(user=self.user1)

        response = self.client.delete(self.delete_convo_url)
        self.assertEqual(response.status_code, 204)
    
    def test_delete_message_history_wrong_user(self):
        Message.objects.create(sender=self.user1, receiver=self.user2, content='sup')
        self.authenticate(user=self.user1)

        response = self.client.delete(self.delete_convo_url_wrong_user)
        self.assertEqual(response.status_code, 400)

    def test_lobby(self):
        Message.objects.create(sender=self.user1, receiver=self.user2, content='sup')
        Message.objects.create(sender=self.user1, receiver=self.user2, content='second message')
        self.authenticate(user=self.user1)
        response = self.client.get(self.lobby_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['unique_peers'], ['user2'])

    def test_lobby_user_search(self):
        self.authenticate(user=self.user1)
        response = self.client.post(self.lobby_url, data={'peer_username': 'user2'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['chat_url'], '/api/chat/conversations/user2/')

    def test_lobby_invalid_user_search(self):
        self.authenticate(user=self.user1)
        response = self.client.post(self.lobby_url, data={'peer_username': ''})
        self.assertEqual(response.status_code, 400)
        response = self.client.post(self.lobby_url, data={'peer_username': 'gibberish'})
        self.assertEqual(response.status_code, 400)
