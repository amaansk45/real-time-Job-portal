from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.get_full_name')

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('id', 'owner', 'is_verified', 'created_at', 'updated_at')
