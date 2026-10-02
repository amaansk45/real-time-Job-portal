from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core import mail
from .utils import generate_user_token
from .permissions import IsCandidate, IsRecruiter, IsPlatformAdmin
from unittest.mock import Mock

User = get_user_model()

class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.candidate_user = User.objects.create_user(
            username='candidate_user',
            email='candidate@example.com',
            password='Password123!',
            role=User.ROLE_CANDIDATE,
            first_name='Amaan',
            last_name='Shaikh',
        )
        self.recruiter_user = User.objects.create_user(
            username='recruiter_user',
            email='recruiter@example.com',
            password='Password123!',
            role=User.ROLE_RECRUITER,
            first_name='Jane',
            last_name='Recruiter',
        )

    def test_candidate_registration_success(self):
        url = reverse('users:register')
        data = {
            'email': 'newcandidate@example.com',
            'username': 'newcandidate',
            'first_name': 'New',
            'last_name': 'Candidate',
            'role': 'candidate',
            'phone': '+1234567890',
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'newcandidate@example.com')
        self.assertEqual(response.data['user']['role'], 'candidate')
        # Check that welcome/verification email was sent
        self.assertEqual(len(mail.outbox), 1)

    def test_registration_password_mismatch(self):
        url = reverse('users:register')
        data = {
            'email': 'mismatch@example.com',
            'username': 'mismatch',
            'role': 'candidate',
            'password': 'SecurePassword123!',
            'confirm_password': 'DifferentPassword123!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

    def test_registration_duplicate_email(self):
        url = reverse('users:register')
        data = {
            'email': 'candidate@example.com',
            'username': 'anotheruser',
            'role': 'candidate',
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_login_success(self):
        url = reverse('users:login')
        data = {
            'email': 'candidate@example.com',
            'password': 'Password123!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'candidate@example.com')

    def test_login_invalid_password(self):
        url = reverse('users:login')
        data = {
            'email': 'candidate@example.com',
            'password': 'WrongPassword!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_token(self):
        # First login to obtain tokens
        login_url = reverse('users:login')
        login_res = self.client.post(login_url, {
            'email': 'candidate@example.com',
            'password': 'Password123!',
        }, format='json')
        refresh_token = login_res.data['refresh']

        refresh_url = reverse('users:token_refresh')
        res = self.client.post(refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

    def test_logout_blacklists_token(self):
        login_url = reverse('users:login')
        login_res = self.client.post(login_url, {
            'email': 'candidate@example.com',
            'password': 'Password123!',
        }, format='json')
        access_token = login_res.data['access']
        refresh_token = login_res.data['refresh']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_url = reverse('users:logout')
        res = self.client.post(logout_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Trying to refresh with blacklisted token should now fail
        refresh_url = reverse('users:token_refresh')
        res_refresh = self.client.post(refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(res_refresh.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_profile_and_update(self):
        self.client.force_authenticate(user=self.candidate_user)
        me_url = reverse('users:current_user')

        # Retrieve profile
        res = self.client.get(me_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'candidate@example.com')

        # Update profile
        update_data = {
            'bio': 'Passionate Full Stack Engineer',
            'location': 'San Francisco, CA',
            'phone': '+1987654321',
        }
        res_patch = self.client.patch(me_url, update_data, format='json')
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.candidate_user.refresh_from_db()
        self.assertEqual(self.candidate_user.bio, 'Passionate Full Stack Engineer')
        self.assertEqual(self.candidate_user.location, 'San Francisco, CA')

    def test_change_password(self):
        self.client.force_authenticate(user=self.candidate_user)
        change_pw_url = reverse('users:change_password')

        # Fail with wrong current password
        bad_res = self.client.post(change_pw_url, {
            'old_password': 'IncorrectPassword!',
            'new_password': 'BrandNewPassword123!',
            'confirm_password': 'BrandNewPassword123!',
        }, format='json')
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Succeed with correct old password
        good_res = self.client.post(change_pw_url, {
            'old_password': 'Password123!',
            'new_password': 'BrandNewPassword123!',
            'confirm_password': 'BrandNewPassword123!',
        }, format='json')
        self.assertEqual(good_res.status_code, status.HTTP_200_OK)

        # Test login with new password
        login_res = self.client.post(reverse('users:login'), {
            'email': 'candidate@example.com',
            'password': 'BrandNewPassword123!',
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

    def test_email_verification(self):
        uidb64, token = generate_user_token(self.candidate_user)
        self.assertFalse(self.candidate_user.is_verified)

        verify_url = reverse('users:verify_email')
        res = self.client.post(verify_url, {'uidb64': uidb64, 'token': token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.candidate_user.refresh_from_db()
        self.assertTrue(self.candidate_user.is_verified)

    def test_password_reset_flow(self):
        # 1. Request reset
        forgot_url = reverse('users:forgot_password')
        res_forgot = self.client.post(forgot_url, {'email': 'candidate@example.com'}, format='json')
        self.assertEqual(res_forgot.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

        # 2. Reset password
        uidb64, token = generate_user_token(self.candidate_user)
        reset_url = reverse('users:reset_password')
        res_reset = self.client.post(reset_url, {
            'uidb64': uidb64,
            'token': token,
            'new_password': 'ResetSuccessful123!',
            'confirm_password': 'ResetSuccessful123!',
        }, format='json')
        self.assertEqual(res_reset.status_code, status.HTTP_200_OK)

        # 3. Login with reset password
        login_res = self.client.post(reverse('users:login'), {
            'email': 'candidate@example.com',
            'password': 'ResetSuccessful123!',
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

    def test_role_permissions(self):
        req_candidate = Mock()
        req_candidate.user = self.candidate_user

        req_recruiter = Mock()
        req_recruiter.user = self.recruiter_user

        perm_candidate = IsCandidate()
        perm_recruiter = IsRecruiter()

        # Candidate permissions check
        self.assertTrue(perm_candidate.has_permission(req_candidate, None))
        self.assertFalse(perm_candidate.has_permission(req_recruiter, None))

        # Recruiter permissions check
        self.assertTrue(perm_recruiter.has_permission(req_recruiter, None))
        self.assertFalse(perm_recruiter.has_permission(req_candidate, None))
