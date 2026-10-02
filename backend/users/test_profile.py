import io
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import CandidateProfile, Experience, Education

User = get_user_model()

class CandidateProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.candidate_user = User.objects.create_user(
            username='candidate_jane',
            email='jane@example.com',
            password='Password123!',
            role=User.ROLE_CANDIDATE,
            first_name='Jane',
            last_name='Doe',
        )
        self.recruiter_user = User.objects.create_user(
            username='recruiter_bob',
            email='bob@example.com',
            password='Password123!',
            role=User.ROLE_RECRUITER,
            first_name='Bob',
            last_name='Smith',
        )

    def test_candidate_profile_auto_created(self):
        profile = CandidateProfile.objects.filter(user=self.candidate_user).first()
        self.assertIsNotNone(profile)
        self.assertEqual(profile.user, self.candidate_user)

    def test_get_candidate_profile(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('users:candidate_profile')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['user']['email'], 'jane@example.com')

    def test_update_candidate_profile(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('users:candidate_profile')
        data = {
            'headline': 'Senior React & Django Engineer',
            'skills': ['Python', 'Django', 'React', 'TypeScript', 'Docker'],
            'linkedin_url': 'https://linkedin.com/in/janedoe',
            'github_url': 'https://github.com/janedoe',
            'portfolio_url': 'https://janedoe.dev',
            'years_of_experience': 4,
        }
        res = self.client.patch(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['headline'], 'Senior React & Django Engineer')
        self.assertEqual(len(res.data['skills']), 5)
        self.assertEqual(res.data['years_of_experience'], 4)

    def test_resume_upload_valid_pdf(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('users:candidate_resume')

        pdf_content = b"%PDF-1.4 sample resume content"
        pdf_file = SimpleUploadedFile(
            "jane_doe_resume.pdf",
            pdf_content,
            content_type="application/pdf"
        )

        res = self.client.post(url, {'resume': pdf_file}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('profile', res.data)
        self.assertTrue(res.data['profile']['resume_name'].endswith('.pdf'))

    def test_resume_upload_invalid_extension_fails(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('users:candidate_resume')

        txt_file = SimpleUploadedFile(
            "resume.txt",
            b"plain text resume",
            content_type="text/plain"
        )

        res = self.client.post(url, {'resume': txt_file}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume', res.data)

    def test_resume_delete(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('users:candidate_resume')

        # First upload
        pdf_file = SimpleUploadedFile("my_resume.pdf", b"%PDF-1.4 content", content_type="application/pdf")
        self.client.post(url, {'resume': pdf_file}, format='multipart')

        # Then delete
        res_del = self.client.delete(url)
        self.assertEqual(res_del.status_code, status.HTTP_200_OK)

        profile = CandidateProfile.objects.get(user=self.candidate_user)
        self.assertFalse(bool(profile.resume))

    def test_experience_crud(self):
        self.client.force_authenticate(user=self.candidate_user)
        list_url = reverse('users:experience_list_create')

        # Create experience
        data = {
            'title': 'Frontend Engineer',
            'company': 'Tech Corp',
            'location': 'New York, NY',
            'start_date': '2022-01-01',
            'is_current': True,
            'description': 'Developed high-performance web applications in React.',
        }
        res_create = self.client.post(list_url, data, format='json')
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)
        exp_id = res_create.data['id']

        # List experiences
        res_list = self.client.get(list_url)
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_list.data['results'] if 'results' in res_list.data else res_list.data), 1)

        # Update experience
        detail_url = reverse('users:experience_detail', kwargs={'pk': exp_id})
        res_update = self.client.patch(detail_url, {'title': 'Senior Frontend Engineer'}, format='json')
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        self.assertEqual(res_update.data['title'], 'Senior Frontend Engineer')

        # Delete experience
        res_del = self.client.delete(detail_url)
        self.assertEqual(res_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Experience.objects.count(), 0)

    def test_education_crud(self):
        self.client.force_authenticate(user=self.candidate_user)
        list_url = reverse('users:education_list_create')

        data = {
            'degree': 'Bachelor of Science',
            'institution': 'Stanford University',
            'field_of_study': 'Computer Science',
            'start_year': 2018,
            'end_year': 2022,
            'grade': '3.9 GPA',
        }
        res_create = self.client.post(list_url, data, format='json')
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)
        edu_id = res_create.data['id']

        detail_url = reverse('users:education_detail', kwargs={'pk': edu_id})
        res_update = self.client.patch(detail_url, {'grade': '4.0 GPA'}, format='json')
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        self.assertEqual(res_update.data['grade'], '4.0 GPA')

    def test_recruiter_forbidden_from_candidate_profile(self):
        self.client.force_authenticate(user=self.recruiter_user)
        url = reverse('users:candidate_profile')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
