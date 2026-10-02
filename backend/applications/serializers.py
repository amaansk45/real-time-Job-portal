from rest_framework import serializers
from .models import Application, SavedJob
from jobs.serializers import JobSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.ReadOnlyField(source='candidate.get_full_name')
    candidate_email = serializers.ReadOnlyField(source='candidate.email')
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company_name')

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'candidate', 'created_at', 'updated_at')

    def validate_resume(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF resume files are permitted.")
        return value

class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ('id', 'user', 'job', 'job_details', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
