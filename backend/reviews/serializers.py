from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.ReadOnlyField(source='reviewer.get_full_name')
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('id', 'reviewer', 'is_approved', 'created_at', 'updated_at')
