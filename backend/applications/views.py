from rest_framework import generics, permissions
from .models import Application, SavedJob
from .serializers import ApplicationSerializer, SavedJobSerializer

class ApplicationListCreateView(generics.ListCreateAPIView):
    """
    List user's applications or submit a new job application.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_recruiter:
            return Application.objects.filter(job__recruiter=user)
        return Application.objects.filter(candidate=user)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve application or update application status.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_recruiter:
            return Application.objects.filter(job__recruiter=user)
        return Application.objects.filter(candidate=user)

class SavedJobListCreateView(generics.ListCreateAPIView):
    """
    List saved jobs or bookmark a new job.
    """
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedJobDeleteView(generics.DestroyAPIView):
    """
    Remove a saved job bookmark.
    """
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
