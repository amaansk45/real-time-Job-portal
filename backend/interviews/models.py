from django.db import models
from django.conf import settings
from applications.models import Application

class Interview(models.Model):
    INTERVIEW_TYPE_CHOICES = (
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('phone', 'Phone'),
        ('technical', 'Technical'),
        ('hr', 'HR'),
    )

    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
    )

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidate_interviews')
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recruiter_interviews')
    scheduled_at = models.DateTimeField()
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES, default='online')
    meeting_link = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, help_text="Required for offline interviews")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"Interview for {self.candidate.email} - {self.interview_type} on {self.scheduled_at}"
