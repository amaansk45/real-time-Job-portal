from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CANDIDATE = 'candidate'
    ROLE_RECRUITER = 'recruiter'
    ROLE_ADMIN = 'admin'

    ROLE_CHOICES = (
        (ROLE_CANDIDATE, 'Candidate'),
        (ROLE_RECRUITER, 'Recruiter'),
        (ROLE_ADMIN, 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CANDIDATE)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    @property
    def is_candidate(self):
        return self.role == self.ROLE_CANDIDATE

    @property
    def is_recruiter(self):
        return self.role == self.ROLE_RECRUITER

    @property
    def is_platform_admin(self):
        return self.role == self.ROLE_ADMIN or self.is_superuser

class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    headline = models.CharField(max_length=255, blank=True, help_text="e.g. Full Stack Developer | React & Python")
    skills = models.JSONField(default=list, blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    resume_name = models.CharField(max_length=255, blank=True)
    resume_updated_at = models.DateTimeField(null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    expected_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email}"

class Experience(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='experiences')
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.title} at {self.company}"

class Education(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='educations')
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_year']

    def __str__(self):
        return f"{self.degree} from {self.institution}"

class Certification(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255)
    issue_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=255, blank=True)
    credential_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.issuing_organization}"

# Signals to auto-create CandidateProfile when candidate registers
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_candidate_profile_signal(sender, instance, created, **kwargs):
    if created and instance.role == User.ROLE_CANDIDATE:
        CandidateProfile.objects.get_or_create(user=instance)

