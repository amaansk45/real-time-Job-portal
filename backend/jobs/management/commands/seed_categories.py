from django.core.management.base import BaseCommand
from django.utils.text import slugify
from jobs.models import JobCategory

class Command(BaseCommand):
    help = 'Seeds standard job categories into the database'

    def handle(self, *args, **options):
        categories = [
            {
                'name': 'Software Engineering',
                'icon': 'FiCode',
                'description': 'Backend, Full Stack, and Core Software Engineering roles',
            },
            {
                'name': 'Frontend & Mobile',
                'icon': 'FiLayout',
                'description': 'React, Vue, iOS, Android, and web client development',
            },
            {
                'name': 'Cloud & DevOps',
                'icon': 'FiServer',
                'description': 'Infrastructure, CI/CD, Kubernetes, AWS, and reliability',
            },
            {
                'name': 'Data Science & AI',
                'icon': 'FiCpu',
                'description': 'Machine Learning, LLMs, Analytics, and Data Engineering',
            },
            {
                'name': 'Product & Design',
                'icon': 'FiFigma',
                'description': 'UI/UX Design, Product Management, and User Research',
            },
            {
                'name': 'Cybersecurity',
                'icon': 'FiShield',
                'description': 'Security Operations, Penetration Testing, and Compliance',
            },
        ]

        count = 0
        for cat_data in categories:
            obj, created = JobCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': slugify(cat_data['name']),
                    'icon': cat_data['icon'],
                    'description': cat_data['description'],
                    'is_active': True,
                }
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} job categories."))
