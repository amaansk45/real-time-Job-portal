from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    VerifyEmailSerializer,
)
from .utils import send_password_reset_email

class RegisterView(generics.CreateAPIView):
    """
    Register a new Candidate or Recruiter account.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_data = UserSerializer(user).data
        return Response({
            'message': 'Registration successful! A verification link has been sent to your email.',
            'user': user_data,
        }, status=status.HTTP_201_CREATED)

class CustomLoginView(generics.GenericAPIView):
    """
    Authenticate user using email and password, returning JWT tokens and user profile.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    """
    Blacklist the provided refresh token to invalidate user session.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request={'application/json': {'type': 'object', 'properties': {'refresh': {'type': 'string'}}}},
        responses={200: OpenApiResponse(description="Successfully logged out.")}
    )
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    """
    Confirm email address using uidb64 and token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.is_verified = True
        user.save()
        return Response({'message': 'Email verified successfully. You can now login.'}, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    """
    Request password reset link for forgotten account password.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()

        if user:
            send_password_reset_email(user, request)

        # Return identical response for security (avoid user enumeration)
        return Response({
            'message': 'If an account exists with this email, a password reset link has been dispatched.'
        }, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    """
    Set new password using secure uidb64 and reset token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password has been reset successfully. Please login with your new password.'}, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    """
    Change password for currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response({'old_password': ['Current password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)

class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    Get or update authenticated user profile details.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
