from rest_framework import serializers
from .models import JobReport

class JobReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.ReadOnlyField(source='reporter.email')
    job_title = serializers.ReadOnlyField(source='job.title')

    class Meta:
        model = JobReport
        fields = '__all__'
        read_only_fields = ('id', 'reporter', 'status', 'admin_notes', 'created_at', 'updated_at')
