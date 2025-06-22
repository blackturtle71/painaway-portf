from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.token = Token.objects.create(user=self.user)
        
        # URLs
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('profile')

    ## Helper Methods ##
    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')


    def test_user_registration(self):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            "first_name": "Mike",
            "last_name": "Wazowski",
            "father_name": "Sarkesian",
            "phone_number": "+777777787",
            "sex": "M",
            "date_of_birth": "2000-7-1"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual("M", response.data['user']['sex'])
        
        # Verify user was created
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_duplicate_registration(self):
        """Test registration with existing username"""
        data = {
            'username': 'testuser',  # Already exists
            'email': 'new@example.com',
            'password': 'newpass123',
            'phone': '465478876'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_wrong_bday_registration(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            "first_name": "Mike",
            "last_name": "Wazowski",
            "father_name": "Sarkesian",
            "phone_number": "+777777787",
            "sex": "F",
            "date_of_birth": "2030-1-1"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_sex_registration(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            "first_name": "Mike",
            "last_name": "Wazowski",
            "father_name": "Sarkesian",
            "phone_number": "+777777787",
            "sex": "G",
            "date_of_birth": "2000-7-1"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_successful_login(self):
        """Test valid credentials login"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_invalid_login(self):
        """Test invalid credentials login"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_authenticated_profile_access(self):
        """Test profile access with valid token"""
        self.authenticate()
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])

    def test_unauthenticated_profile_access(self):
        """Test profile access without token"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_password(self):
        """Test registration with missing required fields"""
        data = {
            'username': 'partialuser',
            'email': 'partialuser@example.com',
            'password': ''
            # Missing email and password
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_missing_email(self):
        """Test registration with missing required fields"""
        data = {
            'username': 'partialuser',
            'email': '',
            'password': '123'
            # Missing email and password
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_profile_update(self):
        self.authenticate()
        data = {
            'phone_number': "654654",
            'username': "wassupuser"
        }
        response = self.client.patch(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("wassupuser", response.data['username'])
        self.assertEqual("654654", response.data['phone_number'])

    def test_profile_update_noneditable_field(self):
        self.authenticate()
        data = {
            "id": 400
        }
        response = self.client.patch(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
