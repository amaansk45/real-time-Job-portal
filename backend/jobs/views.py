from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Job, JobCategory
from .filters import JobFilterSet
from .serializers import (
    JobCategorySerializer,
    JobListSerializer,
    JobDetailSerializer,
    JobCreateUpdateSerializer,
    JobStatusUpdateSerializer,
)
from users.permissions import IsRecruiter, IsRecruiterOrAdmin

class JobCategoryListView(generics.ListAPIView):
    """
    List all active job categories with active job counts.
    """
    queryset = JobCategory.objects.filter(is_active=True)
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class PublicJobListView(generics.ListAPIView):
    """
    Public paginated list of published jobs with advanced multi-parameter filtering, search, and sorting.
    """
    queryset = Job.published.all().select_related('category', 'company')
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = JobFilterSet
    ordering_fields = ['created_at', 'salary_min', 'salary_max', 'views_count']
    ordering = ['-created_at']

class PublicJobDetailView(generics.RetrieveAPIView):
    """
    Retrieve full job details by ID or Slug. Automatically increments the views counter.
    """
    serializer_class = JobDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        lookup = self.kwargs.get('slug_or_id')
        if lookup.isdigit():
            job = generics.get_object_or_404(Job, pk=int(lookup))
        else:
            job = generics.get_object_or_404(Job, slug=lookup)

        # Increment views count atomicly
        Job.objects.filter(pk=job.pk).update(views_count=F('views_count') + 1)
        job.refresh_from_db(fields=['views_count'])
        return job

class RecruiterJobListView(generics.ListAPIView):
    """
    List all jobs posted by the authenticated recruiter, with status filter and summary metrics.
    """
    serializer_class = JobListSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'job_type', 'work_mode']
    search_fields = ['title', 'location', 'company_name']
    ordering_fields = ['created_at', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user).select_related('category', 'company')

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        # Include recruiter overview metrics in the response
        user_jobs = Job.objects.filter(recruiter=request.user)
        metrics = {
            'total_jobs': user_jobs.count(),
            'active_jobs': user_jobs.filter(status='published').count(),
            'draft_jobs': user_jobs.filter(status='draft').count(),
            'closed_jobs': user_jobs.filter(status='closed').count(),
        }

        if isinstance(response.data, dict) and 'results' in response.data:
            response.data['metrics'] = metrics
        return response

class RecruiterJobCreateView(generics.CreateAPIView):
    """
    Create a new job posting for the authenticated recruiter.
    """
    serializer_class = JobCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class RecruiterJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (PUT/PATCH), or delete a recruiter's own job posting.
    """
    serializer_class = JobCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

class JobStatusUpdateView(APIView):
    """
    Update the lifecycle status of a job (draft, published, closed).
    """
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]

    @extend_schema(
        request=JobStatusUpdateSerializer,
        responses={200: OpenApiResponse(description="Job status updated successfully.")}
    )
    def patch(self, request, pk):
        job = generics.get_object_or_404(Job, pk=pk, recruiter=request.user)
        serializer = JobStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        job.status = new_status
        job.save()

        return Response({
            'message': f"Job status changed to {new_status}.",
            'status': job.status,
        }, status=status.HTTP_200_OK)
