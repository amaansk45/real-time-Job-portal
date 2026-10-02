from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer

class JobListCreateView(generics.ListCreateAPIView):
    """
    List published jobs or create a new job posting.
    """
    queryset = Job.objects.filter(status='published')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'work_mode', 'location', 'experience']
    search_fields = ['title', 'company_name', 'skills', 'description']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a job posting.
    """
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
