from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('company', 'reviewer', 'overall_rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'overall_rating', 'created_at')
    search_fields = ('company__name', 'reviewer__email', 'comment')
