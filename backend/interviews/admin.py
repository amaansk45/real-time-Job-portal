from django.contrib import admin
from .models import Interview

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'recruiter', 'interview_type', 'scheduled_at', 'status')
    list_filter = ('interview_type', 'status', 'scheduled_at')
    search_fields = ('candidate__email', 'recruiter__email', 'notes')
