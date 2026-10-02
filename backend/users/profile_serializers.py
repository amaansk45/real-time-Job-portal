from rest_framework import serializers
from .models import CandidateProfile, Experience, Education, Certification
from .serializers import UserSerializer

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'title', 'company', 'location', 'start_date', 'end_date', 'is_current', 'description', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        start_date = attrs.get('start_date') or (instance.start_date if instance else None)
        end_date = attrs.get('end_date') if 'end_date' in attrs else (instance.end_date if instance else None)
        is_current = attrs.get('is_current') if 'is_current' in attrs else (instance.is_current if instance else False)

        if not is_current and not end_date:
            raise serializers.ValidationError({"end_date": "End date is required if this is not your current position."})
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError({"end_date": "End date cannot be earlier than start date."})
        return attrs

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'degree', 'institution', 'field_of_study', 'start_year', 'end_year', 'grade', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        start_year = attrs.get('start_year') or (instance.start_year if instance else None)
        end_year = attrs.get('end_year') if 'end_year' in attrs else (instance.end_year if instance else None)
        if end_year and start_year and end_year < start_year:
            raise serializers.ValidationError({"end_year": "End year cannot be earlier than start year."})
        return attrs

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ('id', 'name', 'issuing_organization', 'issue_date', 'credential_id', 'credential_url', 'created_at')
        read_only_fields = ('id', 'created_at')

class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField(required=True)

    def validate_resume(self, file_obj):
        # 1. File extension validation
        if not file_obj.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF documents (.pdf) are permitted for resumes.")

        # 2. Maximum file size check (5 MB limit)
        max_size_mb = 5
        if file_obj.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(f"Resume file size must not exceed {max_size_mb} MB.")

        # 3. Content type validation
        if hasattr(file_obj, 'content_type') and file_obj.content_type != 'application/pdf':
            raise serializers.ValidationError("File MIME type must be application/pdf.")

        return file_obj

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = (
            'id',
            'user',
            'headline',
            'skills',
            'resume',
            'resume_name',
            'resume_url',
            'resume_updated_at',
            'years_of_experience',
            'expected_salary',
            'linkedin_url',
            'github_url',
            'portfolio_url',
            'experiences',
            'educations',
            'certifications',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'resume', 'resume_name', 'resume_updated_at', 'created_at', 'updated_at')

    def get_resume_url(self, obj):
        if obj.resume and hasattr(obj.resume, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return obj.resume.url
        return None
