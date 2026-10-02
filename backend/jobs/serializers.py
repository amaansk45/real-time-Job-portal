from rest_framework import serializers
from .models import Job, JobCategory
from users.serializers import UserSerializer

class JobCategorySerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = JobCategory
        fields = ('id', 'name', 'slug', 'icon', 'description', 'jobs_count', 'is_active')

    def get_jobs_count(self, obj):
        return obj.jobs.filter(status='published').count()

class JobListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    applicants_count = serializers.ReadOnlyField()

    class Meta:
        model = Job
        fields = (
            'id',
            'title',
            'slug',
            'company_name',
            'company_logo',
            'category_name',
            'category_slug',
            'location',
            'job_type',
            'work_mode',
            'experience',
            'min_experience_years',
            'salary_min',
            'salary_max',
            'salary_currency',
            'salary_is_negotiable',
            'skills',
            'status',
            'views_count',
            'applicants_count',
            'created_at',
        )

class JobDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    recruiter_name = serializers.ReadOnlyField(source='recruiter.get_full_name')
    recruiter_email = serializers.ReadOnlyField(source='recruiter.email')
    applicants_count = serializers.ReadOnlyField()
    company_id = serializers.ReadOnlyField(source='company.id')

    class Meta:
        model = Job
        fields = (
            'id',
            'title',
            'slug',
            'company_name',
            'company_logo',
            'company_id',
            'category',
            'category_name',
            'category_slug',
            'location',
            'job_type',
            'work_mode',
            'experience',
            'min_experience_years',
            'max_experience_years',
            'salary_min',
            'salary_max',
            'salary_currency',
            'salary_is_negotiable',
            'skills',
            'description',
            'responsibilities',
            'requirements',
            'benefits',
            'status',
            'views_count',
            'applicants_count',
            'deadline',
            'recruiter_name',
            'recruiter_email',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'slug', 'views_count', 'applicants_count', 'created_at', 'updated_at')

class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            'id',
            'title',
            'company_name',
            'company_logo',
            'company',
            'category',
            'location',
            'job_type',
            'work_mode',
            'experience',
            'min_experience_years',
            'max_experience_years',
            'salary_min',
            'salary_max',
            'salary_currency',
            'salary_is_negotiable',
            'skills',
            'description',
            'responsibilities',
            'requirements',
            'benefits',
            'status',
            'deadline',
        )
        read_only_fields = ('id',)

    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        if salary_min and salary_max and salary_max < salary_min:
            raise serializers.ValidationError({"salary_max": "Maximum salary cannot be less than minimum salary."})
        return attrs

class JobStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Job.STATUS_CHOICES)
