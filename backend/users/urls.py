from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomLoginView,
    LogoutView,
    CurrentUserView,
    VerifyEmailView,
    ForgotPasswordView,
    ResetPasswordView,
    ChangePasswordView,
)

app_name = 'users'

urlpatterns = [
    # Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile Management
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Verification & Recovery
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
