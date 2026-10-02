from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from .models import User
from .utils import send_verification_email, decode_user_uid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone',
            'bio',
            'location',
            'is_verified',
            'avatar',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'is_verified', 'created_at', 'updated_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'phone',
            'password',
            'confirm_password',
        )
        read_only_fields = ('id',)

    def validate_role(self, value):
        if value not in [User.ROLE_CANDIDATE, User.ROLE_RECRUITER]:
            raise serializers.ValidationError("Role must be either candidate or recruiter.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        send_verification_email(user)
        return user

from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(serializers.Serializer):
    """
    Custom JWT login serializer that returns user profile along with tokens.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip().lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Must include both 'email' and 'password'.")

        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            # Fallback direct check if username field is distinct
            user_by_email = User.objects.filter(email__iexact=email).first()
            if user_by_email and user_by_email.check_password(password):
                user = user_by_email

        if not user:
            raise serializers.ValidationError({"detail": "Invalid credentials provided."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError({"new_password": "New password cannot be the same as the old password."})
        validate_password(attrs['new_password'])
        return attrs

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        return value.lower()

class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(attrs['new_password'])

        uid = decode_user_uid(attrs['uidb64'])
        if not uid:
            raise serializers.ValidationError({"uidb64": "Invalid user ID encoded in token."})

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            raise serializers.ValidationError({"uidb64": "User not found."})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Password reset token is invalid or has expired."})

        attrs['user'] = user
        return attrs

class VerifyEmailSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, attrs):
        uid = decode_user_uid(attrs['uidb64'])
        if not uid:
            raise serializers.ValidationError({"uidb64": "Invalid user identifier."})

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            raise serializers.ValidationError({"uidb64": "User not found."})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Verification token is invalid or has expired."})

        attrs['user'] = user
        return attrs
