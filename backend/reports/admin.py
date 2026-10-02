from django.contrib import admin
from .models import JobReport

@admin.register(JobReport)
class JobReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'reporter', 'reason', 'status', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('job__title', 'reporter__email', 'description')
