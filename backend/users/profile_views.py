from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import CandidateProfile, Experience, Education, Certification
from .profile_serializers import (
    CandidateProfileSerializer,
    ExperienceSerializer,
    EducationSerializer,
    CertificationSerializer,
    ResumeUploadSerializer,
)
from .permissions import IsCandidate

class CandidateProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated candidate's profile.
    """
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_object(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile

class ResumeUploadView(APIView):
    """
    Upload, replace, or delete candidate PDF resume.
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request=ResumeUploadSerializer,
        responses={200: OpenApiResponse(description="Resume uploaded successfully.")}
    )
    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        resume_file = serializer.validated_data['resume']

        # Delete old file if present
        if profile.resume:
            profile.resume.delete(save=False)

        profile.resume = resume_file
        profile.resume_name = resume_file.name
        profile.resume_updated_at = timezone.now()
        profile.save()

        profile_data = CandidateProfileSerializer(profile, context={'request': request}).data
        return Response({
            'message': 'Resume uploaded successfully.',
            'profile': profile_data,
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        profile = getattr(request.user, 'candidate_profile', None)
        if not profile or not profile.resume:
            return Response({'error': 'No resume found to delete.'}, status=status.HTTP_404_NOT_FOUND)

        profile.resume.delete(save=False)
        profile.resume = None
        profile.resume_name = ''
        profile.resume_updated_at = None
        profile.save()

        return Response({'message': 'Resume deleted successfully.'}, status=status.HTTP_200_OK)

# Experience CRUD Views
class ExperienceListCreateView(generics.ListCreateAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.experiences.all()

    def perform_create(self, serializer):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        serializer.save(candidate=profile)

class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.experiences.all()

# Education CRUD Views
class EducationListCreateView(generics.ListCreateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.educations.all()

    def perform_create(self, serializer):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        serializer.save(candidate=profile)

class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.educations.all()

# Certification CRUD Views
class CertificationListCreateView(generics.ListCreateAPIView):
    serializer_class = CertificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.certifications.all()

    def perform_create(self, serializer):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        serializer.save(candidate=profile)

class CertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CertificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile.certifications.all()
