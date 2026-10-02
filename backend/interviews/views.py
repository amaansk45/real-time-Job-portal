from rest_framework import generics, permissions
from .models import Interview
from .serializers import InterviewSerializer

class InterviewListCreateView(generics.ListCreateAPIView):
    """
    List user's interviews or schedule a new interview (recruiter).
    """
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_recruiter:
            return Interview.objects.filter(recruiter=user)
        return Interview.objects.filter(candidate=user)

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (e.g. reschedule), or cancel an interview.
    """
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_recruiter:
            return Interview.objects.filter(recruiter=user)
        return Interview.objects.filter(candidate=user)
