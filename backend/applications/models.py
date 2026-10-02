from django.db import models
from django.conf import settings
from jobs.models import Job

class Application(models.Model):
    STATUS_APPLIED = 'applied'
    STATUS_UNDER_REVIEW = 'under_review'
    STATUS_SHORTLISTED = 'shortlisted'
    STATUS_INTERVIEW = 'interview'
    STATUS_SELECTED = 'selected'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = (
        (STATUS_APPLIED, 'Applied'),
        (STATUS_UNDER_REVIEW, 'Under Review'),
        (STATUS_SHORTLISTED, 'Shortlisted'),
        (STATUS_INTERVIEW, 'Interview'),
        (STATUS_SELECTED, 'Selected'),
        (STATUS_REJECTED, 'Rejected'),
    )

    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPLIED)
    notes = models.TextField(blank=True, help_text="Internal recruiter feedback")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('candidate', 'job')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.candidate.email} -> {self.job.title} ({self.status})"

class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_users')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"
