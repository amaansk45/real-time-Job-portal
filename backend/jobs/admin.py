from django.contrib import admin
from .models import Job, JobCategory

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company_name',
        'category',
        'location',
        'job_type',
        'work_mode',
        'status',
        'views_count',
        'created_at',
    )
    list_filter = ('status', 'job_type', 'work_mode', 'category', 'created_at')
    search_fields = ('title', 'company_name', 'location', 'description')
    prepopulated_fields = {'slug': ('title',)}
    actions = ['mark_as_published', 'mark_as_closed']

    @admin.action(description="Mark selected jobs as Published")
    def mark_as_published(self, request, queryset):
        queryset.update(status='published')

    @admin.action(description="Mark selected jobs as Closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(status='closed')
