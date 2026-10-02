from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Job, JobCategory

User = get_user_model()

class JobModelTests(TestCase):
    def setUp(self):
        self.recruiter = User.objects.create_user(
            username='recruiter_test',
            email='recruiter_test@example.com',
            password='Password123!',
            role=User.ROLE_RECRUITER,
        )

        self.category = JobCategory.objects.create(
            name='Cloud & DevOps Engineering',
            icon='FiServer',
        )

    def test_category_slug_auto_generation(self):
        self.assertEqual(self.category.slug, 'cloud-devops-engineering')
        self.assertTrue(self.category.is_active)

    def test_job_slug_and_defaults(self):
        job = Job.objects.create(
            recruiter=self.recruiter,
            category=self.category,
            title='Senior Site Reliability Engineer',
            company_name='CloudScale Technologies',
            location='San Francisco, CA',
            job_type='full_time',
            work_mode='remote',
            skills=['Kubernetes', 'Terraform', 'AWS', 'Python'],
            description='Lead our cloud infrastructure reliability efforts.',
            status='published',
        )

        self.assertTrue(job.slug.startswith('senior-site-reliability-engineer-cloudscale-technologies'))
        self.assertEqual(job.applicants_count, 0)
        self.assertEqual(job.views_count, 0)
        self.assertTrue(job.is_published)

    def test_published_manager(self):
        # Create published job
        job_pub = Job.objects.create(
            recruiter=self.recruiter,
            title='Published Job',
            company_name='Tech Inc',
            location='Remote',
            description='Test description',
            status='published',
        )

        # Create draft job
        job_draft = Job.objects.create(
            recruiter=self.recruiter,
            title='Draft Job',
            company_name='Tech Inc',
            location='Remote',
            description='Test description',
            status='draft',
        )

        # Create closed job
        job_closed = Job.objects.create(
            recruiter=self.recruiter,
            title='Closed Job',
            company_name='Tech Inc',
            location='Remote',
            description='Test description',
            status='closed',
        )

        published_jobs = Job.published.all()
        self.assertIn(job_pub, published_jobs)
        self.assertNotIn(job_draft, published_jobs)
        self.assertNotIn(job_closed, published_jobs)
        self.assertEqual(published_jobs.count(), 1)
