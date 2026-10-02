from django.db import models
from django.conf import settings
from companies.models import Company
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reviews')
    overall_rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    work_culture_rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    salary_rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    management_rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('reviewer', 'company')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.reviewer.email} for {self.company.name} ({self.overall_rating}/5)"
