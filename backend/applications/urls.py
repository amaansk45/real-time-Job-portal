from django.urls import path
from .views import (
    ApplicationListCreateView,
    ApplicationDetailView,
    SavedJobListCreateView,
    SavedJobDeleteView,
)

app_name = 'applications'

urlpatterns = [
    path('', ApplicationListCreateView.as_view(), name='application_list_create'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application_detail'),
    path('saved/', SavedJobListCreateView.as_view(), name='saved_job_list_create'),
    path('saved/<int:pk>/', SavedJobDeleteView.as_view(), name='saved_job_delete'),
]
