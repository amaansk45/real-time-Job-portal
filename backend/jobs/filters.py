import django_filters
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Job

class JobFilterSet(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search', label='Search keywords')
    category = django_filters.CharFilter(method='filter_category', label='Category slug or ID')
    job_type = django_filters.CharFilter(method='filter_job_type', label='Job Type (e.g. full_time, internship)')
    work_mode = django_filters.CharFilter(method='filter_work_mode', label='Work Mode (e.g. remote, hybrid)')
    location = django_filters.CharFilter(lookup_expr='icontains', label='Location')
    min_salary = django_filters.NumberFilter(method='filter_min_salary', label='Minimum salary')
    max_salary = django_filters.NumberFilter(method='filter_max_salary', label='Maximum salary')
    min_experience = django_filters.NumberFilter(field_name='min_experience_years', lookup_expr='lte', label='Experience years')
    posted_within = django_filters.NumberFilter(method='filter_posted_within', label='Posted within last N days')

    class Meta:
        model = Job
        fields = [
            'search',
            'category',
            'job_type',
            'work_mode',
            'location',
            'min_salary',
            'max_salary',
            'min_experience',
            'posted_within',
        ]

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        val = value.strip()
        return queryset.filter(
            Q(title__icontains=val) |
            Q(company_name__icontains=val) |
            Q(location__icontains=val) |
            Q(description__icontains=val) |
            Q(skills__icontains=val)
        )

    def filter_category(self, queryset, name, value):
        if not value:
            return queryset
        if value.isdigit():
            return queryset.filter(category_id=int(value))
        return queryset.filter(category__slug__iexact=value)

    def filter_job_type(self, queryset, name, value):
        if not value:
            return queryset
        types = [t.strip() for t in value.split(',') if t.strip()]
        return queryset.filter(job_type__in=types)

    def filter_work_mode(self, queryset, name, value):
        if not value:
            return queryset
        modes = [m.strip() for m in value.split(',') if m.strip()]
        return queryset.filter(work_mode__in=modes)

    def filter_min_salary(self, queryset, name, value):
        return queryset.filter(
            Q(salary_min__gte=value) | Q(salary_max__gte=value)
        )

    def filter_max_salary(self, queryset, name, value):
        return queryset.filter(
            Q(salary_max__lte=value) | (Q(salary_max__isnull=True) & Q(salary_min__lte=value))
        )

    def filter_posted_within(self, queryset, name, value):
        try:
            days = int(value)
            since = timezone.now() - timedelta(days=days)
            return queryset.filter(created_at__gte=since)
        except (ValueError, TypeError):
            return queryset
