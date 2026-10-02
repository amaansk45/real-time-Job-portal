from django.db import models
from django.conf import settings
from jobs.models import Job

class JobReport(models.Model):
    REASON_CHOICES = (
        ('fake_job', 'Fake Job'),
        ('scam', 'Scam'),
        ('wrong_info', 'Wrong Information'),
        ('spam', 'Spam'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('action_taken', 'Action Taken (Job Removed)'),
        ('dismissed', 'Dismissed'),
    )

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='filed_reports')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='reports')
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} for {self.job.title} ({self.get_reason_display()})"
