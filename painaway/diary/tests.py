from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from authentication.models import CustomUser
from .models import Note, BodyStats, BodyPart
from rest_framework.authtoken.models import Token
from datetime import datetime

class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

class NotesViewTests(BaseAPITestCase):

    def test_create_note(self):
        url = reverse('notes-view')
        data = {'title': 'Test Note', 'body': 'Note content'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test Note')

    def test_get_notes(self):
        Note.objects.create(owner=self.user, title='Test 1', body='Body 1')
        response = self.client.get(reverse('notes-view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_note(self):
        note = Note.objects.create(owner=self.user, title='Old', body='Body')
        response = self.client.patch(reverse('notes-view'), {'note_pk': note.pk, 'title': 'New'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New')

    def test_patch_wrong_note(self):
        note = Note.objects.create(owner=self.user, title='Old', body='Body')
        response = self.client.patch(reverse('notes-view'), {'note_pk': 3, 'title': 'New'})
        self.assertEqual(response.status_code, 404)

    def test_delete_note(self):
        note = Note.objects.create(owner=self.user, title='Temp', body='To delete')
        response = self.client.delete(reverse('notes-view'), {'note_pk': note.pk})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_wrong_note(self):
        note = Note.objects.create(owner=self.user, title='Temp', body='To delete')
        response = self.client.delete(reverse('notes-view'), {'note_pk': 3})
        self.assertEqual(response.status_code, 404)

class BodyStatsViewTests(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.part = BodyPart.objects.create(name='Arm', translation='Arm')
        self.valid_data = {
            'body_part': self.part.id,
            'pain_type': 'burning',
            'intensity': 5,
            'description': 'Sharp pain'
        }

        self.invalid_data = {
            'body_part': 70,
            'pain_type': 'gibberish',
            'intensity': 30,
            'description': 'Sharp pain'
        }

    def test_create_bodystats(self):
        response = self.client.post(reverse('stats-view'), self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['pain_type'], 'burning')

    def test_create_bodystats(self):
        response = self.client.post(reverse('stats-view'), self.invalid_data)
        self.assertEqual(response.status_code, 400)
    
    def test_get_bodystats(self):
        BodyStats.objects.create(owner=self.user, body_part=self.part, pain_type='burning', intensity=5)
        response = self.client.get(reverse('stats-view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_bodystats(self):
        stat = BodyStats.objects.create(owner=self.user, body_part=self.part, pain_type='burning', intensity=5)
        response = self.client.patch(reverse('stats-view'), {'stat_pk': stat.pk, 'intensity': 8})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['intensity'], 8)

    def test_delete_bodystats(self):
        stat = BodyStats.objects.create(owner=self.user, body_part=self.part, pain_type='burning', intensity=5)
        response = self.client.delete(reverse('stats-view'), {'stat_pk': stat.pk})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class BodyPartsViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        BodyPart.objects.create(name='Head', translation='Head')

    def test_get_bodyparts(self):
        response = self.client.get(reverse('body-parts-view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Head')
