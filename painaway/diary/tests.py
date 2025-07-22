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
        self.user = CustomUser.objects.create_user(username='testuser', password='testpass', email='g@g.com')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.patient_id = self.user.id

        self.doc = CustomUser.objects.create_user(username='doc', password='testpass', email='d@g.com')
        self.doc_token = Token.objects.create(user=self.doc)
        self.doc.groups.set([Group.objects.get(name='Doctor')])
        self.doc_id = self.doc.id
    
    def auth_doc(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.doc_token.key)

    def auth_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
    def create_link(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        self.client.post(url, data)

        self.auth_doc()
        url = reverse('doc-respond')
        data = {'patient_id': self.patient_id, 'action': 'accept'}
        self.client.post(url, data)

        response = self.client.get(reverse('list-links'))
        link_id = response.data[0]['id']
        return link_id

class LinkTests(BaseAPITestCase):
    def test_send_request_to_doc(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], "Request sent")

    def test_delete_request(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        self.client.post(url, data)
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 204)

    def test_delete_wrong_request(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        self.client.post(url, data)
        response = self.client.delete(url, {'doc_username': "doc2"})
        self.assertEqual(response.status_code, 404)

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

    def test_list_links_patient(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], "Request sent")

        response = self.client.get(reverse('list-links'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['status'], 'pending')

    def test_list_links_doctor(self):
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

        response = self.client.get(reverse('list-links'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['status'], 'accepted')

class PrescriptionTests(BaseAPITestCase):
    def test_get_prescription(self):
        link_id = self.create_link()

        response = self.client.get(reverse('prescription-view') + f"?link_id={link_id}")
        self.assertEqual(response.status_code, 200)
        
    def test_get_wrong_prescription(self):
        response = self.client.get(reverse('prescription-view') + f"?link_id=404")
        self.assertEqual(response.status_code, 404)

    def test_add_prescription(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['prescription'], 'Anti-stubby')

    def test_add_multi_prescription(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        data2 = {"link": link_id, "prescription": 'Anti-stubby2'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data2)
        self.assertEqual(response.status_code, 400)
    
    def test_add_wrong_prescription(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, 'details': 'Removes all the stub wounds'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 400)

    def test_add_patient_prescription(self):
        link_id = self.create_link()
        self.auth_patient()
        data = {"link": link_id,  "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 404)

    def test_patch_prescription(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['prescription'], 'Anti-stubby')

        prescription_id = response.data['id']
        data = {"prescription": 'Ointment'}
        response = self.client.patch(reverse('prescription-view') + f"?prescription_id={prescription_id}", data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['prescription'], 'Ointment')

    def test_delete_prescription(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['prescription'], 'Anti-stubby')

        prescription_id = response.data['id']
        response = self.client.delete(reverse('prescription-view') + f"?prescription_id={prescription_id}")
        self.assertEqual(response.status_code, 204)

class DiagnosisTests(BaseAPITestCase):
    def test_get_diagnosis(self):
        link_id = self.create_link()

        response = self.client.get(reverse('diagnosis-view') + f"?link_id={link_id}")
        self.assertEqual(response.status_code, 200)
        
    def test_get_wrong_diagnosis(self):
        response = self.client.get(reverse('diagnosis-view') + f"?link_id=404")
        self.assertEqual(response.status_code, 404)

    def test_add_diagnosis(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "diagnosis": 'DumbFuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['diagnosis'], 'DumbFuck')

    def test_add_multi_diagnosis(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "diagnosis": 'DumbFuck'}
        data2 = {"link": link_id, "diagnosis": 'EvenDumberFuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data2)
        self.assertEqual(response.status_code, 400)
    
    def test_add_wrong_diagnosis(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, 'details': 'Dumb as fuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 400)

    def test_add_patient_diagnosis(self):
        link_id = self.create_link()
        self.auth_patient()
        data = {"link": link_id,  "diagnosis": 'DumbFuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 404)

    def test_patch_diagnosis(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "diagnosis": 'DumbFuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['diagnosis'], 'DumbFuck')

        diagnosis_id = response.data['id']
        data = {"diagnosis": 'Retarded'}
        response = self.client.patch(reverse('diagnosis-view') + f"?diagnosis_id={diagnosis_id}", data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['diagnosis'], 'Retarded')

    def test_delete_diagnosis(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "diagnosis": 'FumbDuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['diagnosis'], 'FumbDuck')

        diagnosis_id = response.data['id']
        response = self.client.delete(reverse('diagnosis-view') + f"?diagnosis_id={diagnosis_id}")
        self.assertEqual(response.status_code, 204) 


class BodyStatsViewTests(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.part = BodyPart.objects.create(name='Arm', translation='Arm')
        self.valid_data = {
            'body_part': self.part.id,
            'pain_type': 'burning',
            'intensity': 5,
            'description': 'Sharp pain',
            'tookPrescription': True
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
        self.assertEqual(response.data['tookPrescription'], True)

    def test_create_wrong_bodystats(self):
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

class NotificationTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.part = BodyPart.objects.create(name='Arm', translation='Arm')
        self.valid_data = {
            'body_part': self.part.id,
            'pain_type': 'burning',
            'intensity': 5,
            'description': 'Sharp pain',
            'tookPrescription': True
        }

    def test_link_notifications(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)


        self.auth_doc()
        response = self.client.get(reverse('notifications'))
        self.assertEqual(len(response.data), 1)
        url = reverse('doc-respond')
        data = {'patient_id': self.patient_id, 'action': 'accept'}
        response = self.client.post(url, data)
        self.auth_patient()
        response = self.client.get(reverse('notifications'))
        self.assertEqual(len(response.data), 1)
    
    def test_bodystats_notifications(self):
        url = reverse('link-doc')
        data = {'doc_username': "doc"}
        response = self.client.post(url, data)

        self.auth_doc()
        url = reverse('doc-respond')
        data = {'patient_id': self.patient_id, 'action': 'accept'}
        response = self.client.post(url, data)

        self.auth_patient()
        response = self.client.post(reverse('stats-view'), self.valid_data)
        response = self.client.post(reverse('stats-view'), self.valid_data)
        response = self.client.post(reverse('stats-view'), self.valid_data)
        self.auth_doc()
        response = self.client.get(reverse('notifications'))
        self.assertEqual(len(response.data), 4) # 3 stats + 1 link

    def test_prescription_notifications(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "prescription": 'Anti-stubby'}
        response = self.client.post(reverse('prescription-view') + f"?link_id={link_id}", data)

        self.auth_patient()
        response = self.client.get(reverse('notifications'))
        self.assertEqual(len(response.data), 2) # 1 prescription + 1 link
    
    def test_diagnosis_notifications(self):
        link_id = self.create_link()
        self.auth_doc()
        data = {"link": link_id, "diagnosis": 'DumbFuck'}
        response = self.client.post(reverse('diagnosis-view') + f"?link_id={link_id}", data)

        self.auth_patient()
        response = self.client.get(reverse('notifications'))
        self.assertEqual(len(response.data), 2) # 1 diagnosis + 1 link