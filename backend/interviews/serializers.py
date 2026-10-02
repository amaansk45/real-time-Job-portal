from rest_framework import serializers
from .models import Interview

class InterviewSerializer(serializers.ModelSerializer):
    candidate_name = serializers.ReadOnlyField(source='candidate.get_full_name')
    candidate_email = serializers.ReadOnlyField(source='candidate.email')
    recruiter_name = serializers.ReadOnlyField(source='recruiter.get_full_name')
    job_title = serializers.ReadOnlyField(source='application.job.title')

    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ('id', 'recruiter', 'created_at', 'updated_at')
