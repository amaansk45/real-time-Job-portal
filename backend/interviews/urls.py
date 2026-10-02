from django.urls import path
from .views import InterviewListCreateView, InterviewDetailView

app_name = 'interviews'

urlpatterns = [
    path('', InterviewListCreateView.as_view(), name='interview_list_create'),
    path('<int:pk>/', InterviewDetailView.as_view(), name='interview_detail'),
]
