from django.urls import path
from .views import (
    JobCategoryListView,
    PublicJobListView,
    PublicJobDetailView,
    RecruiterJobListView,
    RecruiterJobCreateView,
    RecruiterJobDetailView,
    JobStatusUpdateView,
)

app_name = 'jobs'

urlpatterns = [
    # Public Job Endpoints
    path('categories/', JobCategoryListView.as_view(), name='category_list'),
    path('', PublicJobListView.as_view(), name='job_list'),
    path('<str:slug_or_id>/', PublicJobDetailView.as_view(), name='job_detail'),

    # Recruiter Job Management Endpoints
    path('recruiter/my-jobs/', RecruiterJobListView.as_view(), name='recruiter_job_list'),
    path('recruiter/create/', RecruiterJobCreateView.as_view(), name='recruiter_job_create'),
    path('recruiter/<int:pk>/', RecruiterJobDetailView.as_view(), name='recruiter_job_detail'),
    path('recruiter/<int:pk>/status/', JobStatusUpdateView.as_view(), name='recruiter_job_status'),
]
