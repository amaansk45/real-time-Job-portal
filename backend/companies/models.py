from django.db import models
from django.conf import settings

class Company(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField()
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100)
    company_size = models.CharField(max_length=50, default='11-50 employees')
    location = models.CharField(max_length=255)
    founded_year = models.PositiveIntegerField(null=True, blank=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['name']

    def __str__(self):
        return self.name
