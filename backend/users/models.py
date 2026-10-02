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
