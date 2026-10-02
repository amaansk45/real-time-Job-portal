from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid

class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide or React icon name e.g. FiCode, FiCpu")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Job Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class PublishedManager(models.Manager):
    """
    Manager that returns only active and published jobs.
    """
    def get_queryset(self):
        return super().get_queryset().filter(status='published')

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('internship', 'Internship'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
    )

    WORK_MODE_CHOICES = (
        ('remote', 'Remote'),
        ('on_site', 'On-site'),
        ('hybrid', 'Hybrid'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
        ('expired', 'Expired'),
    )

    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_jobs')
    company = models.ForeignKey('companies.Company', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')

    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    company_name = models.CharField(max_length=255, db_index=True)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    location = models.CharField(max_length=255, db_index=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full_time', db_index=True)
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES, default='remote', db_index=True)
    experience = models.CharField(max_length=50, default='0-1 years')
    min_experience_years = models.PositiveIntegerField(default=0)
    max_experience_years = models.PositiveIntegerField(null=True, blank=True)

    # Salary Details
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD')
    salary_is_negotiable = models.BooleanField(default=False)

    # Skills & Description
    skills = models.JSONField(default=list, blank=True, help_text="List of skills e.g. ['Python', 'Django', 'React']")
    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)

    # Metadata & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published', db_index=True)
    views_count = models.PositiveIntegerField(default=0)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Managers
    objects = models.Manager()
    published = PublishedManager()

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['job_type', 'work_mode']),
            models.Index(fields=['location']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.company_name}")
            unique_id = uuid.uuid4().hex[:6]
            self.slug = f"{base_slug}-{unique_id}"
        if self.company and not self.company_name:
            self.company_name = self.company.name
        if self.company and self.company.logo and not self.company_logo:
            self.company_logo = self.company.logo
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} at {self.company_name} ({self.get_status_display()})"

    @property
    def applicants_count(self):
        return getattr(self, 'applications', None).count() if hasattr(self, 'applications') else 0

    @property
    def is_published(self):
        return self.status == 'published'
