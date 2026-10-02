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
from .profile_views import (
    CandidateProfileView,
    ResumeUploadView,
    ExperienceListCreateView,
    ExperienceDetailView,
    EducationListCreateView,
    EducationDetailView,
    CertificationListCreateView,
    CertificationDetailView,
)

app_name = 'users'

urlpatterns = [
    # Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Basic User Profile
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Verification & Recovery
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),

    # Candidate Extended Profile
    path('profile/candidate/', CandidateProfileView.as_view(), name='candidate_profile'),
    path('profile/candidate/resume/', ResumeUploadView.as_view(), name='candidate_resume'),

    # Candidate Experience Timeline
    path('profile/experience/', ExperienceListCreateView.as_view(), name='experience_list_create'),
    path('profile/experience/<int:pk>/', ExperienceDetailView.as_view(), name='experience_detail'),

    # Candidate Education History
    path('profile/education/', EducationListCreateView.as_view(), name='education_list_create'),
    path('profile/education/<int:pk>/', EducationDetailView.as_view(), name='education_detail'),

    # Candidate Certifications
    path('profile/certification/', CertificationListCreateView.as_view(), name='certification_list_create'),
    path('profile/certification/<int:pk>/', CertificationDetailView.as_view(), name='certification_detail'),
]
