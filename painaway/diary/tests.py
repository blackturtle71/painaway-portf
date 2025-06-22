from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from authentication.models import CustomUser
from django.contrib.auth.models import Group
from .models import BodyStats, BodyPart
from rest_framework.authtoken.models import Token
from datetime import datetime

class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpass', email='g@g.com', phone_number='4654566')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.patient_id = self.user.id

        self.doc = CustomUser.objects.create_user(username='doc', password='testpass', email='d@g.com', phone_number='32231321')
        self.doc_token = Token.objects.create(user=self.doc)
        self.doc.groups.set([Group.objects.get(name='Doctor')])
    
    def auth_doc(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.doc_token.key)

class LinkTest(BaseAPITestCase):
    def test_send_request_to_doc(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], "Request sent")

    def test_send_request_to_patient(self):
        url = reverse('link-doc')
        data = {'doc_username': "testuser"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "user is not a doctor")

    def test_send_request_to_non_existent_user(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc2"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 404)
    
    def test_send_request_spam(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], "Request sent")
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "Request already exists")
    
    def test_accept_request(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], "Request sent")

        self.auth_doc()
        url = reverse('doc-respond')
        data = {'patient_id': self.patient_id, 'action': 'accept'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'],"Request accepted.")
    
    def test_accept_wrong_request(self):
        self.auth_doc()
        url = reverse('doc-respond')
        data = {'patient_id': 404, 'action': 'accept'}
        response = self.client.post(url, data)
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

    def test_view_foreign_bodystats(self):
        self.client.post(reverse('stats-view'), self.valid_data)
        response = self.client.get(reverse('stats-view') + '?patient_id=200')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['owner']['username'], 'testuser')
    
    def test_view_patient_bodystats(self):
        self.client.post(reverse('stats-view'), self.valid_data)
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        self.client.post(url, data)

        self.auth_doc()
        url = reverse('doc-respond')
        data = {'patient_id': self.patient_id, 'action': 'accept'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('stats-view') + f'?patient_id={self.patient_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['owner']['username'], 'testuser')

class BodyPartsViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        BodyPart.objects.create(name='Head', translation='Head')

    def test_get_bodyparts(self):
        response = self.client.get(reverse('body-parts-view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Head')
