from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Job, JobCategory

User = get_user_model()

class JobAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.recruiter = User.objects.create_user(
            username='recruiter_alice',
            email='alice@example.com',
            password='Password123!',
            role=User.ROLE_RECRUITER,
            first_name='Alice',
            last_name='Recruiter',
        )

        self.other_recruiter = User.objects.create_user(
            username='recruiter_bob',
            email='bob@example.com',
            password='Password123!',
            role=User.ROLE_RECRUITER,
            first_name='Bob',
            last_name='Recruiter',
        )

        self.candidate = User.objects.create_user(
            username='candidate_charlie',
            email='charlie@example.com',
            password='Password123!',
            role=User.ROLE_CANDIDATE,
            first_name='Charlie',
            last_name='Candidate',
        )

        self.category = JobCategory.objects.create(
            name='Software Engineering',
            slug='software-engineering',
            icon='FiCode',
        )

        self.job1 = Job.objects.create(
            recruiter=self.recruiter,
            category=self.category,
            title='Senior Python & Django Developer',
            company_name='Nexus Solutions',
            location='San Francisco, CA',
            job_type='full_time',
            work_mode='remote',
            salary_min=100000,
            salary_max=140000,
            skills=['Python', 'Django', 'PostgreSQL', 'Docker'],
            description='Build scalable APIs.',
            status='published',
        )

        self.job2 = Job.objects.create(
            recruiter=self.recruiter,
            category=self.category,
            title='Junior React Developer',
            company_name='Pixel Web Works',
            location='Austin, TX',
            job_type='contract',
            work_mode='hybrid',
            salary_min=60000,
            salary_max=80000,
            skills=['React', 'TypeScript', 'Tailwind'],
            description='Build user-friendly dashboards.',
            status='published',
        )

        self.draft_job = Job.objects.create(
            recruiter=self.recruiter,
            category=self.category,
            title='Draft Backend Role',
            company_name='Nexus Solutions',
            location='Remote',
            description='Secret upcoming role.',
            status='draft',
        )

    def test_job_categories_list(self):
        url = reverse('jobs:category_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['slug'], 'software-engineering')
        self.assertEqual(res.data[0]['jobs_count'], 2)

    def test_public_job_list_excludes_drafts(self):
        url = reverse('jobs:job_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data['results'] if 'results' in res.data else res.data
        self.assertEqual(len(results), 2)
        titles = [j['title'] for j in results]
        self.assertIn('Senior Python & Django Developer', titles)
        self.assertNotIn('Draft Backend Role', titles)

    def test_job_search_by_keyword(self):
        url = reverse('jobs:job_list') + '?search=Python'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data['results'] if 'results' in res.data else res.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Senior Python & Django Developer')

    def test_job_filter_by_work_mode_and_type(self):
        url = reverse('jobs:job_list') + '?work_mode=remote&job_type=full_time'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data['results'] if 'results' in res.data else res.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Senior Python & Django Developer')

    def test_job_detail_by_slug_increments_views(self):
        initial_views = self.job1.views_count
        url = reverse('jobs:job_detail', kwargs={'slug_or_id': self.job1.slug})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['slug'], self.job1.slug)
        self.assertEqual(res.data['views_count'], initial_views + 1)

    def test_job_detail_by_id(self):
        url = reverse('jobs:job_detail', kwargs={'slug_or_id': str(self.job1.id)})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['id'], self.job1.id)

    def test_recruiter_create_job(self):
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('jobs:recruiter_job_create')
        data = {
            'title': 'Lead DevOps Engineer',
            'company_name': 'CloudNet',
            'category': self.category.id,
            'location': 'Seattle, WA',
            'job_type': 'full_time',
            'work_mode': 'remote',
            'salary_min': 130000,
            'salary_max': 160000,
            'skills': ['Kubernetes', 'AWS', 'Terraform'],
            'description': 'Architect cloud infrastructure.',
            'status': 'published',
        }
        res = self.client.post(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], 'Lead DevOps Engineer')
        new_job = Job.objects.get(id=res.data['id'])
        self.assertEqual(new_job.recruiter, self.recruiter)

    def test_recruiter_job_list_with_metrics(self):
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('jobs:recruiter_job_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('metrics', res.data)
        metrics = res.data['metrics']
        self.assertEqual(metrics['total_jobs'], 3)
        self.assertEqual(metrics['active_jobs'], 2)
        self.assertEqual(metrics['draft_jobs'], 1)

    def test_recruiter_status_transition(self):
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('jobs:recruiter_job_status', kwargs={'pk': self.draft_job.id})

        # Transition draft -> published
        res = self.client.patch(url, {'status': 'published'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.draft_job.refresh_from_db()
        self.assertEqual(self.draft_job.status, 'published')

    def test_candidate_forbidden_from_recruiter_endpoints(self):
        self.client.force_authenticate(user=self.candidate)
        url = reverse('jobs:recruiter_job_create')
        res = self.client.post(url, {'title': 'Illegal Role'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_recruiter_cannot_edit_other_recruiter_job(self):
        self.client.force_authenticate(user=self.other_recruiter)
        url = reverse('jobs:recruiter_job_detail', kwargs={'pk': self.job1.id})
        res = self.client.patch(url, {'title': 'Hijacked Job'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
