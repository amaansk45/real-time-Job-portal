from django.contrib import admin
from .models import Application, SavedJob

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('candidate__email', 'job__title', 'job__company_name')

@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'created_at')
    search_fields = ('user__email', 'job__title')
