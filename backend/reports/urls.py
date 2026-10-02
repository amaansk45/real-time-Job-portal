from django.urls import path
from .views import JobReportListCreateView, JobReportDetailView

app_name = 'reports'

urlpatterns = [
    path('', JobReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', JobReportDetailView.as_view(), name='report_detail'),
]
